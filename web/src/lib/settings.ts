import {
  OPTIONAL_TRACKING_FIELDS,
  type OptionalTrackingFieldKey,
} from "@/config/trackingFields";

export type FieldDisplaySettings = {
  tracked: boolean;
  showOnDashboard: boolean;
  showOnSingleBook: boolean;
};

export type TrackingSettings = Record<
  OptionalTrackingFieldKey,
  FieldDisplaySettings
>;

const SETTINGS_KEY = "tracking-settings";

function buildDefaultSettings(): TrackingSettings {
  return OPTIONAL_TRACKING_FIELDS.reduce((acc, field) => {
    acc[field.key] = {
      tracked: true,
      showOnDashboard: false,
      showOnSingleBook: true,
    };
    return acc;
  }, {} as TrackingSettings);
}

export function getDefaultTrackingSettings(): TrackingSettings {
  return buildDefaultSettings();
}

export function getTrackingSettings(): TrackingSettings {
  if (typeof window === "undefined") {
    return buildDefaultSettings();
  }

  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    return buildDefaultSettings();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<TrackingSettings>;
    const defaults = buildDefaultSettings();

    for (const key of Object.keys(defaults) as OptionalTrackingFieldKey[]) {
      defaults[key] = {
        ...defaults[key],
        ...(parsed[key] ?? {}),
      };
    }

    return defaults;
  } catch {
    return buildDefaultSettings();
  }
}

export function saveTrackingSettings(settings: TrackingSettings) {
  if (typeof window === "undefined") return;

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("tracking-settings-change"));
}

export function resetTrackingSettings() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SETTINGS_KEY);
  window.dispatchEvent(new Event("tracking-settings-change"));
}