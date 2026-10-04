import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { OpenRouter } from '@openrouter/sdk'
import {
  Send,
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
  Plus,
  Mic,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  FileText,
} from 'lucide-react'
import websiteContext from '@/about_bfanel.md?raw'
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
  .validator((data: { messages: { role: string; content: string }[] }) => data)
  .handler(async function* ({ data }) {
    try {
      const openrouter = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
      })

      const fullMessages = [
        {
          role: 'system',
          content: `
          Instructions To Strictly Follow:
          • You are an intelligent, helpful assistant for the B-Fanel Industries website (customer care).
          • Use the following information about Bfanel to answer user queries accurately.
          About BFANEL (in markdown .md format):
          ===== BEGINS HERE ======
          ${websiteContext}
          ===== ENDS HERE ======        
          • Don't reply user as a middle man, reply as the customer care that works for bfanel, reply like human.
          • Don't answer any questions that's not related to what bfanel is into, just let them know what you are in for, but if the user provides this code "7070" in the beginning of the prompt just know that I the developer is the one chatting with you just for testing purpose, so in that case you have to respond to any question I ask you whether related to bfanel or not.
          • Be precise with your response, stop adding extra unnecessary information for the user.
          • You must response with Markdown (.md), I will use react-markdown to render the output to user's browser, your skill in markdown and markdown table drawing must be top-notch.
          • You will include pictures (in .md format) from this Instructions picture links when necessary.
          • Every clickable link must be underlined and colored.
          • When drawing table, let cells have padding both left and right.
          
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

// Helper to strip Markdown for Text-to-Speech & Raw Copying
const stripMarkdown = (md: string) => {
  if (!md) return ''
  return md
    .replace(/```[\s\S]*?```/g, ' [Code block omitted] ')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*>\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[-]{3,}/g, ' ')
    .replace(/\n{2,}/g, ' . ')
    .trim()
}

// Expandable Content Component
function ExpandableMessage({
  content,
  isTyping,
}: {
  content: string
  isTyping?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        setIsOverflowing(contentRef.current.scrollHeight > 350)
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
          isExpanded ? 'max-h-[3000px]' : 'max-h-[350px]'
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
            rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
            components={reactMarkdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {isOverflowing && !isTyping && (
        <div className="flex justify-start w-full mt-1 relative z-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

const reactMarkdownComponents = {
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-4 w-full rounded-lg border border-slate-200 dark:border-slate-700">
      <table
        className="w-full min-w-[450px] border-collapse text-sm text-left"
        {...props}
      />
    </div>
  ),
  th: ({ node, ...props }: any) => (
    <th
      className="px-4 py-3 bg-slate-100 dark:bg-[#2f2f2f] font-semibold border-b border-slate-200 dark:border-[#3d3d3d]"
      {...props}
    />
  ),
  td: ({ node, ...props }: any) => (
    <td
      className="px-4 py-3 border-b border-slate-200 dark:border-[#3d3d3d] last:border-0"
      {...props}
    />
  ),
  a: ({ node, ...props }: any) => (
    <a
      className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:text-blue-800 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  p: ({ node, ...props }: any) => (
    <p className="mb-3 last:mb-0 whitespace-pre-wrap" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
  ),
  iframe: ({ node, ...props }: any) => (
    <div className="relative w-full my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 aspect-video">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        {...props}
      />
    </div>
  ),
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
  const [feedbackState, setFeedbackState] = useState<
    Record<string, 'up' | 'down'>
  >({})

  // NEW: State to manage the open 3-dots menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const userScrolledUpRef = useRef(false)
  const abortStreamRef = useRef(false)

  // Clean up Text-to-Speech on unmount and click listener for the dots menu
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null)
    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
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

  // Top level window scrolling implementation
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior,
    })
  }, [])

  useEffect(() => {
    const handleWindowScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight
      const isScrolledUp = distanceFromBottom > 140
      setShowScrollButton(isScrolledUp)
      userScrolledUpRef.current = isScrolledUp
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

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

  const handleSelectText = (id: string) => {
    const el = document.getElementById(`msg-${id}`)
    if (el) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(el)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
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
      window.speechSynthesis.cancel()
      setSpeakingMessageId(null)
    } else {
      window.speechSynthesis.cancel()
      const cleanText = stripMarkdown(text)
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.onend = () => setSpeakingMessageId(null)
      utterance.onerror = () => setSpeakingMessageId(null)
      setSpeakingMessageId(id)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackState((prev) => ({
      ...prev,
      [id]: prev[id] === type ? undefined : type,
    }))
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

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  // --- REGENERATING A RESPONSE ---
  const handleRegenerate = (assistantMsgId: string) => {
    const msgIndex = messages.findIndex((m) => m.id === assistantMsgId)
    if (msgIndex <= 0) return
    const userMsg = messages[msgIndex - 1]

    // Safety check to ensure the preceding message is a user prompt
    if (userMsg?.role !== 'user') return

    // Resend the prompt using replaceId—which natively trims history at that point
    sendMessage(userMsg.content, { replaceId: userMsg.id, isEdit: true })
  }

  // --- STOP GENERATING AND RETURN TO TEXTAREA ---
  const handleStop = () => {
    abortStreamRef.current = true // Break stream loops

    setMessages((prev) => {
      const newMessages = [...prev]
      const lastUserIndex = newMessages.map((m) => m.role).lastIndexOf('user')

      if (lastUserIndex !== -1) {
        const lastUserMsg = newMessages[lastUserIndex]
        // Put text back into input
        setInput(lastUserMsg.content)
        // Slice away the user message and everything after it
        return newMessages.slice(0, lastUserIndex)
      }
      return prev
    })

    setIsStreaming(false)
    setEditingMessageId(null)

    // Needs a slight timeout to focus and auto-resize after state reflects
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
        inputRef.current.focus()
      }
    }, 0)
  }

  const sendMessage = async (
    text: string,
    options?: { replaceId?: string; isEdit?: boolean },
  ) => {
    if (!text.trim() || isStreaming) return

    abortStreamRef.current = false // Reset abort signal
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
    if (inputRef.current) inputRef.current.style.height = 'auto'

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

      // IMPORTANT FIX: Prevent ghost typing if stop was clicked while awaiting the initial API response
      if (abortStreamRef.current) {
        return
      }

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

      // When loop breaks internally, reading stream ends which cuts HTTP network connection via the browser cleanly
      for await (const chunk of stream) {
        if (abortStreamRef.current) {
          break
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        )
      }

      if (!abortStreamRef.current) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, status: 'sent' } : m,
          ),
        )
        setIsStreaming(false)
      }
    } catch (error: any) {
      if (!abortStreamRef.current) {
        setMessages((prev) => {
          const hasAssistantStarted = prev.some(
            (m) => m.role === 'assistant' && m.status === 'typing',
          )

          if (hasAssistantStarted) {
            return prev.map((m) =>
              m.status === 'typing'
                ? {
                    ...m,
                    status: 'error',
                    errorMessage: 'Stream disconnected.',
                  }
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
        setIsStreaming(false)
      }
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
    <div className="relative min-h-screen bg-white dark:bg-[#212121] text-slate-900 dark:text-gray-100 font-sans transition-colors duration-300 selection:bg-blue-200 dark:selection:bg-blue-900 flex flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#212121]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              B-Fanel AI
            </h1>
          </div>
        </div>
      </header>

      {/* Main chat window - full document scroll instead of boxed scroll */}
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-[140px] flex flex-col gap-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 dark:text-slate-500 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-10 h-10 text-blue-500/50 dark:text-blue-400/50" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              How can I help you today?
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const canEdit = msg.id === lastUserMsgId && !isStreaming
            const isCurrentlyBeingEdited = editingMessageId === msg.id

            return (
              <div
                key={msg.id}
                className={`flex flex-col group animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                } ${isCurrentlyBeingEdited ? 'opacity-50' : 'opacity-100'}`}
              >
                <div
                  className={`relative group/bubble flex flex-col ${
                    msg.role === 'assistant'
                      ? 'max-w-full sm:max-w-[85%]'
                      : 'max-w-[85%] sm:max-w-[75%]'
                  }`}
                >
                  {/* Message Body */}
                  {msg.role === 'assistant' ? (
                    <div className="px-1 py-1 text-[16px] leading-relaxed text-slate-800 dark:text-gray-100">
                      {msg.status === 'typing' && msg.content === '' ? (
                        <div className="flex gap-1.5 items-center h-6">
                          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"></span>
                        </div>
                      ) : (
                        <>
                          <ExpandableMessage
                            content={msg.content}
                            isTyping={msg.status === 'typing'}
                          />
                          {msg.status === 'error' && (
                            <div className="mt-3 text-sm text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg inline-flex">
                              <AlertCircle className="w-4 h-4" />
                              {msg.errorMessage}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      id={`msg-${msg.id}`}
                      className="px-5 py-3 text-[16px] font-normal leading-relaxed bg-[#1a56db] text-white rounded-3xl rounded-tr-md"
                    >
                      {msg.content}
                    </div>
                  )}

                  {/* USER Context Menu (Hover Dropdown style) */}
                  {msg.role === 'user' && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#2f2f2f] rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-white/10 flex flex-col overflow-hidden opacity-0 scale-95 pointer-events-none group-hover/bubble:opacity-100 group-hover/bubble:scale-100 group-hover/bubble:pointer-events-auto transition-all duration-200 origin-top-right z-50 py-1.5">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#3d3d3d] transition-colors"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        Copy
                      </button>
                      <button
                        onClick={() => handleSelectText(msg.id)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#3d3d3d] transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Select text
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => handleStartEdit(msg)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#3d3d3d] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit message
                        </button>
                      )}
                      <button
                        onClick={() => handleShare(msg.content)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#3d3d3d] transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share prompt
                      </button>
                    </div>
                  )}

                  {/* ASSISTANT Action Buttons (Below text) */}
                  {msg.role === 'assistant' && msg.status !== 'typing' && (
                    <div className="mt-3 flex items-center gap-4 text-slate-400 dark:text-gray-400 pl-1">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        title="Copy"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-[18px] h-[18px] text-green-500" />
                        ) : (
                          <Copy className="w-[18px] h-[18px] hover:text-slate-700 dark:hover:text-gray-200 transition-colors" />
                        )}
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        title="Good response"
                      >
                        <ThumbsUp
                          className={`w-[18px] h-[18px] transition-colors ${feedbackState[msg.id] === 'up' ? 'text-blue-500 fill-blue-500/20' : 'hover:text-slate-700 dark:hover:text-gray-200'}`}
                        />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        title="Bad response"
                      >
                        <ThumbsDown
                          className={`w-[18px] h-[18px] transition-colors ${feedbackState[msg.id] === 'down' ? 'text-red-500 fill-red-500/20' : 'hover:text-slate-700 dark:hover:text-gray-200'}`}
                        />
                      </button>
                      <button
                        onClick={() => handleReadAloud(msg.content, msg.id)}
                        title={
                          speakingMessageId === msg.id
                            ? 'Stop reading'
                            : 'Read aloud'
                        }
                      >
                        {speakingMessageId === msg.id ? (
                          <Square className="w-[18px] h-[18px] fill-current text-blue-500" />
                        ) : (
                          <Volume2 className="w-[18px] h-[18px] hover:text-slate-700 dark:hover:text-gray-200 transition-colors" />
                        )}
                      </button>
                      <button
                        onClick={() => handleShare(msg.content)}
                        title="Share"
                      >
                        <Share2 className="w-[18px] h-[18px] hover:text-slate-700 dark:hover:text-gray-200 transition-colors" />
                      </button>

                      {/* MORE OPTIONS MENU */}
                      <div
                        className="relative inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === msg.id ? null : msg.id)
                          }
                          title="More options"
                          className="p-1 -ml-1 rounded-md hover:bg-slate-200 dark:hover:bg-[#3d3d3d] transition-colors"
                        >
                          <MoreVertical className="w-[18px] h-[18px] text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors" />
                        </button>

                        {openMenuId === msg.id && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-white dark:bg-[#2f2f2f] rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-white/10 flex flex-col py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <button
                              onClick={() => {
                                handleRegenerate(msg.id)
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#3d3d3d] transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Regenerate
                            </button>
                            <button
                              onClick={() => {
                                handleCopy(stripMarkdown(msg.content), msg.id)
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#3d3d3d] transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Copy Raw
                            </button>
                            <div className="h-px w-full bg-slate-100 dark:bg-white/10 my-1" />
                            <button
                              onClick={() => {
                                alert('Response reported.')
                                setOpenMenuId(null)
                              }}
                              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-[#3d3d3d] transition-colors"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              Report
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sending/Error states for User */}
                  {msg.role === 'user' && (
                    <div className="mt-1 flex justify-end px-2">
                      {msg.status === 'sending' && (
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {msg.status === 'error' && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500">
                          <AlertCircle className="w-3 h-3" />
                          <span>Failed</span>
                          <button
                            onClick={() =>
                              sendMessage(msg.content, { replaceId: msg.id })
                            }
                            className="underline ml-1"
                          >
                            Resend
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </main>

      {/* Floating Scroll Button */}
      {showScrollButton && (
        <button
          type="button"
          onClick={() => {
            userScrolledUpRef.current = false
            scrollToBottom('smooth')
          }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center w-10 h-10 bg-white/90 dark:bg-[#2f2f2f]/90 border border-slate-200 dark:border-transparent rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-slate-50 dark:hover:bg-[#383838] transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4 text-slate-700 dark:text-gray-200" />
        </button>
      )}

      {/* Floating Bottom Input Area */}
      <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-white via-white dark:from-[#212121] dark:via-[#212121] to-transparent pt-8 pb-4 px-4 sm:px-6 z-50 pointer-events-none">
        <div className="max-w-3xl mx-auto flex flex-col pointer-events-auto relative">
          {editingMessageId && (
            <div className="flex items-center justify-between px-5 py-2 text-[13px] bg-slate-100 dark:bg-[#2f2f2f] text-slate-600 dark:text-gray-300 rounded-t-2xl mx-2 mb-[-10px] pb-4">
              <span className="font-medium flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5" />
                Editing message
              </span>
              <button
                type="button"
                onClick={cancelEdit}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-[#3d3d3d] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-1.5 p-1.5 bg-slate-100 dark:bg-[#2f2f2f] rounded-[26px] border border-transparent focus-within:border-slate-300 dark:focus-within:border-[#424242] shadow-sm transition-all relative z-10"
          >
            {/* Plus Button - Now alerts user as Nemotron free tier is text-only */}
            <button
              type="button"
              onClick={() =>
                alert(
                  'File upload is not supported by the current free text-only model.',
                )
              }
              className="p-2.5 flex-shrink-0 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white bg-slate-200/50 dark:bg-[#3d3d3d]/50 hover:dark:bg-[#3d3d3d] rounded-full ml-1 mb-1 transition-colors"
              title="Add attachment"
              disabled={isStreaming}
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Input Field */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputResize}
              placeholder="Message B-Fanel AI..."
              disabled={isStreaming}
              rows={1}
              className="flex-1 bg-transparent px-2 py-3 min-h-[44px] max-h-[120px] text-[16px] outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 resize-none overflow-y-auto mb-0.5"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (input.trim() && !isStreaming) handleSubmit(e)
                }
              }}
            />

            {/* Actions (Mic / Send / Stop) */}
            <div className="flex items-center gap-1 pr-1 pb-1 flex-shrink-0">
              {!isStreaming && (
                <button
                  type="button"
                  className="p-2.5 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors"
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}

              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-[#424242] dark:text-gray-200 dark:hover:bg-[#525252] dark:hover:text-white transition-all shadow-sm"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    input.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-300 text-slate-500 dark:bg-[#424242] dark:text-gray-500'
                  }`}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </footer>
    </div>
  )
}
