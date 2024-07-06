from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from datetime import datetime, timezone
import os

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
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

app = Flask(__name__)
port = 5000

CORS(app)

def fetchContext(query_embedding):
    match_count = 5
    data = supabase.rpc("similarity", {
        "query_embedding": query_embedding,
        "match_count": match_count
    }).execute()
    return data.data


@app.route('/api/chat', methods=['POST'])
def api():
    try:
        data = request.json
        prompt = data.get('prompt')
        id = data.get('id')

        if not prompt or not id:
            return jsonify({"error": "Missing prompt or id"}), 400

        # Generate embedding for the prompt
        prompt_embedding = embeddings.embed_documents(prompt)[0]
        
        # Calculate similarity
        similarities = fetchContext(prompt_embedding)

        if similarities:
            similarities = [item['transcript_chunk'] for item in similarities]
            combined_transcripts = " ".join(similarities)
            print(combined_transcripts)
            prompt_with_context = prompt + "Only answer the question asked and Use this following information as context if needed: " + combined_transcripts
            response = llm.invoke(prompt_with_context)
            chatMessage = {
                "sender": "TeyvatAI",
                "message": response.content,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
            try:
                response = supabase.table("chatbot").select("messages").eq("id", id).execute()

                if response.data:
                    current_messages = response.data[0]['messages']
                else:
                    return jsonify({"error": "No data found or error in fetching data"}), 500

                current_messages.append(chatMessage)

                supabase.table("chatbot").update({"messages": current_messages}).eq("id", id).execute()
                return jsonify({"success": True, "updated_message": chatMessage}), 200
            except Exception as e:
                return jsonify({"error": str(e) + "sigma"}), 500
        else:
            return jsonify({"message": "No similar transcript chunks found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)+ "bruh"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=False)

