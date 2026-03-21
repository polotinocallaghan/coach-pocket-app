'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    User,
    ChevronRight,
    Trophy,
    Activity,
    PlayCircle,
    MessageSquare,
    BookOpen,
    Video
} from 'lucide-react';
import { format } from 'date-fns';
import { dataStore, CalendarEvent } from '@/lib/store';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function PlayerDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Get Upcoming Events for the Player
    const events = dataStore.getCalendarEvents();
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const nextSession = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

    // Simulated data for assigned drills in the next session
    const assignedDrills = [
        { id: '1', title: 'Crosscourt Rally Pattern', duration: '15m', category: 'drill' },
        { id: '2', title: 'Serve & Volley Setup', duration: '10m', category: 'drill' }
    ];

    // Simulated recent feedback
    const recentFeedback = [
        { id: 'f1', type: 'video', title: 'Forehand Follow-through', date: 'Yesterday', coach: 'Coach David' },
        { id: 'f2', type: 'comment', title: 'Great intensity in the third set.', date: '2 days ago', coach: 'Coach David' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Player Welcome Header */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-12 opacity-5 pointer-events-none">
                    <User className="w-64 h-64 text-indigo-400" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome back, <span className="text-indigo-400">{user?.displayName?.split(' ')[0] || 'Player'}</span>
                        </h1>
                        <p className="text-slate-400 max-w-lg">
                            Ready to train? Here is what you need to focus on today.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Next Session Highlight */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-400" />
                            Next Practice
                        </h2>

                        {nextSession ? (
                            <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                                                {nextSession.type}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{nextSession.title}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm font-medium">
                                                <span className="flex items-center gap-1.5 text-slate-300">
                                                    <CalendarIcon className="w-4 h-4 text-indigo-400" />
                                                    {format(new Date(nextSession.date), 'EEEE, MMMM do')}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-300">
                                                    <Clock className="w-4 h-4 text-indigo-400" />
                                                    {nextSession.time || '14:00 - 15:30'}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-300">
                                                    <MapPin className="w-4 h-4 text-indigo-400" />
                                                    Court 2
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assigned Drills Preview */}
                                    <div className="mt-6 border-t border-slate-700/50 pt-6">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            Assigned Drills to Preview
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {assignedDrills.map((drill) => (
                                                <div key={drill.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-3 flex items-center justify-between group hover:border-indigo-500/50 transition-colors cursor-pointer" onClick={() => router.push('/library')}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                            <PlayCircle className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">{drill.title}</p>
                                                            <p className="text-xs text-slate-500">{drill.duration} • {drill.category}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-800/30 border border-slate-700 border-dashed rounded-2xl p-12 text-center text-slate-500">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No upcoming sessions scheduled.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">

                    {/* Recent Feedback & Video */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-rose-400" />
                            Recent Feedback
                        </h2>
                        <div className="space-y-3">
                            {recentFeedback.map((feedback) => (
                                <div key={feedback.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                            feedback.type === 'video' ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                        )}>
                                            {feedback.type === 'video' ? <Video className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors leading-tight mb-1">{feedback.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span>{feedback.coach}</span>
                                                <span>•</span>
                                                <span>{feedback.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Schedule Mini */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-emerald-400" />
                            This Week
                        </h2>
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-1">
                            {upcomingEvents.slice(1, 4).map((event, idx) => (
                                <div key={event.id} className={cn(
                                    "p-3 flex items-center gap-3 hover:bg-slate-800/50 rounded-xl transition cursor-default",
                                    idx !== upcomingEvents.slice(1, 4).length - 1 && "border-b border-slate-700/30"
                                )}>
                                    <div className="min-w-[48px] text-center">
                                        <span className="block text-xs font-bold text-slate-500 uppercase">{format(new Date(event.date), 'MMM')}</span>
                                        <span className="block text-lg font-bold text-white leading-none mt-0.5">{format(new Date(event.date), 'd')}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-700/50 mx-1" />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-200">{event.title}</h4>
                                        <p className="text-xs text-slate-400">{event.time || 'All Day'} • {event.type}</p>
                                    </div>
                                </div>
                            ))}
                            {upcomingEvents.length <= 1 && (
                                <div className="p-4 text-center text-sm text-slate-500">
                                    No other upcoming events.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Helper icon
function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
