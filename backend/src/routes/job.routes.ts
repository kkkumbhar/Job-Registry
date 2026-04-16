import { Router, Request, Response } from "express";
import { getJobs, getJobStats } from "../db/job.repository";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await getJobs({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      status: req.query.status as string,
      name: req.query.name as string,
      source: req.query.source as string,
      started_at_from: req.query.started_at_from as string,
      started_at_to: req.query.started_at_to as string,
      finished_at_from: req.query.finished_at_from as string,
      finished_at_to: req.query.finished_at_to as string,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const result = await getJobStats({
      name: req.query.name as string,
      source: req.query.sources as string,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
