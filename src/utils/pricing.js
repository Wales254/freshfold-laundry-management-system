export const calculateTotal = (services, serviceName, quantity) => {
  const selectedService = services.find(
    (service) => service.name === serviceName
  );

  if (!selectedService) return 0;

  return selectedService.price * Number(quantity);
};