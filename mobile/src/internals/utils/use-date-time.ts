export const useTimeFormat = (date: Date) => {
  const newDate = new Date(date);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  }).format(newDate);

  return formattedTime;
};
