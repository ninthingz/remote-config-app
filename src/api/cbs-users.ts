import instance from ".";
import { CommonResponse } from ".";

interface CBSUserLoginDTO {
  username: string;
  password: string;
  source: string;
}

interface CBSUserToken {
  token: string;
  tokenHead: string;
}

interface CBSUserInfo {
  username: string;
  nickname: string;
  email: string;
  expiredTime: string;
}

export function cbsLogin(userLoginDTO: CBSUserLoginDTO) {
  return instance.request<CommonResponse<CBSUserToken>>({
    method: "post",
    url: "/api/v1/cbs_user/login",
    data: userLoginDTO,
  });
}

export function getCBSUserInfo() {
  return instance.request<CommonResponse<CBSUserInfo>>({
    method: "get",
    url: "/api/v1/cbs_user/info",
  });
}
