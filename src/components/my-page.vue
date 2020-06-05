<template>
  <div>
    <myTable
      :tableData="tableData"
      :pageData="pageData"
      @ChangePage="ChangePage"
      :choseTableFun.sync="choseTableFun"
      ref="childTable"
    ></myTable>
    <div class="footer-btn-wrap">
      <el-button @click="cancleChoice">取消</el-button>
      <el-button type="primary" @click="configChoice">确定</el-button>
    </div>
  </div>
</template>
<script>
import myTable from '@/components/my-table.vue' // 引入table组件
import $http from '../router/http' // 这个是axios的接口配置
export default {
  props: {
   // 父组件传递的控制弹框显示隐藏，因为弹框的确定取消按钮在这里，所以为了方便也传递给这个组件了
    showDialogState: { type: Boolean, default: false }
  },
  components: {
    myTable
  },
  data() {
    return {
      pageData: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 所有的表格的数据，因为会有分页，所有将每个分页的数据都push到一个数组里面，方便循环
      allTableData: [], 
      // 表格的数据
      tableData: [], 
      // 用来储存table组件传递过来选中的数据
      choseTableFun: {} 
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    // 接口方法-获取列表数据
    async getListData() {
    // 接口方法就改成自己封装好的方法就好了
      let res = await $http({
        url: '/xxxxx/xxxx/xxx', // 改成自己的接口地址 
        method: 'get',
        datatype: 'application/json',
        params: { ...this.pageData },
      })
      if (res.code !== 0) return this.$common.tipsPop(res.msg, 'error')
      let list = res.data.records
      for (let i in list) {
        list[i].platformTypeName = list[i].platformType === '1' ? '安卓' : 'IOS'
      }
      this.tableData = list
      this.pageData.total = res.data.total
      /** 将每一页的数据都push到一个数组里面方便后续循环，
      判断allTableData的长度是否等于总的数据长度，这样就不用每一次获取数据都要push一次影响性能*/
      if (this.allTableData.length !== res.data.total) {
        this.allTableData = this.allTableData.concat(this.tableData)
        this.allTableData = [...new Set(this.allTableData)]
      }
      // 翻页的时候保持勾选状态
      this.$nextTick(function () {
        this.$refs.childTable.defaultChoice();
      })
    },
    // 操作分页-重新加载表格
    ChangePage(data) {
      this.pageData = data
      this.getListData()
    },
    // 点击了取消按钮
    cancleChoice() {
      this.$refs.childTable.canclePush()
      this.$emit('update:showDialogState', false)
    },
    // 点击了确定按钮
    configChoice() {
      this.$refs.childTable.configPush()
      let sendParentData = []
      /** 因为传递过来的只是id，但是父组件可能会用到某条数据的其他属性，
      所以通过选中的数据的id和总的数据比较，相等的话就将该条数据存起来*/
      for (let i in this.allTableData) {
        for (let j in this.choseTableFun) {
          if (this.allTableData[i].id === this.choseTableFun[j]) {
            sendParentData.push(this.allTableData[i])
          }
        }
      }
      // 将最终选中的数据返回到index页面，并关闭弹窗，清除表格的勾选状态
      this.$emit('update:showDialogState', false)
      this.$emit('tableChoiceData', sendParentData)
      if(this.clearChoiceDataState) this.$refs.childTable.clearChoiceData()
    }
  }
}
</script>
<style scoped>
.footer-btn-wrap {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>