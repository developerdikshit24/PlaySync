
export function formatTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const amount = Math.floor(seconds / value);
        if (amount >= 1) {
            return `${amount} ${unit}${amount > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}
