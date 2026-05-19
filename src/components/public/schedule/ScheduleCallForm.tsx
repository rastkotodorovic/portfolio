"use client";

import { Button, Column, Grid, Text } from "@once-ui-system/core";
import { useState } from "react";
import styles from "./ScheduleCallForm.module.scss";

const timeSlots = [
  "09:00-09:30",
  "10:00-10:30",
  "11:00-11:30",
  "14:00-14:30",
  "15:00-15:30",
  "16:00-16:30",
];

const today = new Date().toISOString().split("T")[0];

type FormState = {
  name: string;
  email: string;
  topic: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  website: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  topic: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
  website: "",
};

export function ScheduleCallForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          timezone,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Could not send your booking request");
      }

      setForm(initialState);
      setIsSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Column
        fillWidth
        padding="xl"
        radius="l"
        background="surface"
        border="neutral-alpha-weak"
        gap="16"
      >
        <Text variant="heading-strong-l">Request sent</Text>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Thanks. I received your preferred time and topic, and I will confirm the calendar invite
          from the admin panel.
        </Text>
        <Button variant="secondary" onClick={() => setIsSubmitted(false)}>
          Send another request
        </Button>
      </Column>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Column fillWidth gap="20">
        <Grid columns="2" s={{ columns: 1 }} gap="16">
          <label className={styles.field} htmlFor="name">
            <span className={styles.label}>Name</span>
            <input
              id="name"
              className={styles.input}
              placeholder="Your name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>
          <label className={styles.field} htmlFor="email">
            <span className={styles.label}>Email</span>
            <input
              id="email"
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>
        </Grid>

        <label className={styles.field} htmlFor="topic">
          <span className={styles.label}>Topic</span>
          <input
            id="topic"
            className={styles.input}
            placeholder="What should we talk about?"
            value={form.topic}
            onChange={(event) => updateField("topic", event.target.value)}
            maxLength={160}
            required
            disabled={isSubmitting}
          />
        </label>

        <Grid columns="2" s={{ columns: 1 }} gap="16">
          <label className={styles.field} htmlFor="preferredDate">
            <span className={styles.label}>Preferred date</span>
            <input
              id="preferredDate"
              className={styles.input}
              type="date"
              min={today}
              value={form.preferredDate}
              onChange={(event) => updateField("preferredDate", event.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>
          <label className={styles.field} htmlFor="preferredTime">
            <span className={styles.label}>Preferred time</span>
            <select
              id="preferredTime"
              className={styles.select}
              value={form.preferredTime}
              onChange={(event) => updateField("preferredTime", event.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
        </Grid>

        <label className={styles.field} htmlFor="message">
          <span className={styles.label}>Details</span>
          <textarea
            id="message"
            className={styles.textarea}
            placeholder="A few notes about the project, question, or decision you want to cover."
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            maxLength={1000}
            disabled={isSubmitting}
          />
        </label>

        <label className={styles.honeypot} htmlFor="website">
          Website
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
          />
        </label>

        <Column gap="8">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Timezone detected: {timezone}
          </Text>
          {error && (
            <Text variant="body-default-s" onBackground="danger-weak">
              {error}
            </Text>
          )}
        </Column>

        <Button
          className={styles.submitButton}
          type="submit"
          size="m"
          fillWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending request..." : "Request a call"}
        </Button>
      </Column>
    </form>
  );
}
