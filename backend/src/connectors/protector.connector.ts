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
      const startTime = get30DaysAgoISO();

      console.log("Fetching Protector jobs...");

      const res = await this.client.get("/master/JobHandler/objects/Jobs", {
        params: {
          // "order-by": "masterTimeStarted DESC",
          // query: `(masterTimeStarted>=${startTime})`,
          count: 10000,
          offset: 0,
        },
        headers: {
          Cookie: this.cookie!,
        },
      });

      console.log("Protector jobs fetched");

      return res.data.job || res.data.items || [];
    } catch (err: any) {
      console.error("Protector fetch error:");
      throw err;
    }
  }

  normalize(job: any): Job {
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
