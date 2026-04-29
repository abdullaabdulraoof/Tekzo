import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig';

export const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [memory, setMemory] = useState({});

    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: 'Hi there! Looking for the best tech deals? How can I help you today?',
            products: [],
            cart: null,
            type: "chat",
            pendingAction: null
        }
    ]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

  const sendToAI = async (messageText) => {
    if (!messageText.trim()) return;

    addMessage({ sender: 'user', text: messageText });

    setInput('');
    setIsLoading(true);

    const token = localStorage.getItem('userToken');

    try {
        const response = await fetch(`${API_URL}/ai/chat-stream`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: messageText,
                token: token,
                memory: memory
            })
        });

        if (!response.ok) {
            throw new Error("Streaming request failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let streamedText = "";
        let finalData = null;

        // Add empty AI message first
        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: "",
                products: [],
                cart: null,
                type: "chat",
                pendingAction: null
            }
        ]);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(Boolean);

            for (const line of lines) {
                const event = JSON.parse(line);

                if (event.type === "chunk") {
                    streamedText += event.content;

                    setMessages(prev => {
                        const updated = [...prev];

                        updated[updated.length - 1] = {
                            ...updated[updated.length - 1],
                            text: streamedText
                        };

                        return updated;
                    });
                }

                if (event.type === "final") {
                    finalData = event.data;
                }
            }
        }

        if (finalData) {
            if (finalData.type === "confirmation") {
                setMemory(prev => ({
                    ...prev,
                    pending_action: finalData.pending_action
                }));
            }

            if (finalData.clear_memory) {
                setMemory({});
            }

            setMessages(prev => {
                const updated = [...prev];

                updated[updated.length - 1] = {
                    sender: "ai",
                    text: finalData.message || streamedText || "No response",
                    products: finalData.products || [],
                    cart: finalData.cart || null,
                    type: finalData.type || "chat",
                    pendingAction: finalData.pending_action || null
                };

                return updated;
            });
        }

    } catch (error) {
        console.error("AI Chat Error:", error);

        addMessage({
            sender: 'ai',
            text: "Sorry, I'm having trouble connecting right now.",
            products: [],
            cart: null,
            type: "error",
            pendingAction: null
        });
    } finally {
        setIsLoading(false);
    }
};

    const handleSend = async (e) => {
        e.preventDefault();
        await sendToAI(input.trim());
    };

    const handleConfirmAction = async () => {
        await sendToAI("yes");
    };

    const handleCancelAction = async () => {
        await sendToAI("cancel");
    };

    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem('userToken');

        if (!token) {
            addMessage({
                sender: 'ai',
                text: 'Please login to add products to your cart.',
                products: [],
                cart: null,
                type: 'error',
                pendingAction: null
            });
            return;
        }

        try {
            await axios.post(
                `${API_URL}/api/cart`,
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            addMessage({
                sender: 'ai',
                text: 'Product added to cart ✅',
                products: [],
                cart: null,
                type: 'action',
                pendingAction: null
            });
        } catch (error) {
            console.error("Add to cart error:", error);

            addMessage({
                sender: 'ai',
                text: 'Failed to add product to cart.',
                products: [],
                cart: null,
                type: 'error',
                pendingAction: null
            });
        }
    };

    const handleViewProduct = (productId) => {
        window.location.href = `/products/productDetails/${productId}`;
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">

            <div
                className={`transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0'} w-[350px] sm:w-[400px] bg-black/80 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col`}
                style={{ height: isOpen ? '500px' : '0px' }}
            >
                <div className="bg-gradient-to-r from-[#2c4b82] to-[#1a2b4c] p-4 rounded-t-2xl flex justify-between items-center">
                    <h3 className="text-white font-bold text-sm">Tekzo Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-white">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">

                    {messages.map((msg, idx) => (
                        <div key={idx}>

                            <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-[#5694F7] text-white'
                                        : 'bg-gray-800 text-gray-200'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>

                            {msg.products?.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {msg.products.map((p) => (
                                        <div key={p.id} className="bg-gray-900 border border-gray-700 p-3 rounded-xl">
                                            <p className="text-white text-sm font-semibold">{p.name}</p>
                                            <p className="text-gray-400 text-xs">{p.brand} • {p.category}</p>
                                            <p className="text-[#5694F7] font-bold mt-1">₹{p.price}</p>

                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddToCart(p.id)}
                                                    className="bg-[#5694F7] text-white text-xs px-3 py-2 rounded-lg hover:bg-[#4078d6] transition-colors"
                                                >
                                                    Add to Cart
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleViewProduct(p.id)}
                                                    className="bg-gray-700 text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {msg.pendingAction && (
                                <div className="flex gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={handleConfirmAction}
                                        className="bg-[#5694F7] text-white text-xs px-3 py-2 rounded-lg hover:bg-[#4078d6] transition-colors"
                                    >
                                        Confirm
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancelAction}
                                        className="bg-gray-700 text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {msg.cart?.items?.length > 0 && (
                                <div className="mt-2 space-y-2 bg-gray-900 p-3 rounded-xl border border-gray-700">

                                    {msg.cart.items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-white">
                                                {item.name} (x{item.quantity})
                                            </span>
                                            <span className="text-[#5694F7]">
                                                ₹{item.totalPrice}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="text-right text-white font-bold border-t border-gray-700 pt-2">
                                        Total: ₹{msg.cart.total}
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 p-3 rounded-xl text-gray-400 text-sm">
                                AI is thinking...
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-3 flex gap-2 border-t border-gray-700">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-black text-white px-3 py-2 rounded-lg border border-gray-700"
                        placeholder="Ask anything..."
                    />
                    <button className="bg-[#5694F7] px-4 rounded-lg text-white">Send</button>
                </form>
            </div>

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-[#5694F7] text-white rounded-full shadow-lg"
                >
                    💬
                </button>
            )}

        </div>
    );
};