import { whois } from "../config/config"


async function getDomainInfo(domain: string) {
    try {

        const domainParts = domain.split('.');
        const mainDomain = domainParts.slice(-2).join('.'); // Get domain.com from sub.domain.com

        const whoisInfo = await whois.lookup(mainDomain);

        let ageDays = null;
        let creationDate = null;

        // Parse creation date from WHOIS (different formats)
        if (whoisInfo.created) {
            creationDate = whoisInfo.created;
            const created = new Date(creationDate);

            if (!isNaN(created.getTime())) {
                ageDays = Math.floor(
                    (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
                );
            }
        }

        return {
            domain: mainDomain,
            registrar: whoisInfo.registrar || "Unknown",
            creationDate: creationDate,
            ageDays: ageDays,
            ageCategory: getAgeCategory(ageDays),
            expires: whoisInfo.expires || null,
            updated: whoisInfo.changed || null,
            nameServers: whoisInfo.nameserver || []
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "something went wrong"
        console.error("Domain lookup error for", domain, message,);
        return null;
    }
}

function getAgeCategory(ageDays: any) {
    if (ageDays === null) return 'unknown';
    if (ageDays < 30) return 'very_new';
    if (ageDays < 90) return 'new';
    if (ageDays < 365) return 'recent';
    if (ageDays < 1825) return 'established'; // 5 years
    return 'very_established'; // 5+ years
}

export default getDomainInfo