export function formatDateTimeForCashfree(isoDateTime: string): string {
  return isoDateTime?.replace("T", " ").replace("Z", "") ?? isoDateTime;
}
