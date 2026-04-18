"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./settings.module.css";
import {
  OPTIONAL_TRACKING_FIELDS,
  type OptionalTrackingFieldKey,
} from "@/config/trackingFields";
import {
  getTrackingSettings,
  resetTrackingSettings,
  saveTrackingSettings,
  type TrackingSettings,
} from "@/lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<TrackingSettings | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setSettings(getTrackingSettings());
  }, []);

  const trackedCount = useMemo(() => {
    if (!settings) return 0;
    return Object.values(settings).filter((item) => item.tracked).length;
  }, [settings]);

  const dashboardCount = useMemo(() => {
    if (!settings) return 0;
    return Object.values(settings).filter((item) => item.showOnDashboard).length;
  }, [settings]);

  const singleBookCount = useMemo(() => {
    if (!settings) return 0;
    return Object.values(settings).filter((item) => item.showOnSingleBook).length;
  }, [settings]);

  function updateField(
    key: OptionalTrackingFieldKey,
    field: "tracked" | "showOnDashboard" | "showOnSingleBook",
    value: boolean,
  ) {
    setSettings((current) => {
      if (!current) return current;

      const next: TrackingSettings = {
        ...current,
        [key]: {
          ...current[key],
          [field]: value,
        },
      };

      if (field === "tracked" && !value) {
        next[key] = {
          tracked: false,
          showOnDashboard: false,
          showOnSingleBook: false,
        };
      }

      return next;
    });
  }

  function handleSave() {
    if (!settings) return;
    saveTrackingSettings(settings);
    setSavedMessage("Settings saved.");
    window.setTimeout(() => setSavedMessage(""), 2000);
  }

  function handleReset() {
    resetTrackingSettings();
    setSettings(getTrackingSettings());
    setSavedMessage("Settings reset to defaults.");
    window.setTimeout(() => setSavedMessage(""), 2000);
  }

  if (!settings) {
    return (
      <div className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.card}>Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Preferences</p>
          <h1 className={styles.title}>Tracking Settings</h1>
          <p className={styles.subtitle}>
            Choose which optional fields you want to track and where they should
            appear throughout Inkling Shelf.
          </p>

          <div className={styles.summaryRow}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Tracked fields</span>
              <strong className={styles.summaryValue}>{trackedCount}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Shown on dashboard</span>
              <strong className={styles.summaryValue}>{dashboardCount}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Shown on single book</span>
              <strong className={styles.summaryValue}>{singleBookCount}</strong>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.tableHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Optional Tracking Fields</h2>
              <p className={styles.sectionText}>
                Turning off tracking also turns off display options for that
                field.
              </p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleReset}
                className={styles.secondaryButton}
              >
                Reset Defaults
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={styles.primaryButton}
              >
                Save Settings
              </button>
            </div>
          </div>

          {savedMessage ? (
            <div className={styles.savedMessage}>{savedMessage}</div>
          ) : null}

          <div className={styles.table}>
            <div className={styles.tableHead}>
              <div>Field</div>
              <div>Track</div>
              <div>Dashboard</div>
              <div>Single Book</div>
            </div>

            {OPTIONAL_TRACKING_FIELDS.map((field) => {
              const current = settings[field.key];

              return (
                <div key={field.key} className={styles.row}>
                  <div className={styles.fieldCell}>
                    <p className={styles.fieldLabel}>{field.label}</p>
                    <p className={styles.fieldDescription}>
                      {field.description}
                    </p>
                  </div>

                  <label className={styles.toggleCell}>
                    <input
                      type="checkbox"
                      checked={current.tracked}
                      onChange={(e) =>
                        updateField(field.key, "tracked", e.target.checked)
                      }
                    />
                  </label>

                  <label className={styles.toggleCell}>
                    <input
                      type="checkbox"
                      checked={current.showOnDashboard}
                      disabled={!current.tracked}
                      onChange={(e) =>
                        updateField(
                          field.key,
                          "showOnDashboard",
                          e.target.checked,
                        )
                      }
                    />
                  </label>

                  <label className={styles.toggleCell}>
                    <input
                      type="checkbox"
                      checked={current.showOnSingleBook}
                      disabled={!current.tracked}
                      onChange={(e) =>
                        updateField(
                          field.key,
                          "showOnSingleBook",
                          e.target.checked,
                        )
                      }
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}