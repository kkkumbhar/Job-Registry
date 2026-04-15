import { Job } from "../types/job.types";

export abstract class BaseConnector<T = any> {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract fetchJobs(): Promise<T[]>;
  abstract normalize(job: T): Job;
}
