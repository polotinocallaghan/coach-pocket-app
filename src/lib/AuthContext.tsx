"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { dataStore } from "@/lib/store";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    firestoreReady: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    firestoreReady: false,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [firestoreReady, setFirestoreReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            setFirestoreReady(false);

            if (firebaseUser) {
                // 1. Instantly load local cache so UI is responsive
                dataStore.initForUser(firebaseUser.uid);
                // 2. Pull fresh data from Firestore in background
                try {
                    await dataStore.syncFromFirestore(firebaseUser.uid);
                } catch (err) {
                    console.error("[AuthContext] Firestore sync failed:", err);
                }
                
                // Set cookie for middleware
                document.cookie = "tf_auth_status=authenticated; path=/; max-age=2592000; SameSite=Lax; Secure";
                setFirestoreReady(true);
            } else {
                // Guest / logged out — just use local state
                dataStore.initForUser(null);
                document.cookie = "tf_auth_status=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                setFirestoreReady(true);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, firestoreReady, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
