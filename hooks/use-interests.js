"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

/**
 * Stateful hook managing shopping category interest preferences.
 * Connects to MongoDB user profile for logged-in users, and uses
 * local storage for anonymous visitors.
 */
export function useInterests() {
  const { data: session } = useSession();
  const user = session?.user;

  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadInterests = useCallback(async () => {
    setLoading(true);
    if (user) {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.profile?.interests) {
            setInterests(json.data.profile.interests);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile interests:", err);
      }
    }

    // Fallback: load from local storage
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("vouchiqo_interests");
      if (local) {
        try {
          setInterests(JSON.parse(local));
        } catch {
          setInterests([]);
        }
      } else {
        setInterests([]);
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadInterests();
  }, [loadInterests]);

  const saveInterests = async (newInterests) => {
    setInterests(newInterests);
    
    if (user) {
      setSyncing(true);
      try {
        await fetch("/api/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interests: newInterests }),
        });
      } catch (err) {
        console.error("Failed to sync interests to database:", err);
      } finally {
        setSyncing(false);
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem("vouchiqo_interests", JSON.stringify(newInterests));
      }
    }
  };

  return {
    interests,
    saveInterests,
    loading,
    syncing,
    reload: loadInterests,
  };
}
