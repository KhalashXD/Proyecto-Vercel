type DispatchUnit = string | number;

const COMPANY_TONES: Record<number, [number, number]> = {
  1: [300, 500],
  2: [400, 600],
  3: [500, 700],
  4: [600, 800],
};

const DEFAULT_TONES: [number, number] = [900, 800];
const TONE_DURATION_SECONDS = 1.5;
const DEFAULT_DURATION_SECONDS = 2;
const GAP_SECONDS = 0.3;

const getCompanyFromUnit = (unit: DispatchUnit): number | null => {
  const value = String(unit).trim();
  const match = value.match(/\d/);

  return match ? Number(match[0]) : null;
};

const playTone = (
  audioContext: AudioContext,
  frequency: number,
  startTime: number,
  duration: number
): void => {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
  gain.gain.setValueAtTime(0.35, startTime + duration - 0.03);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

export const playDispatchAlert = async (
  dispatchUnits: DispatchUnit[]
): Promise<void> => {
  if (!dispatchUnits.length) {
    return;
  }

  const AudioContextConstructor =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextConstructor) {
    console.warn("Web Audio API no esta disponible en este navegador.");
    return;
  }

  const audioContext = new AudioContextConstructor();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  let cursor = audioContext.currentTime + 0.05;

  dispatchUnits.forEach((unit) => {
    const company = getCompanyFromUnit(unit);
    const tones = company ? COMPANY_TONES[company] || DEFAULT_TONES : DEFAULT_TONES;
    const duration =
      tones === DEFAULT_TONES ? DEFAULT_DURATION_SECONDS : TONE_DURATION_SECONDS;

    playTone(audioContext, tones[0], cursor, duration);
    cursor += duration;

    playTone(audioContext, tones[1], cursor, duration);
    cursor += duration + GAP_SECONDS;
  });

  window.setTimeout(() => {
    audioContext.close().catch(() => undefined);
  }, Math.ceil((cursor - audioContext.currentTime + 0.5) * 1000));
};
