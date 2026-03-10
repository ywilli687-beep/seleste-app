"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';

const AgentChatWindow = forwardRef(({ agent, businessId, businessData, auditResults, marketingPlans }, ref) => {
    const bottomRef = useRef(null);

    // Vercel AI SDK useChat Hook handles all state, history, and streaming chunks automatically
    const { messages, input, handleInputChange, handleSubmit, isLoading, append, setInput } = useChat({
        api: '/api/chat',
        body: {
            businessId,
            agentId: agent.id,
            businessData,
            auditResults,
            marketingPlans
        },
        initialMessages: [
            { id: '1', role: 'assistant', content: `Ops Orchestrator online for ${businessData?.businessName || 'your business'}. I've reviewed your audit data and 90-day plan. What should we tackle first?` }
        ]
    });

    const customHandleSubmit = (e) => {
        e.preventDefault();

        const userText = input.toLowerCase().trim();
        if (userText === 'unlock full report' || userText === 'unlock') {
            // Append user message
            append({ role: 'user', content: input });

            // Clear input manually
            setInput('');

            // Fake an immediate assistant response suggesting page options
            append({
                role: 'assistant',
                content: "Generating your secure checkout link..."
            });

            fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessId })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.url) {
                        window.location.href = data.url;
                    } else {
                        throw new Error("No checkout URL returned");
                    }
                })
                .catch(err => {
                    console.error(err);
                    append({
                        role: 'assistant',
                        content: "Sorry, I couldn't reach the billing server to unlock the report right now. Please try again later or visit the [Pricing Page](/pricing)."
                    });
                });

            return;
        }

        // Standard submission
        handleSubmit(e);
    };

    useImperativeHandle(ref, () => ({
        triggerTask: (msg) => {
            append({ role: 'user', content: msg });
        }
    }));

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-[600px] bg-white text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0px_#111] relative">
            {/* Agent Header */}
            <div className="flex justify-between items-center p-5 bg-white border-b-[2px] border-[#111] shrink-0">
                <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">★</span>
                    <div className="flex flex-col">
                        <span className="font-sans font-bold text-lg leading-tight">{agent.label}</span>
                        <span className="font-mono text-[10px] text-[#555] uppercase tracking-widest mt-1">
                            Orchestrator - {businessData?.businessName} context loaded
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#eefaf8] border border-[#2a7a6f]">
                    <span className="font-mono text-[10px] text-[#2a7a6f] uppercase font-bold tracking-widest">
                        Context Loaded
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#fffcf8]">
                {messages.map((m) => (
                    <div key={m.id} className={`flex flex-col w-full ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {m.content && (
                            <>
                                <div
                                    className={`p-5 max-w-[85%] text-[15px] font-serif leading-relaxed rounded-none ${m.role === 'user'
                                        ? 'bg-[#111] text-[#f4ebe1] border-2 border-[#111]'
                                        : 'bg-[#f4ebe1] text-[#111] border border-[#ccc] shadow-[2px_2px_0px_#ccc]'
                                        }`}
                                >
                                    <ReactMarkdown
                                        className="prose prose-p:leading-relaxed prose-pre:bg-[#111] prose-pre:text-[#f4ebe1] prose-pre:border-[#111] prose-pre:rounded-none"
                                        components={{
                                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-2" {...props} />,
                                            a: ({ node, ...props }) => <a className="text-[#2a7a6f] font-bold underline hover:text-[#111]" {...props} />
                                        }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                                <div className={`font-mono text-[9px] text-[#777] uppercase tracking-widest mt-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {m.role === 'user' ? 'YOU' : agent.label.toUpperCase()} &nbsp;&nbsp; JUST NOW
                                </div>
                            </>
                        )}
                        {m.toolInvocations?.map((tool) => (
                            <div key={tool.toolCallId} className="p-4 mt-2 bg-[#eefaf8] border border-[#2a7a6f] text-[#2a7a6f] text-xs font-mono max-w-[85%] flex items-start gap-3 w-full shadow-[2px_2px_0px_rgba(42,122,111,0.2)]">
                                <div className="mt-0.5">
                                    {tool.state === 'result' ? '✓' : <span className="animate-spin inline-block">⚙️</span>}
                                </div>
                                <div className="flex-1">
                                    <span className="uppercase tracking-widest font-bold block mb-1">
                                        {tool.state === 'result' ? `Agent Deployed: ${tool.args.agent_type}` : 'Initializing Agent Deployment...'}
                                    </span>
                                    <p className="text-[#2a7a6f]/80 leading-snug font-serif italic">{tool.args.action_description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex justify-start">
                        <div className="p-4 bg-white border border-[#ccc] text-[#555] font-serif text-sm italic flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full border-t-2 border-[#111] animate-spin" />
                            Drafting response...
                        </div>
                    </div>
                )}

                <div ref={bottomRef} className="pb-2" />
            </div>

            {/* Input Area */}
            <form onSubmit={customHandleSubmit} className="p-5 bg-white border-t-[2px] border-[#111] shrink-0 flex gap-3 items-center">
                <input
                    type="text"
                    className="flex-1 bg-white border border-[#ccc] px-4 py-3 text-[15px] font-sans text-[#111] outline-none focus:border-[#111] transition-colors placeholder:text-[#999]"
                    placeholder="Ask your agent..."
                    value={input}
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="h-full px-6 py-3 bg-[#111] text-white font-mono text-[11px] font-bold tracking-widest uppercase disabled:opacity-50 transition-colors hover:bg-[#333] flex items-center gap-2 border-2 border-[#111]"
                >
                    SEND <span className="text-[13px]">&#9654;</span>
                </button>
            </form>
        </div>
    );
});

export default AgentChatWindow;
