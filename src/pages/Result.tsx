import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Share2, 
  Scissors, 
  ArrowLeft, 
  Music, 
  CheckCircle2,
  ExternalLink,
  Clock,
  Shield,
  Sparkles
} from "lucide-react";
import { useState } from "react";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { text, genre } = location.state || { text: "Your amazing lyrics", genre: "Auto-vibe" };
  
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data for demonstration
  const mockIpAssetId = "0x" + Math.random().toString(16).substr(2, 40);
  const mockWalletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  const mockTimestamp = new Date().toISOString();

  const generatedLyrics = `${text}\n\nIn the rhythm of the night\nWhere dreams come alive\nWe're dancing in the light\nFeeling so alive`;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Song is Ready!
            </h1>
            <p className="text-muted-foreground">Generated in {genre} style</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main player section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio player card */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Audio Player
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Waveform visualization */}
                <div className="flex items-center justify-center gap-1 h-32 bg-white/10 rounded-xl p-4">
                  {[...Array(60)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-black rounded-full transition-all ${
                        isPlaying ? "animate-wave" : ""
                      }`}
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Play controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="rounded-full w-16 h-16 bg-black text-white hover:bg-black/80"
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </Button>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="glass" size="lg">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button variant="glass" size="lg">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="glass" size="lg">
                    <Scissors className="w-4 h-4" />
                    Create Clip
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lyrics card */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle>Generated Lyrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/30 rounded-xl p-6">
                  <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                    {generatedLyrics}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {genre}
                  </span>
                  <span className="px-3 py-1 bg-accent/20 text-white rounded-full text-sm">
                    Energetic
                  </span>
                  <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm">
                    Uplifting
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Story IP Ownership Card */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-primary/30 sticky top-8">
              <CardHeader className="border-b border-border/30 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">
                    Registered On-Chain
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Your song is protected by Story Protocol
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* IP Asset ID */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    IP Asset ID
                  </label>
                  <div className="mt-1 p-3 bg-secondary/30 rounded-lg">
                    <code className="text-xs text-primary break-all">
                      {mockIpAssetId}
                    </code>
                  </div>
                </div>

                {/* Owner */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Owner
                  </label>
                  <div className="mt-1 p-3 bg-secondary/30 rounded-lg">
                    <code className="text-xs text-foreground/80 break-all">
                      {mockWalletAddress}
                    </code>
                  </div>
                </div>

                {/* License */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    License Type
                  </label>
                  <div className="mt-1">
                    <Button className="w-full bg-black text-white hover:bg-black/80">
                      Open Remix License
                    </Button>
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Registered
                  </label>
                  <div className="mt-1">
                    <p className="text-sm text-foreground/80">
                      {new Date(mockTimestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action links */}
                <div className="space-y-2 pt-4 border-t border-border/30">
                  <Button variant="outline" className="w-full justify-between" size="lg">
                    View Provenance
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between" size="lg">
                    Enable Remixing
                    <Sparkles className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between" size="lg">
                    Set Royalty Split
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom action */}
        <div className="mt-8 text-center">
          <Button
            size="xl"
            onClick={() => navigate("/")}
            className="bg-black text-white hover:bg-black/80"
          >
            <Sparkles className="w-5 h-5" />
            Create Another Song
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
