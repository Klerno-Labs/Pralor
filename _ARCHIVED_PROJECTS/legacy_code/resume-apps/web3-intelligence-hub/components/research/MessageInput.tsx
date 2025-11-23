import { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (!text.trim() || disabled) return;
        onSend(text.trim());
        setText('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            className="w-full bg-slate-800/50 text-slate-100 rounded-2xl px-5 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-800/70 transition-all placeholder:text-slate-500 scrollbar-thin"
                            placeholder="Ask about any crypto token or protocol..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={disabled}
                            rows={1}
                            style={{
                                minHeight: '52px',
                                maxHeight: '200px',
                                height: 'auto',
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                            }}
                        />
                        {text.length > 0 && !disabled && (
                            <button
                                onClick={handleSend}
                                className="absolute right-3 bottom-3 text-blue-400 hover:text-blue-300 transition-colors"
                                title="Send message (Enter)"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={disabled || !text.trim()}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:scale-105 active:scale-95"
                    >
                        Send
                    </button>
                </div>
                <div className="text-xs text-slate-500 mt-2 text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Shift + Enter</kbd> for new line
                </div>
            </div>
        </div>
    );
}
