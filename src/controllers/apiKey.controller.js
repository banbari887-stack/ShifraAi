import crypto from "crypto";
import ApiKey from "../models/api.model.js";

const createApiKey = async (req, res) => {
    try {

        const { clientId } = req.body;

        if (!clientId) {
            return res.status(400).json({
                success: false,
                error: "clientId are required"
            });
        }

         // Check if this client already has an API key
        const existingKey = await ApiKey.findOne({
            clientId
        });


        // Already exists
        if (existingKey) {

            return res.status(200).json({
                success: true,
                apiKey: existingKey.apiKey,
                existing: true
            });

        }

        const apiKey =
            "sk_shifra_" +
            crypto.randomBytes(32).toString("hex");

        const savedKey = await ApiKey.create({
            apiKey,
            clientId
        });

        return res.status(201).json({
            success: true,
            apiKey: apiKey
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            existing: false,
            error: "API key generation failed"
        });
    }
}

export const getApiKey = async (req, res) => {

    try {

        const clientId = req.query.d;


        if (!clientId) {
            return res.status(400).json({
                success: false,
                error: "Client ID is required"
            });
        }

        const apiKey = await ApiKey.findOne({
            clientId
        });


        if (!apiKey) {
            return res.status(404).json({
                success: false,
                error: "Assistant not found"
            });
        }


        return res.status(200).json({
            success: true,
            apiKey: apiKey.apiKey
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            error: "Failed to get API key"
        });
    }
};

export default createApiKey;