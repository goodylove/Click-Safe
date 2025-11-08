import express from "express";
import { registerApiRoute } from "@mastra/core/server";
import { clickSafeAgent } from "../mastra/agent/clickSafeAgent";




const router = express.Router();

router.post("/analyze-email", async (req, res) => {
    try {
        const { emailData } = req.body;

        if (!emailData) {
            return res.status(400).json({ error: "Missing emailData in request body." });
        }

        const formattedInput = `
Analyze this email for phishing or fake content.

Subject: ${emailData.metadata?.subject}
Sender: ${emailData.metadata?.sender?.name} <${emailData.metadata?.sender?.email}>
 Domain: ${emailData.metadata?.sender?.domain}
 Links: ${emailData.links?.map((l: any) => `${l.text}: ${l.href}`).join("\n")}
---
 ${emailData.content}
 `;

        // Run your Mastra agent
        const { text } = await clickSafeAgent.generate([
            { role: "user", content: formattedInput },

        ]);



        return res.status(200).json({
            success: true,
            analysis: text
        });
    } catch (err: any) {
        console.error(" Error analyzing email:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
});

export default router