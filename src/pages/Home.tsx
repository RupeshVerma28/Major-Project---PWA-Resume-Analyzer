import { DropzoneArea } from "@/components/upload/DropzoneArea";

export const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center">
            <div className="space-y-4 max-w-2xl px-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Optimize Your Resume for <span className="text-primary">ATS & Humans</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    Free, private, and instant resume analysis. We check for ATS compatibility, keyword gaps, and formatting issues right in your browser.
                </p>
            </div>

            <div className="w-full px-4">
                <DropzoneArea />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl w-full mt-12 px-4">
                <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-semibold mb-2">100% Privacy</h3>
                    <p className="text-sm text-muted-foreground">Your resume is analyzed locally in your browser. No personal data is stored on our servers.</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-semibold mb-2">Detailed Scoring</h3>
                    <p className="text-sm text-muted-foreground">Get instant feedback on ATS readability, section completeness, and keyword matching.</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-semibold mb-2">Actionable Tips</h3>
                    <p className="text-sm text-muted-foreground">Receive specific suggestions to improve your resume's impact and readability.</p>
                </div>
            </div>
        </div>
    );
};
