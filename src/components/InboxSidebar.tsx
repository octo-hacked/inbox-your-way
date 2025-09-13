import { Send, MoreHorizontal } from "lucide-react";

const InboxSidebar = () => {
  const conversations = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "",
      lastMessage: "Thanks for sharing that article!",
      time: "2m",
      unread: true
    },
    {
      id: 2,
      name: "Alex Morgan",
      avatar: "",
      lastMessage: "Let's catch up soon",
      time: "1h",
      unread: false
    },
    {
      id: 3,
      name: "Jordan Kim",
      avatar: "",
      lastMessage: "Great presentation today",
      time: "3h",
      unread: false
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "",
      lastMessage: "See you at the meeting",
      time: "1d",
      unread: true
    }
  ];

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
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id}
            className="p-4 border-b border-border hover:bg-hover-bg cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-muted"></div>
                {conversation.unread && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
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
      </div>

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