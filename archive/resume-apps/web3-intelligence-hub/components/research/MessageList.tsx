import { ChatMessage } from '@/lib/research/types';
import MessageBubble from './MessageBubble';
import { useEffect, useRef } from 'react';

interface MessageListProps {
    messages: ChatMessage[];
    onExampleClick?: (question: string) => void;
}

const EXAMPLE_PROMPTS = [
    "What is Ethereum and how does it work?",
    "Analyze Bitcoin's tokenomics",
    "What are the risks of investing in Solana?",
    "Compare Uniswap and PancakeSwap",
];

export default function MessageList({ messages, onExampleClick }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="glass-card p-8 rounded-3xl max-w-md">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-100 mb-2">
                            Crypto Research Assistant
                        </h2>
                        <p className="text-slate-400 mb-4">
                            AI-powered token research at your fingertips
                        </p>
                        <div className="text-sm text-slate-500 space-y-3">
                            <p className="font-medium">Try these examples:</p>
                            <div className="grid gap-2">
                                {EXAMPLE_PROMPTS.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => onExampleClick?.(prompt)}
                                        className="text-left px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-blue-500/50 text-slate-300 hover:text-blue-300 transition-all text-sm group"
                                    >
                                        <span className="flex items-center justify-between">
                                            <span>{prompt}</span>
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
}
