export const ORDER_STATUS = [
  "Received",
  "Washing",
  "Drying",
  "Ironing",
  "Ready",
  "Delivered",
];

export const getNextStatus = (currentStatus) => {
  const index = ORDER_STATUS.indexOf(currentStatus);

  if (index === -1 || index === ORDER_STATUS.length - 1) {
    return currentStatus;
  }

  return ORDER_STATUS[index + 1];
};

export const getPreviousStatus = (currentStatus) => {
  const index = ORDER_STATUS.indexOf(currentStatus);

  if (index <= 0) {
    return currentStatus;
  }

  return ORDER_STATUS[index - 1];
};