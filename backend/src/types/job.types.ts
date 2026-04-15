
export interface Job {
  external_id: string;
  source: string;
  name?: string;
  status?: string;
  metadata?: any;
  started_at?: Date;
  finished_at?: Date;
}
