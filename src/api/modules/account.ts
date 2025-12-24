/* eslint-disable */
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import accountList from "@/assets/json/accountList.json";

const STORAGE_KEY = "GEEKER_ACCOUNT_DB";

// 获取/初始化数据库
const getDB = () => {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    return JSON.parse(localData);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accountList));
    return JSON.parse(JSON.stringify(accountList));
  }
};

const saveDB = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * @name 账号管理模块
 */

// 获取账号列表
export const getAccountList = (params: any) => {
  const db = getDB();
  let res = JSON.parse(JSON.stringify(db));

  // 模拟搜索 (用户名或真实姓名)
  if (params.username) {
    res.data.list = res.data.list.filter(
      (item: any) => item.username.includes(params.username) || item.realName.includes(params.username)
    );
  }
  // 模拟状态筛选
  if (params.status !== undefined && params.status !== null) {
    res.data.list = res.data.list.filter((item: any) => item.status == params.status);
  }

  res.data.total = res.data.list.length;
  return Promise.resolve(res);
};

// 新增账号
export const addAccount = (params: any) => {
  const db = getDB();
  const newAccount = {
    id: new Date().getTime().toString(),
    ...params,
    createTime: new Date().toLocaleString(),
    status: 1
  };
  db.data.list.unshift(newAccount);
  saveDB(db);
  return Promise.resolve({ code: 200, msg: "添加成功" });
};

// 编辑账号
export const editAccount = (params: any) => {
  const db = getDB();
  const index = db.data.list.findIndex((item: any) => item.id === params.id);
  if (index !== -1) {
    db.data.list[index] = { ...db.data.list[index], ...params };
    saveDB(db);
  }
  return Promise.resolve({ code: 200, msg: "编辑成功" });
};

// 删除账号
export const deleteAccount = (params: { id: string[] }) => {
  const db = getDB();
  db.data.list = db.data.list.filter((item: any) => !params.id.includes(item.id));
  saveDB(db);
  return Promise.resolve({ code: 200, msg: "删除成功" });
};

// 切换状态
export const changeAccountStatus = (params: { id: string; status: number }) => {
  const db = getDB();
  const index = db.data.list.findIndex((item: any) => item.id === params.id);
  if (index !== -1) {
    db.data.list[index].status = params.status;
    saveDB(db);
  }
  return Promise.resolve({ code: 200, msg: "状态修改成功" });
};

// 重置密码
export const resetPassword = (params: { id: string }) => {
  return Promise.resolve({ code: 200, msg: "密码重置为 123456" });
};

// 角色字典
export const getRoleStatus = () => {
  return Promise.resolve({
    code: 200,
    data: [
      { label: "管理员", value: "管理员" },
      { label: "普通用户", value: "普通用户" },
      { label: "访客", value: "访客" }
    ],
    msg: "success"
  });
};