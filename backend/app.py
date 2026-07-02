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
    return "AI Interview Simulator Backend Running"


# ---------------------------------
# Generate Interview Questions
# ---------------------------------
@app.route("/generate", methods=["POST"])
def generate():

    data = request.get_json()

    domain = data.get("domain")
    difficulty = data.get("difficulty")

    prompt = f"""
You are an experienced technical interviewer.

Generate exactly 5 {difficulty} interview questions for a {domain}.

Rules:
- Return ONLY the questions.
- Number them from 1 to 5.
- No title.
- No explanations.
"""

    try:
        response = model.generate_content(prompt)

        return jsonify({
            "questions": response.text
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ---------------------------------
# Evaluate Interview
# ---------------------------------
@app.route("/evaluate", methods=["POST"])
def evaluate():

    data = request.get_json()

    questions = data.get("questions")
    answers = data.get("answers")

    interview = ""

    for q, a in zip(questions, answers):
        interview += f"""

Question:
{q}

Candidate Answer:
{a}

"""

    prompt = f"""
You are a Senior Technical Interviewer.

Evaluate the following interview.

{interview}

Return your response exactly in this format.

## Overall Score

Score: X/10

## Question-wise Feedback

Question 1:
...

Question 2:
...

Question 3:
...

Question 4:
...

Question 5:
...

## Strengths

- Point 1
- Point 2
- Point 3

## Weaknesses

- Point 1
- Point 2

## Suggestions for Improvement

- Point 1
- Point 2
- Point 3

## Final Hiring Recommendation

One short paragraph.

Keep the entire report under 350 words.
"""

    try:

        response = model.generate_content(prompt)

        return jsonify({
            "evaluation": response.text
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)