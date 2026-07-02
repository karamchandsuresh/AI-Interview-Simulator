let currentQuestions = [];

async function startInterview() {

    const role = document.getElementById("domain").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    const questionArea = document.getElementById("questionArea");

    if (role === "") {
        alert("Please enter a job role.");
        return;
    }

    questionArea.innerHTML = `
        <div class="card">
            <h2>Generating Interview...</h2>
            <p>Please wait while AI prepares your questions.</p>
        </div>
    `;

    try {

        const response = await fetch("http://127.0.0.1:5000/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                domain: role,
                difficulty: difficulty
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to generate interview.");
        }

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

                    <p><strong>${question}</strong></p>

                    <textarea
                        id="answer${index}"
                        placeholder="Write your answer here..."
                    ></textarea>

                </div>
            `;

        });

        html += `
            <button onclick="submitInterview()">
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

        answers.push(
            document.getElementById(`answer${i}`).value
        );

    }

    const questionArea = document.getElementById("questionArea");

    questionArea.innerHTML = `
        <div class="card">
            <h2>Evaluating Interview...</h2>
            <p>Please wait while AI evaluates your answers.</p>
        </div>
    `;

    try {

        const response = await fetch("http://127.0.0.1:5000/evaluate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                questions: currentQuestions,
                answers: answers

            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Evaluation failed.");
        }

        let report = data.evaluation;

        // Markdown headings
        report = report.replace(/^## (.*)$/gm, "<h3>$1</h3>");

        // Bold text
        report = report.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Bullet points
        report = report.replace(/^- (.*)$/gm, "• $1");

        // Line breaks
        report = report.replace(/\n/g, "<br>");

        questionArea.innerHTML = `

            <div class="card report-card">

                <h2>📋 AI Interview Report</h2>

                <div class="report">

                    ${report}

                </div>

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