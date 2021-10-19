<template>
  <div>
      <el-pagination class="page" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"  :page-sizes="[10,20,30,40,50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
  </div>
</template>

<script>
export default {
  props:['currentPage','total'],
  name:'Pagination',
  data() { 
    return {

    }
  },
  created() {

  },
  mounted() {
  },
  methods:{
      handleCurrentChange(val){
          this.$emit('handleCurrentChange',val)
      },
      handleSizeChange(val){
          this.$emit('handleSizeChange',val)
      }
  },
 }
</script>

<style lang="scss"  scoped>
.page{
    text-align: right;
    margin-top: 20px;
}
</style>