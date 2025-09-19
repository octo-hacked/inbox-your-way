import { useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import BottomBar from "@/components/BottomBar";
import { useAuth } from "@/context/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const avatarFor = (seed: string) => `https://i.pravatar.cc/200?u=${encodeURIComponent(seed)}`;
const coverFor = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/300`;
const postImageFor = (seed: string | number) => `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/600/600`;

export default function Profile() {
  const { user } = useAuth();

  const profile = useMemo(() => {
    const fallbackName = "Alex Johnson";
    const fallbackUsername = "alex_j";
    const name = user?.fullname || fallbackName;
    const username = user?.username || fallbackUsername;
    return {
      id: user?.id || "demo",
      name,
      username,
      email: user?.email || "alex@example.com",
      avatar: user?.avatar || avatarFor(username),
      cover: user?.coverImage || coverFor(username),
      bio:
        "Designing calmer social experiences. Coffee enthusiast. Weekend photographer.",
      stats: { posts: 9, followers: 1_248, following: 312 },
    };
  }, [user]);

  const posts = useMemo(() => {
    return Array.from({ length: profile.stats.posts }).map((_, i) => ({
      id: i + 1,
      image: postImageFor(`${profile.username}-${i}`),
      alt: `Post ${i + 1}`,
    }));
  }, [profile.stats.posts, profile.username]);

  // Sidebar controls (not used on this page but required by component props)
  const allCats = ["memes", "news", "other"] as const;

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar
          monochrome={false}
          onToggleMonochrome={() => {}}
          selectedCategories={[...allCats] as any}
          onToggleCategory={() => {}}
          onSelectAllCategories={() => {}}
          lowDopamineOnly={false}
          onToggleLowDopamine={() => {}}
        />
      </div>

      <main className="flex-1 h-screen overflow-hidden">
        <ScrollArea className="h-full">
          <div className="min-h-full pb-24">
            <div className="w-full h-40 md:h-48 bg-muted relative">
              <img src={profile.cover} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute -bottom-10 left-4 flex items-end gap-4">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-background object-cover"
                />
                <div className="pb-2">
                  <div className="text-lg md:text-xl font-semibold text-foreground leading-tight">{profile.name}</div>
                  <div className="text-sm text-muted-foreground">@{profile.username}</div>
                </div>
              </div>
            </div>

            <div className="px-4 md:px-6 mt-12">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="text-sm text-muted-foreground max-w-prose">{profile.bio}</div>
                <div className="md:ml-auto flex gap-2">
                  <Button variant="outline">Share Profile</Button>
                  <Button>Edit Profile</Button>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm">
                <div><span className="font-semibold text-foreground">{profile.stats.posts}</span> posts</div>
                <div><span className="font-semibold text-foreground">{profile.stats.followers}</span> followers</div>
                <div><span className="font-semibold text-foreground">{profile.stats.following}</span> following</div>
                <div className="ml-auto text-muted-foreground">{profile.email}</div>
              </div>

              <div className="h-px w-full bg-border my-6" />

              <h2 className="text-base font-semibold mb-3">Posts</h2>
              {posts.length === 0 ? (
                <div className="text-sm text-muted-foreground">No posts yet.</div>
              ) : (
                <div className="grid grid-cols-3 gap-1 md:gap-3">
                  {posts.map((p) => (
                    <div key={p.id} className="bg-post-bg aspect-square overflow-hidden rounded md:rounded-md">
                      <img src={p.image} alt={p.alt} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </main>

      <BottomBar
        monochrome={false}
        onToggleMonochrome={() => {}}
        selectedCategories={[...allCats] as any}
        onToggleCategory={() => {}}
        onSelectAllCategories={() => {}}
        lowDopamineOnly={false}
        onToggleLowDopamine={() => {}}
      />
    </div>
  );
}
