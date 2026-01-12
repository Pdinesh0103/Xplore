'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Map, Calendar } from 'lucide-react';

interface RoadmapStep {
    title: string;
    duration: string;
    description: string;
}

interface SavedRoadmap {
    id: string;
    jobRole: string;
    skillLevel: string;
    steps: RoadmapStep[];
    createdAt: any;
}

export default function SavedRoadmaps() {
    const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (!u) {
                setRoadmaps([]);
                setLoading(false);
            } else {
                fetchRoadmaps(u.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchRoadmaps = async (userId: string) => {
        try {
            const q = query(
                collection(db, 'roadmaps'),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SavedRoadmap[];
            setRoadmaps(data);
        } catch (error) {
            console.error("Error fetching roadmaps:", error);
        } finally {
            setLoading(false);
        }
    };

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading saved roadmaps...</div>;
    }

    if (!user) {
        return null;
    }

    if (roadmaps.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No saved roadmaps yet</h3>
                <p className="text-gray-500">Generate your first career path to see it here!</p>
            </div>
        );
    }

    return (
        <div id="saved-roadmaps" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900">Your Saved Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roadmaps.map((roadmap) => {
                    const isExpanded = expanded[roadmap.id];

                    return (
                        <div
                            key={roadmap.id}
                            onClick={() => toggleExpand(roadmap.id)}
                            className={`bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer relative ${isExpanded ? 'ring-2 ring-blue-50' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{roadmap.jobRole}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                        {roadmap.skillLevel}
                                    </span>
                                </div>
                                <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-blue-100' : 'bg-blue-50'}`}>
                                    <Map className={`w-5 h-5 ${isExpanded ? 'text-blue-700' : 'text-blue-600'}`} />
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                {roadmap.steps.slice(0, isExpanded ? undefined : 2).map((step, idx) => (
                                    <div key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        <div>
                                            <span className={`font-medium ${isExpanded ? 'block mb-1 text-gray-800' : 'inline'}`}>
                                                {step.title}
                                            </span>
                                            {isExpanded && (
                                                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                                                    {step.description} (Duration: {step.duration})
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {!isExpanded && roadmap.steps.length > 2 && (
                                    <div className="text-xs text-gray-400 pl-3.5 pt-1">
                                        +{roadmap.steps.length - 2} more steps...
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4 mt-auto">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Created {roadmap.createdAt?.toDate().toLocaleDateString()}
                                </div>
                                <span className="text-blue-500 font-medium">
                                    {isExpanded ? 'Show Less' : 'View Details'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
