from flask import Flask, request, jsonify

import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

 
app = Flask(__name__)  

@app.route('/api/<prompt>', methods=['POST'])
def api(prompt):
    if request.method == 'POST':
        data = request.get_json()
        response = supabase.from_("chatbot").update([{"messages": prompt}])
        return jsonify(response)


if (__name__ == "__main__"):
    app.run(port=5000, debug=True)

