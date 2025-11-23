import { AssistantResponse } from '@/lib/research/types';
import { useState } from 'react';

interface TokenAnswerPanelProps {
    response: AssistantResponse;
}

export default function TokenAnswerPanel({ response }: TokenAnswerPanelProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        const textToCopy = `
KEY POINTS:
${response.bulletPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

SUMMARY:
${response.summary}

DETAILS:
${response.details}
    `.trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-4 relative">
            {/* Copy Button */}
            <button
                onClick={copyToClipboard}
                className="absolute -top-2 -right-2 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-blue-500/50 transition-all group"
                title="Copy response"
            >
                {copied ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>

            {/* Key Bullet Points */}
            {response.bulletPoints && response.bulletPoints.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Key Points
                    </h3>
                    <ul className="space-y-2">
                        {response.bulletPoints.map((point, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-400 mr-3 mt-1 flex-shrink-0">•</span>
                                <span className="text-slate-200 leading-relaxed">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Summary */}
            {response.summary && (
                <div>
                    <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Summary
                    </h3>
                    <p className="text-slate-200 leading-relaxed">{response.summary}</p>
                </div>
            )}

            {/* Details (collapsible) */}
            {response.details && (
                <div>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center text-sm font-semibold text-emerald-300 mb-2 hover:text-emerald-200 transition-colors"
                    >
                        <svg
                            className={`w-4 h-4 mr-2 transition-transform ${showDetails ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                    {showDetails && (
                        <div className="mt-3 pl-6 border-l-2 border-emerald-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{response.details}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            <div className="pt-3 mt-3 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 italic">
                    ⚠️ This information is for educational purposes only and does not constitute financial advice.
                </p>
            </div>
        </div>
    );
}
