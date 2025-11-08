// ai/mastraAnalyzer.js
import  { AnalysisTools }  from "../src/mastra/tools/analysisTool"

class MastraAnalyzer {
    static async analyzeEmailContent(emailData) {
        try {
            const analysisResults = {
                overallRisk: 'LOW',
                confidence: 'HIGH',
                detailedAnalysis: {},
                recommendations: [],
                safeToClick: true
            };

            // 1. Analyze all links
            const linkAnalysis = this.analyzeLinks(emailData.links || []);
            analysisResults.detailedAnalysis.links = linkAnalysis;

            // 2. Analyze sender information
            if (emailData.metadata && emailData.metadata.sender) {
                const senderAnalysis = AnalysisTools.analyzeSender(emailData.metadata.sender);
                analysisResults.detailedAnalysis.sender = senderAnalysis;
            }

            // 3. Analyze content heuristics
            const contentAnalysis = AnalysisTools.analyzeContentHeuristics(emailData.content);
            analysisResults.detailedAnalysis.content = contentAnalysis;

            // 4. Calculate overall risk
            analysisResults.overallRisk = this.calculateOverallRisk(
                linkAnalysis,
                analysisResults.detailedAnalysis.sender,
                contentAnalysis
            );

            // 5. Generate recommendations
            analysisResults.recommendations = this.generateRecommendations(analysisResults);

            // 6. Determine if safe to click
            analysisResults.safeToClick = analysisResults.overallRisk === 'LOW';

            // 7. Set confidence level
            analysisResults.confidence = this.calculateConfidence(analysisResults);

            return analysisResults;
        } catch (error) {
            console.error('Analysis error:', error);
            return this.getFallbackAnalysis();
        }
    }

    static analyzeLinks(links) {
        return links.map(link => {
            const urlSafety = AnalysisTools.analyzeUrlSafety(link.href);
            const domainReputation = AnalysisTools.analyzeDomainReputation(
                new URL(link.href).hostname
            );

            return {
                ...link,
                analysis: {
                    urlSafety,
                    domainReputation,
                    overallRisk: urlSafety.safetyLevel === 'DANGEROUS' ||
                        domainReputation.trustLevel === 'LOW' ? 'HIGH' :
                        urlSafety.safetyLevel === 'CAUTION' ? 'MEDIUM' : 'LOW',
                    warningMessages: this.generateLinkWarnings(urlSafety, domainReputation, link)
                }
            };
        });
    }

    static calculateOverallRisk(linkAnalysis, senderAnalysis, contentAnalysis) {
        let riskScore = 0;
        let factorCount = 0;

        // Link risk contribution (40%)
        if (linkAnalysis.length > 0) {
            const linkRiskScore = linkAnalysis.reduce((acc, link) => {
                return acc + (link.analysis.overallRisk === 'HIGH' ? 100 :
                    link.analysis.overallRisk === 'MEDIUM' ? 50 : 0);
            }, 0) / linkAnalysis.length;
            riskScore += linkRiskScore * 0.4;
            factorCount += 0.4;
        }

        // Sender risk contribution (30%)
        if (senderAnalysis) {
            const senderRiskScore = senderAnalysis.trustworthiness === 'SUSPICIOUS' ? 100 :
                senderAnalysis.trustworthiness === 'NEUTRAL' ? 50 : 0;
            riskScore += senderRiskScore * 0.3;
            factorCount += 0.3;
        }

        // Content risk contribution (30%)
        if (contentAnalysis) {
            const contentRiskScore = contentAnalysis.riskLevel === 'HIGH' ? 100 :
                contentAnalysis.riskLevel === 'MEDIUM' ? 50 : 0;
            riskScore += contentRiskScore * 0.3;
            factorCount += 0.3;
        }

        // Normalize score
        const normalizedScore = factorCount > 0 ? riskScore / factorCount : 0;

        return normalizedScore >= 70 ? 'HIGH' :
            normalizedScore >= 40 ? 'MEDIUM' : 'LOW';
    }

    static generateLinkWarnings(urlSafety, domainReputation, link) {
        const warnings = [];

        if (urlSafety.safetyLevel === 'DANGEROUS') {
            warnings.push('🚨 This link appears dangerous and should not be clicked');
        } else if (urlSafety.safetyLevel === 'CAUTION') {
            warnings.push('⚠️ Exercise caution when clicking this link');
        }

        if (domainReputation.trustLevel === 'LOW') {
            warnings.push('🔍 Suspicious domain detected');
        }

        if (urlSafety.riskFactors.includes('non_https')) {
            warnings.push('🔓 Connection is not secure (HTTP instead of HTTPS)');
        }

        if (urlSafety.riskFactors.includes('url_shortener')) {
            warnings.push('🔗 This is a shortened URL - destination is hidden');
        }

        return warnings;
    }

    static generateRecommendations(analysis) {
        const recommendations = [];

        if (analysis.overallRisk === 'HIGH') {
            recommendations.push({
                priority: 'CRITICAL',
                message: 'Do not click any links in this email',
                action: 'DELETE_EMAIL'
            });
        }

        if (analysis.detailedAnalysis.links) {
            analysis.detailedAnalysis.links.forEach((link, index) => {
                if (link.analysis.overallRisk === 'HIGH') {
                    recommendations.push({
                        priority: 'HIGH',
                        message: `Avoid clicking: "${link.text}" - ${link.analysis.warningMessages[0]}`,
                        action: 'AVOID_LINK'
                    });
                }
            });
        }

        if (analysis.detailedAnalysis.sender &&
            analysis.detailedAnalysis.sender.trustworthiness === 'SUSPICIOUS') {
            recommendations.push({
                priority: 'MEDIUM',
                message: `Sender "${analysis.detailedAnalysis.sender.email}" appears suspicious`,
                action: 'VERIFY_SENDER'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                priority: 'LOW',
                message: 'This email appears safe. Continue with normal caution.',
                action: 'PROCEED_NORMAL'
            });
        }

        return recommendations;
    }

    static calculateConfidence(analysis) {
        const factors = [];

        // Content quality factor
        if (analysis.detailedAnalysis.content) {
            factors.push(analysis.detailedAnalysis.content.heuristicScore / 100);
        }

        // Link analysis completeness
        if (analysis.detailedAnalysis.links && analysis.detailedAnalysis.links.length > 0) {
            factors.push(0.8); // Good link analysis data
        } else {
            factors.push(0.3); // Limited link data
        }

        // Sender information availability
        if (analysis.detailedAnalysis.sender) {
            factors.push(0.9);
        } else {
            factors.push(0.5);
        }

        const averageConfidence = factors.reduce((a, b) => a + b, 0) / factors.length;

        return averageConfidence >= 0.8 ? 'HIGH' :
            averageConfidence >= 0.6 ? 'MEDIUM' : 'LOW';
    }

    static getFallbackAnalysis() {
        return {
            overallRisk: 'UNKNOWN',
            confidence: 'LOW',
            detailedAnalysis: {},
            recommendations: [{
                priority: 'HIGH',
                message: 'Unable to complete analysis. Proceed with extreme caution.',
                action: 'EXTREME_CAUTION'
            }],
            safeToClick: false
        };
    }
}