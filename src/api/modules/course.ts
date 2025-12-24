/* eslint-disable */
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 引入初始 JSON
import courseList from "@/assets/json/courseList.json";

const STORAGE_KEY = "GEEKER_COURSE_DB";

// 获取/初始化数据库
const getDB = () => {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    return JSON.parse(localData);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courseList));
    return JSON.parse(JSON.stringify(courseList));
  }
};

const saveDB = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * @name 课程管理模块
 */

// 获取课程列表
export const getCourseList = (params: any) => {
  const db = getDB();
  let res = JSON.parse(JSON.stringify(db));

  // 模拟搜索
  if (params.courseName) {
    res.data.list = res.data.list.filter((item: any) => item.courseName.includes(params.courseName));
  }
  // 模拟筛选状态
  if (params.status !== undefined && params.status !== null) {
    // 注意0也是有效值
    res.data.list = res.data.list.filter((item: any) => item.status == params.status);
  }

  res.data.total = res.data.list.length;
  return Promise.resolve(res);
};

// 新增课程
export const addCourse = (params: any) => {
  const db = getDB();
  const newCourse = {
    id: new Date().getTime().toString(),
    ...params,
    status: 1
  };
  db.data.list.unshift(newCourse);
  saveDB(db);
  return Promise.resolve({ code: 200, msg: "添加成功" });
};

// 编辑课程
export const editCourse = (params: any) => {
  const db = getDB();
  const index = db.data.list.findIndex((item: any) => item.id === params.id);
  if (index !== -1) {
    db.data.list[index] = { ...db.data.list[index], ...params };
    saveDB(db);
  }
  return Promise.resolve({ code: 200, msg: "编辑成功" });
};

// 删除课程
export const deleteCourse = (params: { id: string[] }) => {
  const db = getDB();
  db.data.list = db.data.list.filter((item: any) => !params.id.includes(item.id));
  saveDB(db);
  return Promise.resolve({ code: 200, msg: "删除成功" });
};

// 课程状态字典
export const getCourseStatus = () => {
  return Promise.resolve({
    code: 200,
    data: [
      { label: "已开课", value: 1, tagType: "success" },
      { label: "已结课", value: 0, tagType: "info" }
    ],
    msg: "success"
  });
};
