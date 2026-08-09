import dotenv from "dotenv";

dotenv.config();

const GenrateAi = async (language, prompt) => {
    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",

            headers: {
                "Authorization":
                    `Bearer ${process.env.OPENROUTER_API_KEY}`,

                "Content-Type": "application/json",

                "HTTP-Referer":
                    "http://localhost:3000",

                "X-Title":
                    "Shifra AI"
            },

            body: JSON.stringify({
                model: "openrouter/auto",
                max_tokens: 8000,
                messages: [
                    {
                        role: "system",
                        content: `
You are an expert code generator.

Generate high quality code in ${language}.

User request:
${prompt}

If the user asks for code,
return only the code.

Do not use markdown code fences.

If the request is not related to programming,
return exactly:

REQUEST_NOT_CODE
`
                    }
                ]
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error(data);

        throw new Error(
            data?.error?.message ||
            "OpenRouter request failed"
        );
    }

    return {
        content: data.choices?.[0]?.message?.content || ""
    };
}


export default GenrateAi;