import { get, set, del } from 'idb-keyval';
import type { AnalysisResult, HistoryItem } from '../types/resume';

const HISTORY_KEY = 'resume_history_ids';
const ANALYSIS_PREFIX = 'analysis_';

export const StorageService = {
    // Save a new analysis result
    async saveAnalysis(result: AnalysisResult): Promise<void> {
        try {
            // Save the full analysis
            await set(ANALYSIS_PREFIX + result.id, result);

            // Update the history list (lightweight)
            const currentHistory = await this.getHistory();
            const newHistoryItem: HistoryItem = {
                id: result.id,
                fileName: result.resume.fileName,
                date: result.date,
                score: result.atsScore
            };

            // Add to beginning
            await set(HISTORY_KEY, [newHistoryItem, ...currentHistory]);
        } catch (error) {
            console.error('Failed to save analysis to IndexedDB:', error);
        }
    },

    // Get list of all analyses
    async getHistory(): Promise<HistoryItem[]> {
        try {
            return (await get<HistoryItem[]>(HISTORY_KEY)) || [];
        } catch (error) {
            console.error('Failed to load history:', error);
            return [];
        }
    },

    // Get specific analysis
    async getAnalysis(id: string): Promise<AnalysisResult | undefined> {
        try {
            return await get<AnalysisResult>(ANALYSIS_PREFIX + id);
        } catch (error) {
            console.error('Failed to load analysis:', error);
            return undefined;
        }
    },

    // Delete an analysis
    async deleteAnalysis(id: string): Promise<void> {
        try {
            await del(ANALYSIS_PREFIX + id);
            const currentHistory = await this.getHistory();
            const updatedHistory = currentHistory.filter(item => item.id !== id);
            await set(HISTORY_KEY, updatedHistory);
        } catch (error) {
            console.error('Failed to delete analysis:', error);
        }
    },

    // Clear all
    async clearAll(): Promise<void> {
        try {
            // Get all history IDs
            const history = await this.getHistory();
            for (const item of history) {
                await del(ANALYSIS_PREFIX + item.id);
            }
            await del(HISTORY_KEY);
        } catch (error) {
            console.error("Failed to clear storage", error);
        }
    }
};
