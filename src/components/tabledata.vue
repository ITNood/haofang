<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span>订单量 | Order</span>
          </div>
          <div class="num relative">
            <!-- <countTo :startVal='0' :endVal="1561" :duration='2000' style="font-size:2.5rem;" ></countTo> -->
            {{ order }}
            <div class="absolute percentage">
              <p>{{ 1512 }}</p>
              <p style="color: #008a00">154%</p>
              <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span>销售额 | Sales</span>
          </div>
          <div class="num relative">
            {{ sales }}
            <div class="absolute percentage">
              <p>1512</p>
              <p style="color: #008a00">154%</p>
              <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span>总花费 | Cost</span>
          </div>
          <div class="num relative">
            {{ cost }}
            <div class="absolute percentage">
              <p>1512</p>
              <p style="color: #008a00">154%</p>
              <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "tableData",
  props: { order: String, sales: String, cost: String },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style  scoped>
</style>