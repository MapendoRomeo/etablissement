export const isDateBefore = (date1: Date, date2: Date) => new Date(date1) < new Date(date2);

export const isBetween = (target: Date, start: Date, end: Date) => {
  const d = new Date(target).getTime();
  return d >= new Date(start).getTime() && d <= new Date(end).getTime();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
