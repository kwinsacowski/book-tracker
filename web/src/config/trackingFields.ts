export type OptionalTrackingFieldKey =
  | "category"
  | "seriesOrder"
  | "standaloneOrSeries"
  | "seriesStatus"
  | "tropes"
  | "spiceLevel"
  | "rating"
  | "audiobookAvailable";

export type TrackingFieldDefinition = {
  key: OptionalTrackingFieldKey;
  label: string;
  description: string;
};

export const OPTIONAL_TRACKING_FIELDS: TrackingFieldDefinition[] = [
  {
    key: "category",
    label: "Category",
    description: "Track whether this is romance, fantasy, thriller, and more.",
  },
  {
    key: "seriesOrder",
    label: "Series Order",
    description: "Track where a book falls within a series.",
  },
  {
    key: "standaloneOrSeries",
    label: "Standalone or Series",
    description: "Track whether the book stands alone or belongs to a series.",
  },
  {
    key: "seriesStatus",
    label: "Series Status",
    description: "Track whether the series is ongoing, complete, or unknown.",
  },
  {
    key: "tropes",
    label: "Tropes",
    description: "Track notable themes and tropes.",
  },
  {
    key: "spiceLevel",
    label: "Spice Level",
    description: "Track spice level for the book.",
  },
  {
    key: "rating",
    label: "Rating",
    description: "Track your personal star rating.",
  },
  {
    key: "audiobookAvailable",
    label: "Audiobook",
    description: "Track whether an audiobook version is available.",
  },
];