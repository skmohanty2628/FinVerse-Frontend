import { useState } from "react";
import axios from "axios";
import { MessageSquare } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: input });
      const botMsg = {
        role: "bot",
        text: res.data.reply || "Hello! 👋 I’m FinVerse-AI, your personal finance assistant.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Connection error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 💬 Floating Bot Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712102.png"
          alt="FinVerse Bot"
          className="w-10 h-10 rounded-full border-2 border-white shadow-md"
        />
      </button>

      {/* 💠 Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-[#0b1020]/95 border border-indigo-700/40 backdrop-blur-2xl text-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 font-semibold flex items-center space-x-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712102.png"
              alt="bot-avatar"
              className="w-8 h-8 rounded-full border border-white/40"
            />
            <span>FinVerse-AI Bot</span>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white/70 hover:text-white text-sm"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 h-72 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 px-3 rounded-xl text-sm max-w-[80%] ${
                  msg.role === "user"
                    ? "ml-auto bg-indigo-600 text-white"
                    : "mr-auto bg-white/10 text-indigo-200 flex items-start space-x-2"
                }`}
              >
                {msg.role === "bot" && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712102.png"
                    alt="bot"
                    className="w-6 h-6 rounded-full border border-indigo-500/40"
                  />
                )}
                <span>{msg.text}</span>
              </div>
            ))}
            {loading && (
              <div className="text-indigo-400 italic text-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-indigo-700/40 flex bg-[#0f1535]/80">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
              className="flex-1 p-2 bg-transparent outline-none text-white placeholder-indigo-300 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 text-sm font-semibold transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
