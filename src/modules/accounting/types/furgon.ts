export interface Furgon {
    id: number;
    name: string;
    number: string;
    photo?: string;
    kilometer?: number;
    status?: string;
    description?: string;
    is_busy: boolean;
}

export interface FurgonItem {
    id: number;
    name: string;
    number: string;
    photo?: string;
    kilometer: number;
    status: string;
    description?: string;
    is_busy: boolean;
}

export interface FurgonStatusGroup {
    count: number;
    items: FurgonItem[];
}

export interface FurgonStatusSummary {
    in_rays: FurgonStatusGroup;
    available: FurgonStatusGroup;
}