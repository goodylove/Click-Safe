import dotenv from "dotenv"
dotenv.config()

import { WhoisJson } from '@whoisjson/whoisjson';

export const whois = new WhoisJson({
    apiKey: process.env.WHOIS_API_KEY as string
})