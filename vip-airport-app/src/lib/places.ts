/**
 * Google Places client for Aviar VIP.
 *
 * Provides typed Autocomplete + Place Details lookups so a rider can type any
 * address (à la Uber). When no Google Maps API key is configured — or when a
 * network/parse error occurs — we gracefully fall back to the curated
 * DEMO_PICKUPS so the experience never dead-ends in demo/offline mode.
 *
 * Dependency-free: uses the global `fetch`. Results are restricted to South
 * Africa (components=country:za) to keep suggestions relevant.
 */

import { env } from './env';
import type { Place } from '@/types';
import { DEMO_PICKUPS } from '@/constants/demo';

/** A single autocomplete row, decoupled from the Google response shape. */
export interface PlaceSuggestion {
  /** Stable identifier. Demo rows use `demo:<index>`; live rows use place_id. */
  id: string;
  /** Bold primary line (e.g. business / street name). */
  primary: string;
  /** Muted secondary line (e.g. city / region). */
  secondary?: string;
}

/* ----------------------------- Parsed JSON types --------------------------- */
/* Narrow, intentionally-partial shapes for the Google JSON we actually read.  */

interface AutocompletePrediction {
  place_id: string;
  description?: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
}

interface AutocompleteResponse {
  predictions?: AutocompletePrediction[];
}

interface PlaceDetailsResponse {
  result?: {
    name?: string;
    formatted_address?: string;
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  };
}

const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

/** Prefix used to tag suggestions that map back to a DEMO_PICKUPS entry. */
const DEMO_PREFIX = 'demo:';

/**
 * Filter the curated demo pickups by a free-text query (case-insensitive over
 * both label and address) and map them to suggestion rows.
 */
function demoSuggestions(query: string): PlaceSuggestion[] {
  const q = query.trim().toLowerCase();
  return DEMO_PICKUPS.map((place, index) => ({ place, index }))
    .filter(({ place }) => {
      const haystack = `${place.label} ${place.address ?? ''}`.toLowerCase();
      return haystack.includes(q);
    })
    .map(({ place, index }) => ({
      id: `${DEMO_PREFIX}${index}`,
      primary: place.label,
      secondary: place.address,
    }));
}

/**
 * Search for places matching `query`.
 *
 * - Queries shorter than 2 trimmed characters return `[]`.
 * - Without an API key (or on any failure) we fall back to the demo pickups.
 */
export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  if (query.trim().length < 2) {
    return [];
  }

  // No key configured → demo mode.
  if (!env.googleMapsApiKey) {
    return demoSuggestions(query);
  }

  try {
    const url =
      `${AUTOCOMPLETE_URL}?input=${encodeURIComponent(query)}` +
      `&key=${encodeURIComponent(env.googleMapsApiKey)}` +
      `&components=country:za`;

    const res = await fetch(url);
    const json = (await res.json()) as AutocompleteResponse;
    const predictions = json.predictions ?? [];

    return predictions.map((p) => ({
      id: p.place_id,
      primary: p.structured_formatting?.main_text ?? p.description ?? '',
      secondary: p.structured_formatting?.secondary_text,
    }));
  } catch {
    // Network/parse failure → keep the rider moving with demo data.
    return demoSuggestions(query);
  }
}

/**
 * Resolve a chosen suggestion into a fully-located {@link Place}.
 *
 * - Demo suggestions resolve directly from DEMO_PICKUPS.
 * - Live suggestions hit Place Details for geometry + formatted address.
 *
 * @throws if a live place cannot be resolved (no key, network error, or the
 *         response is missing coordinates).
 */
export async function resolvePlace(
  suggestion: PlaceSuggestion,
): Promise<Place> {
  // Demo path: parse the index back out of the id.
  if (suggestion.id.startsWith(DEMO_PREFIX)) {
    const index = Number.parseInt(suggestion.id.slice(DEMO_PREFIX.length), 10);
    const place = DEMO_PICKUPS[index];
    if (!place) {
      throw new Error(`Unknown demo pickup: ${suggestion.id}`);
    }
    return place;
  }

  if (!env.googleMapsApiKey) {
    throw new Error('Cannot resolve place: Google Maps API key is not set.');
  }

  let json: PlaceDetailsResponse;
  try {
    const url =
      `${DETAILS_URL}?place_id=${encodeURIComponent(suggestion.id)}` +
      `&key=${encodeURIComponent(env.googleMapsApiKey)}` +
      `&fields=geometry,name,formatted_address`;

    const res = await fetch(url);
    json = (await res.json()) as PlaceDetailsResponse;
  } catch (cause) {
    throw new Error(`Failed to fetch place details for ${suggestion.id}`, {
      cause,
    });
  }

  const location = json.result?.geometry?.location;
  if (
    !json.result ||
    typeof location?.lat !== 'number' ||
    typeof location?.lng !== 'number'
  ) {
    throw new Error(`No coordinates returned for place ${suggestion.id}`);
  }

  return {
    label: json.result.name ?? suggestion.primary,
    address: json.result.formatted_address,
    lat: location.lat,
    lng: location.lng,
  };
}
