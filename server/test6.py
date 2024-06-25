from supabase import create_client, Client
from datetime import datetime, timezone
import os
from dotenv import load_dotenv



load_dotenv()

# Configure Supabase
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment variables.")
supabase: Client = create_client(supabase_url, supabase_key)



def test6 ():
    prompt = "his best weapon is sinibar spindle"
    id = "a47e5702-4c3a-4299-93ac-4add040b0b81"

    chatMessage = {
        "sender": "TeyvatAI",
        "message": prompt,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    response = supabase.table("chatbot").select("messages").eq("id", id).execute()

    if response.data:
        current_messages = response.data[0]['messages']
        print("here2")
    else:
        print({"error": "No chatbot with the specified ID found."})

    current_messages.append(chatMessage)

    # Perform the update operation (existing code)
    update_response = supabase.table("chatbot").update({"messages": current_messages}).eq("id", id).execute()

    # Fetch the updated record
    check_response = supabase.table("chatbot").select("messages").eq("id", id).execute()

    # Check if the update was successful
    if check_response.data:
        updated_messages = check_response.data[0]['messages']
        if chatMessage in updated_messages:
            print("Update successful, message added.")
        else:
            print("Update failed, message not found.")
    else:
        print({"error": "Failed to fetch updated record."})

test6()