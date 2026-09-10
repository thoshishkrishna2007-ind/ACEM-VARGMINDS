import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey Yash! Ask me anything about the local weather or emergency alerts.' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/weather/ai-analysis', {
        prompt: userText
      });

      const botReply =
        response.data?.analysis ||
        response.data?.reply ||
        response.data?.message ||
        'Weather analysis completed.';

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Unable to reach weather AI right now. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            fontSize: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div
          style={{
            width: '350px',
            height: '470px',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              background: '#1e293b',
              borderBottom: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#f8fafc'
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '14px' }}>🤖 Weather AI Assistant</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.sender === 'user' ? '#2563eb' : '#1e293b',
                  color: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  maxWidth: '82%',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '12px' }}>
                Analyzing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            style={{
              padding: '10px',
              borderTop: '1px solid #334155',
              display: 'flex',
              gap: '6px',
              backgroundColor: '#0b1120'
            }}
          >
            <input
              type="text"
              placeholder="Ask about weather..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#06b6d4',
                color: '#0f172a',
                border: 'none',
                fontWeight: 600,
                fontSize: '12px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}