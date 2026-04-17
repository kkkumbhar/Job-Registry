import axios, { AxiosInstance } from "axios";
import https from "https";
import { BaseConnector } from "./base.connector";
import { Job } from "../types/job.types";

export class FleetConnector extends BaseConnector<any> {
  private token: string | null = null;
  private lastLogin = 0;
  private client: AxiosInstance;
  private address: string;
  private jobUrl = "/es/job/_search";

  constructor() {
    super("fleet");

    this.address = process.env.ADMINISTRATOR_ADDRESS!;

    const baseURL = `${this.address}/fleetmanagement/v1`;

    this.client = axios.create({
      baseURL,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  private async loginIfNeeded(): Promise<void> {
    const now = Date.now();

    if (this.token && now - this.lastLogin < 3600 * 1000) {
      return;
    }

    try {
      const res = await axios.post(
        `${this.address}/auth/realms/vsp360/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: process.env.ADMINISTRATOR_CLIENT_ID!,
          client_secret: process.env.ADMINISTRATOR_CLIENT_SECRET!,
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      );

      this.token = res.data.access_token;
      this.lastLogin = now;

      console.log("Fleet login successful");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      throw new Error("Fleet login failed");
    }
  }

  async fetchJobs(): Promise<any[]> {
    await this.loginIfNeeded();

    const headers = {
      Authorization: `Bearer ${this.token}`,
    };

    // First request: fetch first 1000 jobs
    const firstRes = await this.client.post(
      this.jobUrl,
      {
        size: 1000,
        from: 0,
        track_total_hits: true,
        sort: [
          {
            createdDate: {
              order: "desc",
            },
          },
        ],
      },
      { headers }
    );

    const firstHits = firstRes.data.hits.hits || [];
    const total = firstRes.data.hits.total?.value || 0;

    console.log(`Fleet total jobs found: ${total}`);
    // If total <= 1000, return immediately
    if (total <= 1000) {
      return firstHits;
    }

    // Second request: fetch remaining jobs
    const secondRes = await this.client.post(
      this.jobUrl,
      {
        size: total - 1000,
        from: 1000,
        track_total_hits: true,
        sort: [
          {
            createdDate: {
              order: "desc",
            },
          },
        ],
      },
      { headers }
    );

    const remainingHits = secondRes.data.hits.hits || [];

    console.log("Fleet jobs fetched");

    return [...firstHits, ...remainingHits];
  }

  normalizeData(job: any): Job {
    const jobData = job._source;
    return {
      external_id: jobData.jobId,
      source: this.name,
      name: jobData.title?.text,
      status: jobData.status,
      metadata: job,
      started_at: new Date(jobData.createdDate),
      finished_at: new Date(jobData.endDate),
    };
  }
}
