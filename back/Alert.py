import numpy as np
import sounddevice as sd
import time

def generate_tone(frequency, duration, sample_rate=44100):
    """Generate a sine wave tone at a specific frequency and duration."""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    tone = 0.5 * np.sin(2 * np.pi * frequency * t)  # Volume at 0.5
    return tone

def play_tone(frequency1, duration1, frequency2, duration2):
    """Play two frequencies back-to-back without a gap."""
    tone1 = generate_tone(frequency1, duration1)
    tone2 = generate_tone(frequency2, duration2)
    combined_tone = np.concatenate((tone1, tone2))  # Join the two tones directly
    sd.play(combined_tone, samplerate=44100)
    sd.wait()

# Define dispatch tones
def selective_tone_dispatch(type='alert'):
    if type == 1:
        play_tone(300, 1.5, 500, 1.5)
    elif type == 2:
        play_tone(400, 1.5, 600, 1.5)
    elif type == 3:
        play_tone(500, 1.5, 700, 1.5)
    elif type == 4:
        play_tone(600, 1.5, 800, 1.5)
    else:
        play_tone(900, 2, 800, 2)

def alert(despacho):
    for i in despacho:
        cia = int(str(i)[:1])
        selective_tone_dispatch(cia)
        time.sleep(0.3)