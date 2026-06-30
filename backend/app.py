from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import os

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "AI Interviewer Backend Running"


@app.route("/generate", methods=["POST"])
def generate():

    data = request.get_json()

    domain = data.get("domain")

    prompt = f"""
Generate exactly 5 interview questions for {domain}.

Return only a numbered list.
"""

    response = model.generate_content(prompt)

    return jsonify({
        "questions": response.text
    })


if __name__ == "__main__":
    app.run(debug=True)