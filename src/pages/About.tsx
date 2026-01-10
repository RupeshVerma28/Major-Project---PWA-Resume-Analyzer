export const About = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">About ResumeAI</h1>
                <p className="text-lg text-muted-foreground">
                    We believe every student and job seeker deserves fair, transparent, and accurate feedback on their resume.
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">How it Works</h2>
                <p>
                    ResumeAI runs entirely in your browser. When you upload a resume, our rules-based engine scans the text for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Formatting issues:</strong> Complex layouts, tables, or images that confuse ATS.</li>
                    <li><strong>Keyword optimization:</strong> Missing industry-standard skills and action verbs.</li>
                    <li><strong>Section completeness:</strong> Ensuring you have Education, Experience, and Skills sections.</li>
                </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Disclaimer & Ethics Policy</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This tool uses deterministic rules to analyze your resume. It does NOT use generative AI to "guess" or "hallucinate" information.
                    The score provided is a guide based on common Applicant Tracking System (ATS) patterns, but it is <strong>not a guarantee</strong> of hiring or interview selection.
                    <br /><br />
                    We do not store your data on any server. All processing happens locally on your device.
                </p>
            </div>
        </div>
    );
};
