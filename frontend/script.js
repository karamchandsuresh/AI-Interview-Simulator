async function generateQuestions() {

    const domain = document.getElementById("domain").value;

    const response = await fetch(
        "http://127.0.0.1:5000/generate",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                domain: domain
            })
        }
    );

    const data = await response.json();

    console.log("Response:", data);

    document.getElementById("output").innerText =
        data.questions;
}