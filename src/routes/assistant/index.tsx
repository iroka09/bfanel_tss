import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
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
  ArrowDown,
  Pencil,
  X,
  Check,
} from 'lucide-react'
import websiteContext from '@/about_bfanel.md?raw'
import ReactMarkdown from 'react-markdown'
import { useAppSession } from '@/context/session'
import remarkGfm from 'remark-gfm'

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
          1) You are an intelligent, helpful assistant for the B-Fanel Industries website (customer care).
          2) Use the following information about Bfanel to answer user queries accurately.
          About BFANEL (in markdown .md format):
          ${websiteContext}
          
          3) Don't reply user as a middle man, reply as the customer care that works for bfanel, reply like human.
          4) Don't answer any questions that's not related to what bfanel is into, just let them know what you are in for.
          5) Be precise with your response, stop adding extra unnecessary information for the user.
          6) Your must response with Markdown (.md), i will use react-markdown to render the output to user's browser
          7) Your skill in markdown and markdown table drawing must be top-notch.
          8) You will include pictures (.md format) when necessary, either from external website or bfanel website.
          9) Every clickable link must be underlined and colored.
          10) When drawing table, let cells have padding both left and right.
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
      console.error('Server-side OpenRouter API Error:', error)
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

// Helper for formatting date + time
const formatDateTime = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Expandable Content Component
function ExpandableMessage({
  content,
  isTyping,
  isUser,
}: {
  content: string
  isTyping?: boolean
  isUser?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // threshold 250px
        setIsOverflowing(contentRef.current.scrollHeight > 250)
      }
    }

    checkOverflow()
    const resizeObserver = new ResizeObserver(checkOverflow)
    if (contentRef.current) resizeObserver.observe(contentRef.current)

    return () => resizeObserver.disconnect()
  }, [content])

  return (
    <div className="flex flex-col">
      <div
        ref={contentRef}
        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[3000px]' : 'max-h-[250px]'
        }`}
      >
        <div className="whitespace-pre-wrap">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
      {isOverflowing && !isTyping && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-2 text-xs font-semibold underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity ${
            isUser ? 'self-end' : 'self-start'
          }`}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

