/* ===========================
   src/shared/utils/time.ts
   ===========================
*/

export function parseDuration(value?: string): number {
  if (!value) return 0;
  const regex = /(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
  const m = value.match(regex);
  if (!m) return 0;
  const h = parseInt(m[1] || '0', 10);
  const mi = parseInt(m[2] || '0', 10);
  const s = parseInt(m[3] || '0', 10);
  return h * 3600 + mi * 60 + s;
}

export function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const parts: string[] = [];
  if (hrs) parts.push(`${hrs}h`);
  if (mins) parts.push(`${mins}m`);
  if (secs || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(' ');
}

/**
 * Finalize an entry by using entry.entryTime as the start and the provided exitTime as end.
 * Adds the computed delta (seconds) to entry.timeSpent and sets exitTime/updatedAt.
 *
 * Why: using explicit entryTime/exitTime prevents relying on createdAt/updatedAt which were
 * being updated by different flows resulting in wrong deltas.
 */
export function finalizeEntry(entry: any, exitDate: Date | string): void {
  if (!entry) return;

  const exit = typeof exitDate === 'string' ? new Date(exitDate) : exitDate;
  // Determine start: prefer entry.entryTime, fallback to createdAt/updatedAt
  const startSource =
    entry.entryTime || entry.createdAt || entry.updatedAt || null;
  if (!startSource) return;

  const start = new Date(startSource);

  // Guard: if already finalized with an exit >= this exit, skip to avoid double-counting
  if (entry.exitTime) {
    const prevExit = new Date(entry.exitTime);
    if (prevExit.getTime() >= exit.getTime()) return;
  }

  let deltaSeconds = Math.floor((exit.getTime() - start.getTime()) / 1000);
  if (deltaSeconds <= 0) deltaSeconds = 1;

  const prevSeconds = parseDuration(entry.timeSpent);
  const totalSeconds = prevSeconds + deltaSeconds;

  // persist results on the entry (store ISO strings for DB-friendly format)
  entry.timeSpent = formatDuration(totalSeconds);
  entry.exitTime = exit.toISOString();
  entry.updatedAt = exit.toISOString();
}

/**
 * Check if a session has been inactive for more than the specified timeout period
 * @param entryTime - The entry time of the session
 * @param timeoutMinutes - Timeout period in minutes (default: 30)
 * @returns true if the session should be timed out
 */
export function isSessionTimedOut(
  entryTime: string | Date,
  timeoutMinutes: number = 30
): boolean {
  if (!entryTime) return false;

  const entry = typeof entryTime === 'string' ? new Date(entryTime) : entryTime;
  const now = new Date();
  const timeoutMs = timeoutMinutes * 60 * 1000;

  return now.getTime() - entry.getTime() > timeoutMs;
}

/**
 * Get the timeout time for a session (entry time + timeout period)
 * @param entryTime - The entry time of the session
 * @param timeoutMinutes - Timeout period in minutes (default: 30)
 * @returns The timeout time as a Date object
 */
export function getSessionTimeoutTime(
  entryTime: string | Date,
  timeoutMinutes: number = 30
): Date {
  const entry = typeof entryTime === 'string' ? new Date(entryTime) : entryTime;
  const timeoutMs = timeoutMinutes * 60 * 1000;

  return new Date(entry.getTime() + timeoutMs);
}

/**
 * Compute aggregates for the diagrams array.
 * Accepts diagrams where each diagram.statusHistory[].timeSpent is human-readable string (e.g. "1h 2m 3s").
 */
export function calculateAggregates(diagrams: any[]) {
  let totalSecondsAll = 0;
  const diagramTotals: Record<string, number> = {};
  let totalSlugsCount = 0;
  const statusCounts: Record<string, number> = {
    IN_PROGRESS: 0,
    COMPLETE: 0,
    PENDING: 0,
  };

  for (const d of diagrams) {
    let diagramSeconds = 0;

    for (const h of d.statusHistory || []) {
      const seconds = parseDuration(h.timeSpent);
      diagramSeconds += seconds;
      totalSecondsAll += seconds;
      totalSlugsCount++;

      if (h.newStatus && statusCounts[h.newStatus] !== undefined) {
        statusCounts[h.newStatus]++;
      }
    }

    diagramTotals[d.diagramId] = diagramSeconds;
  }

  return {
    totalTimeAll: formatDuration(totalSecondsAll),
    totalTimePerDiagram: Object.fromEntries(
      Object.entries(diagramTotals).map(([id, secs]) => [
        id,
        formatDuration(secs as number),
      ])
    ),
    totalSlugsCount,
    statusCounts,
  };
}
