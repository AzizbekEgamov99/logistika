import { useFurgons, useFurgonStatus } from '../../accounting/hooks/useFurgon';

export const useCEOFurgons = () => {
  // Reuse the existing hooks from accounting module
  const { furgons, isLoading } = useFurgons();
  const { 
    statusData, 
    inRaysFurgons, 
    availableFurgons, 
    inRaysCount, 
    availableCount 
  } = useFurgonStatus();

  // Get total furgons count
  const totalFurgons = furgons.length;
  
  // Calculate percentage of furgons in use
  const furgonsInUsePercentage = totalFurgons > 0 ? (inRaysCount / totalFurgons) * 100 : 0;
  
  // Calculate percentage of available furgons
  const availableFurgonsPercentage = totalFurgons > 0 ? (availableCount / totalFurgons) * 100 : 0;

  // Get furgons by status
  const getFurgonsByStatus = (status: string) => {
    return furgons.filter((furgon: any) => furgon.holat === status);
  };

  // Calculate maintenance metrics
  const furgonsInMaintenance = getFurgonsByStatus('tamirda').length;
  const furgonsInMaintenancePercentage = totalFurgons > 0 ? (furgonsInMaintenance / totalFurgons) * 100 : 0;

  return {
    furgons,
    isLoading,
    statusData,
    inRaysFurgons,
    availableFurgons,
    inRaysCount,
    availableCount,
    totalFurgons,
    furgonsInUsePercentage,
    availableFurgonsPercentage,
    furgonsInMaintenance,
    furgonsInMaintenancePercentage,
    getFurgonsByStatus
  };
}; 