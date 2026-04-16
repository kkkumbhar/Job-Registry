import axios, { AxiosInstance } from "axios";
import https from "https";
import { BaseConnector } from "./base.connector";
import { Job } from "../types/job.types";

export class FleetConnector extends BaseConnector<any> {
  private token: string | null = null;
  private lastLogin = 0;
  private client: AxiosInstance;
  private address: string;

  constructor() {
    super("fleet");

    this.address = process.env.ADMINISTRATOR_ADDRESS!;

    const platformMode =
      (process.env.PLATFORM_MODE || "false").toLowerCase() === "true";

    const contextPath = platformMode ? "" : "/fleetmanagement";

    const baseURL = `${this.address}${contextPath}/v1`;

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

    const res = await this.client.get(`/jobs`, {
      params: {
        count: 10000,
        offset: 0,
      },
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    console.log("Fleet jobs fetched");
    return res.data.jobs || [];
  }

  normalize(job: any): Job {
    return {
      external_id: job.jobId,
      source: this.name,
      name: job.title?.text,
      status: job.status,
      metadata: job,
      started_at: new Date(job.createdDate),
      finished_at: new Date(job.endDate),
    };
  }
}
