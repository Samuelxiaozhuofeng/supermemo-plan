export function parseTime(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid time: ${value}`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid time: ${value}`);
  }

  return hours * 60 + minutes;
}

export function formatTime(totalMinutes: number): string {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatDuration(totalMinutes: number): string {
  const rounded = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;
  if (hours === 0) {
    return `${minutes} 分`;
  }
  return `${hours} 时 ${minutes} 分`;
}

export function nowAsTime(): string {
  const now = new Date();
  return formatTime(now.getHours() * 60 + now.getMinutes());
}

export function normalizeIntoWindow(time: string, windowStart: number): number {
  let minutes = parseTime(time);
  while (minutes < windowStart) {
    minutes += 1440;
  }
  return minutes;
}
