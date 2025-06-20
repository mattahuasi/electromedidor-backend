import { Report } from "../models/Report.js";

export const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll();

    const data = reports.map((report) => ({
      id: report.id,
      title: report.title,
      detail: report.detail,
      content: report.content,
      type: report.type,
      begin: report.begin,
      end: report.end,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    }));

    res.json(data);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};
