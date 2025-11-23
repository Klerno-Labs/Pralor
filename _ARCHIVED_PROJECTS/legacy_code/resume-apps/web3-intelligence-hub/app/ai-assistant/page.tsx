'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PageShell from '@/components/layout/PageShell';
import MessageList from '@/components/research/MessageList';
import MessageInput from '@/components/research/MessageInput';
import TypingIndicator from '@/components/research/TypingIndicator';
import { ChatMessage, AssistantResponse } from '@/lib/research/types';

export default function ResearchPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  // Load chat history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('research-chat-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    }
  }, []);

  // Save chat history to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('research-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingContent('');

    try {
      // Create a placeholder assistant message for streaming
      const assistantMessageId = uuidv4();
      const placeholderMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, placeholderMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let currentContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.done) {
                // Final update with structured response
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                        ...msg,
                        content: data.fullContent,
                        structuredResponse: data.structuredResponse
                      }
                      : msg
                  )
                );
              } else if (data.content) {
                currentContent += data.content;
                setStreamingContent(currentContent);

                // Update the streaming message content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: currentContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Error parsing stream chunk', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'system',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  return (
    <PageShell
      title="AI Research Assistant"
      description="Deep dive into tokenomics, risks, and opportunities with AI."
    >
      <div className="flex flex-col h-[calc(100vh-12rem)] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/50 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

        <MessageList
          messages={messages}
          onExampleClick={handleSendMessage}
        />

        {isLoading && streamingContent === '' && (
          <div className="px-4">
            <TypingIndicator />
          </div>
        )}

        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </PageShell>
  );
}
