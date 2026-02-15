'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getConversationsByUserId, getUserById, getServiceById, getMessagesByConversationId } from '@/lib/storage';
import { Conversation } from '@/lib/types';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (user) {
      const convos = getConversationsByUserId(user.id).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setConversations(convos);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in required</h2>
          <p className="text-muted-foreground mb-4">You need to be logged in to view messages.</p>
          <a href="/auth" className="text-burnt-orange font-medium hover:text-burnt-orange-dark">Sign in →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
      <p className="text-muted-foreground mb-8">Your conversations with other students</p>

      {conversations.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-border bg-card">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
          <p className="text-muted-foreground mb-4">Start a conversation by messaging a service provider</p>
          <Link href="/services" className="text-sm font-medium text-burnt-orange hover:text-burnt-orange-dark">Browse services →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(convo => {
            const otherUserId = convo.participants.find(p => p !== user.id) || '';
            const otherUser = getUserById(otherUserId);
            const service = getServiceById(convo.serviceId);
            const messages = getMessagesByConversationId(convo.id);
            const lastMessage = messages[messages.length - 1];

            return (
              <Link
                key={convo.id}
                href={`/messages/${convo.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burnt-orange text-white font-bold shrink-0">
                  {otherUser?.name.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-foreground truncate">{otherUser?.name || 'Unknown'}</p>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {new Date(lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {service && (
                    <p className="text-xs text-burnt-orange mb-0.5 truncate">Re: {service.title}</p>
                  )}
                  {lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">{lastMessage.text}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
