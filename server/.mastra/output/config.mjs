import dotenv from 'dotenv';
import { WhoisJson } from '@whoisjson/whoisjson';

dotenv.config();
const whois = new WhoisJson({
  apiKey: process.env.WHOIS_API_KEY
});

export { whois as w };
