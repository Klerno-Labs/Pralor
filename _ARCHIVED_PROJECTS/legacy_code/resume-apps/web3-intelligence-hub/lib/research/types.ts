export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    structuredResponse?: AssistantResponse;
}

export interface AssistantResponse {
    content: string;
}

export interface ChatRequest {
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
}

export interface ChatResponse {
    message: ChatMessage;
    error?: string;
}
