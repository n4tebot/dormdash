'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getConversationById, getMessagesByConversationId, createMessage, getUserById, getServiceById } from '@/lib/storage';
import { Message, Conversation, User, Service } from '@/lib/types';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convo = getConversationById(id);
    if (convo) {
      setConversation(convo);
      const otherId = convo.participants.find(p => p !== user?.id) || '';
      setOtherUser(getUserById(otherId) || null);
      setService(getServiceById(convo.serviceId) || null);
      setMessages(getMessagesByConversationId(convo.id));
    }
  }, [id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !user || !conversation) return;
    createMessage({
      conversationId: conversation.id,
      senderId: user.id,
      text: text.trim(),
    });
    setMessages(getMessagesByConversationId(conversation.id));
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in required</h2>
          <a href="/auth" className="text-burnt-orange font-medium hover:text-burnt-orange-dark">Sign in →</a>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Conversation not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/messages" className="text-muted-foreground hover:text-foreground transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burnt-orange text-white font-bold">
            {otherUser?.name.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-semibold text-foreground">{otherUser?.name || 'Unknown'}</p>
            {service && (
              <Link href={`/services/${service.id}`} className="text-xs text-burnt-orange hover:text-burnt-orange-dark transition-colors">
                Re: {service.title}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No messages yet. Say hello!</p>
        )}
        {messages.map(msg => {
          const isMine = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isMine
                  ? 'bg-burnt-orange text-white rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="rounded-xl bg-burnt-orange px-4 py-2.5 text-white hover:bg-burnt-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
