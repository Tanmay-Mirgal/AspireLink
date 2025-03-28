import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString)=> {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'some time ago';
  }
};

export const formatJobDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d');
  } catch (error) {
    return '';
  }
};

export const getFullName = (user) => {
  if (!user || !user.fullName) return 'Unknown User';
  return `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim();
};

export const getInitials = (user)=> {
  if (!user || !user.fullName) return 'U';
  const firstName = user.fullName.firstName || '';
  const lastName = user.fullName.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};