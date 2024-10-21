import instance, { Page } from ".";
import { CommonResponse } from ".";

export interface Config {
  id: number;
  name: string;
  value: string;
  message: string;
  secret: string;
  last_get_time: number;
  enable: boolean;
}

export interface ConfigHistory {
  id: number;
  config_id: number;
  old_value: string;
  new_value: string;
  nickname: string;
  enable: boolean;
  message: string;
  create_time: number;
}

export const createConfig = (config: Config) => {
  return instance.post<CommonResponse<any>>("/api/v1/config", config);
};

export const updateConfig = (config: Config) => {
  return instance.patch<CommonResponse<any>>("/api/v1/config", config);
};

export const deleteConfig = (name: string) => {
  return instance.delete<CommonResponse<any>>("/api/v1/config", {
    params: { name },
  });
};

export const listConfig = (
  keyword: string,
  pageSize: number,
  pageIndex: number,
) => {
  return instance.get<CommonResponse<Page<Config>>>("/api/v1/config", {
    params: { keyword, pageSize, pageIndex },
  });
};

export const getConfigHistory = (
  configId: number,
  pageSize: number,
  pageIndex: number,
) => {
  return instance.get<CommonResponse<Page<ConfigHistory>>>(
    `/api/v1/config/${configId}/history`,
    {
      params: { pageSize, pageIndex },
    },
  );
};
