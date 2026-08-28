/**
 * Midnight Votive style reminder: sensory interaction should feel calm and ceremonial;
 * sound intensity only drives the candle response, never becomes visually noisy.
 */
import { useEffect, useRef, useState } from "react";

type BlowDetectorOptions = {
  enabled: boolean;
  armed?: boolean;
  onBlowOut: () => void;
  threshold?: number;
};

export type BlowStatus = "idle" | "listening" | "denied" | "unsupported";

export function useBlowDetector({
  enabled,
  armed = true,
  onBlowOut,
  threshold = 0.1,
}: BlowDetectorOptions) {
  const [intensity, setIntensity] = useState(0);
  const [status, setStatus] = useState<BlowStatus>("idle");
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setIntensity(0);
      setStatus("idle");
      firedRef.current = false;
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setStatus("unsupported");
      return;
    }

    let animationFrame = 0;
    let audioContext: AudioContext | null = null;
    let stream: MediaStream | null = null;
    let active = true;

    const beginListening = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            autoGainControl: false,
            noiseSuppression: false,
            echoCancellation: false,
          },
        });

        if (!active) return;

        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.72;
        source.connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        setStatus("listening");

        const sample = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let index = 0; index < data.length; index += 1) {
            const normalized = (data[index] - 128) / 128;
            sum += normalized * normalized;
          }
          const rms = Math.sqrt(sum / data.length);
          const nextIntensity = Math.min(1, Math.max(0, (rms - 0.015) * 11));
          setIntensity(nextIntensity);

          if (armed && nextIntensity > threshold && !firedRef.current) {
            firedRef.current = true;
            onBlowOut();
          }

          if (active) animationFrame = requestAnimationFrame(sample);
        };

        sample();
      } catch {
        if (active) setStatus("denied");
      }
    };

    void beginListening();

    return () => {
      active = false;
      cancelAnimationFrame(animationFrame);
      stream?.getTracks().forEach((track) => track.stop());
      void audioContext?.close();
    };
  }, [enabled, armed, onBlowOut, threshold]);

  return { intensity, status };
}
