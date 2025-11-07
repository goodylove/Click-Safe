import { createTool } from "@mastra/core/tools";
import { simpleParser } from "mailparser";
import { whois } from "../../../config/config"

import z from "zod";

export const mailParser = createTool({
    id: "email-parser",
    description:
        "Parses raw or pasted email text to extract sender, subject, links, and attachments.",
    inputSchema: z.object({
        input: z.string(),
    }),
    execute: async ({ context }) => {
        const parsed = await simpleParser(context.input);

        // Headers

        const headersObj = {};
        for (const [key, value] of parsed.headers) {
            headersObj[key] = value;
        }

        // Extract urls
        const bodyText = parsed.text || parsed.html || "";
        const links = Array.from(bodyText.matchAll(/https?:\/\/[^\s]+/g)).map(
            (m) => m[0],
        );
        await getDomainInfo(links[0])
        // return {
        //     from: parsed.from?.text || null,
        //     subject: parsed.subject || null,
        //     links,
        //     attachments: parsed.attachments?.length || 0,
        // };
    },
});

const getDomainInfo = async (url: string) => {
    try {
        const whoisInfo = await whois.lookup(url)
        return whoisInfo
    } catch (error) {
        console.error('Error:', error);
    }

}
