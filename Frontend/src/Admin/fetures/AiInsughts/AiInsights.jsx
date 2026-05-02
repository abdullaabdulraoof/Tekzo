import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config/apiConfig";

export const AiInsights = () => {
    const [summary, setSummary] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const [summaryRes, logsRes] = await Promise.all([
                axios.get(`${API_URL}/api/ai-analytics/summary`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/ai-analytics/logs`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setSummary(summaryRes.data);
            setLogs(logsRes.data || []);
        } catch (err) {
            console.error("AI insights error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => 
        log.query?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="ml-[211px] min-h-screen bg-black text-white flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="text-gray-400 animate-pulse">Analyzing AI Intelligence...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ml-[211px] min-h-screen bg-black text-white p-10 font-sans">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">AI Insights</h1>
                <p className="text-gray-400 text-lg">Monitor and analyze AI interactions, performance, and usage patterns.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard 
                    label="Total Interactions" 
                    value={summary?.totalInteractions || 0} 
                    icon={<InteractionsIcon />}
                />
                <StatCard 
                    label="Failed Queries" 
                    value={summary?.failedQueries || 0} 
                    color="text-red-500"
                    icon={<FailedIcon />}
                />
                <StatCard 
                    label="Success Rate" 
                    value={`${summary?.totalInteractions ? Math.round(((summary.totalInteractions - summary.failedQueries) / summary.totalInteractions) * 100) : 0}%`}
                    color="text-green-500"
                    icon={<SuccessIcon />}
                />
            </div>

            {/* Secondary Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <InsightBox title="Top Queries" data={summary?.topQueries || []} />
                <InsightBox title="Action Stats" data={summary?.actionStats || []} />
                <InsightBox title="Tool Usage" data={summary?.topTools || []} />
            </div>

            {/* Main Logs Table Card */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold">Recent AI Logs</h2>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                                <SearchIcon />
                            </span>
                            <input 
                                type="text" 
                                placeholder="Search logs..." 
                                className="bg-black border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Show</span>
                            <select className="bg-black border border-white/10 rounded px-2 py-1 focus:outline-none">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                            <span>entries</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-white/5">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Query</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Tool</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">
                                                {(log.user?.username || log.user?.email || "U").substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-sm text-gray-300 font-medium">
                                                {log.user?.username || log.user?.email || "User"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[300px] truncate text-sm text-white font-light" title={log.query}>
                                            {log.query}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] font-medium text-gray-400">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {log.toolUsed || "None"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 italic">
                                        {log.responseType}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.success ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-[11px] font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                SUCCESS
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-[11px] font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                FAILED
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Visual only as per request) */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between text-sm text-gray-500">
                    <p>Showing 1 to {filteredLogs.length} of {logs.length} entries</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">Previous</button>
                        <button className="px-3 py-1 rounded bg-white text-black font-bold">1</button>
                        <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color = "text-white", icon }) => (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group shadow-lg">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">{label}</p>
                <h2 className={`text-4xl font-extrabold ${color} tracking-tight`}>{value}</h2>
            </div>
            <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
        </div>
    </div>
);

const InsightBox = ({ title, data }) => (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-5 border-b border-white/5 pb-2">{title}</h2>
        <div className="space-y-3">
            {data.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No analytics data available yet</p>
            ) : (
                data.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white/[0.03] rounded-xl px-4 py-3 hover:bg-white/[0.06] transition-colors group">
                        <span className="text-sm text-gray-400 truncate max-w-[200px] group-hover:text-white transition-colors">
                            {item._id || "Unknown"}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[#5694F7] font-black text-lg">{item.count}</span>
                            <span className="text-[10px] text-gray-600 uppercase font-bold">hits</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

// Minimal SVG Icons
const InteractionsIcon = () => (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const FailedIcon = () => (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const SuccessIcon = () => (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);