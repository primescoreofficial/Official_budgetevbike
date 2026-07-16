import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// --- BASE URL ----------------------------------------------------------------
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.budgetevbike.in';

// --- LOCAL EV BIKE DATABASE --------------------------------------------------
// Mirrored from app/Find-EV/page.tsx and app/bike/[id]/page.tsx.
// These are the statically-known vehicles that always exist on this site.
interface EVBike {
  id: number;
  name: string;
}

const EV_BIKE_DATABASE: EVBike[] = [
  { id: 1, name: 'Revolt RV400' },
  { id: 2, name: 'Matter AERA 5000' },
  { id: 3, name: 'Oben Rorr' },
  { id: 4, name: 'Tork Kratos R' },
  { id: 5, name: 'Ola S1 Pro Gen 2' },
  { id: 6, name: 'Ather 450X Apex' },
];

// --- STATIC ROUTES -----------------------------------------------------------
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/comparison`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/brands`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/calculator`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/Find-EV`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/charging-stations`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
];

// --- SITEMAP GENERATION ------------------------------------------------------
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Collect IDs from the local database first
  const localIds = new Set<number>(EV_BIKE_DATABASE.map((bike) => bike.id));

  // 2. Attempt to also fetch any additional bike IDs stored in Supabase
  //    so the sitemap stays complete even as the remote DB grows.
  const remoteIds = new Set<number>();

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch only the `id` column to keep the payload minimal
      const { data, error } = await supabase
        .from('bikes') // adjust table name if different in your Supabase project
        .select('id');

      if (!error && data) {
        data.forEach((row: { id: number }) => remoteIds.add(row.id));
      }
    }
  } catch {
    // Silently fall back to the local dataset if Supabase is unreachable
    // during build time (e.g., CI without env vars).
  }

  // 3. Merge local + remote IDs (local IDs are always guaranteed to be present)
  const allBikeIds = new Set<number>([...localIds, ...remoteIds]);

  // 4. Build dynamic `/bike/[id]` entries
  const bikeSitemapEntries: MetadataRoute.Sitemap = Array.from(allBikeIds).map(
    (id) => ({
      url: `${BASE_URL}/bike/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }),
  );

  // 5. Return merged sitemap: static routes first, then dynamic bike pages
  return [...STATIC_ROUTES, ...bikeSitemapEntries];
}
