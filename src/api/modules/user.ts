/* eslint-disable */
import { ResPage, User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 引入本地 JSON
import studentList from "@/assets/json/studentList.json";

// ==========================================
// 核心修改：创建一个“内存数据库”
// 防止每次刷新都重新读取静态 JSON
// ==========================================
let mockDB = JSON.parse(JSON.stringify(studentList));

/**
 * @name 用户管理模块 (本地 Mock 版)
 */

// 获取用户列表 (支持简单的姓名搜索)
export const getUserList = (params: User.ReqUserParams) => {
  // 模拟搜索功能
  let res = JSON.parse(JSON.stringify(mockDB));
  if (params.username) {
    res.data.list = res.data.list.filter((item: any) => item.username.includes(params.username));
  }
  // 更新分页的总数量
  res.data.total = mockDB.data.list.length;
  return Promise.resolve(res);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户 (真的往数组里 push 一个)
export const addUser = (params: { id: string }) => {
  const newUser = {
    id: new Date().getTime().toString(), // 随机生成个ID
    ...params,
    createTime: new Date().toLocaleString(),
    status: 1
  };
  // 插入到最前面
  mockDB.data.list.unshift(newUser);
  return Promise.resolve({ code: 200, msg: "添加成功 (本地模拟)" });
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return Promise.resolve({ code: 200, msg: "批量添加成功 (本地模拟)" });
};

// 编辑用户 (真的修改数组里的数据)
export const editUser = (params: { id: string }) => {
  const index = mockDB.data.list.findIndex((item: any) => item.id === params.id);
  if (index !== -1) {
    // 合并修改的数据
    mockDB.data.list[index] = { ...mockDB.data.list[index], ...params };
  }
  return Promise.resolve({ code: 200, msg: "编辑成功 (本地模拟)" });
};

// 删除用户 (真的从数组里剔除)
export const deleteUser = (params: { id: string[] }) => {
  // 过滤掉要删除的ID
  mockDB.data.list = mockDB.data.list.filter((item: any) => !params.id.includes(item.id));
  return Promise.resolve({ code: 200, msg: "删除成功 (本地模拟)" });
};

// 切换用户状态 (真的改状态)
export const changeUserStatus = (params: { id: string; status: number }) => {
  const index = mockDB.data.list.findIndex((item: any) => item.id === params.id);
  if (index !== -1) {
    mockDB.data.list[index].status = params.status;
  }
  return Promise.resolve({ code: 200, msg: "状态修改成功 (本地模拟)" });
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return Promise.resolve({ code: 200, msg: "重置成功 (本地模拟)" });
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return Promise.resolve({
    code: 200,
    data: [
      { userLabel: "启用", userStatus: 1, tagType: "success" },
      { userLabel: "禁用", userStatus: 0, tagType: "danger" }
    ],
    msg: "success"
  });
};

// 获取用户性别字典
export const getUserGender = () => {
  return Promise.resolve({
    code: 200,
    data: [
      { genderLabel: "男", genderValue: 1 },
      { genderLabel: "女", genderValue: 2 }
    ],
    msg: "success"
  });
};

// 获取部门列表
export const getUserDepartment = () => {
  return Promise.resolve({
    code: 200,
    data: [{ id: "1", name: "计算机学院" }],
    msg: "success"
  });
};
