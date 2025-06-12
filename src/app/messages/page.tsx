'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppConfig } from '@/lib/api/config';

const BASE_URL = `${AppConfig.postgresHttpBaseUrl}/customer`;
const MERCHANT_ID = 95; // 🔒 hard‑coded merchant ID

/** DB shape coming back from /conversation */
interface MessageDto {
    id: number;
    customerId: number;
    merchantId: number;
    senderType: 'C' | 'M';
    message: string;
    createdAt: string; // ISO string
}

export default function MessagesPage() {
    /* form state ----------------------------------------------------------- */
    const [customerId, setCustomerId] = useState('');
    const [newMsg, setNewMsg] = useState('');

    /* data state ----------------------------------------------------------- */
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);

    /* helper: scroll chat to bottom whenever msgs change ------------------ */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /* fetch conversation --------------------------------------------------- */
    const loadConversation = useCallback(async () => {
        if (!customerId) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/conversation?customerId=${customerId}&merchantId=${MERCHANT_ID}`,
                { credentials: 'include' }
            );
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data: MessageDto[] = await res.json();
            setMessages(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    /* auto-refresh every 5 s ---------------------------------------------- */
    useEffect(() => {
        loadConversation(); // initial load
        const id = setInterval(loadConversation, 5000); // poll
        return () => clearInterval(id);
    }, [loadConversation]);

    /* send a message ------------------------------------------------------- */
    const handleSend = async () => {
        if (!newMsg.trim() || !customerId) return;

        const payload = {
            customerId: Number(customerId),
            merchantId: MERCHANT_ID,
            senderType: 'M', // merchant is sending
            message: newMsg.trim(),
        };

        try {
            const res = await fetch(`${BASE_URL}/sendMessage`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Send failed');
            const saved: MessageDto = await res.json();
            setMessages((prev) => [...prev, saved]);
            setNewMsg('');
        } catch (err: any) {
            alert(err.message || 'Could not send message.');
        }
    };

    /* UI ------------------------------------------------------------------- */
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Messages</h1>

            {/* Customer selector */}
            <div className="mb-4">
                <input
                    className="border p-2 rounded w-full max-w-xs"
                    type="number"
                    placeholder="Customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                />
            </div>
            <button
                onClick={loadConversation}
                className="mb-5 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!customerId || loading}
            >
                {loading ? 'Loading…' : 'Load Conversation'}
            </button>

            {/* chat window */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="h-96 overflow-y-auto border rounded p-4 bg-gray-50">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`mb-3 flex ${m.senderType === 'M' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm break-words
                ${m.senderType === 'M' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-900'}`}
                        >
                            <p>{m.message}</p>
                            <span className="block text-xs opacity-70 mt-1">
                {new Date(m.createdAt).toLocaleString()}
              </span>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* composer */}
            <div className="mt-4 flex">
                <input
                    className="flex-grow border p-2 rounded-l"
                    type="text"
                    placeholder="Type a message…"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-green-600 text-white px-4 rounded-r disabled:opacity-50"
                    disabled={!newMsg.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
