import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faHistory,
    faTimes,
    faMicrophone,
    faPaperclip,
    faPaperPlane,
    faRobot,
    faStop,
    faEdit,
    faCopy,
    faCheck,
    faShoppingCart,
    faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import './ChatBox.css';

export const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [memory, setMemory] = useState({});
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: 'Hi there! Looking for the best tech deals?',
            products: [],
            upsellProducts: [],
            bundle: null,
            cart: null,
            checkout: null,
            order: null,
            orders: [],
            type: "chat",
            pendingAction: null
        }
    ]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef(null);
    const messagesEndRef = useRef(null);

    const { fetchCart, setCartCount } = useCart();

    const [sessions, setSessions] = useState([]);
    const [sessionId, setSessionId] = useState(() => {
        return localStorage.getItem("aiSessionId") || `session-${Date.now()}`;
    });

    useEffect(() => {
        if (isOpen) {
            loadSessions();
            loadChatHistory();
        }
    }, [isOpen, sessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadSessions = async () => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        try {
            const res = await axios.get(`${API_URL}/api/ai-chat`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSessions(res.data || []);
        } catch (err) {
            console.error("Load sessions error:", err);
        }
    };

    const loadChatHistory = async () => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        try {
            const res = await axios.get(`${API_URL}/api/ai-chat/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data?.length > 0) {
                setMessages(
                    res.data.map((m) => ({
                        sender: m.sender,
                        text: m.text,
                        products: m.products || [],
                        upsellProducts: m.upsellProducts || [],
                        bundle: m.bundle || null,
                        cart: m.cart || null,
                        checkout: m.checkout || null,
                        order: m.order || null,
                        orders: m.orders || [],
                        type: m.type || "chat",
                        pendingAction: m.pendingAction || null,
                        isEdited: m.isEdited || false
                    }))
                );
            }
        } catch (err) {
            console.error("Load history error:", err);
        }
    };

    const saveMessage = async (data) => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        try {
            await axios.post(
                `${API_URL}/api/ai-chat/save`,
                { sessionId, ...data },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadSessions();
        } catch (err) {
            console.error("Save chat error:", err);
        }
    };

    const sendToAI = async (messageText) => {
        if (!messageText.trim()) return;

        const userMsg = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMsg]);

        await saveMessage(userMsg);

        setInput('');
        setIsLoading(true);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            const res = await fetch(`${API_URL}/ai/chat-stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    token: localStorage.getItem("userToken"),
                    memory
                }),
                signal: abortControllerRef.current.signal
            });

            if (!res.ok) throw new Error("AI request failed");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let text = "";
            let finalData = null;
            let buffer = "";

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: "",
                    products: [],
                    upsellProducts: [],
                    bundle: null,
                    cart: null,
                    checkout: null,
                    order: null,
                    orders: [],
                    type: "chat",
                    pendingAction: null
                }
            ]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;

                    const event = JSON.parse(line);

                    if (event.type === "chunk") {
                        text += event.content;

                        setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                text
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
                if (finalData.clear_memory) {
                    setMemory({});
                }

                if (finalData.pending_action) {
                    setMemory(prev => ({
                        ...prev,
                        pending_action: finalData.pending_action
                    }));
                }

                if (finalData.bundle) {
                    setMemory(prev => ({
                        ...prev,
                        last_bundle: finalData.bundle
                    }));
                }

                if (finalData.clear_bundle_memory) {
                    setMemory(prev => {
                        const updated = { ...prev };
                        delete updated.last_bundle;
                        return updated;
                    });
                }

                const aiMessage = {
                    sender: "ai",
                    text: finalData.message || text || "No response",
                    products: finalData.products || [],
                    upsellProducts: finalData.upsell_products || [],
                    bundle: finalData.bundle || null,
                    cart: finalData.cart || null,
                    checkout: finalData.checkout || null,
                    order: finalData.order || null,
                    orders: finalData.orders || [],
                    type: finalData.type || "chat",
                    pendingAction: finalData.pending_action || null
                };

                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = aiMessage;
                    return updated;
                });

                await saveMessage({
                    sender: "ai",
                    text: aiMessage.text,
                    products: aiMessage.products,
                    upsellProducts: aiMessage.upsellProducts,
                    bundle: aiMessage.bundle,
                    cart: aiMessage.cart,
                    checkout: aiMessage.checkout,
                    order: aiMessage.order,
                    orders: aiMessage.orders,
                    type: aiMessage.type,
                    pendingAction: aiMessage.pendingAction
                });

                if (finalData.action?.type === "ADD_TO_CART") {
                    fetchCart();
                }
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("AI error:", err);
                toast.error("AI Error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = false;

        setIsListening(true);

        recognition.onresult = (e) => {
            const text = e.results[0][0].transcript;
            sendToAI(text);
        };

        recognition.onerror = () => {
            toast.error("Voice input failed");
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const createNewChat = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const newSessionId = `session-${Date.now()}`;
        setSessionId(newSessionId);
        localStorage.setItem("aiSessionId", newSessionId);

        setMessages([
            {
                sender: 'ai',
                text: 'Hi there! Looking for the best tech deals?',
                products: [],
                upsellProducts: [],
                bundle: null,
                cart: null,
                checkout: null,
                order: null,
                orders: [],
                type: "chat",
                pendingAction: null
            }
        ]);

        setMemory({});
        setShowHistory(false);
        setIsLoading(false);
    };

    const switchSession = async (id) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setSessionId(id);
        localStorage.setItem("aiSessionId", id);
        setShowHistory(false);
        setIsLoading(false);
    };

    const deleteSession = async (id) => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        try {
            await axios.delete(`${API_URL}/api/ai-chat/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSessions(prev => prev.filter(s => s._id !== id));

            if (sessionId === id) {
                createNewChat();
            }
        } catch (err) {
            console.error("Delete session error:", err);
        }
    };

    const stopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsLoading(false);
        }
    };

    const getProductId = (p) => p.id || p._id;
    const getProductPrice = (p) => p.offerPrice || p.price;

    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem("userToken");
        if (!token) return toast.error("Please login to add to cart");

        try {
            await axios.post(
                `${API_URL}/api/cart`,
                { productId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            setCartCount(prev => prev + 1);
            fetchCart();
            toast.success("Added to cart");
        } catch (err) {
            console.error("Add cart error:", err);
            toast.error("Failed to add to cart");
        }
    };

    const handleCheckout = (checkout) => {
        window.location.href = checkout?.url || "/checkout/cart";
    };

    const handleConfirm = () => sendToAI("yes");
    const handleCancel = () => sendToAI("cancel");

    return (
        <div className="tekzo-chat-container">
            <div className={`chat-panel-wrapper ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div className="header-info">
                        <div className="header-title">
                            Tekzo Assistant <span className="status-dot"></span>
                        </div>
                        <div className="header-subtitle">
                            {isListening ? "Listening..." : "Ready to help"}
                        </div>
                    </div>

                    <div className="header-actions">
                        <div className="header-icon" onClick={createNewChat}>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className="header-icon" onClick={() => setShowHistory(!showHistory)}>
                            <FontAwesomeIcon icon={faHistory} />
                        </div>
                        <div className="header-icon" onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                </div>

                <div className={`sessions-overlay ${showHistory ? 'active' : ''}`}>
                    <div style={{ padding: '0 10px 10px', fontSize: '11px', color: '#888', fontWeight: 600 }}>
                        RECENT SESSIONS
                    </div>

                    {sessions.length === 0 && (
                        <div className="p-3 text-xs text-gray-500">No previous chats</div>
                    )}

                    {sessions.map((s) => (
                        <div
                            key={s._id}
                            className={`session-item ${sessionId === s._id ? "active" : ""}`}
                            onClick={() => switchSession(s._id)}
                        >
                            <span className="session-text">{s.lastMessage || "New Chat"}</span>
                            <span
                                className="delete-session"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSession(s._id);
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} size="xs" />
                            </span>
                        </div>
                    ))}
                </div>

                <div className="chat-messages">
                    {messages.map((m, i) => (
                        <div key={i} className={`message-group ${m.sender === 'user' ? 'user' : 'ai'}`}>
                            <div className="message-bubble-container">
                                <div className="message-bubble">{m.text}</div>
                            </div>

                            {m.products?.length > 0 && (
                                <>
                                    <div className="chat-products-container">
                                        {m.products.map((p, idx) => {
                                            const productId = getProductId(p);

                                            return (
                                                <div key={idx} className="chat-product-card">
                                                    <div className="chat-product-info">
                                                        <div className="chat-product-name">{p.name || p.brandName}</div>
                                                        <div className="chat-product-price">₹{getProductPrice(p)}</div>
                                                        {m.type === "admin_products" && p.stockQty !== undefined && (
                                                            <div style={{ fontSize: '11px', color: p.stockQty < 5 ? '#ef4444' : '#888', marginTop: '2px' }}>
                                                                Stock: {p.stockQty ?? 0}
                                                            </div>
                                                        )}
                                                        {m.type !== "admin_products" && (
                                                            <button
                                                                className="chat-btn chat-btn-add"
                                                                onClick={() => handleAddToCart(productId)}
                                                            >
                                                                <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {m.type === "admin_products" && (
                                        <div className="admin-label">ADMIN INSIGHTS</div>
                                    )}
                                </>
                            )}

                            {m.order && (
                                <div className="chat-cart-container">
                                    <strong>Order Status</strong>

                                    <div className="chat-cart-item">
                                        <span>Status</span>
                                        <span>{m.order.status}</span>
                                    </div>

                                    <div className="chat-cart-item">
                                        <span>Total</span>
                                        <span>₹{m.order.totalAmount}</span>
                                    </div>

                                    <div className="chat-cart-item">
                                        <span>Payment</span>
                                        <span>{m.order.paymentMethod}</span>
                                    </div>

                                    <button
                                        className="chat-btn chat-btn-confirm"
                                        onClick={() => window.location.href = `/orders/${m.order.id}`}
                                    >
                                        View Order
                                    </button>

                                    {["pending", "placed", "paid"].includes(String(m.order.status).toLowerCase()) && (
                                        <button
                                            className="chat-btn chat-btn-cancel"
                                            onClick={() => sendToAI("cancel this order")}
                                        >
                                            Cancel Order
                                        </button>
                                    )}

                                    {String(m.order.status).toLowerCase() === "delivered" && (
                                        <button
                                            className="chat-btn chat-btn-cancel"
                                            onClick={() => sendToAI("return this order")}
                                        >
                                            Return Order
                                        </button>
                                    )}
                                </div>
                            )}

                            {m.cart?.items?.length > 0 && (
                                <div className="chat-cart-container">
                                    {m.cart.items.map((item, idx) => (
                                        <div key={idx} className="chat-cart-item">
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>₹{item.totalPrice}</span>
                                        </div>
                                    ))}

                                    <div className="chat-cart-total">
                                        Total: ₹{m.cart.total}
                                    </div>
                                </div>
                            )}

                            {(m.pendingAction || m.checkout) && (
                                <div className="chat-action-container">
                                    {m.checkout?.url && (
                                        <button
                                            className="chat-btn chat-btn-confirm"
                                            onClick={() => handleCheckout(m.checkout)}
                                        >
                                            <FontAwesomeIcon icon={faCreditCard} /> Continue to Checkout
                                        </button>
                                    )}

                                    {m.pendingAction && (
                                        <>
                                            <button className="chat-btn chat-btn-confirm" onClick={handleConfirm}>
                                                <FontAwesomeIcon icon={faCheck} /> Confirm
                                            </button>
                                            <button className="chat-btn chat-btn-cancel" onClick={handleCancel}>
                                                <FontAwesomeIcon icon={faTimes} /> Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="sender-label">
                                {m.sender === 'user' ? 'YOU' : 'ASSISTANT'}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-group ai">
                            <div className="message-bubble">Typing...</div>
                        </div>
                    )}

                    <div ref={messagesEndRef}></div>
                </div>

                <div className="chat-input-section">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendToAI(input);
                        }}
                        className="input-container"
                    >
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="chat-textarea"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendToAI(input);
                                }
                            }}
                        />

                        <div className="input-actions">
                            <div className="action-tools">
                                <div className="tool-icon" onClick={startListening}>
                                    <FontAwesomeIcon icon={faMicrophone} />
                                </div>
                                <div className="tool-icon">
                                    <FontAwesomeIcon icon={faPaperclip} />
                                </div>
                            </div>

                            {isLoading ? (
                                <button type="button" onClick={stopGeneration} className="send-button">
                                    <FontAwesomeIcon icon={faStop} />
                                </button>
                            ) : (
                                <button type="submit" className="send-button" disabled={!input.trim()}>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="footer-tag">
                        AI-POWERED ASSISTIVE TECHNOLOGY
                    </div>
                </div>
            </div>

            {!isOpen && (
                <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faRobot} />
                </button>
            )}
        </div>
    );
};