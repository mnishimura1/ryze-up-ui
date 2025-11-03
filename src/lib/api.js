const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.ryze.pro';
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://api.ryze.pro/ws';
export const api = {
    base: API_BASE,
    ws: WS_URL,
    async get(endpoint) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok)
            throw new Error(`API error: ${response.status}`);
        return response.json();
    },
    async post(endpoint, data) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error(`API error: ${response.status}`);
        return response.json();
    },
    connectWS(handler) {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => console.log('WS connected');
        ws.onmessage = handler;
        ws.onerror = (err) => console.error('WS error:', err);
        ws.onclose = () => console.log('WS closed');
        return ws;
    },
};
