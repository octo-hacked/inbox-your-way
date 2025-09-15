import { Heart, MessageCircle, Share2, BadgeCheck, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import type { Category, FeedPost } from "@/components/MainFeed";

export type Reel = {
  id: number;
  username: string;
  description: string;
  likes: number;
  comments: number;
  time: string;
  video: string;
  poster: string;
  avatar: string;
  category: Category;
  lowDopamine: boolean;
  isVerified: boolean;
  liked?: boolean;
};

const avatarFor = (seed: string) => `https://i.pravatar.cc/100?u=${encodeURIComponent(seed)}`;
const posterFor = (seed: string | number) => `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/600/900`;

type ReelsFeedProps = {
  onOpenComments?: (post: FeedPost, fromRect: DOMRect) => void;
  onOpenShare?: (post: FeedPost, fromRect: DOMRect) => void;
  selectedCategories?: Category[];
  lowDopamineOnly?: boolean;
  onBack?: () => void;
};

const ReelsFeed = ({ onOpenComments, onOpenShare, selectedCategories, lowDopamineOnly, onBack }: ReelsFeedProps) => {
  const [reels, setReels] = useState<Reel[]>([
    {
      id: 101,
      username: "reels_sarah",
      description: "Mindful tech tip: set a timer before scrolling.",
      likes: 230,
      comments: 12,
      time: "2h",
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: posterFor("reel-sarah"),
      avatar: avatarFor("reels_sarah"),
      category: "news",
      lowDopamine: true,
      isVerified: true,
    },
    {
      id: 102,
      username: "alex_reels",
      description: "Weekend vibes and focus tips.",
      likes: 450,
      comments: 28,
      time: "4h",
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: posterFor("reel-alex"),
      avatar: avatarFor("alex_reels"),
      category: "other",
      lowDopamine: false,
      isVerified: false,
    },
    {
      id: 103,
      username: "jordan_reels",
      description: "Minimalist workspace tour.",
      likes: 180,
      comments: 9,
      time: "6h",
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      poster: posterFor("reel-jordan"),
      avatar: avatarFor("jordan_reels"),
      category: "memes",
      lowDopamine: false,
      isVerified: false,
    },
    {
      id: 104,
      username: "emma_reels",
      description: "Intentional design = better habits.",
      likes: 310,
      comments: 18,
      time: "8h",
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      poster: posterFor("reel-emma"),
      avatar: avatarFor("emma_reels"),
      category: "news",
      lowDopamine: true,
      isVerified: true,
    },
  ]);

  const toggleLike = (id: number) => {
    setReels((prev) => prev.map((r) => (r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? Math.max(0, r.likes - 1) : r.likes + 1 } : r)));
  };

  const activeCategories: Category[] = selectedCategories && selectedCategories.length > 0 ? selectedCategories : ["memes", "news", "other"];
  const onlyLow = Boolean(lowDopamineOnly);
  const visibleReels = reels.filter((r) => activeCategories.includes(r.category) && (!onlyLow || r.lowDopamine));

  // Auto play/pause when entering viewport
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const videos = Array.from(containerRef.current?.querySelectorAll("video[data-reel]") || []);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 1] }
    );
    videos.forEach((v) => obs.observe(v));
    return () => obs.disconnect();
  }, [visibleReels.length]);

  return (
    <div className="flex-1 h-screen relative">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/50 text-white text-sm hover:bg-black/60">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
      <ScrollArea className="h-full">
        <div ref={containerRef} className="flex flex-col items-center gap-6 py-6">
          {visibleReels.map((reel) => {
            const feedPost: FeedPost = {
              id: reel.id,
              username: reel.username,
              content: reel.description,
              likes: reel.likes,
              comments: reel.comments,
              time: reel.time,
              image: reel.poster,
              avatar: reel.avatar,
              category: reel.category,
              lowDopamine: reel.lowDopamine,
              isVerified: reel.isVerified,
              liked: reel.liked,
            };
            return (
              <div key={reel.id} data-reel-card className="relative w-[380px] h-[70vh] bg-black rounded-xl overflow-hidden shadow-lg">
                <video
                  id={`reel-video-${reel.id}`}
                  data-reel
                  src={reel.video}
                  poster={reel.poster}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                />

                {/* Right action bar */}
                <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4">
                  <button
                    aria-label="Like"
                    onClick={() => toggleLike(reel.id)}
                    className={`p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors ${reel.liked ? "text-red-500" : "text-white"}`}
                  >
                    <Heart className={`w-6 h-6 ${reel.liked ? "stroke-red-500 fill-red-500" : ""}`} />
                  </button>
                  <button
                    aria-label="Comment"
                    onClick={(e) => {
                      const vidEl = document.getElementById(`reel-video-${reel.id}`);
                      const cardEl = (e.currentTarget as HTMLElement).closest('[data-reel-card]') as HTMLElement | null;
                      const rect = (vidEl || cardEl)?.getBoundingClientRect();
                      if (rect && onOpenComments) onOpenComments(feedPost, rect);
                      else if (onOpenComments) onOpenComments(feedPost, new DOMRect(0, 0, 0, 0));
                    }}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button
                    aria-label="Share"
                    onClick={(e) => {
                      const vidEl = document.getElementById(`reel-video-${reel.id}`);
                      const cardEl = (e.currentTarget as HTMLElement).closest('[data-reel-card]') as HTMLElement | null;
                      const rect = (vidEl || cardEl)?.getBoundingClientRect();
                      if (rect && onOpenShare) onOpenShare(feedPost, rect);
                      else if (onOpenShare) onOpenShare(feedPost, new DOMRect(0, 0, 0, 0));
                    }}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Bottom description */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={reel.avatar} className="w-8 h-8 rounded-full object-cover" alt={reel.username} />
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{reel.username}</span>
                      {reel.isVerified && <BadgeCheck className="w-4 h-4 text-accent" />}
                    </div>
                    <span className="ml-auto text-xs opacity-80">{reel.time}</span>
                  </div>
                  <p className="text-sm leading-tight opacity-95 line-clamp-3">{reel.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ReelsFeed;
