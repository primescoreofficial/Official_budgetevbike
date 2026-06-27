import { createClient } from '@supabase/supabase-js';
import bikeImages from './bikeImagesMap.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Resolves the image URL for a given brand and bike model.
 * It first searches the local EV_Bike catalog mapped in `bikeImagesMap.json`.
 * If found, it returns the local public path.
 * If not found, it falls back to the Supabase Storage public URL.
 */
export function getBikeImageUrl(brandName: string, bikeName: string): string {
  if (!brandName || !bikeName) return '/logo.png';

  const cleanedBrand = brandName.trim().toLowerCase();
  const cleanedBike = bikeName.trim().toLowerCase();

  // 1. Try to find direct parent folder match (or close match)
  const brandFolderFiles = bikeImages.filter(img => {
    const parentLower = img.Parent.toLowerCase();
    return parentLower === cleanedBrand || parentLower.includes(cleanedBrand) || cleanedBrand.includes(parentLower);
  });

  if (brandFolderFiles.length > 0) {
    // 2. Try to find file that matches the bikeName/modelName closest
    const matchedFile = brandFolderFiles.find(img => {
      const nameLower = img.Name.toLowerCase();
      const nameWithoutExt = nameLower.replace(/\.[^/.]+$/, "");
      return nameWithoutExt.includes(cleanedBike) || cleanedBike.includes(nameWithoutExt);
    });

    if (matchedFile) {
      return `/EV_Bike/${encodeURIComponent(matchedFile.Parent)}/${encodeURIComponent(matchedFile.Name)}`;
    }

    // Fallback to first image in the brand folder
    return `/EV_Bike/${encodeURIComponent(brandFolderFiles[0].Parent)}/${encodeURIComponent(brandFolderFiles[0].Name)}`;
  }

  // 3. Fallback: Supabase Public URL
  const { data } = supabase.storage
    .from('ev-bike')
    .getPublicUrl(`${brandName.trim()}/${bikeName.trim()}.png`);

  return data?.publicUrl || '/logo.png';
}