// 3. The React Component
function AiAssistantRoute() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // State for message editing
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editInput, setEditInput] = useState('')

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const userScrolledUpRef = useRef(false)
  const { session, isAuthenticated } = useAppSession()

  // Find the last user message ID to allow editing
  const lastUserMsgId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') return messages[i].id
    }
    return null
  }, [messages])

  // Scroll exclusively inside the chat container box
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      })
    }
  }, [])

  // Detect user scroll position inside the chat box
  const handleScroll = () => {
    if (!chatContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    const isScrolledUp = distanceFromBottom > 140
    setShowScrollButton(isScrolledUp)
    userScrolledUpRef.current = isScrolledUp
  }

  useEffect(() => {
    if (!userScrolledUpRef.current) {
      scrollToBottom('smooth')
    }
  }, [messages, scrollToBottom])

  // Unified send message function mapping both normal and edit flows
  const sendMessage = async (
    text: string,
    options?: { replaceId?: string; isEdit?: boolean },
  ) => {
    if (!text.trim() || isStreaming) return

    userScrolledUpRef.current = false
    const userId = options?.replaceId || crypto.randomUUID()
    const userMessage: Message = {
      id: userId,
      role: 'user',
      content: text.trim(),
      status: 'sending',
      timestamp: new Date(),
    }

    setInput('')
    setEditingMessageId(null)
    setIsStreaming(true)

    // Calculate history up to the point of edit or just standard previous state
    let historyForApi = messages

    if (options?.isEdit && options.replaceId) {
      // Truncate messages to replace everything from the edited message onwards
      const idx = messages.findIndex((m) => m.id === options.replaceId)
      if (idx !== -1) {
        historyForApi = messages.slice(0, idx)
      }
    } else if (options?.replaceId) {
      // Standard resend (failed message), just remove the failed attempt
      historyForApi = messages.filter((m) => m.id !== options.replaceId)
    }

    setMessages([...historyForApi, userMessage])

    const apiMessages = historyForApi
      .filter((m) => m.status === 'sent')
      .map((m) => ({ role: m.role, content: m.content }))

    apiMessages.push({ role: 'user', content: text.trim() })

    try {
      const stream = await streamChatFn({
        data: { messages: apiMessages },
      })

      setMessages((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, status: 'sent' } : m)),
      )

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

      for await (const chunk of stream) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        )
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, status: 'sent' } : m)),
      )
    } catch (error: any) {
      setMessages((prev) => {
        const hasAssistantStarted = prev.some(
          (m) => m.role === 'assistant' && m.status === 'typing',
        )

        if (hasAssistantStarted) {
          return prev.map((m) =>
            m.status === 'typing'
              ? { ...m, status: 'error', errorMessage: 'Stream disconnected.' }
              : m,
          )
        } else {
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
    <div className="relative flex flex-col h-screen h-[100dvh] overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-blue-200 dark:selection:bg-blue-900">
      {/* Header - Fixed Height */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              B-Fanel AI ASSISTANT
            </h1>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
              Powered by Nemotron-3 Ultra
            </p>
          </div>
        </div>
      </header>

      {/* Chat Area - Isolated Scroll Box */}
      <main
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-8 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[55vh] text-slate-400 dark:text-slate-500 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="p-4 rounded-full bg-blue-50 dark:bg-slate-800/50 ring-1 ring-slate-200 dark:ring-slate-700">
                <Bot className="w-12 h-12 text-blue-500 dark:text-blue-400 opacity-80" />
              </div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                How can I assist you with B-Fanel Industries today?
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isEditing = editingMessageId === msg.id
              const canEdit = msg.id === lastUserMsgId && !isStreaming

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 group animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`flex gap-4 w-full relative ${
                      msg.role === 'user'
                        ? 'flex-row-reverse justify-start'
                        : 'flex-row justify-start'
                    }`}
                  >
                    {/* AI Avatar */}
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-slate-800 dark:to-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 shadow-sm mt-1">
                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}

                    {/* User Avatar */}
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 ring-1 ring-slate-300 dark:ring-slate-600 shadow-sm mt-1 overflow-hidden">
                        {isAuthenticated && session?.picture ? (
                          <img
                            src={session.picture}
                            className="w-full h-full object-cover"
                            alt="avatar"
                          />
                        ) : (
                          <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        )}
                      </div>
                    )}

                    {/* Message Bubble container */}
                    <div className="relative group/bubble max-w-[85%] sm:max-w-[75%]">
                      {/* Hover Edit Button for Last User Message */}
                      {msg.role === 'user' && canEdit && !isEditing && (
                        <div className="absolute top-2 right-[100%] mr-2 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingMessageId(msg.id)
                              setEditInput(msg.content)
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm"
                            title="Edit and Resend"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Actual Message Bubble styling */}
                      <div
                        className={`px-5 py-4 text-[15px] font-normal leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-3xl rounded-tr-md shadow-blue-500/20'
                            : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-3xl rounded-tl-md'
                        }`}
                      >
                        {msg.role === 'assistant' &&
                        msg.status === 'typing' &&
                        msg.content === '' ? (
                          <div className="flex gap-1.5 items-center h-6 px-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60 animate-bounce"></span>
                          </div>
                        ) : isEditing ? (
                          <div className="flex flex-col gap-2 min-w-[200px] sm:min-w-[300px]">
                            <textarea
                              value={editInput}
                              onChange={(e) => setEditInput(e.target.value)}
                              className="w-full bg-black/10 dark:bg-black/20 text-white border border-white/20 rounded-xl p-2 outline-none focus:border-white/50 resize-none text-sm"
                              rows={3}
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={() =>
                                  sendMessage(editInput, {
                                    replaceId: msg.id,
                                    isEdit: true,
                                  })
                                }
                                disabled={!editInput.trim()}
                                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors disabled:opacity-50"
                                title="Save & Resend"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ExpandableMessage
                              content={msg.content}
                              isTyping={msg.status === 'typing'}
                              isUser={msg.role === 'user'}
                            />
                            {msg.role === 'assistant' &&
                              msg.status === 'error' && (
                                <div className="mt-3 text-sm text-red-500 flex items-center gap-1 bg-red-50/50 dark:bg-red-950/30 p-2 rounded-lg">
                                  <AlertCircle className="w-4 h-4" />
                                  {msg.errorMessage}
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Timestamp Indicators (Date included) */}
                  <div
                    className={`text-[11px] flex items-center gap-1.5 px-14 font-medium transition-opacity ${
                      msg.role === 'user'
                        ? 'text-slate-400 flex-row-reverse'
                        : 'text-slate-400'
                    }`}
                  >
                    <span>{formatDateTime(msg.timestamp)}</span>

                    {msg.role === 'user' && !isEditing && (
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
                              onClick={() =>
                                sendMessage(msg.content, { replaceId: msg.id })
                              }
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
              )
            })
          )}
        </div>
      </main>

      {/* Floating Scroll-to-Bottom Button */}
      {showScrollButton && (
        <button
          type="button"
          onClick={() => {
            userScrolledUpRef.current = false
            scrollToBottom('smooth')
          }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/90 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-3.5 h-3.5 text-blue-500" />
          <span>Scroll to bottom</span>
        </button>
      )}

      {/* Footer / Input Bar - Fixed at Bottom */}
      <footer className="flex-shrink-0 z-20 px-4 sm:px-6 py-4 bg-transparent">
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
