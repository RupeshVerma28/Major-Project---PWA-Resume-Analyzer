import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResume } from '@/context/ResumeContext';
import { useNavigate } from 'react-router-dom';

export const DropzoneArea = () => {
    const { analyzeResume, isAnalyzing, error } = useResume();
    const navigate = useNavigate();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            await analyzeResume(file);
            // After analysis (mocked or real), navigate to results
            navigate('/analysis');
        }
    }, [analyzeResume, navigate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/5 hover:bg-muted/10",
                    isAnalyzing ? "opacity-50 pointer-events-none" : ""
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-4">
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <FileType className="w-12 h-12 text-primary mb-4" />
                            <p className="text-lg font-medium">Analyzing your resume...</p>
                            <p className="text-sm text-muted-foreground">This happens right on your device.</p>
                        </div>
                    ) : (
                        <>
                            <Upload className={cn("w-12 h-12 mb-4 text-muted-foreground", isDragActive && "text-primary")} />
                            <p className="mb-2 text-lg font-semibold text-foreground">
                                {isDragActive ? "Drop your resume here" : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                PDF or DOCX (Max 5MB)
                            </p>
                        </>
                    )}
                </div>
            </div>
            {error && (
                <div className="mt-4 p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
};
