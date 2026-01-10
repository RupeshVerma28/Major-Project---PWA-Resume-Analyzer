import { useEffect } from "react";
import { useResume } from "@/context/ResumeContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const Analysis = () => {
    const { currentAnalysis } = useResume();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentAnalysis) {
            navigate('/');
        }
    }, [currentAnalysis, navigate]);

    if (!currentAnalysis) return null;

    const { atsScore, suggestions, resume } = currentAnalysis;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
                    <p className="text-muted-foreground">File: {resume.fileName}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => window.print()}>Export PDF</Button>
                    <Button onClick={() => navigate('/')}>Analyze Another</Button>
                </div>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle>ATS Score</CardTitle>
                        <CardDescription>Your overall compatibility rating</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-6">
                        <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/20">
                            <span className="text-4xl font-bold text-primary">{atsScore}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Key Observations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium">File Format</p>
                                <p className="text-sm text-muted-foreground">Standard {resume.fileType.toUpperCase()} format is ATS friendly.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                            <div>
                                <p className="font-medium">Keyword Matching</p>
                                <p className="text-sm text-muted-foreground">Found {currentAnalysis.keywords.matched.length} major keywords. Consider adding more technical terms.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Suggestions */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Improvement Suggestions</h2>
                {suggestions.map((suggestion, idx) => (
                    <Card key={idx} className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 bg-muted rounded">{suggestion.section}</span>
                                    <span className="text-sm font-medium text-yellow-600 capitalize">Priority: {suggestion.priority}</span>
                                </div>
                                <p className="font-medium">{suggestion.message}</p>
                                <p className="text-sm text-muted-foreground">Action: {suggestion.action}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {suggestions.length === 0 && (
                    <div className="text-center p-8 bg-muted/20 rounded-lg">
                        <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="font-medium">Great job! No critical issues found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
