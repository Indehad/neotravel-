'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'user' | 'emma' | 'system';

interface Message {
  id: string;
  role: Role;
  text: string;
  ts: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'emma',
  text: 'Bonjour ! Je suis Emma, votre conseillère transport NeoTravel.\n\nJe peux vous préparer un devis personnalisé en quelques minutes.\n\nPar où voulez-vous commencer ? Dites-moi votre trajet, vos dates, et le nombre de passagers.',
  ts: new Date(),
};

// ─── Components ───────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: '#8AA84B' }}
      >
        E
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-5">
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#8AA84B', animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#8AA84B', animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#8AA84B', animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const isSystem = msg.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs px-3 py-1 rounded-full" style={{ color: '#B5CC7A', backgroundColor: 'rgba(138,168,75,0.15)' }}>
          {msg.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#1a3a5c' }}>
          V
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#8AA84B' }}>
          E
        </div>
      )}

      <div
        className="max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm"
        style={
          isUser
            ? { backgroundColor: '#8AA84B', color: '#fff', borderBottomRightRadius: '4px' }
            : { backgroundColor: '#fff', color: '#1e293b', borderBottomLeftRadius: '4px' }
        }
      >
        {msg.text}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: generateId(), role: 'user', text, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text }),
      });

      const data = await res.json();
      const emmaMsg: Message = {
        id: generateId(),
        role: 'emma',
        text: res.ok
          ? data.reply || data.output || "Je n'ai pas pu obtenir de réponse."
          : data.error || 'Une erreur est survenue. Réessayez.',
        ts: new Date(),
      };
      setMessages(prev => [...prev, emmaMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: generateId(), role: 'system', text: 'Connexion interrompue.', ts: new Date() },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#0A2240' }}>

      {/* Header */}
      <header
        className="px-4 py-3 flex items-center gap-3 flex-shrink-0 border-b"
        style={{ backgroundColor: '#0A2240', borderColor: 'rgba(138,168,75,0.3)' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: '#8AA84B' }}
        >
          E
        </div>
        <div>
          <p className="font-semibold text-white text-sm">Emma</p>
          <p className="text-xs" style={{ color: '#B5CC7A' }}>Conseillère Transport · NeoTravel</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8AA84B' }} />
          <span className="text-xs" style={{ color: '#B5CC7A' }}>En ligne</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ backgroundColor: '#0d2d4a' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs px-3 py-2 rounded-lg inline-block max-w-sm" style={{ color: '#8AA84B', backgroundColor: 'rgba(138,168,75,0.1)' }}>
              Vos données sont collectées uniquement pour établir votre devis transport (RGPD Art. 6).
            </p>
          </div>

          {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 flex-shrink-0 border-t"
        style={{ backgroundColor: '#0A2240', borderColor: 'rgba(138,168,75,0.3)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-2 border"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(138,168,75,0.4)' }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Décrivez votre trajet, dates, nombre de passagers…"
              rows={1}
              disabled={loading}
              className="flex-1 bg-transparent resize-none outline-none text-sm py-1 max-h-[120px] disabled:opacity-50"
              style={{ color: '#fff', height: '36px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 mb-0.5"
              style={{ backgroundColor: '#8AA84B' }}
              aria-label="Envoyer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: '#B5CC7A', opacity: 0.5 }}>
            Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
          </p>
        </div>
      </div>

    </div>
  );
}
