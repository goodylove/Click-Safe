import { createTool } from "@mastra/core";
import { whois } from "../../config/config.js"
import z from "zod";



interface AnalysisInterface {
    links: string[],
    sender: Record<string, string> | any,
    content: Record<string, string> | any
}



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




async function analyzeDomainReputation(domain: string) {
    const riskFactors = [];
    let reputationScore = 100;

    // 1. Check for suspicious patterns
    const suspiciousPatterns = [
        /([0-9]{1,3}\.){3}[0-9]{1,3}/, // IP addresses
        /.*login.*\.(tk|ml|ga|cf)/, // Free domains with login
        /.*verify.*\.(xyz|top)/, // Suspicious TLDs
        /.*bank.*\.(com|net)/, // Brand impersonation
        /.*security.*\.(ru|cn)/ // Suspicious country codes
    ];

    suspiciousPatterns.forEach(pattern => {
        if (pattern.test(domain.toLowerCase())) {
            riskFactors.push('suspicious_domain_pattern');
            reputationScore -= 20;
        }
    });

    // 2. Get REAL domain age from WHOIS (replacing simulation)
    const domainInfo = await getDomainInfo(domain);
    if (domainInfo) {
        if (domainInfo.ageDays !== null) {
            if (domainInfo.ageDays < 30) {
                riskFactors.push('very_new_domain');
                reputationScore -= 25; // Higher penalty for very new domains
            } else if (domainInfo.ageDays < 90) {
                riskFactors.push('new_domain');
                reputationScore -= 15;
            } else if (domainInfo.ageDays < 365) {
                riskFactors.push('recent_domain');
                reputationScore -= 5;
            }

        }
    } else {

        riskFactors.push('whois_lookup_failed');
        reputationScore -= 10;
    }


    return {
        reputationScore: Math.max(0, reputationScore),
        riskFactors,
        trustLevel: reputationScore >= 80 ? 'HIGH' : reputationScore >= 60 ? 'MEDIUM' : 'LOW',
        domainInfo: domainInfo || { error: 'WHOIS lookup failed' }
    };
}



// URL Safety Analysis
function analyzeUrlSafety(url: string) {
    const riskFactors = [];
    let safetyScore = 100;

    // Protocol check
    if (!url.startsWith('https://')) {
        riskFactors.push('non_https');
        safetyScore -= 30;
    }

    // Suspicious keywords in path
    const suspiciousKeywords = [
        'login', 'verify', 'secure', 'account', 'password',
        'confirm', 'validation', 'auth', 'signin'
    ];

    suspiciousKeywords.forEach(keyword => {
        if (url.toLowerCase().includes(keyword)) {
            riskFactors.push(`suspicious_keyword_${keyword}`);
            safetyScore -= 10;
        }
    });

    // Check for URL shortening services
    const shorteners = [
        'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
        'is.gd', 'buff.ly', 'adf.ly', 'shorte.st'
    ];

    if (shorteners.some(shortener => url.includes(shortener))) {
        riskFactors.push('url_shortener');
        safetyScore -= 25;
    }

    return {
        safetyScore: Math.max(0, safetyScore),
        riskFactors,
        safetyLevel: safetyScore >= 80 ? 'SAFE' : safetyScore >= 60 ? 'CAUTION' : 'DANGEROUS'
    };
}

// Content Heuristic Analysis
function analyzeContentHeuristics(content: any) {
    type PhishingCategory = keyof typeof phishingIndicators;

    const phishingIndicators = {
        urgency: [
            'urgent', 'immediately', 'right away', 'asap', 'within 24 hours',
            'account suspension', 'verify now', 'action required'
        ],
        threats: [
            'suspend', 'close', 'terminate', 'locked', 'restricted',
            'compromised', 'hacked', 'security alert'
        ],
        rewards: [
            'free', 'winner', 'prize', 'reward', 'bonus',
            'limited time', 'exclusive', 'special offer'
        ],
        authority: [
            'security team', 'admin', 'support', 'customer service',
            'technical department', 'billing department'
        ]
    };

    const detectedPatterns: Record<PhishingCategory, string[]> = {
        urgency: [],
        threats: [],
        rewards: [],
        authority: [],
    };
    let heuristicScore = 100;

    (Object.keys(phishingIndicators) as PhishingCategory[]).forEach(category => {
        const matches = phishingIndicators[category].filter(indicator =>
            content.toLowerCase().includes(indicator.toLowerCase())
        );

        if (matches.length > 0) {
            detectedPatterns[category] = matches;
            heuristicScore -= matches.length * 5;
        }
    });

    return {
        heuristicScore: Math.max(0, heuristicScore),
        detectedPatterns,
        riskLevel: heuristicScore >= 80 ? 'LOW' : heuristicScore >= 60 ? 'MEDIUM' : 'HIGH'
    };
}

