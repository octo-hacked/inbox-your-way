import { useState } from "react";
import { ArrowLeft, Send, Paperclip, Smile, Phone, Video, MoreVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "",
      lastMessage: "Thanks for sharing that article!",
      time: "2m",
      unread: true,
      online: true
    },
    {
      id: 2,
      name: "Alex Morgan",
      avatar: "",
      lastMessage: "Let's catch up soon",
      time: "1h",
      unread: false,
      online: true
    },
    {
      id: 3,
      name: "Jordan Kim",
      avatar: "",
      lastMessage: "Great presentation today",
      time: "3h",
      unread: false,
      online: false
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "",
      lastMessage: "See you at the meeting",
      time: "1d",
      unread: true,
      online: false
    },
    {
      id: 5,
      name: "Marcus Johnson",
      avatar: "",
      lastMessage: "The project looks amazing",
      time: "2d",
      unread: false,
      online: true
    },
    {
      id: 6,
      name: "Lisa Zhang",
      avatar: "",
      lastMessage: "Can we schedule a call?",
      time: "3d",
      unread: false,
      online: false
    }
  ];

  const messages = {
    1: [
      { id: 1, text: "Hey! How are you doing?", sender: "other", time: "10:30 AM" },
      { id: 2, text: "I'm doing great! Just finished reading that article you sent.", sender: "me", time: "10:32 AM" },
      { id: 3, text: "Thanks for sharing that article!", sender: "other", time: "10:33 AM" },
      { id: 4, text: "It really opened my eyes to the mindful tech movement.", sender: "other", time: "10:33 AM" },
      { id: 5, text: "I'm so glad you found it helpful! That's exactly what we're trying to build here.", sender: "me", time: "10:35 AM" }
    ],
    2: [
      { id: 1, text: "Hey Alex! It's been a while.", sender: "me", time: "Yesterday" },
      { id: 2, text: "Let's catch up soon", sender: "other", time: "1h ago" }
    ]
  };

  const currentChat = conversations.find(c => c.id === selectedChat);
  const currentMessages = messages[selectedChat] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, you'd send this to your backend
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations List */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1 hover:bg-hover-bg rounded transition-colors">
              <ArrowLeft className="w-5 h-5 text-icon-color" />
            </Link>
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1 inbox-scroll">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={`p-4 border-b border-border hover:bg-hover-bg cursor-pointer transition-colors ${
                selectedChat === conversation.id ? 'bg-hover-bg' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-muted"></div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                  {conversation.unread && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-accent rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm ${conversation.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <p className={`text-sm truncate ${conversation.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    {currentChat.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{currentChat.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {currentChat.online ? "Active now" : "Last seen 2h ago"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-hover-bg rounded transition-colors">
                    <Phone className="w-5 h-5 text-icon-color" />
                  </button>
                  <button className="p-2 hover:bg-hover-bg rounded transition-colors">
                    <Video className="w-5 h-5 text-icon-color" />
                  </button>
                  <button className="p-2 hover:bg-hover-bg rounded transition-colors">
                    <MoreVertical className="w-5 h-5 text-icon-color" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 main-feed-scroll">
              <div className="p-4 space-y-4">
                {currentMessages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs rounded-lg p-3 ${
                      message.sender === 'me' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-hover-bg rounded transition-colors">
                  <Paperclip className="w-5 h-5 text-icon-color" />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-input rounded-lg px-3 py-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button className="p-1 hover:bg-hover-bg rounded transition-colors">
                    <Smile className="w-4 h-4 text-icon-color" />
                  </button>
                </div>
                <button 
                  onClick={handleSendMessage}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;