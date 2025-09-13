import { Heart, MessageCircle, Send } from "lucide-react";

const MainFeed = () => {
  const stories = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    username: "username"
  }));

  const posts = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    username: "username",
    content: "Our app keeps you mindful of your time with a finite feed, gentle reminders, and low-dopamine design — helping you connect meaningfully without endless scrolling or losing hours."
  }));

  return (
    <div className="flex-1 p-6">
      {/* Stories Section */}
      <div className="mb-8">
        <div className="flex gap-4 items-center">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted mb-2"></div>
              <span className="text-sm text-muted-foreground">{story.username}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-px bg-border mt-6"></div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-card rounded-lg overflow-hidden">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted"></div>
                <span className="text-sm font-medium text-foreground">{post.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-hover-bg rounded transition-colors">
                  <Heart className="w-5 h-5 text-icon-color" />
                </button>
                <button className="p-1 hover:bg-hover-bg rounded transition-colors">
                  <MessageCircle className="w-5 h-5 text-icon-color" />
                </button>
                <button className="p-1 hover:bg-hover-bg rounded transition-colors">
                  <Send className="w-5 h-5 text-icon-color" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="h-48 bg-post-bg"></div>

            {/* Post Description */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {post.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainFeed;