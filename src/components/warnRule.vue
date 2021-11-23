<template>
  <div>
    <el-row :gutter="20">
      <el-col :md="24" :lg="16" :xl="15">
        <el-table
          :data="ruleData"
          border
          :header-cell-style="{ background: '#858796', color: '#fff' }"
          max-height="560"
        >
          <el-table-column label="是否有效" prop="isEffective">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isEffective" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="Campaign/Keyword"
            prop="alertCampaign"
            width="200"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: '/campaign',
                  query: { id: scope.row.conditionId },
                }"
                class="posterName"
                >{{ scope.row.alertCampaign }}</router-link
              >
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="state">
            <template slot-scope="scope">
              <p v-if="scope.row.state === 1" style="color: #008a00">启用</p>
              <p v-else style="color: #e74a3b">禁用</p>
            </template>
          </el-table-column>
          <el-table-column
            label="起始时间"
            prop="alertMonitorStartDate"
          ></el-table-column>
          <el-table-column
            label="结束时间"
            prop="alertMonitorEndDate"
          ></el-table-column>
          <el-table-column
            label="历史触发数"
            prop="triggerNumber"
          ></el-table-column>
          <el-table-column label="已达标天数" prop="reachDay"></el-table-column>
          <el-table-column
            label="创建日期"
            prop="createDateTime"
          ></el-table-column>
          <el-table-column
            label="创建人"
            prop="alertCreateUser"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="tableBtn">
                <el-button
                  @click="deleRules(scope.$index, scope.row)"
                  type="danger"
                  size="mini"
                  >删除</el-button
                >
                <el-button
                  @click="ruleLook(scope.row)"
                  type="primary"
                  size="mini"
                  >查看</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :currentPage="currentPage"
          :total="totalPage"
          @handleSizeChange="sizeChange"
          @handleCurrentChange="currentChange"
        />
      </el-col>
      <el-col :md="24" :lg="8" :xl="9">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="card">
              <div slot="header" class="clearfix">
                <span>订单量 | Order</span>
              </div>
              <div class="num relative">
                {{ ruleOrder }}
                <div class="absolute percentage">
                  <p>{{ 1512 }}</p>
                  <p style="color: #008a00">154%</p>
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
                {{ ruleSales }}
                <div class="absolute percentage">
                  <p>1512</p>
                  <p style="color: #008a00">154%</p>
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
                {{ ruleCost }}
                <div class="absolute percentage">
                  <p>1512</p>
                  <p style="color: #008a00">154%</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div id="ruleCharts"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import api from "../API/index";
import pagination from "../components/pagination.vue";
export default {
  name: "warnRule",
  components: { pagination },
  data() {
    return {
      ruleData: [],
      ruleOrder: 0,
      ruleSales: 0,
      ruleCost: 0,
      currentPage: 1,
      pagesize: 10,
      totalPage: 0,
    };
  },
  created() {
    //预警规则
    const data = { current: this.currentPage, size: this.pagesize };
    this.getwarnRules(data);
  },
  mounted() {
    this.ruleCharts();
  },
  methods: {
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //预警规则
    getwarnRules(data) {
      api
        .post("adAlterCenter/findAllAlertCenter", data)
        .then((res) => {
          if (res.data.list.length > 0) {
            this.ruleData = res.data.list;
            this.totalPage = res.data.total;
            const now = this.getNowFormatDate();
            this.ruleData.map((item, index) => {
              const start = item.alertMonitorStartDate,
                end = item.alertMonitorEndDate;
              if (now > start && now < end) {
                item.isEffective = true;
              } else {
                item.isEffective = false;
              }
            });
            //默认取第一条数据渲染右侧
            this.ruleOrder = res.data.list[0].sumOrder;
            this.ruleSales = res.data.list[0].sumSales;
            this.ruleCost = res.data.list[0].sumCost;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    //每页显示数据条数
    sizeChange(val) {
      this.pagesize = val;
      const data = { current: this.currentPage, size: this.pagesize };
      this.getwarnRules(data);
    },
    //当前页数
    currentChange(val) {
      this.currentPage = val;
      const data = { current: this.currentPage, size: this.pagesize };
      this.getwarnRules(data);
    },
    //预警规则查看
    ruleLook(row) {
      console.log(row);
      this.ruleOrder = row.sumOrder;
      this.ruleSales = row.sumSales;
      this.ruleCost = row.sumCost;
    },
    //删除预警规则
    deleRules(index, row) {
      this.$confirm("是否删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api
            .put("adAlterCenter/alertCondition", { id: row.conditionId })
            .then((res) => {
              if (res.code == 200) {
                this.$message.success("删除成功！！！");
                const data = {
                  current: this.currentPage,
                  size: this.pagesize,
                };
                this.getwarnRules(data);
              } else if (res.code == 400) {
                this.$message.error("删除失败！！！");
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {});
        })
        .catch((err) => {});
    },
    ruleCharts() {
      const chartDom = document.getElementById("ruleCharts");
      const myChart = echarts.init(chartDom);
      const option = {
        grid: {
          left: "3%",
          right: "4%",
          bottom: "12%",
          top: "5%",
          containLabel: true,
        },
        color: ["#409EFF"],
        tooltip: {
          trigger: "item",
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            barWidth: 20,
          },
        ],
      };
      option && myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
  },
};
</script>

<style  scoped>
</style>