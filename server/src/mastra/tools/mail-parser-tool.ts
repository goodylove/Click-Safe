import { createTool } from "@mastra/core/tools";
import { simpleParser } from "mailparser";
import { whois } from "../../config/config"

import z from "zod";

export const mailParser = createTool({
  id: "email-parser",
  description:
    "Parses raw or pasted email text to extract sender, subject, links, headers, and domain/auth info.",
  inputSchema: z.object({
    input: z.string(),
  }),
  execute: async ({ context }) => {
    const parsed = await simpleParser(context.input);

    // Convert headers Map → object
    const headersObj: Record<any, any> = {};
    for (const [key, value] of parsed.headers) {
      headersObj[key] = value;
    }

    const bodyText = parsed.text || parsed.html || "";
    const links = Array.from(bodyText.matchAll(/https?:\/\/[^\s]+/g)).map(
      (m) => m[0],
    );

    const authResults = analyzeHeaders(headersObj);

    // If there’s a link, get WHOIS/domain info
    let domainInfo = null;
    if (links.length > 0) {
      domainInfo = await getDomainInfo(links[0]);
    }

    //  Return everything
    return {
      from: parsed.from?.text || null,
      subject: parsed.subject || null,
      links,
      headers: headersObj,
      attachments: parsed.attachments?.length || 0,
      authResults,
      domainInfo,
    };
  },
});

function analyzeHeaders(headers: Record<string, string>) {
  const find = (key: string) =>
    Object.keys(headers).find((k) => k.toLowerCase() === key.toLowerCase());

  const auth = headers[find("authentication-results") || ""] || "";
  const spfHeader = headers[find("received-spf") || ""] || "";
  const dkimHeader = headers[find("dkim-signature") || ""] || "";
  const dmarcHeader = headers[find("dmarc") || ""] || "";

  const parseResult = (text: string, key: string) => {
    const match = text.toLowerCase().match(new RegExp(`${key}=([a-z-]+)`));
    return match ? match[1] : "unknown";
  };

  const spf = parseResult(auth, "spf") || parseResult(spfHeader, "spf");
  const dkim = parseResult(auth, "dkim") || (dkimHeader ? "pass" : "unknown");
  const dmarc = parseResult(auth, "dmarc") || parseResult(dmarcHeader, "dmarc");

  const fails = [spf, dkim, dmarc].filter((v) =>
    ["fail", "softfail", "neutral"].includes(v),
  );

  return {
    spf,
    dkim,
    dmarc,
    spoofingDetected: fails.length > 0,
    reason:
      fails.length > 0
        ? `Authentication failed: ${fails.join(", ")}`
        : "All authentication checks passed",
  };
}

async function getDomainInfo(url: string) {
  try {
    const domain = url.replace(/^https?:\/\//, "").split("/")[0];
    const whoisInfo = await whois.lookup(domain);

    let ageDays: number | null = null;
    if (whoisInfo.created) {
      const created = new Date(whoisInfo.created);
      ageDays = Math.floor(
        (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    return {
      domain,
      registrar: whoisInfo.registrar || "Unknown",
      creationDate: whoisInfo.created || null,
      ageDays,
    };
  } catch (error) {
    console.error("Domain lookup error:", error);
    return null;
  }
}
