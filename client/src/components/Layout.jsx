import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, Stethoscope, DollarSign, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AnimatedBackground from './AnimatedBackground';

const Layout = ({ children }) => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Patient Manager', href: '/patients', icon: Users },
        { name: 'Appointments', href: '/appointments', icon: Calendar },
        { name: 'Treatments', href: '/treatments', icon: Stethoscope },
        { name: 'Payments', href: '/payments', icon: DollarSign },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50/50 relative">
            <AnimatedBackground />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`w-72 bg-white/90 backdrop-blur-sm border-r border-slate-200/60 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-8 border-b border-slate-100">
                    <div className="flex items-center">
                        <Activity className="h-6 w-6 text-slate-800 mr-3" />
                        <span className="text-lg font-bold tracking-tight text-slate-900">SoloDental</span>
                    </div>
                    {/* Close Button Mobile */}
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 group ${
                                    isActive
                                        ? 'bg-slate-100 text-slate-900 font-medium'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                                onClick={() => setIsSidebarOpen(false)} // Close on navigate
                            >
                                <Icon className={`h-4 w-4 mr-3 transition-colors ${
                                    isActive ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'
                                }`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Snippet */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm mr-3">
                            Dr
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">Dr. Hamza Ali</p>
                            <p className="text-xs text-slate-500 truncate">Dentist Admin</p>
                        </div>
                        <button 
                             onClick={() => alert("Logout functionality would go here")}
                             className="text-slate-400 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                             title="Logout"
                        >
                            <DollarSign className="h-4 w-4" /> {/* Fallback icon since logout svg was generic */}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col md:ml-72 min-w-0 bg-slate-50/50 relative z-10 transition-all duration-300">
                 {/* Header - Minimal & Floating or blended */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="mr-4 md:hidden text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
                            {navigation.find((n) => n.href === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>
                    
                    <div className="flex items-center space-x-4 md:space-x-6">
                         {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme} 
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    </div>
                </header>

                <main className="flex-1 w-full p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
