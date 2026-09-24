import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, useRef, useEffect } from 'react'
import { OpenRouter } from '@openrouter/sdk'
import {
  Send,
  Bot,
  User,
  Sparkles,
  CheckCheck,
  Clock,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import websiteContext from '@/about_bfanel.md?raw'
import ReactMarkdown from 'react-markdown'

// 1. Declare the ?raw module right here so TypeScript doesn't complain.
declare module '*?raw' {
  const src: string
  export default src
}

// 2. Define the server function for handling the OpenRouter stream
const streamChatFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { messages: { role: string; content: string }[] }) => data,
  )
  .handler(async function* ({ data }) {
    try {
      const openrouter = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY || '',
      })

      const fullMessages = [
        {
          role: 'system',
          content: `
          Instructions To Strictly Follow:
          
          1) You are an intelligent, helpful assistant for the B-Fanel Industries website. 
          2) Use the following Markdown information about Bfanel to answer user queries accurately.
          BFANEL CONTEXT (.md format):
          ${websiteContext}
          
          3) Don't reply user as a middle man, reply as the customer care that works for bfanel, reply like human.
          4) Don't answer any questions that's not related to what bfanel is into, just let them know what you are in for.
          5) Be precise with your response, stop adding extra unnecessary information for the user.
          6) Your response can be plain text or Markdown (.md), i will use react-markdown to render the output to user's browser
          `,
        },
        ...data.messages,
      ]

      const stream = await openrouter.chat.send({
        chatRequest: {
          model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
          messages: fullMessages,
          stream: true,
        },
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          yield content
        }
      }
    } catch (error) {
      // Log the exact error securely on the server console
      console.error('Server-side OpenRouter API Error:', error)

      // Throw a generic, safe error to the client to prevent leaking sensitive server info
      throw new Error(
        'Unable to reach the AI provider. Please try again later.',
      )
    }
  })

export const Route = createFileRoute('/assistant/')({
  component: AiAssistantRoute,
})

// Types for better state management
type MessageStatus = 'sending' | 'sent' | 'error' | 'typing'
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  status: MessageStatus
  errorMessage?: string
  timestamp: Date
}

// Helper for formatting time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 3. The React Component
function AiAssistantRoute() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Smooth auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Unified send message function to handle both new messages and resends
  const sendMessage = async (text: string, existingId?: string) => {
    if (!text.trim() || isStreaming) return

    const userId = existingId || crypto.randomUUID()
    const userMessage: Message = {
      id: userId,
      role: 'user',
      content: text.trim(),
      status: 'sending',
      timestamp: new Date(),
    }

    // If resending, filter out the old error message first, then append the new attempt
    setMessages((prev) => {
      const filtered = existingId
        ? prev.filter((m) => m.id !== existingId)
        : prev
      return [...filtered, userMessage]
    })

    setInput('')
    setIsStreaming(true)

    // Build the payload with only successfully sent messages
    const apiMessages = messages
      .filter((m) => m.status === 'sent')
      .map((m) => ({ role: m.role, content: m.content }))

    apiMessages.push({ role: 'user', content: text.trim() })

    try {
      const stream = await streamChatFn({
        data: { messages: apiMessages },
      })

      // Update user message status to 'sent' once the stream connects successfully
      setMessages((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, status: 'sent' } : m)),
      )

      // Add empty placeholder for the AI's response
      const assistantId = crypto.randomUUID()
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          status: 'typing',
          timestamp: new Date(),
        },
      ])

      // Stream the response
      for await (const chunk of stream) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        )
      }

      // Mark assistant message as fully sent
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, status: 'sent' } : m)),
      )
    } catch (error: any) {
      // Determine if we failed during stream or before the stream connected
      setMessages((prev) => {
        const hasAssistantStarted = prev.some(
          (m) => m.role === 'assistant' && m.status === 'typing',
        )

        if (hasAssistantStarted) {
          // Network interrupted while AI was streaming
          return prev.map((m) =>
            m.status === 'typing'
              ? { ...m, status: 'error', errorMessage: 'Stream disconnected.' }
              : m,
          )
        } else {
          // Failed before sending
          return prev.map((m) =>
            m.id === userId
              ? {
                  ...m,
                  status: 'error',
                  errorMessage:
                    'Message failed to send. Check your connection.',
                }
              : m,
          )
        }
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

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
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 group animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* AI Avatar */}
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-slate-800 dark:to-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 shadow-sm mt-1">
                      <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}

                  {/* User Avatar */}
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 ring-1 ring-slate-300 dark:ring-slate-600 shadow-sm mt-1">
                      <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 text-[15px] font-normal leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-3xl rounded-tr-md shadow-blue-500/20'
                        : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-3xl rounded-tl-md'
                    }`}
                  >
                    {/* Bouncing Dots Typing Indicator */}
                    {msg.role === 'assistant' &&
                    msg.status === 'typing' &&
                    msg.content === '' ? (
                      <div className="flex gap-1.5 items-center h-6 px-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce"></span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {msg.role === 'assistant' && msg.status === 'error' && (
                          <div className="mt-2 text-sm text-red-500 flex items-center gap-1 bg-red-50/50 dark:bg-red-950/30 p-2 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            {msg.errorMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Timestamp Indicators (Placed Below Bubble) */}
                <div
                  className={`text-[11px] flex items-center gap-1.5 px-14 font-medium transition-opacity ${
                    msg.role === 'user'
                      ? 'text-slate-400 flex-row-reverse'
                      : 'text-slate-400'
                  }`}
                >
                  <span>{formatTime(msg.timestamp)}</span>

                  {msg.role === 'user' && (
                    <>
                      {msg.status === 'sending' && (
                        <Clock className="w-3 h-3 text-slate-400" />
                      )}
                      {msg.status === 'sent' && (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      {msg.status === 'error' && (
                        <div className="flex items-center gap-1.5 text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          <span>{msg.errorMessage}</span>
                          <span className="mx-1 text-slate-300 dark:text-slate-600">
                            |
                          </span>
                          <button
                            onClick={() => sendMessage(msg.content, msg.id)}
                            className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Resend
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Floating Glassmorphism Input Bar */}
      <footer className="sticky bottom-6 left-0 right-0 z-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className={`flex items-center gap-3 p-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border rounded-[2rem] shadow-xl transition-all duration-300 ${
              isStreaming
                ? 'border-slate-200 dark:border-slate-800 opacity-80 cursor-not-allowed'
                : 'border-white/60 dark:border-slate-700/60 shadow-slate-200/50 dark:shadow-black/40 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50'
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isStreaming
                  ? 'B-Fanel AI is typing...'
                  : 'Message B-Fanel AI...'
              }
              disabled={isStreaming}
              className="flex-1 bg-transparent px-5 py-3 text-[15px] font-normal outline-none disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/30 hover:shadow-lg hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 mr-1"
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
  )
}
