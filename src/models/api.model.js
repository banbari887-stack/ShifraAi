import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
    {
        clientId: {
            type: String,
            required: true,
            unique: true
        },

        apiKey: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;