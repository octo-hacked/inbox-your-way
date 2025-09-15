import { Heart, MessageCircle, Share2, BadgeCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export type Category = "memes" | "news" | "other";

export type FeedPost = {
  id: number;
  username: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  image: string;
  avatar: string;
  category: Category;
  lowDopamine: boolean;
  isVerified: boolean;
  liked?: boolean;
};

const avatarFor = (seed: string) => `https://i.pravatar.cc/100?u=${encodeURIComponent(seed)}`;
const postImageFor = (seed: string | number) => `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/600/400`;

type MainFeedProps = {
  onOpenComments?: (post: FeedPost, fromRect: DOMRect) => void;
  onOpenShare?: (post: FeedPost, fromRect: DOMRect) => void;
  selectedCategories?: Category[];
  lowDopamineOnly?: boolean;
};

const MainFeed = ({ onOpenComments, onOpenShare, selectedCategories, lowDopamineOnly }: MainFeedProps) => {
  const stories = [
    { id: 1, username: "sarah_chen", active: true },
    { id: 2, username: "alex_m", active: false },
    { id: 3, username: "jordan.k", active: true },
    { id: 4, username: "emma_w", active: false },
    { id: 5, username: "marcus.j", active: true },
    { id: 6, username: "lisa_z", active: false },
    { id: 7, username: "david.r", active: true }
  ];

  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: 1,
      username: "sarah_chen",
      content: "Just finished reading about mindful technology and how it can help us stay present in our digital lives. The concept of finite feeds is fascinating!",
      likes: 23,
      comments: 5,
      time: "2h",
      image: postImageFor("sarah-1"),
      avatar: avatarFor("sarah_chen"),
      category: "news",
      lowDopamine: true,
      isVerified: true
    },
    {
      id: 2,
      username: "alex_m",
      content: "Our app keeps you mindful of your time with a finite feed, gentle reminders, and low-dopamine design — helping you connect meaningfully without endless scrolling or losing hours.",
      likes: 45,
      comments: 12,
      time: "4h",
      image: postImageFor("alex-2"),
      avatar: avatarFor("alex_m"),
      category: "other",
      lowDopamine: false,
      isVerified: false
    },
    {
      id: 3,
      username: "jordan.k",
      content: "Loving the minimalist approach to social media. Sometimes less really is more when it comes to staying focused and productive.",
      likes: 18,
      comments: 3,
      time: "6h",
      image: postImageFor("jordan-3"),
      avatar: avatarFor("jordan.k"),
      category: "memes",
      lowDopamine: false,
      isVerified: false
    },
    {
      id: 4,
      username: "emma_w",
      content: "The power of intentional design in creating healthy digital habits. Every feature should serve a purpose and respect the user's time.",
      likes: 31,
      comments: 8,
      time: "8h",
      image: postImageFor("emma-4"),
      avatar: avatarFor("emma_w"),
      category: "news",
      lowDopamine: true,
      isVerified: true
    },
    {
      id: 5,
      username: "marcus.j",
      content: "Building technology that enhances rather than detracts from our real-world connections. That's the future I want to be part of.",
      likes: 67,
      comments: 15,
      time: "12h",
      image: postImageFor("marcus-5"),
      avatar: avatarFor("marcus.j"),
      category: "other",
      lowDopamine: true,
      isVerified: false
    },
    {
      id: 6,
      username: "lisa_z",
      content: "Simple reminder: your attention is your most valuable asset. Choose where to invest it wisely.",
      likes: 89,
      comments: 22,
      time: "1d",
      image: postImageFor("lisa-6"),
      avatar: avatarFor("lisa_z"),
      category: "memes",
      lowDopamine: false,
      isVerified: false
    }
  ]);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? Math.max(0, p.likes - 1) : p.likes + 1 } : p,
      ),
    );
  };


  const activeCategories: Category[] = selectedCategories && selectedCategories.length > 0 ? selectedCategories : ["memes", "news", "other"];
  const onlyLow = Boolean(lowDopamineOnly);
  const visiblePosts = posts.filter((p) => activeCategories.includes(p.category) && (!onlyLow || p.lowDopamine));

  return (
    <ScrollArea className="flex-1 h-screen main-feed-scroll">
      <div className="p-6">
        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                <div className={`w-16 h-16 rounded-full bg-muted mb-2 relative ${story.active ? 'ring-2 ring-accent ring-offset-2' : ''}`}>
                  <img
                    src={avatarFor(story.username)}
                    alt={`${story.username} story`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {story.active && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"></div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{story.username}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-border mt-6"></div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 gap-6 pb-6">
          {visiblePosts.map((post) => (
            <div key={post.id} data-post-card className="bg-card rounded-lg overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={`${post.username} avatar`} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-foreground">{post.username}</span>
                      {post.isVerified && <BadgeCheck className="w-4 h-4 text-accent" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{post.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Like"
                    onClick={() => toggleLike(post.id)}
                    className={`p-1 hover:bg-hover-bg rounded transition-colors ${post.liked ? "text-red-500" : ""}`}
                  >
                    <Heart className={`w-5 h-5 ${post.liked ? "stroke-red-500 fill-red-500" : "text-icon-color"}`} />
                  </button>
                  <button
                    aria-label="Comment"
                    onClick={(e) => {
                      const imgEl = document.getElementById(`post-image-${post.id}`);
                      const cardEl = (e.currentTarget as HTMLElement).closest('[data-post-card]') as HTMLElement | null;
                      const rect = (imgEl || cardEl)?.getBoundingClientRect();
                      if (rect && onOpenComments) onOpenComments(post, rect);
                      else if (onOpenComments) onOpenComments(post, new DOMRect(0, 0, 0, 0));
                    }}
                    className="p-1 hover:bg-hover-bg rounded transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-icon-color" />
                  </button>
                  <button
                    aria-label="Share"
                    onClick={(e) => {
                      const imgEl = document.getElementById(`post-image-${post.id}`);
                      const cardEl = (e.currentTarget as HTMLElement).closest('[data-post-card]') as HTMLElement | null;
                      const rect = (imgEl || cardEl)?.getBoundingClientRect();
                      if (rect && onOpenShare) onOpenShare(post, rect);
                      else if (onOpenShare) onOpenShare(post, new DOMRect(0, 0, 0, 0));
                    }}
                    className="p-1 hover:bg-hover-bg rounded transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-icon-color" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="h-48 bg-post-bg">
                <img id={`post-image-${post.id}`} src={post.image} alt="Post" className="w-full h-48 object-cover" />
              </div>

              {/* Post Description & Stats */}
              <div className="p-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="px-2 py-0.5 rounded bg-muted text-foreground capitalize">{post.category}</span>
                  {post.lowDopamine && <span className="px-2 py-0.5 rounded bg-muted text-foreground">Low Dopamine</span>}
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {post.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default MainFeed;
