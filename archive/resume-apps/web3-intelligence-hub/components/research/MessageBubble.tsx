import { ChatMessage } from '@/lib/research/types';

interface MessageBubbleProps {
    message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const displayContent = message.structuredResponse?.content || message.content;

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 message-enter`}>
            <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
                {/* Role label */}
                <div className={`text-xs font-semibold mb-2 ${isUser ? 'text-right text-blue-400' : 'text-left text-purple-400'}`}>
                    {isUser ? 'You' : 'Crypto Research Assistant'}
                </div>

                {/* Message bubble */}
                <div
                    className={`rounded-2xl px-6 py-4 transition-all duration-300 ${isUser
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50'
                            : 'glass-card text-slate-100 shadow-xl hover:shadow-2xl border border-slate-700/30'
                        }`}
                >
                    <p className={`whitespace-pre-wrap leading-relaxed ${isUser ? '' : 'text-slate-300'}`}>
                        {displayContent || <span className="text-slate-500 italic">Thinking...</span>}
                    </p>
                </div>

                {/* Timestamp */}
                <div className={`text-xs text-slate-500 mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>
        </div>
    );
}
