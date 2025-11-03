import React, { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

interface VoiceIntent {
  id: string;
  text: string;
  confidence: number;
  category: 'trade' | 'query' | 'control';
  timestamp: number;
}

export const RyVoiceIntentsModal: React.FC = () => {
  const { safety } = useStore();
  const [open, setOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [intents, setIntents] = useState<VoiceIntent[]>([]);
  const [error, setError] = useState('');

  // Simulate SpeechRecognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech Recognition not supported in this browser');
      return;
    }

    setIsListening(true);
    setTranscript('');
    setError('');

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setError('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(transcript);
          processIntent(transcript);
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processIntent = (text: string) => {
    // Simulate intent classification
    let category: 'trade' | 'query' | 'control' = 'query';
    if (text.toLowerCase().includes('long') || text.toLowerCase().includes('short') || text.toLowerCase().includes('close'))
      category = 'trade';
    if (text.toLowerCase().includes('close') || text.toLowerCase().includes('stop'))
      category = 'control';

    const intent: VoiceIntent = {
      id: Date.now().toString(),
      text,
      confidence: 0.85 + Math.random() * 0.15,
      category,
      timestamp: Date.now(),
    };

    setIntents((prev) => [intent, ...prev]);
  };

  const handleExecuteIntent = (intent: VoiceIntent) => {
    if (!safety.deploy && intent.category === 'trade') {
      return;
    }
    console.log(`Executing voice intent: ${intent.text}`);
  };

  const handleClear = () => {
    setTranscript('');
    setIntents([]);
  };

  const getCategoryColor = (category: string) => {
    return {
      trade: 'bg-success/10 text-success',
      query: 'bg-warn/10 text-warn',
      control: 'bg-danger/10 text-danger',
    }[category] || 'bg-dark-border text-dark-text/70';
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 rounded bg-dark-border text-dark-text hover:bg-dark-border/80 transition text-sm font-semibold"
      >
        🎤 Voice Intents
      </button>

      {/* Modal */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <Card>
            <div className="fixed inset-4 top-20 bottom-20 left-20 right-20 z-50 rounded-lg overflow-hidden">
              <div className="bg-dark-panel border border-dark-border rounded-lg h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-dark-border flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Voice Command Assistant</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-dark-text/70 hover:text-dark-text text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Listening Section */}
                  <div className="text-center">
                    <button
                      onClick={startListening}
                      disabled={isListening}
                      className={`px-6 py-3 rounded-lg font-semibold text-lg transition ${
                        isListening
                          ? 'bg-danger text-white pulse'
                          : 'bg-accent text-dark-bg hover:bg-accent/90'
                      }`}
                    >
                      {isListening ? '🎤 Listening...' : '🎤 Start Listening'}
                    </button>
                  </div>

                  {/* Transcript Display */}
                  {transcript && (
                    <div className="p-4 bg-dark-bg rounded border border-dark-border">
                      <div className="text-xs text-dark-text/70 mb-2">Detected Transcript:</div>
                      <div className="text-lg text-dark-text italic">"{transcript}"</div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-danger/10 rounded border border-danger/50 text-danger text-sm">
                      {error}
                    </div>
                  )}

                  {/* Intent History */}
                  {intents.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Recent Intents</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {intents.map((intent) => {
                          const isDisabled = !safety.deploy && intent.category === 'trade';
                          return (
                            <div
                              key={intent.id}
                              className={`p-3 rounded border cursor-pointer transition ${
                                isDisabled ? 'opacity-50' : 'hover:bg-dark-bg/50'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="text-sm text-dark-text">{intent.text}</div>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(intent.category)}`}>
                                      {intent.category}
                                    </span>
                                    <span className="text-xs text-dark-text/70">
                                      {(intent.confidence * 100).toFixed(0)}% confident
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleExecuteIntent(intent)}
                                  disabled={isDisabled}
                                  className={`px-2 py-1 rounded text-xs font-semibold transition ${
                                    isDisabled
                                      ? 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed'
                                      : 'bg-accent text-dark-bg hover:bg-accent/90'
                                  }`}
                                >
                                  Execute
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sandbox Warning */}
                  {!safety.deploy && (
                    <div className="p-4 bg-warn/10 rounded border border-warn/50 text-warn text-sm">
                      ⚠️ Trade intents disabled in Sandbox Mode. Query and control intents are available.
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-dark-border flex justify-between">
                  <button
                    onClick={handleClear}
                    className="px-3 py-2 rounded text-sm font-semibold bg-dark-border text-dark-text hover:bg-dark-border/80 transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded text-sm font-semibold bg-accent text-dark-bg hover:bg-accent/90 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
};
