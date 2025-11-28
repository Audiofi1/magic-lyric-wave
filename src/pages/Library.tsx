import { Music, Clock, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const navigate = useNavigate();

  const songs = [
    { id: 1, title: 'My First Song', date: '2024-01-15', likes: 24 },
    { id: 2, title: 'Sunset Vibes', date: '2024-01-14', likes: 18 },
    { id: 3, title: 'Morning Coffee', date: '2024-01-13', likes: 32 },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">My Library</h1>
          <Button onClick={() => navigate('/')} variant="outline" className="bg-white/10 text-white border-white/20">
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <Card key={song.id} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Music className="w-12 h-12 text-white" />
                  <Heart className="w-5 h-5 text-white/60" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{song.title}</h3>
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {song.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {song.likes}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
