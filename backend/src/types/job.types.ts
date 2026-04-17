
export interface Job {
  external_id: string;
  source: string;
  name?: string;
  status?: string;
  metadata?: any;
  started_at?: Date;
  finished_at?: Date;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  status?: string;
  name?: string;
  source?: string;
  started_at_from?: string;
  started_at_to?: string;
  finished_at_from?: string;
  finished_at_to?: string;
}
