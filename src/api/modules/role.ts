/* eslint-disable */
import http from "@/api";
import roleList from "@/assets/json/roleList.json";

const STORAGE_KEY = "GEEKER_ROLE_DB";

// 获取/初始化数据库
const getDB = () => {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    return JSON.parse(localData);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roleList));
    return JSON.parse(JSON.stringify(roleList));
  }
};

const saveDB = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * @name 角色管理模块
 */

// 获取角色列表
export const getRoleList = (params: any) => {
  const db = getDB();
  let res = JSON.parse(JSON.stringify(db));

  // 模拟搜索
  if (params.roleName) {
    res.data.list = res.data.list.filter((item: any) => item.roleName.includes(params.roleName));
  }
  // 模拟状态筛选
  if (params.status !== undefined && params.status !== null) {
    res.data.list = res.data.list.filter((item: any) => item.status == params.status);
  }

  res.data.total = res.data.list.length;
  return Promise.resolve(res);
};

// 新增角色
export const addRole = (params: any) => {
  const db = getDB();
  const newRole = {
    id: new Date().getTime().toString(),
    ...params,
    createTime: new Date().toLocaleString(),
    status: 1
  };
  db.data.list.unshift(newRole);
  saveDB(db);
  return Promise.resolve({ code: 200, msg: "添加成功" });
};

// 编辑角色
export const editRole = (params: any) => {
  const db = getDB();
  const index = db.data.list.findIndex((item: any) => item.id === params.id);
  if (index !== -1) {
    db.data.list[index] = { ...db.data.list[index], ...params };
    saveDB(db);
  }
  return Promise.resolve({ code: 200, msg: "编辑成功" });
};

// 删除角色
export const deleteRole = (params: { id: string[] }) => {
  const db = getDB();
  db.data.list = db.data.list.filter((item: any) => !params.id.includes(item.id));
  saveDB(db);
  return Promise.resolve({ code: 200, msg: "删除成功" });
};

// 切换角色状态
export const changeRoleStatus = (params: { id: string; status: number }) => {
  const db = getDB();
  const index = db.data.list.findIndex((item: any) => item.id === params.id);
  if (index !== -1) {
    db.data.list[index].status = params.status;
    saveDB(db);
  }
  return Promise.resolve({ code: 200, msg: "状态修改成功" });
};

// 角色状态字典
export const getRoleStatusEnum = () => {
  return Promise.resolve({
    code: 200,
    data: [
      { label: "启用", value: 1, tagType: "success" },
      { label: "禁用", value: 0, tagType: "danger" }
    ],
    msg: "success"
  });
};