// Sender Analysis
async function analyzeSender(sender: Record<string, string>) {
    const riskFactors = [];
    let senderScore = 100;

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sender.email)) {
        riskFactors.push('invalid_email_format');
        senderScore -= 20;
    }

    // Check for display name mismatch
    if (sender.name && sender.email) {
        const domainFromEmail = sender.email.split('@')[1];
        const nameWords = sender.name.toLowerCase().split(/\s+/);

        if (nameWords.some(word => domainFromEmail.includes(word))) {
            riskFactors.push('name_domain_mismatch');
            senderScore -= 15;
        }
    }

    // Analyze domain
    const domainAnalysis = await analyzeDomainReputation(sender.domain);
    senderScore += (domainAnalysis.reputationScore - 100)
    riskFactors.push(...domainAnalysis.riskFactors);

    return {
        senderScore: Math.max(0, senderScore),
        riskFactors,
        trustworthiness: senderScore >= 80 ? 'TRUSTED' : senderScore >= 60 ? 'NEUTRAL' : 'SUSPICIOUS'
    };
}

// Main analysis function that combines all tools
// async function analysisTools(emailData: any) {
//     console.log(emailData.content)
//     const analysis: AnalysisInterface = {
//         links: [],
//         sender: {},
//         content: {}
//     };
//     // Analyze links if present
//     if (emailData.links && emailData.links.length > 0) {
//         analysis.links = emailData.links.map(async (link: any) => {

//             return {
//                 ...link,
//                 safetyAnalysis: analyzeUrlSafety(link.href),
//                 domainAnalysis: await analyzeDomainReputation(new URL(link.href).hostname)
//             }

//         });
//     }

//     // Analyze sender if present
//     if (emailData.metadata && emailData.metadata.sender) {
//         analysis.sender = await analyzeSender(emailData.metadata.sender);
//     }

//     // Analyze content
//     if (emailData.content) {
//         analysis.content = analyzeContentHeuristics(emailData.content);
//     }

//     return analysis;
// }

// export const analysisTool = createTool({
//     id: 'click-safe',
//     description: 'Comprehensive email security analysis for phishing detection and link safety assessment',
//     inputSchema: z.object({
//         emailData: z.any(),
//     }),
//     outputSchema: z.any(),
//     execute: async ({ context }) => {
//         return await analysisTools(context.emailData);
//     },
// });

// tools/analysisTool.ts
async function analysisTools(emailData: any) {
    console.log('📧 Email content:', emailData.content); // This should now work
    const analysis: AnalysisInterface = {
        links: [],
        sender: {},
        content: {}
    };

    // Analyze links if present - FIXED: Handle async properly
    if (emailData.links && emailData.links.length > 0) {
        // Fix: Use Promise.all to handle async operations in map
        analysis.links = await Promise.all(
            emailData.links.map(async (link: any) => {
                return {
                    ...link,
                    safetyAnalysis: analyzeUrlSafety(link.href),
                    domainAnalysis: await analyzeDomainReputation(new URL(link.href).hostname)
                };
            })
        );
    }

    // Analyze sender if present
    if (emailData.metadata && emailData.metadata.sender) {
        analysis.sender = await analyzeSender(emailData.metadata.sender);
    }

    // Analyze content
    if (emailData.content) {
        analysis.content = analyzeContentHeuristics(emailData.content);
    }

    return analysis;
}

export const analysisTool = createTool({
    id: 'click-safe',
    description: 'Comprehensive email security analysis for phishing detection and link safety assessment',
    inputSchema: z.object({
        type: z.enum(["GMAIL_EMAIL", "OUTLOOK_EMAIL", "WEB_CONTENT", "HEURISTIC_CONTENT", "FALLBACK_CONTENT"]),
        content: z.string(),
        html: z.string().optional(),

        links: z.array(z.object({
            text: z.string(),
            href: z.string(),
            title: z.string().optional(),
            isSuspicious: z.boolean().optional(),
            riskFactors: z.array(z.string()).optional()
        })),
        metadata: z.object({
            sender: z.object({
                name: z.string(),
                email: z.string(),
                domain: z.string()
            }),
            subject: z.string(),


        }).optional(),
        url: z.string().optional(),
        source: z.string().optional(),

    }),
    outputSchema: z.any(),
    execute: async ({ context }) => {
        // ✅ Now context IS the email data directly
        console.log('🔍 Direct email content:', context.content);
        return await analysisTools(context);
    },
});