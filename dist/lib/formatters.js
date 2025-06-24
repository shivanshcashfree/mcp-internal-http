export function formatDateTimeForCashfree(isoDateTime) {
    return isoDateTime?.replace("T", " ").replace("Z", "") ?? isoDateTime;
}
export function formatDateForDexter(dateTime) {
    // Convert "YYYY-MM-DD HH:MM:SS" to "YYYY-MM-DD"
    return dateTime.split(" ")[0];
}
