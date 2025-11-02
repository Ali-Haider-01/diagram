/**
 * Extract browser information from user agent string
 * @param userAgent - User agent string
 * @returns Browser information
 */
export function extractBrowserInfo(userAgent: string): string {
    if (!userAgent) return 'Unknown';
  
    const ua = userAgent.toLowerCase();
  
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    if (ua.includes('opera')) return 'Opera';
    if (ua.includes('ie')) return 'Internet Explorer';
  
    return 'Unknown';
  }
  
  /**
   * Extract operating system information from user agent string
   * @param userAgent - User agent string
   * @returns Operating system information
   */
  export function extractSystemInfo(userAgent: string): string {
    if (!userAgent) return 'Unknown';
  
    const ua = userAgent.toLowerCase();
  
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('ios')) return 'iOS';
  
    return 'Unknown';
  }
  