from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from supabase import create_client, Client
import numpy as np
import ast
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
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

def fetch_embeddings_from_supabase():
    # Fetch embeddings from Supabase
    query = supabase.table('vectors').select("*").execute()

    if hasattr(query, 'error') and query.error:
        print(f"Error fetching data from Supabase: {query.error.message}")
        return []

    res = []
    for data in query.data:
        try:
            # Ensure 'embedding' is converted to a NumPy array
            embedding_array = np.array(data.get("embedding", []))
            res.append({'transcript_chunk': data.get("transcript_chunk", ""), 'embedding': embedding_array})
        except KeyError as e:
            print(f"KeyError: {e} in data: {data}")
        except Exception as e:
            print(f"An error occurred while processing data: {e}")
    return res

def calculate_similarity(prompt_embedding, target_embeddings):
    # Calculate cosine similarity between prompt_embedding and each target_embedding
    similarities = []
    for target in target_embeddings:
        target_vector = np.array(target['embedding'])# Ensure target['embedding'] is converted to NumPy array
        similarity_score = np.dot(prompt_embedding, target_vector) / (np.linalg.norm(prompt_embedding) * np.linalg.norm(target_vector))
        similarities.append((target['transcript_chunk'], similarity_score))

        
        similarity_score = np.dot(prompt_embedding, target_vector) / (np.linalg.norm(prompt_embedding) * np.linalg.norm(target_vector))
        similarities.append((target['transcript_chunk'], similarity_score))
    
        
    # Sort by similarity score (higher is more similar)
    similarities.sort(key=lambda x: x[1], reverse=True)
    
    return similarities

if __name__ == "__main__":
    try:
        # Example prompt
        prompt = "what are good weapon options for yelan?"
        
        # Get embeddings from Supabase
        embeddings_data = fetch_embeddings_from_supabase()
        
        if embeddings_data:
            # Debug: Check the structure of embeddings_data
            #print("Embeddings data fetched from Supabase:")
            #for item in embeddings_data:
            #    print(item)
            
            # Generate embedding for the prompt
            prompt_embedding = embeddings.embed_documents(prompt)[0]  # Assuming embed_text returns a single embedding
            
            # Calculate similarity
            similarities = calculate_similarity(prompt_embedding, embeddings_data)
            
            # Print top results
            #print(f"Prompt: {prompt}")
            #for i, (transcript_chunk, similarity_score) in enumerate(similarities[:5]):  # Adjust the number of top results to display
            #    print(f"Similarity Rank {i + 1}:")
            #    print(f"Transcript Chunk: {transcript_chunk}")
            #    print(f"Similarity Score: {similarity_score}")
            #    print("---")
            
            # Use the most similar transcript chunk to generate a response from the generative AI model
            #if similarities:
            #    most_similar_transcript = similarities[0][0]  # Choose the most similar transcript chunk
            #    prompt = prompt + "Use this following information as context if needed" + most_similar_transcript
            #    response = llm.invoke(prompt)
            #    print(f"Generated Response: {response.content}")
            #else:
            #    print("No similar transcript chunks found.")

         # Use the most similar transcript chunks to generate a response from the generative AI model
            if similarities:
                top_5_similar_transcripts = similarities[:5]  # Get the top 5 items
                combined_transcripts = " ".join([transcript[0] for transcript in top_5_similar_transcripts])  # Combine the transcript chunks
                prompt = prompt + " Use this following information as context if needed: " + combined_transcripts
                response = llm.invoke(prompt)
                print(f"Generated Response: {response.content}")
            else:
                print("No similar transcript chunks found.")   
        else:
            print("No embeddings data found from Supabase.")
    except Exception as e:
        print(f"An error occurred: {e}")
