import axios, { AxiosInstance } from "axios";
import https from "https";
import { BaseConnector } from "./base.connector";
import { Job } from "../types/job.types";

function get30DaysAgoISO(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

export class ProtectorConnector extends BaseConnector<any> {
  private cookie: string | null = null;
  private client: AxiosInstance;
  private address: string;
  private version = "8.0";

  constructor() {
    super("protector");

    this.address = process.env.PROTECTOR_ADDRESS!;

    const baseURL = `${this.address}/API/${this.version}`;

    this.client = axios.create({
      baseURL,
      withCredentials: true,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  private async loginIfNeeded(): Promise<void> {
    if (this.cookie) return;

    try {
      const res = await this.client.post(
        "/master/UIController/services/Users/Actions/login/invoke",
        {
          space: "master",
          username: process.env.PROTECTOR_USERNAME,
          password: process.env.PROTECTOR_PASSWORD,
        }
      );

      const cookies = res.headers["set-cookie"];

      if (!cookies) {
        throw new Error("No cookies received from login");
      }

      const sessionCookie = cookies.find((c: string) =>
        c.startsWith("Session_ID")
      );

      if (!sessionCookie) {
        throw new Error("Session_ID cookie not found");
      }

      this.cookie = sessionCookie.split(";")[0];

      console.log("Protector login successful");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  }

  async fetchJobs(): Promise<any[]> {
    await this.loginIfNeeded();

    try {
      console.log("Fetching Protector jobs...");
      const headers = {
        Cookie: this.cookie!,
      };

      // First request
      const firstRes = await this.client.get(
        "/master/JobHandler/objects/Jobs",
        {
          params: {
            count: 1000,
            offset: 0,
          },
          headers,
        }
      );

      const firstJobs = firstRes.data.job || firstRes.data.items || [];
      const total = firstRes.data.pageInfo?.totalCount || 0;

      console.log(`Protector total jobs found: ${total}`);

      // If all jobs fit in first request
      if (total <= 1000) {
        return firstJobs;
      }

      // Second request for remaining jobs
      const secondRes = await this.client.get(
        "/master/JobHandler/objects/Jobs",
        {
          params: {
            count: total - 1000,
            offset: 1000,
          },
          headers,
        }
      );

      const remainingJobs = secondRes.data.job || secondRes.data.items || [];

      console.log("Protector jobs fetched");

      return [...firstJobs, ...remainingJobs];
    } catch (err: any) {
      console.error("Protector fetch error");
      throw err;
    }
  }

  normalizeData(job: any): Job {
    return {
      external_id: job.id,
      source: this.name,
      name: job.description,
      status: job.status,
      metadata: job,
      started_at: job.masterTimeStarted,
      finished_at: job.masterTimeCompleted,
    };
  }
}
