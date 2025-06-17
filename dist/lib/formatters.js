export function formatDateTimeForCashfree(isoDateTime) {
    return isoDateTime?.replace("T", " ").replace("Z", "") ?? isoDateTime;
}
