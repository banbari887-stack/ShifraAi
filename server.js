import express from "express";
import dotenv from "dotenv";
import generateRoutes from "./src/routes/generate.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dns from "dns";
import apiKeyRoutes from "./src/routes/apiKey.routes.js";
import cors from 'cors';

dotenv.config();

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected"))
    .catch(err => console.log(err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    "/components",
    express.static(
        path.join(__dirname, "templates", "components")
    )
);

app.get("/", (req, res) => {
    res.sendFile("./templates/page/Home/index.html", { root: __dirname })
}).get("/builder", (req, res) => {
    res.sendFile("./templates/page/Builder/index.html", { root: __dirname })
}).get("/js/home.js", (req, res) => {
    res.type("application/javascript");
    res.sendFile(
        path.join(__dirname, "src", "Js", "home.js")
    );
}).get("/js/builder.js", (req, res) => {
    res.type("application/javascript");
    res.sendFile(
        path.join(__dirname, "src", "Js", "builder.js")
    );
}).get("/js/navbar.js", (req, res) => {
    res.type("application/javascript");

    res.sendFile(
        path.join(__dirname, "src", "Js", "navbar.js")
    );
}).get("/js/fetch.js", (req, res) => {
    res.type("application/javascript");

    res.sendFile(
        path.join(__dirname, "src", "Js", "fetch.js")
    );
});

app.use("/api", generateRoutes);
app.use("/api/generate", apiKeyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});