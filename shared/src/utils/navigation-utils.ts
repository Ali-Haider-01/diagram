import dayjs = require("dayjs");


/**
 * Check if a navigation session has timed out
 * @param entryTime - The entry timestamp of the navigation
 * @param timeoutMinutes - Timeout in minutes (default: 30)
 * @returns boolean indicating if the session has timed out
 */
export function isNavigationSessionTimedOut(
  entryTime: string | Date,
  timeoutMinutes: number = 30
): boolean {
  const entry = dayjs(entryTime);
  const now = dayjs();
  const diffMinutes = now.diff(entry, 'minute');
  return diffMinutes >= timeoutMinutes;
}

/**
 * Get the timeout time for a navigation session
 * @param entryTime - The entry timestamp of the navigation
 * @param timeoutMinutes - Timeout in minutes (default: 30)
 * @returns Date object representing when the session should timeout
 */
export function getNavigationTimeoutTime(
  entryTime: string | Date,
  timeoutMinutes: number = 30
): Date {
  const entry = dayjs(entryTime);
  return entry.add(timeoutMinutes, 'minute').toDate();
}

/**
 * Finalize a navigation entry with exit time and duration
 * @param navigation - The navigation object to finalize
 * @param exitTime - The exit time (defaults to current time)
 */
export function finalizeNavigationEntry(
  navigation: any,
  exitTime: Date = new Date()
): void {
  if (!navigation.entry_timestamp) {
    return;
  }

  const entry = dayjs(navigation.entry_timestamp);
  const exit = dayjs(exitTime);
  const durationMs = exit.diff(entry);
  const durationMins = Math.floor(durationMs / 60000);
  const hrs = Math.floor(durationMins / 60);
  const mins = durationMins % 60;
  const timeSpent = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} minutes`;

  navigation.exit_timestamp = exitTime.toISOString();
  navigation.time_spent = timeSpent;
}

/**
 * Calculate the time spent in a navigation session
 * @param entryTime - The entry timestamp
 * @param exitTime - The exit timestamp (optional, defaults to current time)
 * @returns Formatted time spent string
 */
export function calculateNavigationTimeSpent(
  entryTime: string | Date,
  exitTime?: string | Date
): string {
  const entry = dayjs(entryTime);
  const exit = exitTime ? dayjs(exitTime) : dayjs();
  const durationMs = exit.diff(entry);
  const durationMins = Math.floor(durationMs / 60000);
  const hrs = Math.floor(durationMins / 60);
  const mins = durationMins % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} minutes`;
}

/**
 * Get active navigation sessions (without exit_timestamp)
 * @param navigations - Array of navigation objects
 * @returns Array of active navigation sessions
 */
export function getActiveNavigationSessions(navigations: any[]): any[] {
  return navigations.filter(
    (nav: any) => !nav.exit_timestamp && nav.entry_timestamp
  );
}

/**
 * Get the most recent active navigation session
 * @param navigations - Array of navigation objects
 * @returns The most recent active navigation or null
 */
export function getMostRecentActiveNavigation(navigations: any[]): any | null {
  const activeNavigations = getActiveNavigationSessions(navigations);
  
  if (activeNavigations.length === 0) {
    return null;
  }

  // Sort by entry_timestamp descending to get the most recent
  return activeNavigations.sort(
    (a: any, b: any) =>
      new Date(b.entry_timestamp).getTime() - new Date(a.entry_timestamp).getTime()
  )[0];
}

