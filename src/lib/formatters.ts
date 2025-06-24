export function formatDateTimeForCashfree(isoDateTime: string): string {
  return isoDateTime?.replace("T", " ").replace("Z", "") ?? isoDateTime;
}

export function formatDateForDexter(dateTime: string): string {
  // Convert "YYYY-MM-DD HH:MM:SS" to "YYYY-MM-DD"
  return dateTime.split(" ")[0];
}
