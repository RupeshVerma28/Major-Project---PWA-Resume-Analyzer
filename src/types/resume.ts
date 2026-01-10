export interface ResumeSection {
    id: string;
    title: string;
    content: string[]; // Lines or paragraphs
    score?: number; // Section specific score
    feedback?: string[]; // Specific improvements
}

export interface ParsedResume {
    fileName: string;
    fileType: 'pdf' | 'docx';
    rawText: string;
    metadata: {
        name?: string;
        email?: string;
        phone?: string;
        links?: string[];
    };
    sections: {
        education: ResumeSection;
        experience: ResumeSection;
        skills: ResumeSection;
        projects: ResumeSection;
        certifications: ResumeSection;
    };
}

export interface AnalysisResult {
    id: string;
    date: string;
    resume: ParsedResume;
    atsScore: number; // 0-100
    sectionScores: {
        [key in keyof ParsedResume['sections']]?: number;
    };
    keywords: {
        matched: string[];
        missing: string[];
    };
    suggestions: {
        priority: 'high' | 'medium' | 'low';
        section: string;
        message: string;
        action: string;
    }[];
}

export interface HistoryItem {
    id: string;
    fileName: string;
    date: string;
    score: number;
}
