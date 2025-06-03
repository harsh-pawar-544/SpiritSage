import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const UNSPLASH_ACCESS_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!UNSPLASH_ACCESS_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function searchUnsplashImage(query: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)} drink&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return null;
  } catch (error) {
    console.error(`Error searching Unsplash for ${query}:`, error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch all spirits
    const { data: spirits, error: fetchError } = await supabase
      .from('alcohol_types')
      .select('id, name, image_url');

    if (fetchError) throw fetchError;

    const updates = [];
    const results = [];

    // Process each spirit
    for (const spirit of spirits) {
      const imageUrl = await searchUnsplashImage(spirit.name);
      if (imageUrl) {
        const { error: updateError } = await supabase
          .from('alcohol_types')
          .update({ image_url: imageUrl })
          .eq('id', spirit.id);

        if (updateError) {
          results.push({ name: spirit.name, status: 'error', error: updateError.message });
        } else {
          results.push({ name: spirit.name, status: 'success', imageUrl });
        }
      } else {
        results.push({ name: spirit.name, status: 'skipped', reason: 'No image found' });
      }

      // Wait a bit between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});