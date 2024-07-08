
from dotenv import load_dotenv
from supabase import create_client, Client
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from datetime import datetime, timezone
import os


load_dotenv()

# Configure Google API
api_key = os.environ.get("GOOGLE_API_KEY")
if api_key is None:
    raise ValueError("GOOGLE_API_KEY environment variable not found.")
genai.configure(api_key=api_key)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key)


response = llm.invoke("can you tell me something about python")

print(response)