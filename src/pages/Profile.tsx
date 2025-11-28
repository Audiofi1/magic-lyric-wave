import { User, Music, Heart, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Songs Created', value: '12', icon: Music },
    { label: 'Total Likes', value: '248', icon: Heart },
    { label: 'Achievements', value: '5', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <Button onClick={() => navigate('/')} variant="outline" className="bg-white/10 text-white border-white/20">
            Back to Home
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Music Creator</h2>
                <p className="text-white/60">Member since January 2024</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-lg p-4">
                  <stat.icon className="w-6 h-6 text-white/60 mb-2" />
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full bg-white/5 text-white border-white/20">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full bg-white/5 text-white border-white/20">
              Notification Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
