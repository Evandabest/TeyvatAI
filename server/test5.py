from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from supabase import create_client, Client
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Google API
api_key = os.environ.get("GOOGLE_API_KEY")
if api_key is None:
    raise ValueError("GOOGLE_API_KEY environment variable not found.")
genai.configure(api_key=api_key)

# Configure Supabase
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment variables.")
supabase: Client = create_client(supabase_url, supabase_key)

# Instantiate the language model and embeddings
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")


def func () :
    try:
        prompt = "what stats do albedo scale off of?"
        id = "a47e5702-4c3a-4299-93ac-4add040b0b81"
        # Generate embedding for the prompt
        prompt_embedding = embeddings.embed_documents(prompt)[0]
        
        # Calculate similarity
        similarities = fetchContext(prompt_embedding)

        print(f"Similarities: {similarities}")

        if similarities:
            similarities = [item['transcript_chunk'] for item in similarities]
            combined_transcripts = " ".join(similarities)
            prompt_with_context = prompt + " Use this following information as context if needed: " + combined_transcripts
            response = llm.invoke(prompt_with_context)
            chatMessage = {
                "sender": "TeyvatAI",
                "message": response.content,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }

            print (response.content)
            
            try:
                response = supabase.table("chatbot").select("messages").eq("id", id).execute()

                if response.data:
                    current_messages = response.data[0]['messages']
                    print(current_messages)
                    print("here2")
                else:
                    print({"error": "No chatbot with the specified ID found."})

                current_messages.append(chatMessage)

                update_response = supabase.table("chatbot").update({"messages": current_messages}).eq("id", id).execute()
                #print({"success": True, "updated_message": chatMessage})
            except Exception as e:
                print({"error": str(e)})
        else:
            return jsonify({"message": "No similar transcript chunks found."})
    except Exception as e:
        print({"error": str(e)})

def fetchContext(query_embedding):
    match_count = 7
    data = supabase.rpc("similarity", {
        "query_embedding": query_embedding,
        "match_count": match_count
    }).execute()
    return data.data

if (__name__ == "__main__"):
    func()