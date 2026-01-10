import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ParsedResume } from '../types/resume';

// Initialize PDF.js worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Common section headers
const SECTIONS = {
    education: /EDUCATION|ACADEMIC|QUALIFICATIONS/i,
    experience: /EXPERIENCE|EMPLOYMENT|WORK HISTORY/i,
    skills: /SKILLS|TECHNOLOGIES|TECHNICAL|COMPETENCIES/i,
    projects: /PROJECTS|PORTFOLIO/i,
    certifications: /CERTIFICATIONS|AWARDS|HONORS/i
};

export const ParserService = {
    async parseResume(file: File): Promise<ParsedResume> {
        const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';

        let rawText = '';
        if (fileType === 'pdf') {
            rawText = await this.parsePDF(file);
        } else {
            rawText = await this.parseDOCX(file);
        }

        const sections = this.extractSections(rawText);
        const metadata = this.extractMetadata(rawText);

        return {
            fileName: file.name,
            fileType,
            rawText,
            metadata,
            sections
        };
    },

    async parsePDF(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Filter for TextItem items which have the 'str' property
            const pageText = textContent.items
                .filter((item: any) => 'str' in item)
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }
        return fullText;
    },

    async parseDOCX(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    },

    extractMetadata(text: string) {
        // Basic email/phone extraction
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const phoneRegex = /(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/;

        const emailMatch = text.match(emailRegex);
        const phoneMatch = text.match(phoneRegex);

        // Name is hard to extract reliably without NLP, but we can guess the first line(s)
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        const name = lines.length > 0 ? lines[0].substring(0, 50) : "Candidate";

        return {
            name,
            email: emailMatch ? emailMatch[0] : undefined,
            phone: phoneMatch ? phoneMatch[0] : undefined
        };
    },

    extractSections(text: string): ParsedResume['sections'] {
        const lines = text.split('\n');
        const result: any = {
            education: { id: 'edu', title: 'Education', content: [], score: 0 },
            experience: { id: 'exp', title: 'Experience', content: [], score: 0 },
            skills: { id: 'skills', title: 'Skills', content: [], score: 0 },
            projects: { id: 'projects', title: 'Projects', content: [], score: 0 },
            certifications: { id: 'certs', title: 'Certifications', content: [], score: 0 },
        };

        let currentSection: keyof typeof result | null = null;

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Check if line is a header
            let isHeader = false;
            for (const [key, regex] of Object.entries(SECTIONS)) {
                if (regex.test(trimmed) && trimmed.length < 50) { // Headers are usually short
                    currentSection = key as keyof typeof result;
                    isHeader = true;
                    break;
                }
            }

            if (isHeader) continue;

            if (currentSection) {
                result[currentSection].content.push(trimmed);
            }
        }

        return result;
    }
};
