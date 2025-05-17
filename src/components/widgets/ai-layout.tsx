'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Message as UIMessage } from 'ai'
import {
  MessageCircle,
  X,
  History,
  User,
  Plus,
  Send,
  ChevronRight,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useChat } from 'ai/react'
import { useChatStore } from '@/store/chat-store'
import { useUser } from '@clerk/nextjs'
import ReactMarkdown from 'react-markdown'
import { usePathname } from 'next/navigation'

interface Message extends UIMessage {
  timestamp: Date
  isLoading?: boolean
}

const quickPrompts = [
  { id: 1, text: 'Trending watches', icon: Sparkles },
  { id: 2, text: 'Market analysis', icon: ChevronRight },
  { id: 3, text: 'Investment opportunities', icon: ChevronRight },
  { id: 4, text: 'Price predictions', icon: ChevronRight },
]

export function AIAssistant() {
  const { user } = useUser()
  const { chats, currentChatId, setCurrentChat, createNewChat, setChats } =
    useChatStore()
  const {
    messages: aiMessages,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
  } = useChat({
    api: '/api/chat',
    body: {
      chatId: currentChatId,
    },
    onResponse: () => {
      setIsTyping(false)
    },
    onFinish: () => {
      setIsTyping(false)
    },
  })
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages: Message[] = aiMessages.map((msg) => ({
    ...msg,
    timestamp: new Date(),
    isLoading: false,
  }))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch('/api/chat/history')
        if (!response.ok) throw new Error('Failed to load chat history')
        const chats = await response.json()
        setChats(chats)
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }
    loadChatHistory()
  }, [setChats])

  const handleQuickPrompt = async (text: string) => {
    if (!currentChatId) {
      await createNewChat()
    }
    setIsTyping(true)
    try {
      // @eslint-disable-next-line @typescript-eslint/no-explicit-any
      await handleSubmit(new Event('submit') as any, {
        data: { content: text },
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsTyping(false)
    }
  }

  const handleChatSelect = (chatId: string) => {
    setCurrentChat(chatId)
    const selectedChat = chats.find((chat) => chat.id === chatId)
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
    const tabsList = document.querySelector('[role="tablist"]') as HTMLElement
    const chatTab = tabsList?.querySelector('[value="chat"]') as HTMLElement
    chatTab?.click()
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    if (!currentChatId) {
      await createNewChat()
    }

    setInputValue('')
    setIsTyping(true)

    try {
      await handleSubmit(e)
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsTyping(false)
    }
  }

  const pathname = usePathname()

  const routes = ['/dashboard/community']
  if (routes.includes(pathname)) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Button
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-blue-700"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-full max-w-md md:max-w-lg z-50 rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 shadow-2xl backdrop-blur-xl"
          >
            <div className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-blue-500">
                      <AvatarImage src="/logo.webp" />
                      <AvatarFallback className="bg-blue-500">
                        WP
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      WatchPoint Assistant
                    </h3>
                    <p className="text-xs text-gray-400">
                      AI Investment Expert
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="w-full bg-transparent border-b border-gray-700 p-0">
                <TabsTrigger
                  value="chat"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                >
                  Profile
                </TabsTrigger>
              </TabsList>
              <div className="h-[calc(100vh-200px)] flex flex-col">
                <TabsContent value="chat" className="h-full flex flex-col m-0">
                  <ScrollArea className="flex-1 px-4 py-6">
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            'flex gap-3',
                            message.role === 'user' && 'flex-row-reverse'
                          )}
                        >
                          <Avatar
                            className={cn(
                              'h-8 w-8 border-2',
                              message.role === 'assistant'
                                ? 'border-blue-500'
                                : 'border-white/20'
                            )}
                          >
                            <AvatarImage
                              src={
                                message.role === 'assistant'
                                  ? '/logo.webp'
                                  : undefined
                              }
                            />
                            <AvatarFallback
                              className={
                                message.role === 'assistant'
                                  ? 'bg-blue-500'
                                  : 'bg-white/10'
                              }
                            >
                              {message.role === 'assistant' ? 'WP' : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              'group relative rounded-2xl px-4 py-3 text-sm transition-all',
                              message.role === 'assistant'
                                ? 'bg-gray-800 text-white'
                                : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                            )}
                          >
                            {message.role === 'assistant' ? (
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            ) : (
                              message.content
                            )}
                            {isTyping &&
                              message === messages[messages.length - 1] &&
                              message.role === 'assistant' && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex items-center gap-1 mt-2"
                                >
                                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-150" />
                                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-300" />
                                </motion.div>
                              )}
                            <div
                              className={cn(
                                'absolute -bottom-5 left-0 text-xs text-gray-400 opacity-0 transition-opacity',
                                'group-hover:opacity-100'
                              )}
                            >
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && messages.length === 0 && (
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8 border-2 border-blue-500">
                            <AvatarImage src="/logo.webp" />
                            <AvatarFallback className="bg-blue-500">
                              WP
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-800 rounded-2xl px-4 py-3">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-1"
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-150" />
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-300" />
                            </motion.div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="px-4 py-3 bg-gray-800/80 backdrop-blur-xl border-t border-gray-700">
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-2">
                        {messages.length === 0 &&
                          quickPrompts.map((prompt) => (
                            <Button
                              key={prompt.id}
                              variant="outline"
                              className="flex-shrink-0 bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-blue-500 transition-all duration-200"
                              onClick={() => handleQuickPrompt(prompt.text)}
                              disabled={isLoading}
                            >
                              <prompt.icon className="w-4 h-4 mr-2" />
                              {prompt.text}
                            </Button>
                          ))}
                      </div>
                    </ScrollArea>
                  </div>
                  {/* Input */}
                  <div className="p-4 bg-gray-800/80 backdrop-blur-xl border-t border-gray-700">
                    <form onSubmit={handleSend} className="relative flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value)
                          handleInputChange(e)
                        }}
                        placeholder="Ask your question..."
                        className="flex-1 h-12 pl-4 pr-12 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 
                               focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500
                               rounded-xl transition-all duration-200"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="h-12 px-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800
                               rounded-xl transition-all duration-200"
                      >
                        <Send className="h-5 w-5 text-white" />
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="m-0 flex flex-col ">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-2">
                      {chats
                        .slice()
                        .reverse()
                        .map((chat) => (
                          <Button
                            key={chat.id}
                            variant="ghost"
                            className={cn(
                              'w-full justify-start text-left p-4 hover:bg-gray-800/50 rounded-xl transition-all duration-200',
                              currentChatId === chat.id &&
                                'bg-gray-800/50 border-blue-500'
                            )}
                            onClick={() => handleChatSelect(chat.id)}
                          >
                            <History className="h-5 w-5 mr-3 text-blue-500" />
                            <div className="flex-1">
                              <p className="font-medium text-white">
                                {chat.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(chat.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </Button>
                        ))}

                      <Button
                        variant="outline"
                        className="w-full justify-start p-4 bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-blue-500
                               rounded-xl transition-all duration-200"
                        onClick={() => createNewChat()}
                      >
                        <Plus className="h-5 w-5 mr-3 text-blue-500" />
                        New Chat
                      </Button>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent
                  value="profile"
                  className="m-0 flex flex-col items-center justify-center"
                >
                  <ScrollArea className="h-full">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                          <Avatar className="h-16 w-16 border-2 border-blue-500">
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback className="bg-blue-500">
                              {user?.firstName?.[0]}
                              {user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            size="icon"
                            variant="outline"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gray-800 border-gray-700"
                          >
                            <Settings className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {user?.fullName || 'Guest User'}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              Premium Member
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-700">
                              PRO
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start p-4 bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-blue-500
                                 rounded-xl transition-all duration-200"
                        >
                          <User className="h-5 w-5 mr-3 text-white" />
                          Account Settings
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start p-4 bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-blue-500
                                 rounded-xl transition-all duration-200"
                          onClick={() => createNewChat()}
                        >
                          <Plus className="h-5 w-5 mr-3 text-white" />
                          New Chat
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start p-4 bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-red-500
                                 rounded-xl transition-all duration-200 group"
                        >
                          <LogOut className="h-5 w-5 mr-3 text-white group-hover:text-red-500" />
                          <span className="text-white group-hover:text-red-500">
                            Sign Out
                          </span>
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
