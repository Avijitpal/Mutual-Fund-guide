const { GoogleGenAI } = require("@google/genai");
const Fund = require("../models/Fund");

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.getAIRecommendation = async (req, res, next) => {
  try {
    const { riskTolerance, investmentHorizon, primaryGoal, monthlyBudget } = req.body;

    // 1. Fetch available fund data from MongoDB to serve as our context matrix
    const availableFunds = await Fund.find({}).select(
      "schemeName fundHouse category subCategory nav returns riskLevel expenseRatio aum"
    );

    // 2. Draft an enterprise-grade system prompt instructing Gemini to parse out valid IDs
    const systemPrompt = `
      You are an elite, institutional Robo-Advisor platform. Your task is to analyze an investor's profile and recommend exactly 4 highly-suited mutual funds from the provided dataset (1 Large Cap, 1 Mid Cap, 1 Small Cap, 1 Flexi Cap/Hybrid).
      
      Investor Profile:
      - Risk Profile: ${riskTolerance}
      - Investment Horizon: ${investmentHorizon} years
      - Primary Financial Goal: ${primaryGoal}
      - Monthly Savings Budget: ₹${monthlyBudget}

      Instructions:
      - Match the investor's risk profile with the fund's risk level appropriately (e.g., Aggressive/High Risk profiles favor Small/Mid caps; Conservative profiles favor Large caps/Stable hybrids).
      - Return your response strictly as a JSON object with a "rationale" summary string and an array of 4 "recommendations".
      - Each recommendation item MUST include the exact, matching original "schemeName" from the dataset and a personalized "reasonWhy" sentence.

      Respond ONLY with valid JSON inside a code block. Do not include markdown conversational introductory fluff text.
    `;

    // 3. Fire the request to Gemini 1.5 Pro or Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [
        { text: `${systemPrompt}\n\nAvailable Funds Dataset:\n${JSON.stringify(availableFunds)}` }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text;
    const cleanJson = JSON.parse(rawText);

    // 4. Map the textual schema recommendations back to actual, rich MongoDB document references
    const populatedRecommendations = cleanJson.recommendations.map(rec => {
      const fullDocument = availableFunds.find(
        f => f.schemeName.trim().toLowerCase() === rec.schemeName.trim().toLowerCase()
      );
      return {
        fundDetails: fullDocument || null,
        reasonWhy: rec.reasonWhy
      };
    }).filter(item => item.fundDetails !== null); // Drop unmapped clean-up edge cases

    res.json({
      success: true,
      rationale: cleanJson.rationale,
      recommendations: populatedRecommendations
    });

  } catch (error) {
    console.error("Gemini Advisor Pipeline Crash:", error);
    res.status(500).json({ success: false, error: "AI failed to process portfolio allocation choices." });
  }
};