from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from supabase import create_client, Client
import numpy as np
import os
from dotenv import load_dotenv


load_dotenv()

api_key = os.environ.get("GOOGLE_API_KEY")
if api_key is None:
    raise ValueError("GOOGLE_API_KEY environment variable not found.")

genai.configure(api_key=api_key)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment variables.")

supabase: Client = create_client(supabase_url, supabase_key)

# Instantiate the language model with the specified model name and API key
llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)

embeddings = GoogleGenerativeAIEmbeddings (model="models/embedding-001" )

def fetch_embeddings_from_supabase():
    # Example: Fetch embeddings from Supabase
    query = supabase.table('vectors').select("*").limit(1)
    response = query.execute()
    print(response[0])
    #return response.get('data')
    #res = {}
    #data = response.json()
    #for row in data:
    #    res[row['transcript_chunk']] = res[row["embedding"]]  # Store the entire row as value
#
    #return res
#



def calculate_similarity(prompt_embedding, target_embeddings):
    # Calculate cosine similarity between prompt_embedding and each target_embedding
    similarities = []
    for target_embedding in target_embeddings:
        target_vector = np.array(target_embedding['embedding'])
        similarity_score = np.dot(prompt_embedding, target_vector) / (np.linalg.norm(prompt_embedding) * np.linalg.norm(target_vector))
        similarities.append((target_embedding['transcript_chunk'], similarity_score))
    
    # Sort by similarity score (higher is more similar)
    similarities.sort(key=lambda x: x[1], reverse=True)
    
    return similarities


if __name__ == "__main__":
    # Example prompt
    prompt = "Tell me what element Albedo uses."
    
    # Get embeddings from Supabase
    embeddings_data = fetch_embeddings_from_supabase()
    
    if embeddings_data:
        # Extract embeddings and transcript chunks
        target_embeddings = [{'transcript_chunk': item['transcript_chunk'], 'embedding': item['embedding']} for item in embeddings_data]
        
        # Generate embedding for the prompt
        prompt_embedding = embeddings.embed_text(prompt)
        
        # Calculate similarity
        similarities = calculate_similarity(prompt_embedding, target_embeddings)
        
        # Print top results
        print(f"Prompt: {prompt}")
        for i, (transcript_chunk, similarity_score) in enumerate(similarities[:5]):  # Adjust the number of top results to display
            print(f"Similarity Rank {i + 1}:")
            print(f"Transcript Chunk: {transcript_chunk}")
            print(f"Similarity Score: {similarity_score}")
            print("---")
        
        # Use the most similar transcript chunk to generate a response from the generative AI model
        if similarities:
            most_similar_transcript = similarities[0][0]  # Choose the most similar transcript chunk
            response = llm.invoke(prompt, context=most_similar_transcript)
            print(f"Generated Response: {response}")
        else:
            print("No similar transcript chunks found.")
    else:
        print("No embeddings data found from Supabase.")
