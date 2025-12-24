/* eslint-disable */
import roleList from "@/assets/json/authMenuList.json";

const STORAGE_KEY = "GEEKER_MENU_DB";

// 获取/初始化数据库
const getDB = () => {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    return JSON.parse(localData);
  } else {
    // 兼容处理：如果 json 是数组直接用，如果是对象取 .data
    const initData = Array.isArray(roleList) ? roleList : (roleList as any).data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initData));
    return JSON.parse(JSON.stringify(initData));
  }
};

const saveDB = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * @name 菜单管理模块
 */

// 获取菜单列表
export const getMenuList = (params: any) => {
  const db = getDB();
  // 注意：菜单是树形结构，前端搜索比较麻烦，这里简单模拟直接返回全量
  // 实际项目中通常由后端进行树形数据的过滤
  return Promise.resolve({
    code: 200,
    data: db, // 直接返回数组，ProTable 会自动根据 row-key 渲染成树
    msg: "success"
  });
};

// 新增菜单
export const addMenu = (params: any) => {
  return Promise.resolve({ code: 200, msg: "添加成功 (演示)" });
};

// 编辑菜单
export const editMenu = (params: any) => {
  return Promise.resolve({ code: 200, msg: "编辑成功 (演示)" });
};

// 删除菜单
export const deleteMenu = (params: { id: string[] }) => {
  return Promise.resolve({ code: 200, msg: "删除成功 (演示)" });
};