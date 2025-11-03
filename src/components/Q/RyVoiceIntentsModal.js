import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';
export const RyVoiceIntentsModal = () => {
    const { safety } = useStore();
    const [open, setOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [intents, setIntents] = useState([]);
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
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onstart = () => {
            setError('');
        };
        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    setTranscript(transcript);
                    processIntent(transcript);
                }
                else {
                    interimTranscript += transcript;
                }
            }
        };
        recognition.onerror = (event) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
        };
        recognition.onend = () => {
            setIsListening(false);
        };
        recognition.start();
    };
    const processIntent = (text) => {
        // Simulate intent classification
        let category = 'query';
        if (text.toLowerCase().includes('long') || text.toLowerCase().includes('short') || text.toLowerCase().includes('close'))
            category = 'trade';
        if (text.toLowerCase().includes('close') || text.toLowerCase().includes('stop'))
            category = 'control';
        const intent = {
            id: Date.now().toString(),
            text,
            confidence: 0.85 + Math.random() * 0.15,
            category,
            timestamp: Date.now(),
        };
        setIntents((prev) => [intent, ...prev]);
    };
    const handleExecuteIntent = (intent) => {
        if (!safety.deploy && intent.category === 'trade') {
            return;
        }
        console.log(`Executing voice intent: ${intent.text}`);
    };
    const handleClear = () => {
        setTranscript('');
        setIntents([]);
    };
    const getCategoryColor = (category) => {
        return {
            trade: 'bg-success/10 text-success',
            query: 'bg-warn/10 text-warn',
            control: 'bg-danger/10 text-danger',
        }[category] || 'bg-dark-border text-dark-text/70';
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setOpen(true), className: "flex items-center space-x-2 px-3 py-2 rounded bg-dark-border text-dark-text hover:bg-dark-border/80 transition text-sm font-semibold", children: "\uD83C\uDFA4 Voice Intents" }), open && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/50 z-40 backdrop-blur-sm", onClick: () => setOpen(false) }), _jsx(Card, { children: _jsx("div", { className: "fixed inset-4 top-20 bottom-20 left-20 right-20 z-50 rounded-lg overflow-hidden", children: _jsxs("div", { className: "bg-dark-panel border border-dark-border rounded-lg h-full flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-dark-border flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Voice Command Assistant" }), _jsx("button", { onClick: () => setOpen(false), className: "text-dark-text/70 hover:text-dark-text text-xl", children: "\u2715" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "text-center", children: _jsx("button", { onClick: startListening, disabled: isListening, className: `px-6 py-3 rounded-lg font-semibold text-lg transition ${isListening
                                                        ? 'bg-danger text-white pulse'
                                                        : 'bg-accent text-dark-bg hover:bg-accent/90'}`, children: isListening ? '🎤 Listening...' : '🎤 Start Listening' }) }), transcript && (_jsxs("div", { className: "p-4 bg-dark-bg rounded border border-dark-border", children: [_jsx("div", { className: "text-xs text-dark-text/70 mb-2", children: "Detected Transcript:" }), _jsxs("div", { className: "text-lg text-dark-text italic", children: ["\"", transcript, "\""] })] })), error && (_jsx("div", { className: "p-4 bg-danger/10 rounded border border-danger/50 text-danger text-sm", children: error })), intents.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Recent Intents" }), _jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: intents.map((intent) => {
                                                            const isDisabled = !safety.deploy && intent.category === 'trade';
                                                            return (_jsx("div", { className: `p-3 rounded border cursor-pointer transition ${isDisabled ? 'opacity-50' : 'hover:bg-dark-bg/50'}`, children: _jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm text-dark-text", children: intent.text }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx("span", { className: `text-xs px-2 py-0.5 rounded ${getCategoryColor(intent.category)}`, children: intent.category }), _jsxs("span", { className: "text-xs text-dark-text/70", children: [(intent.confidence * 100).toFixed(0), "% confident"] })] })] }), _jsx("button", { onClick: () => handleExecuteIntent(intent), disabled: isDisabled, className: `px-2 py-1 rounded text-xs font-semibold transition ${isDisabled
                                                                                ? 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed'
                                                                                : 'bg-accent text-dark-bg hover:bg-accent/90'}`, children: "Execute" })] }) }, intent.id));
                                                        }) })] })), !safety.deploy && (_jsx("div", { className: "p-4 bg-warn/10 rounded border border-warn/50 text-warn text-sm", children: "\u26A0\uFE0F Trade intents disabled in Sandbox Mode. Query and control intents are available." }))] }), _jsxs("div", { className: "p-4 border-t border-dark-border flex justify-between", children: [_jsx("button", { onClick: handleClear, className: "px-3 py-2 rounded text-sm font-semibold bg-dark-border text-dark-text hover:bg-dark-border/80 transition", children: "Clear" }), _jsx("button", { onClick: () => setOpen(false), className: "px-3 py-2 rounded text-sm font-semibold bg-accent text-dark-bg hover:bg-accent/90 transition", children: "Close" })] })] }) }) })] }))] }));
};
