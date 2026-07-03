let currentQuestions = [];

const API_URL = "https://ai-interview-simulator-ymw8.onrender.com";

async function startInterview() {

    const role = document.getElementById("domain").value.trim();
    const difficulty = document.getElementById("difficulty").value;

    if (role === "") {
        alert("Please enter a job role.");
        return;
    }

    const questionArea = document.getElementById("questionArea");

    questionArea.innerHTML = "<h3>Generating Interview...</h3>";

    try {

        const response = await fetch(`${API_URL}/generate`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                domain: role,
                difficulty: difficulty
            })

        });

        if (!response.ok) {
            throw new Error("Failed to generate interview.");
        }

        const data = await response.json();

        currentQuestions = data.questions
            .split("\n")
            .filter(q => q.trim() !== "");

        let html = `
            <div class="card">
                <h2>Interview Questions</h2>
        `;

        currentQuestions.forEach((question, index) => {

            html += `

            <div class="question">

                <p>${question}</p>

                <textarea
                    id="answer${index}"
                    placeholder="Write your answer here..."
                ></textarea>

            </div>

            `;

        });

        html += `

            <button id="submitBtn" onclick="submitInterview()">
                Submit Interview
            </button>

        </div>
        `;

        questionArea.innerHTML = html;

    }

    catch (error) {

        questionArea.innerHTML = `
        <div class="card">
            <h2>Error</h2>
            <p>${error.message}</p>
        </div>
        `;

    }

}



async function submitInterview() {

    const answers = [];

    for (let i = 0; i < currentQuestions.length; i++) {

        answers.push(document.getElementById(`answer${i}`).value);

    }

    const questionArea = document.getElementById("questionArea");

    questionArea.innerHTML = "<h3>Evaluating your interview...</h3>";

    try {

        const response = await fetch(`${API_URL}/evaluate`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                questions: currentQuestions,

                answers: answers

            })

        });

        if (!response.ok) {
            throw new Error("Failed to evaluate interview.");
        }

        const data = await response.json();

        questionArea.innerHTML = `

        <div class="card">

            <h2>AI Interview Report</h2>

            <pre>${data.evaluation}</pre>

            <br>

            <button onclick="location.reload()">

                Start New Interview

            </button>

        </div>

        `;

    }

    catch (error) {

        questionArea.innerHTML = `

        <div class="card">

            <h2>Error</h2>

            <p>${error.message}</p>

        </div>

        `;

    }

}