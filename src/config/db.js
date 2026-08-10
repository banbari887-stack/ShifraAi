import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing");
    }

    try {
        const connection = await mongoose.connect(
            process.env.MONGODB_URI,
            {
                serverSelectionTimeoutMS: 10000
            }
        );

        isConnected =
            connection.connection.readyState === 1;

        console.log("MongoDB Connected");
    } catch (error) {
        isConnected = false;

        console.error(
            "MongoDB Connection Error:",
            error.message
        );

        throw error;
    }
};

export default connectDB;