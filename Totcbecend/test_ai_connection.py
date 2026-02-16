import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env info explicitly
load_dotenv(".env")

api_key = os.getenv("GEMINI_API_KEY")

print(f"Loaded API Key: {api_key[:5] if api_key else 'None'}... (hidden)")

if not api_key:
    print("❌ ERROR: API Key is missing in .env")
    exit(1)

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Attempting to generate content...")
    response = model.generate_content("Hello, are you working?")
    print(f"✅ SUCCESS: AI Responded: {response.text}")
except Exception as e:
    print(f"❌ ERROR: Test failed: {str(e)}")
