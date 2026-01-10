import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, History, Info, Download } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export const Navbar = () => {
    const location = useLocation();
    const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

    React.useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };

    const navItems = [
        { href: '/', label: 'Analyze', icon: FileText },
        { href: '/history', label: 'History', icon: History },
        { href: '/about', label: 'About', icon: Info },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between mx-auto px-4">
                <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
                    <FileText className="h-6 w-6 text-primary" />
                    <span>ResumeAI</span>
                </Link>

                <div className="flex items-center gap-2">
                    {navItems.map(item => (
                        <Link key={item.href} to={item.href}>
                            <Button
                                variant={location.pathname === item.href ? "secondary" : "ghost"}
                                size="sm"
                                className="hidden md:flex gap-2"
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                            <Button
                                variant={location.pathname === item.href ? "secondary" : "ghost"}
                                size="icon"
                                className="md:hidden"
                                title={item.label}
                            >
                                <item.icon className="h-4 w-4" />
                            </Button>
                        </Link>
                    ))}

                    {deferredPrompt && (
                        <Button size="sm" onClick={handleInstall} className="ml-2 gap-2">
                            <Download className="h-4 w-4" />
                            <span className="hidden md:inline">Install App</span>
                        </Button>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
};
