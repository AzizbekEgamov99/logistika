export const getTagColor = (serviceType: string, serviceTypes: string[]) => {
    const serviceIndex = serviceTypes.indexOf(serviceType);
    return serviceIndex >= 0 ? serviceIndex : 0;
};