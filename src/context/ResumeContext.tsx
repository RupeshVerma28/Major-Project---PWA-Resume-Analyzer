import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AnalysisResult, HistoryItem } from '../types/resume';
import { ParserService } from '../services/parser';
import { AnalyzerService } from '../services/analyzer';
import { StorageService } from '../services/storage';

interface ResumeContextType {
    currentAnalysis: AnalysisResult | null;
    history: HistoryItem[];
    isAnalyzing: boolean;
    error: string | null;
    analyzeResume: (file: File) => Promise<void>;
    loadAnalysis: (id: string) => Promise<void>;
    clearAnalysis: () => void;
    refreshHistory: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
    const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        refreshHistory();
    }, []);

    const refreshHistory = async () => {
        const data = await StorageService.getHistory();
        setHistory(data);
    };

    const analyzeResume = async (file: File) => {
        setIsAnalyzing(true);
        setError(null);
        try {
            // 1. Parse
            const parsed = await ParserService.parseResume(file);

            // 2. Analyze
            const result = AnalyzerService.analyze(parsed);

            // 3. Save
            await StorageService.saveAnalysis(result);

            // 4. Update State
            setCurrentAnalysis(result);
            await refreshHistory();

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to analyze resume');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const loadAnalysis = async (id: string) => {
        setIsAnalyzing(true);
        try {
            const result = await StorageService.getAnalysis(id);
            if (result) {
                setCurrentAnalysis(result);
            } else {
                setError("Analysis not found");
            }
        } catch (err: any) {
            setError("Failed to load analysis");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearAnalysis = () => {
        setCurrentAnalysis(null);
        setError(null);
    }

    return (
        <ResumeContext.Provider value={{
            currentAnalysis,
            history,
            isAnalyzing,
            error,
            analyzeResume,
            loadAnalysis,
            clearAnalysis,
            refreshHistory
        }}>
            {children}
        </ResumeContext.Provider>
    );
}

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};
