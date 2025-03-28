"use client"

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { useParams } from "react-router-dom"
import { Users, MessageCircle, UserPlus, ChevronLeft, Send, Loader2, ArrowLeft, Info } from "lucide-react"
import { useForumStore } from "@/store/useFormStore"
import { connectSocket, disconnectSocket, onReceiveMessage, offReceiveMessage } from "@/lib/socket"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom"

// Members Sidebar Component
const MembersSidebar = ({ members, isCollapsed, toggleSidebar }) => (
  <div className={`bg-card border-r transition-all duration-300 h-screen ${isCollapsed ? "w-16" : "w-72"}`}>
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Users size={20} className="text-primary" />
        {!isCollapsed && <h2 className="font-semibold">Members</h2>}
      </div>
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <ChevronLeft size={18} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
      </Button>
    </div>
    <ScrollArea className="h-[calc(100vh-65px)]">
      <div className="p-2">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors mb-1"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {member.fullName.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-medium text-sm">{`${member.fullName.firstName} ${member.fullName.lastName}`}</span>
                <span className="truncate text-xs text-muted-foreground">{member.email}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
)

// Message Component
const Message = React.memo(({ message, isCurrentUser }) => {
  const messageTime = new Date(message.timestamp)
  const formattedTime = messageTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formattedDate = messageTime.toLocaleDateString()

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2 mt-1">
          <AvatarFallback>{message.sender.fullName.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`
          p-3 rounded-lg max-w-xs lg:max-w-md 
          ${isCurrentUser ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border rounded-tl-none"}
        `}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-medium ${isCurrentUser ? "text-primary-foreground/90" : ""}`}>
            {isCurrentUser ? "You" : message.sender.fullName.firstName}
          </span>
          <span className={`text-xs ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"} ml-2`}>
            {formattedTime}
          </span>
        </div>
        <p className="break-words">{message.content}</p>
        <span
          className={`text-xs ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"} block text-right mt-1`}
        >
          {formattedDate}
        </span>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8 ml-2 mt-1">
          <AvatarFallback className="bg-primary-foreground text-primary">
            {message.sender.fullName.firstName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
})

// Enhanced Message Input Component with localized loading
const MessageInput = ({ forumId, sendMessage }) => {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = useCallback(async () => {
    if (message.trim()) {
      setIsSending(true)
      try {
        await sendMessage(forumId, message)
        setMessage("")
      } catch (error) {
        console.error("Failed to send message:", error)
      } finally {
        setIsSending(false)
      }
    }
  }, [forumId, message, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 bg-card border-t">
      <div className="flex items-center gap-2">
        <textarea
          className="flex-1 min-h-[44px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="1"
          disabled={isSending}
        />
        <Button onClick={handleSend} disabled={!message.trim() || isSending} size="icon">
          {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </Button>
      </div>
    </div>
  )
}

// Main Forum Component
export const ForumDetail = () => {
  const { id } = useParams()
  const { currentForum, isLoading, error, fetchForumById, joinForum, sendMessage, addSocketMessage, leaveForum } =
    useForumStore()

  const [currentUser, setCurrentUser] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const messagesEndRef = useRef(null)

  // Check if user is a member of the forum
  const isMember = useMemo(() => {
    if (!currentUser || !currentForum) return false
    return currentForum.members.some((member) => member._id === currentUser._id)
  }, [currentUser, currentForum])

  // Check if user is the mentor who created the forum
  const isForumCreator = useMemo(() => {
    if (!currentUser || !currentForum || !currentForum.mentorId) return false
    return currentForum.mentorId._id === currentUser._id
  }, [currentUser, currentForum])

  // User can post if they're a member OR the forum creator (mentor)
  const canPostMessage = useMemo(() => {
    return isMember || isForumCreator
  }, [isMember, isForumCreator])

  // Need join button if not a member AND not the creator
  const needsJoinButton = useMemo(() => {
    return !isMember && !isForumCreator
  }, [isMember, isForumCreator])

  const handleJoin = useCallback(async () => {
    if (id && !isMember && !isForumCreator) {
      setIsJoining(true)
      try {
        await joinForum(id)
      } catch (error) {
        console.error("Failed to join forum:", error)
      } finally {
        setIsJoining(false)
      }
    }
  }, [id, joinForum, isMember, isForumCreator])

  const handleReceiveMessage = useCallback(
    (data) => {
      if (data.forumId === id && data.message) {
        addSocketMessage(data.message)
        // Scroll to bottom when new message arrives
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    },
    [id, addSocketMessage],
  )

  useEffect(() => {
    connectSocket()
    onReceiveMessage(handleReceiveMessage)
    return () => {
      if (id) leaveForum(id)
      offReceiveMessage(handleReceiveMessage)
      disconnectSocket()
    }
  }, [id, handleReceiveMessage, leaveForum])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setCurrentUser(JSON.parse(storedUser))
  }, [])

  useEffect(() => {
    if (id) fetchForumById(id)
    return () => {
      if (id) leaveForum(id)
    }
  }, [id, fetchForumById, leaveForum])

  // Scroll to bottom when forum loads
  useEffect(() => {
    if (messagesEndRef.current && currentForum?.messages?.length > 0) {
      messagesEndRef.current.scrollIntoView()
    }
  }, [currentForum?.messages?.length])

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-72 border-r">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="flex-1 p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full mr-2" />}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-16 w-64" />
                  </div>
                  {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full ml-2" />}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <Info size={24} className="text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Unable to load forum</h2>
            <p className="text-muted-foreground mb-6 text-center">{error}</p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link to="/forums">Go Back</Link>
              </Button>
              <Button onClick={() => fetchForumById(id)}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentForum) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Forum not found</h2>
            <Button asChild>
              <Link to="/forums">
                <ArrowLeft size={16} className="mr-2" />
                Back to Forums
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <MembersSidebar
        members={currentForum.members}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-card border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{currentForum.topic}</h1>
              <div className="flex items-center mt-1 text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center mr-3">
                        <MessageCircle size={16} className="mr-1" />
                        <span className="text-sm">{currentForum.messages.length}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentForum.messages.length} {currentForum.messages.length === 1 ? "message" : "messages"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        <span className="text-sm">{currentForum.members.length}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentForum.members.length} {currentForum.members.length === 1 ? "member" : "members"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {isForumCreator && (
                  <Badge variant="outline" className="ml-3 text-primary border-primary">
                    Creator
                  </Badge>
                )}
              </div>
            </div>
            {needsJoinButton && (
              <Button onClick={handleJoin} disabled={isJoining} className="gap-2">
                {isJoining ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Join Forum
                  </>
                )}
              </Button>
            )}
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">{currentForum.description}</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {currentForum.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <MessageCircle size={24} className="text-primary" />
                </div>
                <p className="text-muted-foreground text-center">
                  No messages yet.{" "}
                  {canPostMessage ? "Be the first to start the conversation!" : "Join to start the conversation!"}
                </p>
              </div>
            ) : (
              <div className="max-w-full">
                {currentForum.messages.map((message) => (
                  <Message
                    key={message._id}
                    message={message}
                    isCurrentUser={currentUser && message.sender._id === currentUser._id}
                  />
                ))}
                <div ref={messagesEndRef}></div>
              </div>
            )}
          </div>
        </ScrollArea>

        {canPostMessage ? (
          <MessageInput forumId={currentForum._id} sendMessage={sendMessage} />
        ) : (
          <div className="p-4 bg-muted/50 border-t text-center text-muted-foreground flex items-center justify-center gap-2">
            <UserPlus size={16} />
            <span>Join this forum to send messages</span>
            <Button size="sm" variant="outline" onClick={handleJoin} disabled={isJoining}>
              {isJoining ? "Joining..." : "Join Now"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

