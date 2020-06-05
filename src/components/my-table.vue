<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :stripe="true"
      ref="cesTable"
      height="530"
      @select="handleselectRow"
      @select-all="handleselectAll"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column  prop="resourceCode" label="资源ID" width="80"></el-table-column>
      <el-table-column prop="name" label="资源名称"></el-table-column>
      <el-table-column prop="version" label="资源版本号"></el-table-column>
      <el-table-column prop="platformTypeName" label="平台"></el-table-column>
    </el-table>
    <el-pagination
      style="display: flex;justify-content: center;height: 100%;align-items: center; "
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[1,10,20,50,100]"
      layout="total,sizes ,prev, pager, next,jumper"
      :page-size="pageData.pageSize"
      :current-page="pageData.pageNum"
      :total="pageData.total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    tableData: { type: Array, default: () => [] }, // 表格的数据
      // 分页数据
    pageData: { type: Object, default: () => ({ pageNum: 1, pageSize: 10, total: 0 }) },
  },
  data() {
    return {
      selectObj: {}, // 用来存储选中的表格的数据
      choiceArr: {} // 传递给父组件的最终选中的数据
    }
  },
  methods: {
    // 改变分页页数
    handleSizeChange(val) {
      this.pageData.pageSize = val;
      this.$emit('ChangePage', this.pageData);
    },
    // 改变分页当前页
    handleCurrentChange(val) {
      this.pageData.pageNum = val;
      this.$emit('ChangePage', this.pageData);
    },
    // 行选中函数  若有删除，若无添加
    handleselectRow(selection, row) {
      if (this.selectObj[row.id]) delete this.selectObj[row.id]
      else this.selectObj[row.id] = row.id
    },
    // 全选函数  点击全选遍历当页数据若无添加,若是反选则删除(判断是否是全选还是反选)
    handleselectAll(selection) {
      this.tableData.forEach((row) => {
        if (this.selectObj.hasOwnProperty(row.id)) {
          selection.length ? null : delete this.selectObj[row.id]
        } else this.selectObj[row.id] = row.id
      });
    },
    // 记忆函数
    defaultChoice() {
      this.tableData.forEach((row) => {
        if (this.selectObj.hasOwnProperty(row.id)) {
          this.$refs.cesTable.toggleRowSelection(row, true);
        } else {
          this.$refs.cesTable.toggleRowSelection(row, false);
        }
      });
    },
    // 父组件点击确定按钮时触发
    configPush() {
      /**  在弹框点击确定的时候才将选中的数据传递，
      不然的话，如果用户点击的是取消，也会将后面选中的数据传递给弹框 */
      this.choiceArr = { ...this.selectObj }
      this.$emit('update:choseTableFun', this.choiceArr)
    },
    // 父组件点击取消时触发
    canclePush() {
    // 如果用户点击取消的话就不将后面选中的数据传递，恢复成原来选中的数据
      this.selectObj = { ...this.choiceArr }
      // 改变选中状态
      this.$nextTick(function () { this.defaultChoice() })
    },
    // 清除所有选中状态
    clearChoiceData() {
      this.selectObj = {}
      this.choiceArr = {}
      this.$nextTick(function () { this.defaultChoice() })
    },
  },
}
</script>