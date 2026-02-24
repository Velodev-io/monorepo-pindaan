export const SERVICE_KEYS = {
    ASTHI_VISARJAN: 'ASTHI_VISARJAN',
    PIND_DAAN: 'PIND_DAAN',
    SHRADDH: 'SHRADDH',
    TARPAN: 'TARPAN',
} as const;

export type ServiceKey = keyof typeof SERVICE_KEYS;

export const SERVICE_LABELS: Record<ServiceKey, string> = {
    ASTHI_VISARJAN: 'Asthi Visarjan',
    PIND_DAAN: 'Pind Daan',
    SHRADDH: 'Shraddh',
    TARPAN: 'Tarpan',
};
