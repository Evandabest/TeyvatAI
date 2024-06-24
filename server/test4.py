from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from supabase import create_client, Client
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

def fetchContext (query_embedding):
    match_count = 7
    data = supabase.rpc("similarity", {
        "query_embedding": query_embedding,
        "match_count": match_count
    }).execute()

    return data.data


if __name__ == "__main__":
    try:
        
        prompt = "what stats do albedo scale off of?"

        if prompt:
            # Generate embedding for the prompt
            prompt_embedding = embeddings.embed_documents(prompt)[0]  
            
            # Calculate similarity
            similarities = fetchContext(prompt_embedding)

            #print(f"Similarities: {similarities}")

            similarities = [item['transcript_chunk'] for item in similarities]
            
            if similarities:
                combined_transcripts = " ".join(similarities)
                prompt = prompt + " Use this following information as context if needed: " + combined_transcripts
                response = llm.invoke(prompt)
                print(f"Generated Response: {response.content}")
            else:
                print("No similar transcript chunks found.")   
        else:
            print("No embeddings data found from Supabase.")
    except Exception as e:
        print(f"An error occurred: {e}")
