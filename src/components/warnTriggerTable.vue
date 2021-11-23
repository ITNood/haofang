<template>
  <div>
    <div class="publicTitle">预警触发表</div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table
          :data="warnTable"
          border
          max-height="500"
          :header-cell-style="{ background: '#858796', color: '#fff' }"
        >
          <el-table-column
            label="Campaign/Keyword"
            prop="alertCampaign"
            width="200"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: '/campaign',
                  query: {
                    id: scope.row.id,
                    name: scope.row.alertCampaign,
                  },
                }"
                class="posterName"
                >{{ scope.row.alertCampaign }}</router-link
              >
            </template>
          </el-table-column>
          <el-table-column
            label="预警指标"
            prop="forewarnQuota"
          ></el-table-column>
          <el-table-column
            label="判断条件"
            prop="forewarnCondition"
          ></el-table-column>
          <el-table-column label="阈值" prop="threshold"></el-table-column>
          <el-table-column
            label="持续天数"
            prop="continueDay"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="look(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :currentPage="currentPage"
          :total="totalPage"
          @handleSizeChange="sizeChange"
          @handleCurrentChange="currentChange"
        />
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="card">
              <div slot="header" class="clearfix">
                <span>订单量 | Order</span>
              </div>
              <div class="num relative">
                {{ order }}
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
                {{ sales }}
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
                {{ cost }}
                <div class="absolute percentage">
                  <p>1512</p>
                  <p style="color: #008a00">154%</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div id="dataCharts"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import Pagination from "../components/pagination.vue";
import api from "../API/index";
export default {
  name: "warnTriggerTable",
  components: { Pagination },
  data() {
    return {
      warnTable: [],
      currentPage: 1,
      pagesize: 10,
      totalPage: 0,
      order: 0,
      sales: 0,
      cost: 0,
    };
  },
  created() {
    //预警触发表
    const res = { current: this.currentPage, size: this.pagesize };
    this.getWarnTrigger(res);
  },
  mounted() {},
  methods: {
    //每页显示数据条数
    sizeChange(val) {
      this.pagesize = val;
      const res = { current: this.currentPage, size: this.pagesize };
      this.getWarnTrigger(res);
    },
    //当前页数
    currentChange(val) {
      this.currentPage = val;
      const res = { current: this.currentPage, size: this.pagesize };
      this.getWarnTrigger(res);
    },
    look(row) {
      this.order = row.sumOrder;
      this.sales = row.sumSales;
      this.cost = row.sumCost;
      const data = {
        alertColumn: row.forewarnQuota,
        campaignOrKeyWord: row.alertCampaign,
        centerDay: row.continueDay,
        forewarnCondition: row.forewarnCondition,
        dataType: row.dataType,
        monitorEndDate: row.monitorEndDate,
        monitorStartDate: row.monitorStartDate,
        threshold: row.threshold,
      };
      this.getEcharts(data);
    },

    //预警触发表
    getWarnTrigger(res) {
      api
        .post("adAlterCenter/findAllAlertCenterTrigger", res)
        .then((res) => {
          if (res.data.records.length > 0) {
            this.warnTable = res.data.records;
            const row = res.data.records[0];
            const data = {
              alertColumn: row.forewarnQuota,
              campaignOrKeyWord: row.alertCampaign,
              centerDay: row.continueDay,
              forewarnCondition: row.forewarnCondition,
              dataType: row.dataType,
              monitorEndDate: row.monitorEndDate,
              monitorStartDate: row.monitorStartDate,
              threshold: row.threshold,
            };
            this.getEcharts(data);
          } else {
            this.warnTable = "";
          }
          this.totalPage = res.data.total;
          this.order = res.data.records[0].sumOrder;
          this.sales = res.data.records[0].sumSales;
          this.cost = res.data.records[0].sumCost;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    getEcharts(data) {
      api
        .post("/adAlterCenter/alertCenterStatistics", data)
        .then((res) => {
          if (res.code == 200) {
            const date = res.data.requestDate,
              newData = res.data.alertColumn;
            this.charts(date, newData);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },

    //echarts
    charts(date, newData) {
      const chartDom = document.getElementById("dataCharts");
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
          data: date,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: newData,
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