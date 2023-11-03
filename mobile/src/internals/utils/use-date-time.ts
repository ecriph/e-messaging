export const useTimeFormat = (date: number) => {
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  }).format(date);

  return formattedTime;
};
