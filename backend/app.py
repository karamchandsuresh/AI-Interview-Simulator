from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Backend Running"


@app.route("/generate", methods=["POST"])
def generate():
    domain = request.json["domain"]

    prompt = (
        f"Generate exactly 5 interview questions for {domain}. "
        f"Return only a numbered list."
    )

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.1",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()

    return jsonify({
        "questions": result.get("response", "No questions generated")
    })


if __name__ == "__main__":
    app.run(debug=True)