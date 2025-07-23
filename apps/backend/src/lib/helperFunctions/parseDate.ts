export const parseDate = (dateString: string) => {
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; 
        const year = parseInt(parts[2]);
        const date = new Date(year, month, day);
        return date;
      }
    } 
    
    if (dateString.includes('-')) {
      const date = new Date(dateString);
      return date;
    }
    
    const date = new Date(dateString);
    return date;
}