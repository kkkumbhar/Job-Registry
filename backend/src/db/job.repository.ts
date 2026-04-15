import { Job } from "../models/job.model";
import { Op } from "sequelize";

export async function upsertJobsBulk(jobs: any[]) {
  if (!jobs.length) return;

  await Job.bulkCreate(jobs, {
    updateOnDuplicate: [
      "name",
      "status",
      "metadata",
      "started_at",
      "finished_at",
      "updatedAt",
    ],
  });
}

export async function deleteOldJobs() {
  const count = await Job.destroy({
    where: {
      started_at: {
        [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return count;
}

interface JobFilters {
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

export async function getJobs(filters: JobFilters) {
  const {
    page,
    limit,
    status,
    name,
    source,
    started_at_from,
    started_at_to,
    finished_at_from,
    finished_at_to,
  } = filters;

  const where: any = {};

  // status multi
  if (status) {
    where.status = { [Op.in]: status.split(",") };
  }

  // source multi
  if (source) {
    where.source = { [Op.in]: source.split(",") };
  }

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  if (started_at_from || started_at_to) {
    where.started_at = {
      ...(started_at_from && { [Op.gte]: new Date(started_at_from) }),
      ...(started_at_to && { [Op.lte]: new Date(started_at_to) }),
    };
  }

  if (finished_at_from || finished_at_to) {
    where.finished_at = {
      ...(finished_at_from && { [Op.gte]: new Date(finished_at_from) }),
      ...(finished_at_to && { [Op.lte]: new Date(finished_at_to) }),
    };
  }

  const hasPagination = page && limit;

  const { rows, count } = await Job.findAndCountAll({
    where,
    order: [["started_at", "DESC"]],
    offset: hasPagination ? (page - 1) * limit : undefined,
    limit: hasPagination ? limit : undefined,
  });

  return {
    data: rows,
    total: count,
    page: hasPagination ? page : null,
    limit: hasPagination ? limit : null,
  };
}

export async function getJobStats(filters: any = {}) {
  const where: any = {};

  if (filters.source) {
    where.source = { [Op.in]: filters.source.split(",") };
  }

  if (filters.name) {
    where.name = { [Op.iLike]: `%${filters.name}%` };
  }

  const [total, successful, failed, running] = await Promise.all([
    Job.count({ where }),
    Job.count({
      where: {
        ...where,
        status: {
          [Op.in]: ["eJOB_SUCCEEDED", "SUCCESS"],
        },
      },
    }),
    Job.count({ where: { ...where, status: "eJOB_FAILED" } }),
    Job.count({ where: { ...where, status: "eJOB_RUNNING" } }),
  ]);

  return { total, successful, failed, running };
}
