import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import { loadLordicon } from '../../../utils/loadLordicon';

export const Sidebar = () => {
    useEffect(() => {
        loadLordicon();
    }, []);

    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            name: 'Orders',
            path: '/ordersList',
            icon: 'https://cdn.lordicon.com/rezibkiy.json'
        },
        {
            name: 'Wishlist',
            path: '/account/wishlist',
            icon: 'https://cdn.lordicon.com/efgqjiqt.json'
        },
        {
            name: 'Profile',
            path: '/account/profilee',
            icon: 'https://cdn.lordicon.com/kdduutaw.json'
        }
    ];

    return (
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-4 sticky top-28">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <lord-icon
                                        src={item.icon}
                                        trigger="hover"
                                        colors={`primary:${isActive ? '#60a5fa' : '#9ca3af'},secondary:${isActive ? '#60a5fa' : '#9ca3af'}`}
                                        style={{ width: "22px", height: "22px" }}>
                                    </lord-icon>
                                </div>
                                <span className="font-medium text-sm">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    )
}
