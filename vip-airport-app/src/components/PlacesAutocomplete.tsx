/**
 * PlacesAutocomplete
 *
 * A controlled address input with a debounced suggestion dropdown, styled for
 * the Aviar VIP dark-luxury theme. Backed by `src/lib/places`, which talks to
 * Google Places when a key is configured and falls back to curated demo
 * pickups otherwise.
 *
 * Usage:
 *   <PlacesAutocomplete
 *     label="Pickup"
 *     value={pickup}
 *     onSelect={setPickup}
 *   />
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppText } from '@/components/ui';
import { palette, radius, spacing } from '@/constants/theme';
import type { Place } from '@/types';
import {
  searchPlaces,
  resolvePlace,
  type PlaceSuggestion,
} from '@/lib/places';

type Props = {
  label?: string;
  placeholder?: string;
  value?: Place | null;
  onSelect: (place: Place) => void;
};

/** How long to wait after the last keystroke before querying. */
const DEBOUNCE_MS = 300;
/** Cap the dropdown so it never dominates the screen. */
const MAX_SUGGESTIONS = 5;

export function PlacesAutocomplete({
  label,
  placeholder = 'Search address…',
  value,
  onSelect,
}: Props) {
  // Raw text in the field. While not editing, we display value.label instead.
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guards against out-of-order async results updating state after unmount.
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /**
   * Debounced search: re-armed on every keystroke. Only runs while the field
   * is being edited so selecting a value doesn't immediately re-query.
   */
  useEffect(() => {
    if (!editing) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      void (async () => {
        try {
          const results = await searchPlaces(trimmed);
          if (!mountedRef.current) return;
          setSuggestions(results.slice(0, MAX_SUGGESTIONS));
        } finally {
          if (mountedRef.current) {
            setLoading(false);
          }
        }
      })();
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, editing]);

  /** Resolve a chosen suggestion to a Place and bubble it up. */
  async function handleSelect(suggestion: PlaceSuggestion) {
    setLoading(true);
    try {
      const place = await resolvePlace(suggestion);
      if (!mountedRef.current) return;
      onSelect(place);
      setSuggestions([]);
      setQuery('');
      setEditing(false);
      inputRef.current?.blur();
    } catch {
      // Resolution failed — keep the dropdown so the rider can retry/pick another.
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }

  // When not editing and a value exists, show its label; otherwise the query.
  const displayValue = !editing && value ? value.label : query;
  const showDropdown = editing && (loading || suggestions.length > 0);

  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="label" color={palette.textMuted} style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View style={styles.inputWrap}>
        <TextInput
          ref={inputRef}
          value={displayValue}
          placeholder={placeholder}
          placeholderTextColor={palette.textFaint}
          style={styles.input}
          onFocus={() => setEditing(true)}
          onChangeText={(text) => {
            // Any typing implies an active edit session.
            if (!editing) setEditing(true);
            setQuery(text);
          }}
          returnKeyType="search"
          autoCorrect={false}
        />
        {loading ? (
          <ActivityIndicator
            color={palette.gold}
            style={styles.spinner}
            size="small"
          />
        ) : null}
      </View>

      {showDropdown ? (
        <View style={styles.dropdown}>
          {suggestions.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => void handleSelect(item)}
              style={({ pressed }) => [
                styles.row,
                index > 0 && styles.rowBorder,
                pressed && styles.rowPressed,
              ]}
            >
              <AppText variant="body" numberOfLines={1}>
                {item.primary}
              </AppText>
              {item.secondary ? (
                <AppText
                  variant="caption"
                  color={palette.textMuted}
                  numberOfLines={1}
                  style={styles.secondary}
                >
                  {item.secondary}
                </AppText>
              ) : null}
            </Pressable>
          ))}

          {/* Empty-but-loading state: spinner above already signals progress. */}
          {!loading && suggestions.length === 0 ? (
            <View style={styles.row}>
              <AppText variant="caption" color={palette.textFaint}>
                No matches
              </AppText>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputWrap: {
    justifyContent: 'center',
  },
  input: {
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    color: palette.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    // Leave space for the trailing spinner.
    paddingRight: spacing.xl + spacing.lg,
  },
  spinner: {
    position: 'absolute',
    right: spacing.lg,
  },
  dropdown: {
    marginTop: spacing.xs,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  rowPressed: {
    backgroundColor: palette.surfaceAlt,
  },
  secondary: {
    marginTop: 2,
  },
});

export default PlacesAutocomplete;
