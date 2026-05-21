export function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');       // 01-31
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-indexed
    const year = date.getFullYear();                            // 4-digit year

    return `${day}-${month}-${year}`;
}