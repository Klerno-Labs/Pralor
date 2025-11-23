export default function TypingIndicator() {
    return (
        <div className="flex items-start mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-[85%]">
                {/* Role label */}
                <div className="text-xs font-medium mb-2 text-left text-purple-400">
                    Crypto Research Assistant
                </div>

                {/* Typing bubble */}
                <div className="glass-card text-slate-100 shadow-xl rounded-2xl px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1.5">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}></div>
                        </div>
                        <span className="text-sm text-slate-400 animate-pulse">Analyzing...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
