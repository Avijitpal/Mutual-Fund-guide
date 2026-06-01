const { GoogleGenAI } = require("@google/genai");
const Fund = require("../models/Fund");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.handleContextualChat = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "Message content is required." });
    }

    // 1. Fetch live mutual fund inventory metrics to append as grounding context
    const trackingContext = await Fund.find({}).select(
      "schemeName fundHouse category subCategory nav returns riskLevel expenseRatio aum"
    );

    // 2. Structural system instructions setting clear operating parameters for the AI model
    const systemInstruction = `
      You are a specialized institutional Wealth Management Chatbot assistant. Your purpose is to guide users through mutual fund picking strategy rules.
      
      Grounding Dataset Rules:
      - Use this live database catalog context to formulate accurate data answers: ${JSON.stringify(trackingContext)}
      
      Communication Guidelines:
      - Answer financial queries conversationally, accurately, and concisely.
      - Never hallucinate fund names or return numbers not present in the dataset.
      - Keep responses clean and format them nicely with bolding and bullet points where applicable.
      - Include a standard disclaimer sentence when giving investment ideas noting that mock metrics do not represent absolute guarantees.
    `;

    // 3. Map historical message states cleanly into the Google Gen AI chat format
    // Map 'user' to 'user' and 'assistant' to 'model'
    const formattedContents = (chatHistory || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Append the user's newest incoming message prompt to the content stack
    formattedContents.push({
      role: 'user',
      parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }]
    });

    // 4. Dispatch the full historical tree context over to the Gemini system
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents
    });

    return res.json({
      success: true,
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini Chat Terminal Runtime Error:", error);
    return res.status(500).json({ success: false, error: "The AI service encountered a temporary processing break." });
  }
};