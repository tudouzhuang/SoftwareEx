<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="path"
      :indent="20"
      :columns="columns"
      :request-api="getMenuList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增菜单</el-button>
        <el-button type="info" :icon="Sort" plain @click="toggleExpand">展开/折叠</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="CirclePlus" @click="openDrawer('新增子菜单', scope.row)">添加下级</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteMenuFunc(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="menuManageFixed">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Sort } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";

// 引入 API
import { getMenuList, addMenu, editMenu, deleteMenu } from "@/api/modules/menu";

const proTable = ref();

// 初始化参数
const initParam = reactive({});

// 数据回调
const dataCallback = (data: any) => {
  return {
    list: data, // 菜单接口通常直接返回数组，不需要 list/total 结构
    total: data.length
  };
};

// 切换展开/折叠
const isExpand = ref(false);
const toggleExpand = () => {
  isExpand.value = !isExpand.value;
  const nodes = proTable.value?.element?.store?.states?.data.value;
  setExpand(nodes, isExpand.value);
};
// 递归设置展开
const setExpand = (nodes: any[], isExpand: boolean) => {
  nodes.forEach(item => {
    proTable.value?.element?.toggleRowExpansion(item, isExpand);
    if (item.children && item.children.length) setExpand(item.children, isExpand);
  });
};

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input" }, minWidth: 200 },
  {
    prop: "meta.icon",
    label: "图标",
    width: 100,
    render: scope => {
      return <el-icon size={18}>{scope.row.meta.icon ? <component is={scope.row.meta.icon}></component> : null}</el-icon>;
    }
  },
  { prop: "name", label: "菜单 Name", search: { el: "input" }, minWidth: 150 },
  { prop: "path", label: "路由路径", width: 300, search: { el: "input" } },
  { prop: "component", label: "组件路径", width: 300 },
  {
    prop: "meta.isHide",
    label: "显示",
    width: 100,
    render: scope => {
      return <el-tag type={scope.row.meta.isHide ? "info" : "success"}>{scope.row.meta.isHide ? "隐藏" : "显示"}</el-tag>;
    }
  },
  {
    prop: "meta.isKeepAlive",
    label: "缓存",
    width: 100,
    render: scope => {
      return <el-tag type={scope.row.meta.isKeepAlive ? "success" : "info"}>{scope.row.meta.isKeepAlive ? "是" : "否"}</el-tag>;
    }
  },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
];

// 删除菜单
const deleteMenuFunc = async (params: any) => {
  await useHandleData(deleteMenu, { id: [params.path] }, `删除菜单【${params.meta.title}】`);
  proTable.value?.getTableList();
};

// 打开抽屉
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  if (title === "新增子菜单") {
    // 演示：新增子菜单逻辑
    ElMessage.info("演示：准备为 " + row.meta.title + " 添加子菜单");
    return;
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addMenu : title === "编辑" ? editMenu : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
