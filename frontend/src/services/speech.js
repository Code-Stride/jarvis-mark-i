// J.A.R.V.I.S. Speech Recognition & Synthesis Engine

export class JarvisSpeechEngine {
  constructor({ onSpeechResult, onSpeechError, onListeningChange, onSpeakingChange }) {
    this.onSpeechResult = onSpeechResult;
    this.onSpeechError = onSpeechError;
    this.onListeningChange = onListeningChange;
    this.onSpeakingChange = onSpeakingChange;

    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    this.voices = [];

    this.pitch = 0.95;
    this.rate = 1.05;
    this.enabled = true;

    this.initRecognition();
    this.loadVoices();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onListeningChange) this.onListeningChange(true);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onListeningChange) this.onListeningChange(false);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onListeningChange) this.onListeningChange(false);
      if (this.onSpeechError) this.onSpeechError(event.error);
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.onSpeechResult && transcript) {
        this.onSpeechResult(transcript);
      }
    };
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  startListening() {
    if (!this.recognition) {
      if (this.onSpeechError) this.onSpeechError("Speech recognition not supported in this browser.");
      return;
    }
    try {
      if (!this.isListening) {
        this.recognition.start();
      }
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  speak(text) {
    if (!this.enabled || !this.synth || !text) return;

    // Strip markdown symbols for natural vocal reading
    const cleanText = text
      .replace(/```[\s\S]*?```/g, "Command output displayed on screen.")
      .replace(/[*#_`~]/g, "")
      .replace(/https?:\/\/\S+/g, "URL displayed on screen");

    this.synth.cancel(); // Stop any currently speaking utterance

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = this.pitch;
    utterance.rate = this.rate;

    // Prefer British English voice or best English voice for butler persona
    const preferredVoice = this.voices.find(
      (v) => v.lang.includes("en-GB") || v.name.includes("UK") || v.name.includes("Daniel") || v.name.includes("Arthur")
    ) || this.voices.find((v) => v.lang.includes("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeakingChange) this.onSpeakingChange(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeakingChange) this.onSpeakingChange(false);
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onSpeakingChange) this.onSpeakingChange(false);
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onSpeakingChange) this.onSpeakingChange(false);
    }
  }

  updateSettings(enabled, pitch, rate) {
    this.enabled = enabled;
    this.pitch = pitch;
    this.rate = rate;
  }
}
