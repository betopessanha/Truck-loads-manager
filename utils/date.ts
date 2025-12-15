// Returns the start (Sunday) and end (Saturday) of the week for a given date.
export const getWeekRange = (date: Date): { start: string; end: string; } => {
  const d = new Date(date);
  const day = d.getDay(); // Sunday - 0, Monday - 1, etc.
  const diffToSunday = d.getDate() - day;
  
  const startOfWeek = new Date(d.setDate(diffToSunday));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    start: formatDateForSupabase(startOfWeek),
    end: formatDateForSupabase(endOfWeek),
  };
};

// Formats a Date object to a 'YYYY-MM-DD' string suitable for Supabase queries.
export const formatDateForSupabase = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Manually construct date string to guarantee MM/DD/YYYY format for display.
export const formatDateMMDDYYYY = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
};
