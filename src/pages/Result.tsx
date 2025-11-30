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
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { text, genre, lyrics, audioUrl, message } = location.state || { 
    text: "Your amazing lyrics", 
    genre: "Auto-vibe",
    lyrics: "No lyrics generated",
    audioUrl: "",
    message: ""
  };
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [songSaved, setSongSaved] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock data for demonstration
  const mockIpAssetId = "0x" + Math.random().toString(16).substr(2, 40);
  const mockWalletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  const mockTimestamp = new Date().toISOString();

  useEffect(() => {
    if (message) {
      toast.info(message);
    }
    saveSongToDatabase();
  }, [message]);

  const saveSongToDatabase = async () => {
    if (songSaved || isSaving) return;
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to save your song');
        navigate('/auth');
        return;
      }

      // Generate image for the song
      toast.info('Generating album cover...');
      const { data: imageData, error: imageError } = await supabase.functions.invoke(
        'generate-song-image',
        {
          body: { title: text, genre }
        }
      );

      let generatedImageUrl = "";
      if (imageError) {
        console.error('Failed to generate image:', imageError);
        toast.error('Could not generate album cover');
      } else if (imageData?.imageUrl) {
        generatedImageUrl = imageData.imageUrl;
        setImageUrl(generatedImageUrl);
      }

      // Save song to database
      const { error: saveError } = await supabase
        .from('songs')
        .insert({
          user_id: user.id,
          title: text,
          lyrics: lyrics,
          genre: genre,
          audio_url: audioUrl,
          image_url: generatedImageUrl || null,
        });

      if (saveError) throw saveError;
      
      setSongSaved(true);
      toast.success('Song saved to your library!');
    } catch (error: any) {
      console.error('Error saving song:', error);
      toast.error('Failed to save song');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
            <h1 className="text-3xl font-bold text-white">
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
                {/* Album cover image */}
                {imageUrl && (
                  <div className="flex justify-center">
                    <img 
                      src={imageUrl} 
                      alt="Album Cover" 
                      className="w-64 h-64 rounded-xl object-cover shadow-lg"
                    />
                  </div>
                )}
                
                {isSaving && !imageUrl && (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-white/60">Generating album cover...</p>
                  </div>
                )}

                {/* Audio element */}
                {audioUrl && (
                  <audio 
                    ref={audioRef} 
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                )}

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
                    onClick={togglePlay}
                    disabled={!audioUrl}
                    className="rounded-full w-16 h-16 bg-black text-white hover:bg-black/80 disabled:opacity-50"
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
                    {lyrics}
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
                    <code className="text-xs text-white break-all">
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
