import { clickSafeAgent } from "../mastra/agent/clickSafeAgent.js";
import { registerApiRoute } from "@mastra/core/server";

export const clickSafeRoute = registerApiRoute("/analyze-email", {
  method: "POST",
  handler: async ({ req }) => {
    try {
      const body = await req.json();

      if (!body.emailData) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Missing emailData in request body.",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const email = body.emailData;

      const formattedInput = `
Analyze this email for phishing or fake content.

Subject: ${email.metadata?.subject || "No subject"}
Sender: ${email.metadata?.sender?.name || "Unknown"} <${email.metadata?.sender?.email || "unknown@email.com"}>
Domain: ${email.metadata?.sender?.domain || "Unknown domain"}
Links: ${email.links?.map((l: any) => `${l.text}: ${l.href}`).join("\n") || "No links"}
---
${email.content}
`;

      const { text } = await clickSafeAgent.generate([
        { role: "user", content: formattedInput },
      ]);

      let cleanedText = text.trim();

      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText
          .replace(/^```(json)?/, "")
          .replace(/```$/, "")
          .trim();
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedText);
      } catch (error) {
        parsedResponse = { error: "Invalid JSON response from model" };
      }

      return new Response(
        JSON.stringify({
          success: true,
          analysis: parsedResponse,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      console.error("Error analyzing email:", err);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Internal server error",
          message: err instanceof Error ? err.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
});
