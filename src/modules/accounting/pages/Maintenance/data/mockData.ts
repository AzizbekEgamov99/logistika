// Car data
export const carData = [
  { id: 1, model: 'Nexia', number: '01A123BB', lastService: '12.02.2025' },
  { id: 2, model: 'Cobalt', number: '01A456CC', lastService: '25.01.2025' },
  { id: 3, model: 'Lacetti', number: '01A789DD', lastService: '03.03.2025' },
  { id: 4, model: 'Spark', number: '01A012EE', lastService: '18.02.2025' },
]

// Service types
export interface ServiceType {
  name: string
  basePrice: number
}

// Service types and pricing
export const serviceTypes: Record<string, ServiceType> = {
  oil: { name: 'Moy almashtirish', basePrice: 150000 },
  tire: { name: "G'ildirak xizmati", basePrice: 100000 },
}

export const maintenanceTypes = [
  { id: 'oil', name: 'Moy almashtirish', importance: 'high' },
  { id: 'tire', name: "G'ildirak xizmati", importance: 'medium' },
  { id: 'other', name: 'Boshqa', importance: 'low' },
]
