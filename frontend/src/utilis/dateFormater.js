export const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        timeZone: 'Asia/Bangkok' 
    };
    return date.toLocaleDateString('vi-VN', options);
};
