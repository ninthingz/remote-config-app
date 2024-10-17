import instance from ".";
import { CommonResponse } from ".";

export interface Project {
  label: string;
  count: string;
  pass_count: string;
  last_update_time: string;
}

export interface SearchProjectDTO {
  projectName: string;
  showProcess: boolean;
  process: string;
  showVersion: boolean;
}

export const getProjects = (searchProjectDTO: SearchProjectDTO) => {
  return instance.get<CommonResponse<Project[]>>("/api/v1/projects", {
    params: searchProjectDTO,
  });
};
