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
  Copy,
  Share2,
  ChevronDown,
  ChevronUp,
  Volume2,
  Square,
} from 'lucide-react'
import websiteContext from '@/about_bfanel.md?raw'
import { useAppSession } from '@/context/session'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

const schema = {
  ...defaultSchema,
  tagNames: [...defaultSchema.tagNames, 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      'src',
      'width',
      'height',
      'allow',
      'allowFullScreen',
      'frameBorder',
    ],
  },
}
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

// Helper to strip Markdown for Text-to-Speech
const stripMarkdown = (md: string) => {
  if (!md) return ''
  return md
    .replace(/```[\s\S]*?```/g, ' [Code block omitted] ') // Remove code blocks
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract text from links
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italics
    .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
    .replace(/`([^`]+)`/g, '$1') // Remove inline code ticks
    .replace(/^\s*>\s+/gm, '') // Remove blockquotes
    .replace(/^\s*[-*+]\s+/gm, '') // Remove unordered list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove ordered list markers
    .replace(/\|/g, ' ') // Remove table pipes
    .replace(/[-]{3,}/g, ' ') // Remove table row dividers
    .replace(/\n{2,}/g, ' . ') // Add pauses for multiple newlines
    .trim()
}

// Expandable Content Component with Markdown overriding for Tables and Links
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
    <div className="relative flex flex-col w-full max-w-full">
      <div
        ref={contentRef}
        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden break-words w-full ${
          isExpanded ? 'max-h-[3000px]' : 'max-h-[250px]'
        }`}
        style={{
          WebkitMaskImage:
            !isExpanded && isOverflowing && !isTyping
              ? 'linear-gradient(180deg, #000 65%, transparent 100%)'
              : 'none',
          maskImage:
            !isExpanded && isOverflowing && !isTyping
              ? 'linear-gradient(180deg, #000 65%, transparent 100%)'
              : 'none',
        }}
      >
        <div className={`w-full ${isOverflowing && !isExpanded ? 'pb-4' : ''}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            // rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
            components={{
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-4 w-full rounded-lg border border-slate-200 dark:border-slate-700">
                  <table
                    className="w-full min-w-[450px] border-collapse text-sm text-left"
                    {...props}
                  />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-800/50 font-semibold border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 last:border-0"
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-3 last:mb-0 whitespace-pre-wrap" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
              ),
              iframe: ({ node, ...props }) => (
                <div className="relative w-full my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 aspect-video">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    {...props}
                  />
                </div>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Expand/Collapse Arrow Icon Button */}
      {isOverflowing && !isTyping && (
        <div className="flex justify-end w-full -mt-3 relative z-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1 rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${
              isUser
                ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700/60'
            }`}
            title={isExpanded ? 'Show less' : 'Read more'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
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

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null,
  )

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const userScrolledUpRef = useRef(false)
  const { session, isAuthenticated } = useAppSession()

  // Clean up Text-to-Speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const lastUserMsgId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') return messages[i].id
    }
    return null
  }, [messages])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      })
    }
  }, [])

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

  // Utility Actions
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedMessageId(id)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'B-Fanel AI Response',
          text: text,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      handleCopy(text, 'share-fallback')
      alert(
        "Text copied to clipboard because native sharing isn't supported on this browser.",
      )
    }
  }

  const handleReadAloud = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.')
      return
    }

    if (speakingMessageId === id) {
      // Stop speaking if it's already playing this message
      window.speechSynthesis.cancel()
      setSpeakingMessageId(null)
    } else {
      // Stop anything currently playing, strip markdown, and start new synthesis
      window.speechSynthesis.cancel()

      const cleanText = stripMarkdown(text)
      const utterance = new SpeechSynthesisUtterance(cleanText)

      utterance.onend = () => setSpeakingMessageId(null)
      utterance.onerror = () => setSpeakingMessageId(null)

      setSpeakingMessageId(id)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleStartEdit = (msg: Message) => {
    setInput(msg.content)
    setEditingMessageId(msg.id)
    inputRef.current?.focus()
  }

  const cancelEdit = () => {
    setInput('')
    setEditingMessageId(null)
  }

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

    let historyForApi = messages

    if (options?.isEdit && options.replaceId) {
      const idx = messages.findIndex((m) => m.id === options.replaceId)
      if (idx !== -1) {
        historyForApi = messages.slice(0, idx)
      }
    } else if (options?.replaceId) {
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
    sendMessage(input, {
      replaceId: editingMessageId || undefined,
      isEdit: !!editingMessageId,
    })
  }

  return (
    <div className="relative flex flex-col h-screen h-[100dvh] overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-blue-200 dark:selection:bg-blue-900">
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

      <main
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-8 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[55vh] text-slate-400 dark:text-slate-500 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="p-4 rounded-full bg-blue-50 dark:bg-slate-800/50 ring-1 ring-slate-200 dark:ring-slate-700">
                <Bot className="w-12 h-12 text-blue-500 dark:text-blue-400 opacity-80" />
              </div>
              <p className="text-lg font-medium text-slate-600 text-center dark:text-slate-300">
                How can I assist you today?
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const canEdit = msg.id === lastUserMsgId && !isStreaming
              const isCurrentlyBeingEdited = editingMessageId === msg.id

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 group animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  } ${isCurrentlyBeingEdited ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div
                    className={`flex gap-4 w-full relative ${
                      msg.role === 'user'
                        ? 'flex-row-reverse justify-start'
                        : 'flex-row justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-slate-800 dark:to-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 shadow-sm mt-1">
                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}

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

                    <div
                      className={`relative group/bubble flex flex-col ${msg.role === 'assistant' ? 'max-w-[88%] sm:max-w-[80%]' : 'max-w-[85%] sm:max-w-[75%]'}`}
                    >
                      {/* User Bubble Hover Actions (Copy & Edit) */}
                      {msg.role === 'user' && (
                        <div className="absolute top-2 right-full mr-2 flex flex-col gap-2 opacity-0 scale-95 group-hover/bubble:opacity-100 group-hover/bubble:scale-100 transition-all duration-200 ease-out origin-right z-10">
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-all"
                            title="Copy message"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {canEdit && (
                            <button
                              onClick={() => handleStartEdit(msg)}
                              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-all"
                              title="Edit message"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Actual Message Bubble styling */}
                      <div
                        className={`px-5 py-4 text-[15px] font-normal leading-relaxed shadow-sm flex-1 overflow-hidden w-full ${
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
                        ) : (
                          <>
                            <ExpandableMessage
                              content={msg.content}
                              isTyping={msg.status === 'typing'}
                              isUser={msg.role === 'user'}
                            />

                            {/* AI Error Alert */}
                            {msg.role === 'assistant' &&
                              msg.status === 'error' && (
                                <div className="mt-3 text-sm text-red-500 flex items-center gap-1 bg-red-50/50 dark:bg-red-950/30 p-2 rounded-lg relative z-10">
                                  <AlertCircle className="w-4 h-4" />
                                  {msg.errorMessage}
                                </div>
                              )}
                          </>
                        )}
                      </div>

                      {/* AI Action Buttons Outside Bubble */}
                      {msg.role === 'assistant' && msg.status !== 'typing' && (
                        <div className="mt-1.5 ml-2 flex items-center gap-1">
                          <button
                            onClick={() => handleReadAloud(msg.content, msg.id)}
                            className="p-1.5 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-200/50 dark:hover:text-blue-400 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                            title={
                              speakingMessageId === msg.id
                                ? 'Stop reading'
                                : 'Read aloud'
                            }
                          >
                            {speakingMessageId === msg.id ? (
                              <Square className="w-4 h-4 fill-blue-500 text-blue-500" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="p-1.5 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                            title="Copy"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleShare(msg.content)}
                            className="p-1.5 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`text-[11px] flex items-center gap-1.5 px-14 font-medium transition-opacity ${
                      msg.role === 'user'
                        ? 'text-slate-400 flex-row-reverse mt-1'
                        : 'text-slate-400'
                    }`}
                  >
                    <span>{formatDateTime(msg.timestamp)}</span>

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

      {showScrollButton && (
        <button
          type="button"
          onClick={() => {
            userScrolledUpRef.current = false
            scrollToBottom('smooth')
          }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/90 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-3.5 h-3.5 text-blue-500" />
          <span>Scroll to bottom</span>
        </button>
      )}

      {/* FOOTER UPDATED HERE: Z-index lowered to 10, sticky positioning added, bottom margins aligned */}
      <footer className="sticky bottom-4 mb-4 z-10 flex-shrink-0 px-4 sm:px-6 bg-transparent">
        <div className="max-w-3xl mx-auto flex flex-col drop-shadow-xl">
          {editingMessageId && (
            <div className="flex items-center justify-between px-5 py-2.5 text-[13px] bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border-x border-t border-blue-200 dark:border-slate-700 rounded-t-3xl backdrop-blur-md">
              <span className="font-medium flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5" />
                Editing previous message...
              </span>
              <button
                type="button"
                onClick={cancelEdit}
                className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors text-blue-500 dark:text-slate-400"
                title="Cancel Edit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`flex items-center gap-3 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border transition-all duration-300 ${
              editingMessageId
                ? 'rounded-b-[2rem] border-blue-200 dark:border-slate-700 border-t-0 shadow-inner'
                : 'rounded-[2rem] border-white/60 dark:border-slate-700/60'
            } ${
              isStreaming
                ? 'opacity-80 cursor-not-allowed'
                : 'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 shadow-slate-200/50 dark:shadow-black/40'
            }`}
          >
            <input
              ref={inputRef}
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
              className={`flex items-center justify-center w-12 h-12 rounded-full text-white shadow-md transition-all duration-200 mr-1 ${
                editingMessageId
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30 hover:shadow-emerald-500/40'
                  : 'bg-gradient-to-r from-blue-600 to-violet-600 shadow-blue-500/30 hover:shadow-lg'
              } hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none disabled:cursor-not-allowed`}
            >
              {isStreaming ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : editingMessageId ? (
                <Check className="w-5 h-5" />
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
