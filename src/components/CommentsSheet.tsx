import { Drawer } from "vaul";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { FeedPost } from "@/components/MainFeed";
import { ScrollArea } from "@/components/ui/scroll-area";

const avatarFor = (seed: string) => `https://i.pravatar.cc/100?u=${encodeURIComponent(seed)}`;

type CommentsSheetProps = {
  open: boolean;
  post: FeedPost | null;
  onClose: () => void;
};

const CommentsSheet = ({ open, post, onClose }: CommentsSheetProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!post) return;
      setLoadingComments(true);
      try {
        const commentsApi = await import("@/lib/comments");
        const res = await commentsApi.getComments({ postId: post.remoteId ?? post.id, limit: 50, includeReplies: false, token: accessToken });
        const items = res?.comments || res?.data || res?.items || [];
        if (!mounted) return;
        setCommentsList(items);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        if (mounted) setLoadingComments(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [post, accessToken]);

  if (!post) return null;

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const body = newMessage.trim();
    setNewMessage("");
    try {
      const commentsApi = await import("@/lib/comments");
      const res = await commentsApi.postComment(post.remoteId ?? post.id, body, undefined, accessToken);
      const created = res?.comment || res?.data || res;
      setCommentsList((prev) => [created, ...prev]);
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-card">
          <Drawer.Title className="sr-only">Comments</Drawer.Title>
          <div className="p-3 border-b border-border flex items-center gap-2">
            <button onClick={onClose} className="p-1 hover:bg-hover-bg rounded" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-semibold">Comments</h3>
          </div>

          <div className="p-4 flex items-center gap-3">
            <img src={post.avatar} alt={post.username} className="w-8 h-8 rounded-full object-cover" />
            <div className="text-sm font-medium">{post.username}</div>
            <div className="ml-auto text-xs text-muted-foreground">{post.time}</div>
          </div>
          <div className="px-4">
            <div className="overflow-hidden rounded-md bg-post-bg">
              <img src={post.image} alt="Post" className="w-full h-40 object-cover" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{post.content}</p>
          </div>

          <ScrollArea className="h-[40vh] inbox-scroll">
            <div className="p-4 space-y-3">
              {loadingComments ? (
                <div className="text-sm text-muted-foreground">Loading comments...</div>
              ) : commentsList.length === 0 ? (
                <div className="text-sm text-muted-foreground">No comments yet</div>
              ) : (
                commentsList.map((c: any) => (
                  <div key={c._id ?? c.id} className="flex items-start gap-3">
                    <img src={c.user?.avatar || avatarFor(c.user?.username || c.user || 'user')} alt={c.user?.username || c.user} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-sm"><span className="font-medium">{c.user?.username || c.user}</span> {c.body || c.text || c.content}</div>
                      <div className="text-[10px] text-muted-foreground">{c.timeAgo || c.createdAt}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="p-2 bg-primary text-primary-foreground rounded-lg active:scale-[0.98]"
                aria-label="Send comment"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default CommentsSheet;
