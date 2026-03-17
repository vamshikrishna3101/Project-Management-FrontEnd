export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const getBadgeClass = (value) => {
  if (!value) return 'badge';
  return `badge badge-${value.toLowerCase().replace('_', '_')}`;
};

export const getStatusOptions = () => [
  { value: 'PLANNING',  label: 'Planning' },
  { value: 'ACTIVE',    label: 'Active' },
  { value: 'ON_HOLD',   label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const getTaskStatusOptions = () => [
  { value: 'TODO',        label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW',   label: 'In Review' },
  { value: 'DONE',        label: 'Done' },
];

export const getPriorityOptions = () => [
  { value: 'LOW',      label: 'Low' },
  { value: 'MEDIUM',   label: 'Medium' },
  { value: 'HIGH',     label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

export const getRoleOptions = () => [
  { value: 'MEMBER',  label: 'Member' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'ADMIN',   label: 'Admin' },
];

export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};

export const truncate = (str, n = 60) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
};
