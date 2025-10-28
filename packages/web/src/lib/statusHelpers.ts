import { statusValues, type Status } from 'api/db/schema';

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'in progress':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'in review':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
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
    case 'in review':
      return '🔍';
    default:
      return '○';
  }
};

export const cycleStatus = (currentStatus: Status): Status => {
  const currentIndex = statusValues.indexOf(currentStatus);
  return statusValues[(currentIndex + 1) % statusValues.length];
};
