/**
 * Curated, theme-relevant stock photography for marketing surfaces (blogs, work
 * albums, initiative cards). These replace the old random `picsum.photos`
 * placeholders that didn't match a blood-donation NGO.
 *
 * Source: Unsplash — free to use under the Unsplash License
 * (https://unsplash.com/license), no attribution required. URLs are pinned to
 * specific photo IDs and were verified to resolve (HTTP 200).
 *
 * When the org has its own event photography, swap these out here (one place)
 * or move the images into the gallery/blog CMS.
 */

const BASE = 'https://images.unsplash.com/photo-';
/** Standard transform: auto format, cropped, ~70 quality. Pass a width. */
const tx = (w: number) => `?auto=format&fit=crop&w=${w}&q=70`;

/** Build a themed photo URL at a given render width. */
function photo(id: string, width = 1200): string {
  return `${BASE}${id}${tx(width)}`;
}

/** Named, blood/health/community-themed photos. */
export const THEME_PHOTO_IDS = {
  bloodDonationArm: '1612277795421-9bc7706a4a34',
  bloodBagsLab: '1615461066841-6116e61058f4',
  labTestTubes: '1584515933487-779824d29309',
  medicalTeam: '1576091160550-2173dba999ef',
  doctorHand: '1579154204601-01588f351e67',
  nursePatient: '1559757148-5c350d0d3c56',
  hospitalRoom: '1582719508461-905c673771fd',
  volunteersHands: '1530026405186-ed1f139313f8',
  communityGroup: '1488521787991-ed7bbaae773c',
  ramadanMosque: '1542884748-2b87b36c6b90',
} as const;

export type ThemePhotoKey = keyof typeof THEME_PHOTO_IDS;

/** Get a themed photo URL by name. */
export function themePhoto(key: ThemePhotoKey, width = 1200): string {
  return photo(THEME_PHOTO_IDS[key], width);
}

/** Ordered list for galleries that need a rotating set of distinct images. */
const GALLERY_ORDER: ThemePhotoKey[] = [
  'bloodDonationArm', 'communityGroup', 'volunteersHands', 'medicalTeam',
  'labTestTubes', 'nursePatient', 'hospitalRoom', 'doctorHand',
  'bloodBagsLab', 'ramadanMosque',
];

/** Pick a deterministic gallery photo for a given index (wraps around). */
export function galleryPhoto(index: number, width = 1200): string {
  const key = GALLERY_ORDER[index % GALLERY_ORDER.length];
  return photo(THEME_PHOTO_IDS[key], width);
}
