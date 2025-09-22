const status = ['pending', 'in progress', 'completed'] as const;
export type Status = (typeof status)[number];

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'in progress':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

export const getStatusIcon = (status: Status): string => {
  switch (status) {
    case 'completed':
      return '✓';
    case 'in progress':
      return '⏳';
    default:
      return '○';
  }
};

export const cycleStatus = (currentStatus: Status): Status => {
  const currentIndex = status.indexOf(currentStatus);
  return status[(currentIndex + 1) % status.length];
};
