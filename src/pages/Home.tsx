import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Music } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const genres = [
  "Auto-vibe",
  "Pop",
  "R&B",
  "Trap",
  "Afro",
  "Lofi",
  "Metal",
  "Ballad",
];

const Home = () => {
  const [text, setText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Auto-vibe");
  const navigate = useNavigate();

  const handleCreateSong = () => {
    if (text.trim()) {
      navigate("/creating", { state: { text, genre: selectedGenre } });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Music className="w-8 h-8 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LyricDrop
            </h1>
          </div>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            Turn any text into a professional song in 3 seconds
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <div className="glass-card rounded-3xl p-8 md:p-12 animate-slide-up">
          {/* Text input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4 text-foreground">
              What's on your mind?
            </label>
            <Textarea
              placeholder="Type anything and turn it into a song... a meme, a tweet, a love note, or just random thoughts"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] text-lg bg-background/50 border-border/50 focus:border-primary resize-none rounded-2xl"
            />
          </div>

          {/* Genre selector */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4 text-foreground">
              Pick a vibe
            </label>
            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "magic" : "glass"}
                  size="lg"
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre ? "" : "hover:border-primary/50"}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Magic button */}
          <Button
            variant="magic"
            size="xl"
            className="w-full"
            onClick={handleCreateSong}
            disabled={!text.trim()}
          >
            <Sparkles className="w-6 h-6" />
            Turn Into Song
            <Sparkles className="w-6 h-6" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8">
        <p className="text-center text-xs text-muted-foreground">
          Powered by Story Protocol
        </p>
      </footer>
    </div>
  );
};

export default Home;
