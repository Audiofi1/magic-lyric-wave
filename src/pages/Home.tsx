import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Sparkles, Wallet } from "lucide-react";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleCreateSong = () => {
    if (prompt.trim()) {
      navigate("/creating", { state: { text: prompt, genre: "Auto-vibe" } });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && prompt.trim()) {
      handleCreateSong();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="container mx-auto flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <Music className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              LyricDrop
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="bg-white text-black border-0 hover:bg-white/90 font-medium"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-text-reveal">
            Make any song
            <br />
            you can imagine
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-text-reveal-delay">
            Start with a simple prompt or dive into our pro editing tools, your next track is just a step away.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-2 flex items-center gap-3">
            <Input
              placeholder="Chat to make music"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-0 text-white text-lg placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Advanced
            </Button>
            <Button
              onClick={handleCreateSong}
              disabled={!prompt.trim()}
              className="bg-black hover:bg-black/80 text-white font-semibold px-6 h-12 rounded-xl border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              Create
            </Button>
          </div>
        </div>

        {/* Features hint */}
        <div className="mt-8 flex items-center gap-2 text-white/60 text-sm">
          <span>✨ Turn any text into a professional song in seconds</span>
        </div>
      </main>

      {/* Footer - Logo Cloud */}
      <footer className="relative z-10 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-8 opacity-40 flex-wrap">
            <span className="text-white/60 text-sm font-medium">Featured in</span>
            <span className="text-white/60 text-sm">Rolling Stone</span>
            <span className="text-white/60 text-sm">Billboard</span>
            <span className="text-white/60 text-sm">Forbes</span>
            <span className="text-white/60 text-sm">Wired</span>
          </div>
          <p className="text-center text-white/40 text-xs mt-6">
            Powered by Story Protocol
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
