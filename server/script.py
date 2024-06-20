from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import undetected_chromedriver as uc
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from math import ceil
import time

chrome_options = Options()
chrome_options.add_argument("--headless")  
chrome_options.add_argument("--disable-gpu")

llm = ChatGoogleGenerativeAI(model="gemini-flash")
result = llm.invoke("Tell me about the character Albedo in Genshin Impact")


driver = uc.Chrome(options=chrome_options, service=Service(uc))
embeddings = GoogleGenerativeAIEmbeddings(model="model/embedding-004")

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

        texts = text_splitter.create_documents([combined_transcript])
        print(texts[0])

        vectors = embeddings.embed_documents(texts)

        len(vectors), len(vectors[0])
