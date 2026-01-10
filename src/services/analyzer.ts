import type { ParsedResume, AnalysisResult } from '../types/resume';

const KEYWORDS = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'Tailwind',
    'Python', 'Java', 'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes', 'Git',
    'CI/CD', 'Rest API', 'GraphQL', 'Next.js', 'Vite', 'Redux', 'Agile', 'Scrum'
];

export const AnalyzerService = {
    analyze(resume: ParsedResume): AnalysisResult {
        const { sections, rawText } = resume;
        const matchedKeywords = this.findKeywords(rawText);
        const missingKeywords = KEYWORDS.filter(k => !matchedKeywords.includes(k));

        // Calculate Section Scores
        const sectionScores = {
            education: this.scoreSection(sections.education),
            experience: this.scoreSection(sections.experience),
            skills: this.scoreSection(sections.skills),
            projects: this.scoreSection(sections.projects), // Optional but good
            certifications: this.scoreSection(sections.certifications), // Optional
        };

        // Calculate Overall ATS Score
        // Weightage: Experience 30%, Skills 30%, Education 20%, Projects 20%
        let atsScore =
            (sectionScores.education * 0.2) +
            (sectionScores.experience * 0.3) +
            (sectionScores.skills * 0.3) +
            (sectionScores.projects * 0.2);

        // Boost score if keyword match is high (up to 10 points)
        const keywordDensity = matchedKeywords.length / KEYWORDS.length;
        atsScore += Math.min(10, keywordDensity * 20);

        // Cap at 100
        atsScore = Math.min(100, Math.round(atsScore));

        // Generate Suggestions
        const suggestions = this.generateSuggestions(resume, sectionScores, matchedKeywords);

        return {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            resume,
            atsScore,
            sectionScores,
            keywords: {
                matched: matchedKeywords,
                missing: missingKeywords,
            },
            suggestions
        };
    },

    findKeywords(text: string): string[] {
        const lower = text.toLowerCase();
        return KEYWORDS.filter(k => lower.includes(k.toLowerCase()));
    },

    scoreSection(section: any): number {
        if (!section || section.content.length === 0) return 0;
        // Simple length heuristic: > 5 lines = 100%, < 5 lines scales down
        const lengthScore = Math.min(100, section.content.length * 20);
        return lengthScore;
    },

    generateSuggestions(resume: ParsedResume, scores: any, matched: string[]) {
        const suggestions: AnalysisResult['suggestions'] = [];

        // Critical Sections
        if (scores.education < 50) {
            suggestions.push({
                priority: 'high',
                section: 'Education',
                message: 'Your Education section is missing or too short.',
                action: 'Add your degree, university, and graduation year.'
            });
        }
        if (scores.experience < 50) {
            suggestions.push({
                priority: 'high',
                section: 'Experience',
                message: 'Your Work Experience section is sparse.',
                action: 'Detail your roles using bullet points and action verbs.'
            });
        }
        if (scores.skills < 50) {
            suggestions.push({
                priority: 'high',
                section: 'Skills',
                message: 'Skills section is critical for ATS.',
                action: 'List technical and soft skills clearly.'
            });
        }

        // Keyword suggestions
        if (matched.length < 5) {
            suggestions.push({
                priority: 'medium',
                section: 'Keywords',
                message: 'Low keyword count detection.',
                action: 'Include more industry-standard technical terms found in job descriptions.'
            });
        }

        // Formatting
        if (resume.metadata.email === undefined) {
            suggestions.push({
                priority: 'high',
                section: 'Contact',
                message: 'Could not detect an email address.',
                action: 'Ensure your email is clearly visible at the top.'
            });
        }

        return suggestions;
    }
};
