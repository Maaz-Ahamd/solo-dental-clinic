import React from 'react';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <svg
                className="absolute w-full h-full text-slate-100/50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#f1f5f9', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#e2e8f0', stopOpacity: 0.2 }} />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#grad1)"
                    d="M0,0 C300,200 600,0 1000,200 L1000,1000 L0,1000 Z"
                >
                    <animate
                        attributeName="d"
                        dur="30s"
                        repeatCount="indefinite"
                        values="
                            M0,0 C300,200 600,0 1000,200 L1000,1000 L0,1000 Z;
                            M0,0 C300,0 600,200 1000,0 L1000,1000 L0,1000 Z;
                            M0,0 C300,200 600,0 1000,200 L1000,1000 L0,1000 Z
                        "
                    />
                </path>
            </svg>
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-100/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[35%] h-[35%] bg-indigo-100/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
    );
};

export default AnimatedBackground;
