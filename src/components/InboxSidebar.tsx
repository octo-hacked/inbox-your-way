import { Send, ArrowLeft, Phone, Video, Smile, Paperclip } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import type { FeedPost } from "@/components/MainFeed";

const avatarFor = (seed: string) => `https://i.pravatar.cc/100?u=${encodeURIComponent(seed)}`;

type InboxSidebarProps = {
  postPreview?: FeedPost | null;
  onBackFromPost?: () => void;
  postToShare?: FeedPost | null;
  onBackFromShare?: () => void;
};

const InboxSidebar = ({ postPreview, onBackFromPost, postToShare, onBackFromShare }: InboxSidebarProps) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const { toast } = useToast();
  const { accessToken } = useAuth();

  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!postPreview) return;
      setLoadingComments(true);
      try {
        const commentsApi = await import("@/lib/comments");
        const res = await commentsApi.getComments({ postId: postPreview.remoteId ?? postPreview.id, limit: 50, includeReplies: false, token: accessToken });
        const parseArray = (v: any) => {
          if (Array.isArray(v)) return v;
          if (!v) return [];
          if (Array.isArray(v.comments)) return v.comments;
          if (Array.isArray(v.items)) return v.items;
          if (Array.isArray(v.data)) return v.data;
          if (Array.isArray(v.data?.comments)) return v.data.comments;
          if (Array.isArray(v.data?.items)) return v.data.items;
          return [];
        };
        const items = parseArray(res);
        if (!mounted) return;
        setCommentsList(items);
      } catch (err) {
        console.error("Failed to load comments:", err);
        toast({ title: "Comments", description: "Could not load comments.", variant: "destructive" });
      } finally {
        if (mounted) setLoadingComments(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [postPreview, accessToken, toast]);

  const conversations = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: avatarFor("Sarah Chen"),
      lastMessage: "Thanks for sharing that article!",
      time: "2m",
      unread: true,
      online: true
    },
    {
      id: 2,
      name: "Alex Morgan",
      avatar: avatarFor("Alex Morgan"),
      lastMessage: "Let's catch up soon",
      time: "1h",
      unread: false,
      online: true
    },
    {
      id: 3,
      name: "Jordan Kim",
      avatar: avatarFor("Jordan Kim"),
      lastMessage: "Great presentation today",
      time: "3h",
      unread: false,
      online: false
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: avatarFor("Emma Wilson"),
      lastMessage: "See you at the meeting",
      time: "1d",
      unread: true,
      online: false
    },
    {
      id: 5,
      name: "Marcus Johnson",
      avatar: avatarFor("Marcus Johnson"),
      lastMessage: "The project looks amazing",
      time: "2d",
      unread: false,
      online: true
    }
  ];

  if (postPreview) {

    return (
      <div className="w-80 h-screen bg-card border-l border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <button onClick={onBackFromPost} className="p-1 hover:bg-hover-bg rounded transition-colors" aria-label="Back to inbox">
            <ArrowLeft className="w-5 h-5 text-icon-color" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Post</h2>
        </div>

        {/* Post Preview */}
        <ScrollArea className="flex-1 inbox-scroll">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src={postPreview.avatar} alt={`${postPreview.username} avatar`} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <div className="text-sm font-medium text-foreground">{postPreview.username}</div>
                <div className="text-xs text-muted-foreground">{postPreview.time}</div>
              </div>
            </div>
            <div className="w-full overflow-hidden rounded-md bg-post-bg">
              <img src={postPreview.image} alt="Post" className="w-full h-48 object-cover" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{postPreview.content}</p>
            <div className="h-px w-full bg-border" />
            <div className="space-y-3">
              {loadingComments ? (
                <div className="text-sm text-muted-foreground">Loading comments...</div>
              ) : commentsList.length === 0 ? (
                <div className="text-sm text-muted-foreground">No comments yet</div>
              ) : (
                commentsList.map((c: any) => (
                  <div key={c._id ?? c.id} className="flex items-start gap-3">
                    <img src={c.user?.avatar || avatarFor(c.user?.username || c.user || 'user')} alt={c.user?.username || c.user} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-sm text-foreground"><span className="font-medium">{c.user?.username || c.user}</span> {c.body || c.text || c.content}</div>
                      <div className="text-[10px] text-muted-foreground">{c.timeAgo || c.createdAt}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Composer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1 bg-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={() => handleAddComment()}
              className="p-2 bg-primary text-primary-foreground rounded-lg active:scale-[0.98]"
              aria-label="Send comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default inbox UI

  const messages: Record<number, { id: number; text: string; sender: "me" | "other"; time: string }[]> = {
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
  const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  const [postingComment, setPostingComment] = useState(false);

  const handleAddComment = async () => {
    if (postingComment) return;
    if (!newMessage.trim() || !postPreview) return;
    const body = newMessage.trim();
    setPostingComment(true);
    try {
      const commentsApi = await import("@/lib/comments");
      const res = await commentsApi.postComment(postPreview.remoteId ?? postPreview.id, body, undefined, accessToken);
      // Normalize created item
      const createdRaw = res?.comment || res?.data || res;
      const created = createdRaw?.comment || createdRaw?.data || createdRaw;
      if (!created) {
        console.warn('Unexpected comment create response:', res);
        throw new Error('Invalid response from server');
      }
      setCommentsList((prev) => [created, ...prev]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast({ title: "Comment Failed", description: "Could not post comment.", variant: "destructive" });
    } finally {
      setPostingComment(false);
    }
  };

  if (postToShare) {
    const toggleRecipient = (id: number) => {
      setSelectedRecipients((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleShare = () => {
      if (selectedRecipients.length === 0) return;
      const names = conversations.filter((c) => selectedRecipients.includes(c.id)).map((c) => c.name);
      toast({ title: "Shared", description: `Shared with ${names.join(", ")}` });
      setSelectedRecipients([]);
      onBackFromShare?.();
    };

    return (
      <div className="w-80 h-screen bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <button onClick={onBackFromShare} className="p-1 hover:bg-hover-bg rounded transition-colors" aria-label="Back to inbox">
            <ArrowLeft className="w-5 h-5 text-icon-color" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Share</h2>
        </div>

        <ScrollArea className="flex-1 inbox-scroll">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src={postToShare.avatar} alt={`${postToShare.username} avatar`} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <div className="text-sm font-medium text-foreground">{postToShare.username}</div>
                <div className="text-xs text-muted-foreground">{postToShare.time}</div>
              </div>
            </div>
            <div className="w-full overflow-hidden rounded-md bg-post-bg">
              <img src={postToShare.image} alt="Post" className="w-full h-36 object-cover" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{postToShare.content}</p>
            <div className="h-px w-full bg-border" />

            <div className="space-y-3">
              <div className="text-xs font-medium text-foreground">Select recipients</div>
              {conversations.map((c) => (
                <label key={c.id} className="flex items-center gap-3 p-2 rounded hover:bg-hover-bg cursor-pointer">
                  <div className="relative">
                    <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                    {c.online && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.lastMessage}</div>
                  </div>
                  <Checkbox
                    checked={selectedRecipients.includes(c.id)}
                    onCheckedChange={() => toggleRecipient(c.id)}
                    aria-label={`Select ${c.name}`}
                  />
                </label>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleShare}
            disabled={selectedRecipients.length === 0}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2 px-4 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    );
  }

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
                <img src={currentChat?.avatar} alt={currentChat?.name} className="w-8 h-8 rounded-full object-cover" />
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
                <img src={conversation.avatar} alt={conversation.name} className="w-12 h-12 rounded-full object-cover" />
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
