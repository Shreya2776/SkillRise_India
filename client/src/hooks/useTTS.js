import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useTTS — Text-to-Speech hook
 * ─────────────────────────────
 * Wraps the Web Speech API's SpeechSynthesis for reading AI responses aloud.
 *
 * Returns:
 *   speak(text: string, options?) — start speaking
 *   stop()                        — cancel current speech
 *   speaking: boolean             — whether TTS is active
 *   supported: boolean            — browser support flag
 */
export function useTTS(defaultOptions = {}) {
  const [speaking,  setSpeaking]  = useState(false);
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(isSupported);
    
    // Ensure voices are loaded (some browsers load them async)
    if (isSupported) {
      window.speechSynthesis.getVoices();
    }
    
    return () => window.speechSynthesis?.cancel(); // cleanup on unmount
  }, []);

  const speak = useCallback(
    (text, options = {}) => {
      if (!supported || !text?.trim()) return;

      // Cancel anything already playing to prevent overlapping speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || defaultOptions.lang || "en-US";
      
      // AI humanization: Slightly slower, clearer rate for technical clarity
      utterance.rate = options.rate || defaultOptions.rate || 0.95;
      utterance.pitch = options.pitch || defaultOptions.pitch || 1.05;
      utterance.volume = options.volume || defaultOptions.volume || 1;

      // Natural Voice Selection Strategy
      const voices = window.speechSynthesis.getVoices();
      
      // Priorities: Google Natural > Apple/System Natural > English Default
      const preferredVoice = voices.find(v => 
        v.lang.startsWith("en") && 
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Premium"))
      ) || voices.find(v => v.lang.startsWith("en"));
      
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (e) => {
        console.warn("[useTTS] Speech error:", e.error);
        setSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported, defaultOptions]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}
