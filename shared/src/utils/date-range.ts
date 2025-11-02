export function buildDateRangeFilter(
    startDate?: Date,
    endDate?: Date
  ): Record<string, any> | undefined {
    if (!startDate && !endDate) return undefined;
  
    const range: Record<string, any> = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      range['$gte'] = start;
    }
  
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      range['$lte'] = end;
    }
  
    return range;
  }