<template>
  <div id="app">
    <el-button type="primary" @click="showDialog">点击弹出弹框</el-button>
    <div v-show="tableChoiceData.length === undefined">请点击按钮进行选择</div>
    <div v-show="tableChoiceData.length>0" class="list">
      <div v-for="(item, index) in tableChoiceData" :key="index">{{index+1}} - {{item}}</div>
    </div>
    <myDialog :showDialogState.sync="showDialogState">
      <myPage 
        :showDialogState.sync="showDialogState" 
        @tableChoiceData="changeChoiceData"
      ></myPage>
    </myDialog>
  </div>
</template>

<script>
import myDialog from '@/components/my-dialog.vue'
import myPage from '@/components/my-page.vue'
export default {
  name: 'app',
  components: {
    myDialog,
    myPage
  },
  data() {
    return {
      showDialogState: false,
      tableChoiceData: {}
    }
  },
  methods: {
    // 点击按钮显示弹框
    showDialog() {
      this.showDialogState = true
    },
    // 获取子组件传递过来的选中的数据
    changeChoiceData(data) {
      let dataName = []
      for(let i in data) {
        dataName.push(data[i].name)
      }
      this.tableChoiceData = dataName
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.list{
  width:30%;
  margin:10px auto;
  text-align: left;
  line-height: 28px;
}
</style>
