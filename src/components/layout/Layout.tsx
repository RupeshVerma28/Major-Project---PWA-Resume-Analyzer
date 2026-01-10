import { Navbar } from './Navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            <Navbar />
            <main className="container mx-auto px-4 pt-20 pb-12">
                {children}
            </main>
            {/* <Toaster /> */}
        </div>
    );
};
