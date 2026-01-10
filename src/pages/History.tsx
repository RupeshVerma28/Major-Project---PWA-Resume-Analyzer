import { useEffect } from 'react';
import { useResume } from "@/context/ResumeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/storage';

export const History = () => {
    const { history, refreshHistory, loadAnalysis } = useResume();
    const navigate = useNavigate();

    useEffect(() => {
        refreshHistory();
    }, []);

    const handleLoad = async (id: string) => {
        await loadAnalysis(id);
        navigate('/analysis');
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await StorageService.deleteAnalysis(id);
        await refreshHistory();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Your Analysis History</h1>
            <p className="text-muted-foreground">Locally stored results of your previous resumes.</p>

            <div className="grid gap-4">
                {history.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleLoad(item.id)}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">{item.fileName}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <span className="text-2xl font-bold">{item.score}</span>
                                    <span className="text-xs text-muted-foreground block">ATS Score</span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={(e) => handleDelete(e, item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {history.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No history found. Upload a resume to get started!</p>
                        <Button className="mt-4" onClick={() => navigate('/')}>Upload Resume</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
