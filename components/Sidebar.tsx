import React from 'react';
import { clearSupabaseConfig } from '../supabaseClient';

const Sidebar: React.FC = () => {
    const navItems = [
        { name: 'Load Manager', href: '#', icon: 'M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM22.5 13.5V6.375c0-1.035-.84-1.875-1.875-1.875h-.375a3 3 0 0 0-3-3H9.375a3 3 0 0 0-3 3H6c-1.036 0-1.875.84-1.875 1.875v7.125c0 .621.504 1.125 1.125 1.125h.375a3 3 0 0 1 5.25 0h.375a3 3 0 0 1 5.25 0h.375c.621 0 1.125-.504 1.125-1.125v-7.125Zm-18-3a.375.375 0 0 1 .375-.375h.375a.375.375 0 0 1 .375.375v.375h-.75V10.5Z', current: true },
        { name: 'Dashboard', href: '#', icon: 'M2.25 13.5h3.86a2.25 2.25 0 0 1 2.25 2.25v3.86a2.25 2.25 0 0 1-2.25 2.25H2.25a2.25 2.25 0 0 1-2.25-2.25v-3.86a2.25 2.25 0 0 1 2.25-2.25Zm10.5 0h3.86a2.25 2.25 0 0 1 2.25 2.25v3.86a2.25 2.25 0 0 1-2.25 2.25h-3.86a2.25 2.25 0 0 1-2.25-2.25v-3.86a2.25 2.25 0 0 1 2.25-2.25ZM2.25 3h3.86a2.25 2.25 0 0 1 2.25 2.25v3.86a2.25 2.25 0 0 1-2.25 2.25H2.25A2.25 2.25 0 0 1 0 9.36V5.5A2.25 2.25 0 0 1 2.25 3Zm10.5 0h3.86a2.25 2.25 0 0 1 2.25 2.25v3.86a2.25 2.25 0 0 1-2.25 2.25h-3.86a2.25 2.25 0 0 1-2.25-2.25V5.5a2.25 2.25 0 0 1 2.25-2.25Z', current: false, disabled: true },
        { name: 'Analytics', href: '#', icon: 'M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z M21 13.5A7.5 7.5 0 1 1 13.5 6v7.5h7.5Z', current: false, disabled: true },
    ];

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
                <div className="flex-grow px-4">
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                                    ${item.current
                                        ? 'bg-blue-50 text-blue-700'
                                        : item.disabled
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }
                                `}
                                aria-current={item.current ? 'page' : undefined}
                                onClick={(e) => item.disabled && e.preventDefault()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-3">
                                    <path d={item.icon} />
                                </svg>
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
            <div className="p-4 border-t border-gray-200">
                <button 
                    onClick={clearSupabaseConfig}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Disconnect DB
                </button>
            </div>
        </div>
    );
};

export default Sidebar;