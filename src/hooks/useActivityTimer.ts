import { useEffect, useMemo, useState } from "react";
import { computeSchedule, getRunningActivity } from "../schedule";
import { normalizeIntoWindow, parseTime } from "../time";
import type { NotificationStatus, PlanDocument, ReminderSettings } from "../types";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export interface AlarmState {
  activityId: string;
  title: string;
  kind: "pre" | "end";
}

const DEFAULT_SETTINGS: ReminderSettings = { preAlertMinutes: 5, snoozeMinutes: 5 };
const SETTINGS_KEY = "supermemo-plan-core:reminders";

function currentAbsoluteSeconds(planStart: number): number {
  const now = new Date();
  let minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  while (minutes < planStart) {
    minutes += 1440;
  }
  return Math.floor(minutes * 60);
}

function loadSettings(): ReminderSettings {
  if (typeof localStorage === "undefined") {
    return DEFAULT_SETTINGS;
  }
  const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null") as Partial<ReminderSettings> | null;
  return {
    preAlertMinutes: Number(parsed?.preAlertMinutes) || DEFAULT_SETTINGS.preAlertMinutes,
    snoozeMinutes: Number(parsed?.snoozeMinutes) || DEFAULT_SETTINGS.snoozeMinutes,
  };
}

function beep(): void {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = 740;
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.55);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.6);
}

function notificationStatus(): NotificationStatus {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  return window.Notification.permission;
}

export function useActivityTimer(today?: PlanDocument) {
  const [clock, setClock] = useState(() => new Date());
  const [alarm, setAlarm] = useState<AlarmState>();
  const [mutedActivityId, setMutedActivityId] = useState<string>();
  const [snoozeUntil, setSnoozeUntil] = useState(0);
  const [settings, setSettings] = useState<ReminderSettings>(() => loadSettings());
  const [status, setStatus] = useState<NotificationStatus>(() => notificationStatus());
  const [preAlertedId, setPreAlertedId] = useState<string>();
  const [endedId, setEndedId] = useState<string>();

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const running = today ? getRunningActivity(today) : undefined;
  const runningComputed =
    today && running ? computeSchedule(today).find((row) => row.id === running.id) : undefined;
  const remainingSeconds = useMemo(() => {
    if (!today || !running || !runningComputed?.actualStart) {
      return undefined;
    }
    const planStart = parseTime(today.startTime);
    const startSeconds = normalizeIntoWindow(runningComputed.actualStart, planStart) * 60;
    const elapsedSeconds = Math.max(0, currentAbsoluteSeconds(planStart) - startSeconds);
    const durationSeconds = Math.max(1, runningComputed.allocatedMinutes || running.desiredMinutes) * 60;
    return Math.max(0, durationSeconds - elapsedSeconds);
  }, [clock, running, runningComputed, today]);

  useEffect(() => {
    if (!runningComputed) {
      setMutedActivityId(undefined);
      return;
    }
    if (mutedActivityId === runningComputed.id || Date.now() < snoozeUntil || alarm) {
      return;
    }
    if (remainingSeconds === undefined) {
      return;
    }

    const shouldPreAlert =
      settings.preAlertMinutes > 0 &&
      remainingSeconds <= settings.preAlertMinutes * 60 &&
      remainingSeconds > 0 &&
      preAlertedId !== runningComputed.id;
    const shouldEndAlert = remainingSeconds <= 0 && endedId !== runningComputed.id;
    if (!shouldPreAlert && !shouldEndAlert) {
      return;
    }

    const kind = shouldEndAlert ? "end" : "pre";
    setAlarm({ activityId: runningComputed.id, title: runningComputed.title, kind });
    if (kind === "pre") {
      setPreAlertedId(runningComputed.id);
    } else {
      setEndedId(runningComputed.id);
      setMutedActivityId(runningComputed.id);
    }
    beep();
    if ("Notification" in window && window.Notification.permission === "granted") {
      new window.Notification(kind === "end" ? "活动时间到了" : "活动即将结束", {
        body: runningComputed.title,
      });
    }
  }, [alarm, endedId, mutedActivityId, preAlertedId, remainingSeconds, runningComputed, settings, snoozeUntil]);

  async function requestNotification(): Promise<void> {
    if ("Notification" in window && window.Notification.permission === "default") {
      await window.Notification.requestPermission();
    }
    setStatus(notificationStatus());
  }

  return {
    alarm,
    clock,
    muteCurrent: () => setMutedActivityId(runningComputed?.id),
    mutedActivityId,
    notificationStatus: status,
    remainingSeconds,
    requestNotification,
    running,
    runningComputed,
    setAlarm,
    setMutedActivityId,
    setSettings,
    settings,
    snooze: (minutes = settings.snoozeMinutes) => {
      setAlarm(undefined);
      setMutedActivityId(undefined);
      setSnoozeUntil(Date.now() + minutes * 60 * 1000);
    },
  };
}
