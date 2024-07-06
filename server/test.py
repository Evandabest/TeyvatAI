from dotenv import load_dotenv
import os
from supabase import create_client, Client


load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment variables.")

supabase: Client = create_client(supabase_url, supabase_key)


# Execute the query and unpack the result into `data` and `error`
data = supabase.table("characters").select("*").execute()

characters = data.data

names = [item['name'] for item in characters]

print(names)


