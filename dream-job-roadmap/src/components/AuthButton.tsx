'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Error signing in", error);
            if (error.code === 'auth/operation-not-allowed') {
                alert("Configuration Error: Google Sign-In is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.");
            } else if (error.code === 'auth/popup-closed-by-user') {
                // User closed popup, no need to alert
            } else {
                alert("Failed to sign in. See console for details.");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <button
                    onClick={() => document.getElementById('saved-roadmaps')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors hidden sm:block"
                >
                    My Roadmaps
                </button>
                <div className="flex items-center gap-2 group relative cursor-help" title={`Name: ${user.displayName || 'User'}\nEmail: ${user.email || 'No email'}`}>
                    {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-gray-200" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                        </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden md:block group-hover:underline decoration-dotted underline-offset-4">
                        {user.displayName?.split(' ')[0]}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
            <LogIn className="w-4 h-4" />
            Sign In
        </button>
    );
}
