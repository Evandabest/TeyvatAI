from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import undetected_chromedriver as uc
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_text_splitters import RecursiveCharacterTextSplitter
from math import ceil
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import time



chrome_options = Options()
chrome_options.add_argument("--headless")  
chrome_options.add_argument("--disable-gpu")

driver = uc.Chrome(options=chrome_options, service=Service(uc))
# Load environment variables from a .env file
load_dotenv()

# Configure the generative AI with the API key
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

# Invoke the model with a prompt
#result = llm.invoke("Tell me about the character Albedo in Genshin Impact")


genshin_impact_characters = [
    'Albedo'
]

for i in genshin_impact_characters:    

    # Open a webpage
    driver.get("https://www.youtube.com")

    element = driver.find_element(By.NAME, "search_query")
    element.click()
    element.send_keys(f"{i} character guide genshin impact")

    element.send_keys(Keys.RETURN)
    time.sleep(3)

    video_links = driver.find_elements(By.XPATH, '//a[@id="video-title"]')

    video_ids = []
    for i, link in enumerate(video_links):
        if i < 1:
            href = link.get_attribute('href')
            video_id = href.split('v=')[-1]
            video_ids.append(video_id)
        else:
            break

    driver.quit()

    for video_id in video_ids:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        combined_transcript = ""
        for segment in transcript:
            combined_transcript += segment['text'] + " "
        print(combined_transcript, len(combined_transcript))
    
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=ceil(len(combined_transcript)/10),
            chunk_overlap=ceil(len(combined_transcript)/100),
            #chunk_size=400,
            #chunk_overlap=40,
            length_function=len,
            is_separator_regex=False,
        )

        #texts = text_splitter.create_documents([combined_transcript])
        #print(texts[0])
#
        #vectors = embeddings.embed_documents(texts)
#
        #len(vectors), len(vectors[0])

        documents = text_splitter.create_documents([combined_transcript])
        texts = [doc.page_content for doc in documents]  # Extracting text from Document objects

        print(texts[0])

        vectors = embeddings.embed_documents(texts)

        character = "Albedo"

        for text, vector in zip(texts, vectors):
            response = supabase.table('vectors').insert({
                'character_name': character,
                'video_id': video_id,
                'transcript_chunk': text,
                'embedding': vector
            }).execute()

            if 'error' in response:
                print(f"Error inserting data: {response['error']}")
            else:
                print("Data inserted successfully")
                
                



