"use client";

import { useState } from 'react';
import { MessageSquarePlus, X, Send } from 'lucide-react';

export default function GlobalFeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [type, setType] = useState('idea'); // 'idea', 'bug', 'other'
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        // In a real app, this would POST to an API or Discord webhook
        console.log('Sending feedback:', { type, feedback, url: window.location.href });

        setSubmitted(true);
        setTimeout(() => {
            setIsOpen(false);
            setSubmitted(false);
            setFeedback('');
        }, 2000);
    };

    if (isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-[100] w-80 bg-[#fffcf8] border-[2px] border-[#111] shadow-[8px_8px_0px_#111] font-serif flex flex-col">
                <div className="flex items-center justify-between border-b-[2px] border-[#111] px-4 py-3 bg-[#f4ebe1]">
                    <h3 className="font-sans font-bold text-sm tracking-tight flex items-center gap-2">
                        <MessageSquarePlus size={16} /> Beta Feedback
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-[#111] hover:text-[#f4ebe1] p-1 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {submitted ? (
                    <div className="p-6 text-center">
                        <p className="font-mono text-xs uppercase tracking-widest text-[#2a7a6f] font-bold mb-2">Sent via Seleste</p>
                        <p className="text-sm italic text-[#555]">We heavily rely on this feedback. Thank you.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setType('idea')}
                                className={`flex-1 py-1.5 font-mono text-[10px] uppercase border-[1px] border-[#111] transition-colors ${type === 'idea' ? 'bg-[#111] text-[#f4ebe1]' : 'bg-transparent text-[#111] hover:bg-[#111]/10'}`}
                            >Idea</button>
                            <button
                                type="button"
                                onClick={() => setType('bug')}
                                className={`flex-1 py-1.5 font-mono text-[10px] uppercase border-[1px] border-[#111] transition-colors ${type === 'bug' ? 'bg-[#c64e32] text-[#f4ebe1] border-[#c64e32]' : 'bg-transparent text-[#111] hover:bg-[#111]/10'}`}
                            >Bug</button>
                        </div>

                        <textarea
                            autoFocus
                            required
                            placeholder="What's missing? What's broken? We build fast."
                            className="w-full h-28 bg-[#f4ebe1] border-[1px] border-[#111] p-3 text-sm font-sans resize-none focus:outline-none focus:ring-1 focus:ring-[#111]"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="w-full bg-[#111] text-[#f4ebe1] py-2.5 font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-transparent hover:text-[#111] border-[2px] border-[#111] transition-colors flex items-center justify-center gap-2"
                        >
                            <Send size={14} /> Send Note
                        </button>
                    </form>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-[#111] text-[#f4ebe1] border-[2px] border-[#111] px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-[#f4ebe1] hover:text-[#111] hover:shadow-[4px_4px_0px_#111] transition-all flex items-center gap-2"
        >
            <MessageSquarePlus size={16} /> <span>Suggestions?</span>
        </button>
    );
}
