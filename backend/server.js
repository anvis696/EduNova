const express = require("express");
const path = require("path");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow GitHub Pages to connect to EduNova backend
app.use(cors({
    origin: "https://anvis696.github.io"
}));

app.use(express.json({ limit: "10mb" }));

// Serve EduNova frontend
app.use(express.static(path.join(__dirname, "..")));

// Open EduNova website
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// AI Tutor
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/ask", async (req, res) => {
    const question = req.body.question;

    if (!question) {
        return res.json({
            answer: "Please type a question first."
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `You are EduNova, a helpful school AI tutor.
Explain the answer in simple language suitable for a school student.

Question: ${question}`
        });

        res.json({
            answer: response.text
        });

    } catch (error) {
        console.error("GEMINI ERROR:", error.message);

        res.status(500).json({
            answer: "❌ Gemini Error: " + error.message
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduNova server running on port ${PORT}`);
});