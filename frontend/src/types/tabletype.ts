export interface OffsetAndCount {
    offset: number;
    count: number;
}

export interface OrderBy {
    order: string;
}

export interface APIResponse<T> {
    items: T[];
    total?: number;
    count?: number;
    offset?: number;
}

export type QueryOptions<T = unknown> = {
    skip?: boolean;
    refresh?: boolean | number;
    enabled?: boolean;
    initialData?: APIResponse<T>;
};

export type PaginationParams = Partial<OffsetAndCount> & Partial<OrderBy>;
