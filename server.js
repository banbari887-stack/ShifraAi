import express from "express";
import dotenv from "dotenv";
import generateRoutes from "./src/routes/generate.routes.js";
import apiKeyRoutes from "./src/routes/apiKey.routes.js";
import connectDB from "./src/config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Static
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    "/components",
    express.static(
        path.join(__dirname, "templates", "components")
    )
);

// Pages
app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "templates",
            "page",
            "Home",
            "index.html"
        )
    );
});

app.get("/builder", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "templates",
            "page",
            "Builder",
            "index.html"
        )
    );
});

// JS
app.get("/js/home.js", (req, res) => {
    res.type("application/javascript");

    res.sendFile(
        path.join(__dirname, "src", "js", "home.js")
    );
});

app.get("/js/builder.js", (req, res) => {
    res.type("application/javascript");

    res.sendFile(
        path.join(__dirname, "src", "js", "builder.js")
    );
});

app.get("/js/navbar.js", (req, res) => {
    res.type("application/javascript");

    res.sendFile(
        path.join(__dirname, "src", "js", "navbar.js")
    );
});

app.get("/js/fetch.js", (req, res) => {
    res.type("application/javascript");

    res.sendFile(
        path.join(__dirname, "src", "js", "fetch.js")
    );
});

// MongoDB middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database unavailable:", error);

        res.status(503).json({
            success: false,
            error: "Database unavailable"
        });
    }
// API
app.use("/api", generateRoutes);
app.use("/api/generate", apiKeyRoutes);

});

// Local development
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(
            `Server running on port ${PORT}`
        );
    });
}

export default app;
