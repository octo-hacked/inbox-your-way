import { useState } from "react";
import { Send, MoreHorizontal, ArrowLeft, Phone, Video, Smile, Paperclip } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const InboxSidebar = () => {
  const [selectedChat, setSelectedChat] = useState(null);
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
    }
  ];

  const messages = {
    1: [
      { id: 1, text: "Hey! How are you doing?", sender: "other", time: "10:30 AM" },
      { id: 2, text: "I'm doing great!", sender: "me", time: "10:32 AM" },
      { id: 3, text: "Thanks for sharing that article!", sender: "other", time: "10:33 AM" }
    ],
    2: [
      { id: 1, text: "Hey Alex!", sender: "me", time: "Yesterday" },
      { id: 2, text: "Let's catch up soon", sender: "other", time: "1h ago" }
    ],
    3: [
      { id: 1, text: "Great presentation today", sender: "other", time: "3h ago" },
      { id: 2, text: "Thank you! I'm glad it went well.", sender: "me", time: "3h ago" }
    ]
  };

  const currentChat = conversations.find(c => c.id === selectedChat);
  const currentMessages = messages[selectedChat] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  if (selectedChat) {
    return (
      <div className="w-80 h-screen bg-card border-l border-border flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedChat(null)}
              className="p-1 hover:bg-hover-bg rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-icon-color" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-muted"></div>
                {currentChat?.online && (
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">{currentChat?.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {currentChat?.online ? "Active now" : "Last seen 2h ago"}
                </p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button className="p-1 hover:bg-hover-bg rounded transition-colors">
                <Phone className="w-4 h-4 text-icon-color" />
              </button>
              <button className="p-1 hover:bg-hover-bg rounded transition-colors">
                <Video className="w-4 h-4 text-icon-color" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 inbox-scroll">
          <div className="p-3 space-y-3">
            {currentMessages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[200px] rounded-lg p-2 ${
                  message.sender === 'me' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  <p className="text-xs">{message.text}</p>
                  <p className={`text-[10px] mt-1 ${
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
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-hover-bg rounded transition-colors">
              <Paperclip className="w-4 h-4 text-icon-color" />
            </button>
            <div className="flex-1 flex items-center gap-1 bg-input rounded-lg px-2 py-1">
              <input
                type="text"
                placeholder="Type..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="p-1 hover:bg-hover-bg rounded transition-colors">
                <Smile className="w-3 h-3 text-icon-color" />
              </button>
            </div>
            <button 
              onClick={handleSendMessage}
              className="p-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-screen bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-icon-color" />
          <h2 className="text-lg font-semibold text-foreground">Inbox</h2>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 inbox-scroll">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id}
            onClick={() => setSelectedChat(conversation.id)}
            className="p-4 border-b border-border hover:bg-hover-bg cursor-pointer transition-colors"
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

      {/* Compose Button */}
      <div className="p-4 border-t border-border">
        <button className="w-full bg-primary text-primary-foreground rounded-lg py-2 px-4 text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          New Message
        </button>
      </div>
    </div>
  );
};

export default InboxSidebar;