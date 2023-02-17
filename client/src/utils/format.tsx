const formatMessageTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const shortYear = date.getFullYear().toString().slice(-2);
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = date.getHours() > 12 ? 'PM' : 'AM';
  return `${month}/${day}/${shortYear} ${hours}:${minutes}${amOrPm}`;
};

export { formatMessageTimestamp };
