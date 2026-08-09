function copyValue(elementId) {
    const element = document.getElementById(elementId);

    if (!element) {
        alert("Element not found");
        return;
    }

    const value = element.value ?? element.textContent;

    if (!value.trim()) {
        alert("Nothing to copy");
        return;
    }

    navigator.clipboard.writeText(value)
}


function generateApiCode(apiKey, language, prompt) {

    const apiCode = `
const express = require('express');

const app = express();
const port = 3001;

app.get("/", async (req, res) => {
    const SHIFRA_API_KEY = "${apiKey}";

    const language = "${language}";
    const prompt = "${prompt}";

    try {
        const response = await fetch(
            "http://localhost:3000/api/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                            \`Bearer \${SHIFRA_API_KEY}\`
                },

                body: JSON.stringify({
                    language,
                    prompt
                })
            }
        );

        const data = await response.json();

        const code = data?.code?.content;

        if (!response.ok) {
            return res.status(response.status).send(
                data?.error || "Failed to generate code"
            );
        }

        return res
            .type("text/plain")
            .send(code);

    } catch (error) {
        console.error(error);

        return res
            .status(500)
            .type("text/plain")
            .send("Failed to connect to Shifra API");
    }
});

app.listen(port, () => {
    console.log(\`Server running at http://localhost:\${port}\`);
});

`;

    document.getElementById("embedCode").textContent = apiCode;
}

async function saveAssistant() {

    let clientId = localStorage.getItem("shifra_client_id");

    if (!clientId) {
        clientId = crypto.randomUUID();

        localStorage.setItem(
            "shifra_client_id",
            clientId
        );
    }

    console.log("Client ID:", clientId);

    const prompt =
        document.getElementById("PromptDescription").value.trim();
    const language =
        document.getElementById("language").value.trim();

    if (!prompt) {
        alert("Please enter your prompt.");
        return;
    }

    if (!language) {
        alert("Please enter language.");
        return;
    }

    localStorage.setItem(
        "shifra_prompt",
        prompt
    );

    localStorage.setItem(
        "shifra_language",
        language
    );


    // User data object
    const assistantData = {
        prompt,
        language
    };


    console.log(assistantData);

    try {
        const response = await fetch(
            "/api/generate/new",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    clientId
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.error || "API key generation failed");

            return;
        }

        const SHIFRA_API_KEY = data.apiKey;
        localStorage.setItem(
            "shifra_api_key",
            SHIFRA_API_KEY
        );
        document.getElementById("ApiKey").value = SHIFRA_API_KEY;

        console.log("Generated API Key:", SHIFRA_API_KEY);


        // Generated API code
        generateApiCode(SHIFRA_API_KEY,
            language,
            prompt)


        // Elements
        const status = document.getElementById("status");
        const builderForm = document.getElementById("builderForm");
        const editBtn = document.getElementById("edit_btn");


        // Show status
        showStatus()


        alert("Assistant saved successfully!");
    } catch (error) {
        console.log(error)
        alert("Something went wrong.");
    }
}

async function checkAssistant() {
    const clientId = localStorage.getItem("shifra_client_id")

    if (!clientId) {
        builderShow()
        return;
    }

    const prompt =
        localStorage.getItem("shifra_prompt");

    const language =
        localStorage.getItem("shifra_language");

    if (!prompt || !language) {

        builderShow();

        return;
    }

    try {
        const response = await fetch(
            `/api/generate/check?d=${encodeURIComponent(clientId)}`
        )
        const data = await response.json()

        if (!response.ok || !data.apiKey) {
            builderShow()
            return;
        }

        localStorage.setItem(
            "shifra_api_key",
            data.apiKey
        )

        document.getElementById("ApiKey").value = data.apiKey

        generateApiCode(
            data.apiKey,
            language,
            prompt
        );

        showStatus()

    } catch (error) {
        console.error(
            "Check assistant error:",
            error
        );

        builderShow();
    }
}

function showStatus() {
    document
        .getElementById("status")
        .classList.remove("hidden");

    document
        .getElementById("builderForm")
        .classList.add("hidden");
    document
        .getElementById("edit_btn")
        .classList.remove("hidden");
}
function builderShow() {
    document
        .getElementById("status")
        .classList.add("hidden");

    document
        .getElementById("builderForm")
        .classList.remove("hidden");
}


function editAssistant() {

    const builderForm =
        document.getElementById("builderForm");

    const editBtn =
        document.getElementById("edit_btn");
    const prompt =
        localStorage.getItem("shifra_prompt");

    const language =
        localStorage.getItem("shifra_language");
    const prompt_html =
        document.getElementById("PromptDescription");
    const language_html =
        document.getElementById("language");
    prompt_html.value = prompt;
    language_html.value = language;

    builderForm.classList.remove("hidden");

    editBtn.classList.add("hidden");

    builderForm.scrollIntoView({
        behavior: "smooth"
    });
}

checkAssistant()