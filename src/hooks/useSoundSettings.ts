import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Simple sound effects using Web Audio API
const playTone = (frequency: number, duration: number, type: OscillatorType = "sine") => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.log("Audio not supported");
  }
};

export const useSoundSettings = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("creative_parent_settings")
        .select("sound_enabled")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setSoundEnabled(data.sound_enabled);
      }
    };

    fetchSettings();

    // Subscribe to changes
    const channel = supabase
      .channel("parent_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "creative_parent_settings",
          filter: user ? `user_id=eq.${user.id}` : undefined,
        },
        (payload) => {
          if (payload.new && "sound_enabled" in payload.new) {
            setSoundEnabled(payload.new.sound_enabled as boolean);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    playTone(523.25, 0.1); // C5
    setTimeout(() => playTone(659.25, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 0.2), 200); // G5
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    playTone(440, 0.05); // A4
  }, [soundEnabled]);

  const playMatch = useCallback(() => {
    if (!soundEnabled) return;
    playTone(587.33, 0.15); // D5
    setTimeout(() => playTone(880, 0.2), 100); // A5
  }, [soundEnabled]);

  const playCelebration = useCallback(() => {
    if (!soundEnabled) return;
    playTone(523.25, 0.1); // C5
    setTimeout(() => playTone(587.33, 0.1), 100); // D5
    setTimeout(() => playTone(659.25, 0.1), 200); // E5
    setTimeout(() => playTone(783.99, 0.1), 300); // G5
    setTimeout(() => playTone(1046.5, 0.3), 400); // C6
  }, [soundEnabled]);

  return {
    soundEnabled,
    playSuccess,
    playClick,
    playMatch,
    playCelebration,
  };
};
