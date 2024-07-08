




from dotenv import load_dotenv
from supabase import create_client, Client
import os
load_dotenv()
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment variables.")
supabase: Client = create_client(supabase_url, supabase_key)

susIds = []
for i in susIds:
    data = supabase.table("vectors").delete().eq("id", i).execute()




""""
Can you tell me a little about Emile
what artifact set should I use on Navia?
how do I build Navia?
what artifact set should I use on Navia?
what weapon does hu tao use?
What are good weapons for Tartaglia // solved use childes name
"""