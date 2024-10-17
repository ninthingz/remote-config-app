import instance from ".";
import { CommonResponse } from ".";

export interface SearchRecordDTO {
  projectName?: string;
  process?: string;
  version?: string;
  mac?: string;
  channel?: number;
  code: number;
  startTime?: string;
  endTime?: string;
  groupBy?: string;
}

export interface ReportResult {
  tag: string;
  count: number;
}

export const getReports = (searchRecordDTO: SearchRecordDTO) => {
  return instance.get<CommonResponse<ReportResult[]>>("/api/v1/reports", {
    params: searchRecordDTO,
  });
};

export const getReportsLast24Hours = (searchRecordDTO: SearchRecordDTO) => {
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);
  startTime.setDate(startTime.getDate() - 1);
  const endTime = new Date();
  endTime.setHours(0, 0, 0, 0);

  searchRecordDTO.startTime = startTime.toLocaleString();
  searchRecordDTO.endTime = endTime.toLocaleString();
  return getReports(searchRecordDTO);
};
