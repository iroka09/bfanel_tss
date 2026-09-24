import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useState, useRef, useEffect } from 'react';
import { OpenRouter } from '@openrouter/sdk';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import websiteContext from '@/about_bfanel.md?raw';


// 1. We declare the ?raw module right here so TypeScript doesn't complain.
// No need to create a separate vite-env.d.ts file!
declare module '*?raw' {
  const src: string;
  export default src;
}


// 2. Define the server function for handling the OpenRouter stream
const streamChatFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { messages: { role: string; content: string }[] }) => data)
  .handler(async function*({ data }) {
    const openrouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY || '',
    });

    const fullMessages = [
      {
        role: "system",
        content: `You are an intelligent, helpful assistant for the B-Fanel Industries website. 
        Use the following Markdown information to answer user queries accurately.
        
        WEBSITE CONTEXT (.md format):
        ${websiteContext}`
      },
      ...data.messages
    ];

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: fullMessages,
        stream: true,
      },
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  });

export const Route = createFileRoute('/assistant/')({
  component: AiAssistantRoute,
});

// 3. The React Component
function AiAssistantRoute() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Smooth auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    // Add empty placeholder for the AI's response to trigger the typing animation
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const stream = await streamChatFn({
        data: { messages: updatedMessages }
      });

      for await (const chunk of stream) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastIndex = newMsgs.length - 1;
          newMsgs[lastIndex] = {
            ...newMsgs[lastIndex],
            content: newMsgs[lastIndex].content + chunk,
          };
          return newMsgs;
        });
      }
    } catch (error) {
      console.error("Failed to stream response:", error);
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].content = "⚠️ Connection error. Please try again.";
        return newMsgs;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-blue-200 dark:selection:bg-blue-900">

      {/* Sleek Glassmorphism Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              B-Fanel AI
            </h1>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
              Powered by Nemotron-3 Ultra
            </p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 pt-8 pb-40 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 dark:text-slate-500 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="p-4 rounded-full bg-blue-50 dark:bg-slate-800/50 ring-1 ring-slate-200 dark:ring-slate-700">
                <Bot className="w-12 h-12 text-blue-500 dark:text-blue-400 opacity-80" />
              </div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                How can I assist you with B-Fanel Industries today?
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                {/* AI Avatar */}
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-slate-800 dark:to-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 shadow-sm mt-1">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 text-[15px] font-normal leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-3xl rounded-tr-md shadow-blue-500/20'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-3xl rounded-tl-md'
                    }`}
                >
                  {/* Bouncing Dots Typing Indicator */}
                  {msg.role === 'assistant' && msg.content === '' && isStreaming ? (
                    <div className="flex gap-1.5 items-center h-6 px-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce"></span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 ring-1 ring-slate-300 dark:ring-slate-600 shadow-sm mt-1">
                    <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Floating Glassmorphism Input Bar */}
      <footer className="fixed bottom-6 left-0 right-0 z-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 p-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/40 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all duration-300"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message B-Fanel AI..."
              disabled={isStreaming}
              className="flex-1 bg-transparent px-5 py-3 text-[15px] font-normal outline-none disabled:opacity-50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/30 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-200 mr-1"
            >
              {isStreaming ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-1" />
              )}
            </button>
          </form>
        </div>
      </footer>

    </div>
  );
}
