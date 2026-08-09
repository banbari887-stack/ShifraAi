import ResponseAi from "../services/generate.ai.js";
import ApiKey from "../models/api.model.js";

const generateCode = async (req, res) => {
    try {
        const { language, prompt } = req.body;

        if (!language) {
            return res.status(400).json({
                success: false,
                error: "Language is required"
            });
        }

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: "Prompt is required"
            });
        }

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: "API key is required"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Invalid authorization format"
            });
        }

        const apiKey = authHeader.split(" ")[1];

        const keyExists = await ApiKey.findOne({
            apiKey
        });

        if (!keyExists) {
            return res.status(401).json({
                success: false,
                error: "Invalid API key"
            });
        }

        const code = await ResponseAi(language, prompt);

        res.json({
            success: true,
            language,
            code
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            error: "Code Generation Failed"
        });
    }
};

export default generateCode;