import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function AiChatbot() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am your AI Wealth Intelligence Advisor. Ask me anything about our mutual funds catalog, risk management, or asset optimization plans!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const scrollAnchor = useRef(null);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userPrompt = input.trim();
    setInput('');
    
    const userMessage = { id: Date.now(), sender: 'user', text: userPrompt };
    const historicalSnap = [...messages, userMessage];
    setMessages(historicalSnap);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token'); // Retrieve auth session state tokens
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post(`${API_URL}/chat/talk`, {
        message: userPrompt,
        chatHistory: messages
      }, config);

      setMessages([...historicalSnap, { id: Date.now() + 1, sender: 'bot', text: response.data.reply }]);
    } catch (err) {
      console.error("Chat transmission failure:", err);
      setMessages([...historicalSnap, { id: Date.now() + 1, sender: 'bot', text: '⚠️ Connection broken. Ensure your account session is authorized and your server is live.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl h-[calc(100vh-100px)] flex flex-col space-y-4">
      {/* Header Info Block */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-md flex items-center gap-3">
        <div className="bg-emerald-500 w-3 h-3 rounded-full animate-pulse"></div>
        <div>
          <h2 className="font-black tracking-wide text-md">🧠 Context-Grounded Financial Chatbot</h2>
          <p className="text-[11px] text-slate-400 font-medium">Conversational engine querying live database records for secure, hallucination-free advice</p>
        </div>
      </div>

      {/* Messages Terminal Display Grid Panel */}
      <div className="flex-1 bg-white border border-slate-100 rounded-3xl shadow-inner p-6 overflow-y-auto space-y-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm whitespace-pre-line
              ${msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-50 text-slate-800 border rounded-bl-none'}`}
            >
              <span className="block text-[9px] font-black uppercase opacity-60 mb-1 tracking-wider">
                {msg.sender === 'user' ? 'You' : 'Gemini Advisor'}
              </span>
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border px-5 py-4 rounded-2xl rounded-bl-none flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={scrollAnchor} />
      </div>

      {/* Message Typing Form Controls */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something (e.g., 'Which of our funds has the lowest expense ratio?')"
          disabled={loading}
          className="flex-1 border bg-white rounded-xl px-5 py-3.5 font-semibold text-sm focus:outline-none focus:border-blue-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white font-black px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}