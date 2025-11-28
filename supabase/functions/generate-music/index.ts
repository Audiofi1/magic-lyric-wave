import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lyrics, genre } = await req.json();
    console.log('Music generation requested for genre:', genre);

    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY');
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not configured');
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    });

    // Create a prompt that combines lyrics intent and genre
    const prompt = `${genre} music, ${lyrics.substring(0, 200)}`;
    
    console.log('Generating music with MusicGen...');
    const output = await replicate.run(
      "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      {
        input: {
          prompt: prompt,
          model_version: "stereo-large",
          duration: 30,
          temperature: 1.0,
          top_k: 250,
          top_p: 0.0,
          classifier_free_guidance: 3
        }
      }
    );

    console.log('Music generated successfully:', output);
    
    // MusicGen returns an audio URL
    const audioUrl = Array.isArray(output) ? output[0] : output;

    return new Response(JSON.stringify({ 
      audioUrl,
      message: "Music generated successfully with MusicGen!"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-music:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
