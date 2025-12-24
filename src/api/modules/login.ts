import { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 关键点1：引入你的 JSON 文件
import authMenuList from "@/assets/json/authMenuList.json";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(PORT1 + `/login`, params, { noLoading: true });
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { noLoading: true });
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  // 关键点2：注释掉原来的请求，直接返回本地 JSON 数据
  // return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`, {}, { noLoading: true });

  // 伪造一个成功的返回，把你的 json 塞进去
  return Promise.resolve({
    code: 200,
    data: authMenuList,
    msg: "success"
  });
};

// 退出登录
export const logoutApi = () => {
  return http.post(PORT1 + `/logout`);
};
