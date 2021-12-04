<template>
  <div>
    <div class="title">
      Campaign<i></i><dfn>{{ text }}</dfn>
    </div>
    <section>
      <el-tabs v-model="activeName" class="tabs" @tab-click="count">
        <el-tab-pane label="广告活动指标" name="1">
          <el-row :gutter="20">
            <Card :card="card" @closeCard="closeCard" />
            <el-col :md="8" :lg="6" :xl="4">
              <el-card class="card" @click.native="cardDialog = true">
                <div
                  slot="header"
                  class="clearfix"
                  style="text-align: center; color: #005a95"
                >
                  <span>添加指标 | Add Metrics</span>
                </div>
                <div class="addicoon el-icon-plus"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="销售数据指标" name="2">
          <el-row :gutter="20">
            <SalesCard :market="market" @closeCard="closeCard" />
            <el-col :md="8" :lg="6" :xl="4">
              <el-card class="card" @click.native="cardDialog = true">
                <div
                  slot="header"
                  class="clearfix"
                  style="text-align: center; color: #005a95"
                >
                  <span>添加指标 | Add Metrics</span>
                </div>
                <div class="addicoon el-icon-plus"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </section>
    <!--添加卡片-->
    <el-dialog
      :visible.sync="cardDialog"
      width="30%"
      :close-on-click-modal="false"
      title="添加指标"
    >
      <el-select placeholder="请选择" v-model="selectTarget" style="width: 48%">
        <el-option
          v-for="item in selects"
          :key="item.id"
          :label="item.name"
          :disabled="item.disabled"
          :value="item.id"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cardDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCard">确 定</el-button>
      </div>
    </el-dialog>

    <section>
      <el-tabs
        v-model="activetabs"
        class="tabs"
        style="margin-top: 20px"
        @tab-click="handleClick"
      >
        <el-tab-pane lazy label="指标对比图" name="1">
          <el-row :gutter="40">
            <el-col :lg="18" :md="16">
              <div id="firstMap"></div>
            </el-col>
            <el-col :lg="6" :md="8">
              <el-form :model="form" ref="form">
                <ul class="formlist">
                  <li>
                    <el-button size="medium">对比指标1：</el-button>
                    <el-select v-model="form.target1" placeholder="请选择">
                      <el-option
                        v-for="item in target"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <dfn
                      class="icon iconfont icon-brokenLine"
                      @click="typeLine1"
                    ></dfn>
                    <dfn class="el-icon-s-data" @click="typeBar1"></dfn>
                  </li>
                  <li>
                    <el-button size="medium">对比指标2：</el-button>
                    <el-select v-model="form.target2" placeholder="请选择">
                      <el-option
                        v-for="item in target"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <dfn
                      class="icon iconfont icon-brokenLine"
                      @click="typeLine2"
                    ></dfn>
                    <dfn class="el-icon-s-data" @click="typeBar2"></dfn>
                  </li>
                  <li>
                    <el-button size="medium">对比指标3：</el-button>
                    <el-select v-model="form.target3" placeholder="请选择">
                      <el-option
                        v-for="item in target"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <dfn
                      class="icon iconfont icon-brokenLine"
                      @click="typeLine3"
                    ></dfn>
                    <dfn class="el-icon-s-data" @click="typeBar3"></dfn>
                  </li>
                  <li>
                    <el-button size="medium">时间</el-button>
                    <el-select
                      v-model="form.comparisonPeriod"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in time"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-button class="el-icon-check plot" @click="newCharts()"
                      >生成图表</el-button
                    >
                  </li>
                  <li>
                    <el-row :gutter="30">
                      <el-col :span="12">
                        <el-button
                          size="medium"
                          class="plotBtn"
                          @click="submitImpAndClk"
                          >Imp vs Clk</el-button
                        >
                      </el-col>
                      <el-col :span="12">
                        <el-button
                          size="medium"
                          class="plotBtn"
                          @click="submitCostAndSale"
                          >Cost VS Sale</el-button
                        >
                      </el-col>
                    </el-row>
                  </li>
                  <li>
                    <el-row :gutter="30">
                      <el-col :span="12">
                        <el-button
                          size="medium"
                          class="plotBtn"
                          @click="submitCvrAndCtr"
                          >CVR VS CTR</el-button
                        >
                      </el-col>
                      <!-- <el-col :span="12">
                        <el-button size="medium" class="plotBtn el-icon-edit edit" @click="newCharts">修改常用图</el-button>
                      </el-col> -->
                    </el-row>
                  </li>
                </ul>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane lazy label="时段成交数据图" name="2">
          <el-row :gutter="50">
            <el-col :lg="18" :md="16">
              <div id="timeMap"></div>
            </el-col>
            <el-col :lg="6" :md="8">
              <el-form :mpodel="dateForm" ref="dateForm">
                <ul class="formlist timeForm">
                  <li>
                    <el-form-item prop="time">
                      <el-button size="medium">付款时间</el-button>
                      <el-date-picker
                        v-model="dateForm.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        style="width: 80%"
                      ></el-date-picker>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item prop="countryCode">
                      <el-button size="medium">站点</el-button>
                      <el-select
                        v-model="dateForm.countryCode"
                        placeholder="请选择"
                        style="width: 80%"
                      >
                        <el-option
                          v-for="item in list"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item prop="asin">
                      <el-button size="medium">ASIN</el-button>
                      <el-select
                        v-model="dateForm.asin"
                        placeholder="请选择"
                        style="width: 80%"
                      >
                        <el-option
                          v-for="item in asin"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item prop="skus">
                      <el-button size="medium">品牌商</el-button>
                      <el-select
                        v-model="dateForm.skus"
                        placeholder="请选择"
                        style="width: 80%"
                      >
                        <el-option
                          v-for="item in sku"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </li>
                  <!-- <li>
                    <el-form-item prop="payDate">
                      <el-button size="medium">月份</el-button>
                      <el-select v-model="dateForm.payDate" placeholder="请选择" style="width:80%">
                        <el-option v-for="item in payTime" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </li> -->
                  <li>
                    <el-form-item prop="sku">
                      <el-button size="medium">产品编码</el-button>
                      <el-select
                        v-model="dateForm.sku"
                        placeholder="请选择"
                        style="width: 80%"
                      >
                        <el-option
                          v-for="item in sku"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </li>
                </ul>
                <el-button class="submit_btn" @click="submitForm"
                  >生成图表</el-button
                >
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </section>

    <section>
      <el-row :gutter="20">
        <el-col :md="16" :lg="16" :xl="19">
          <div class="operation">
            <el-input
              placeholder="查找广告组"
              v-model="content"
              @keydown.enter.native="submit"
              clearable
              style="margin: 0"
            >
              <template slot="prepend"><i class="el-icon-search"></i></template>
            </el-input>
            <!--right-->
            <div class="operationRight">
              <el-select
                placeholder="列/自定义"
                v-model="column"
                multiple
                collapse-tags
                @change="handlChange"
                class="selectColumn"
              >
                <el-option
                  v-for="(item, index) in todos"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>

              <el-button
                type="primary"
                size="medium"
                style="margin-left: 20px"
                @click="exportTable"
                >导出</el-button
              >
            </div>
          </div>
          <el-table
            :data="rulesTable"
            v-loading="loading"
            ref="rulesTable"
            id="rulesTable"
            border
            :header-cell-style="{ background: '#858796', color: '#fff' }"
            max-height="600"
          >
            <el-table-column label="Product" min-width="200" prop="adGroupName">
              <template slot-scope="scope">
                <div class="campaignName">
                  <!-- <img :src="scope.row.img"> -->
                  <p>{{ scope.row.adGroupName }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in listColumn"
              :key="index"
              :prop="item.prop"
              :width="item.width"
              :label="item.name"
            >
              <template slot-scope="scope">{{ scope.row[item.prop] }}</template>
            </el-table-column>
          </el-table>
          <Pagination
            :currentPage="currentPage"
            :total="totalPage"
            @handleSizeChange="sizeChange"
            @handleCurrentChange="currentChange"
          />
        </el-col>
        <el-col :md="8" :lg="8" :xl="5">
          <tableSearch
            :addContent="addContent"
            :conditionName="conditionName"
            :minDate="minDate"
            :maxDate="maxDate"
            :conditionForm="conditionForm"
            @updateMinDate="
              (val) => {
                minDate = val;
              }
            "
            @updateMaxDate="
              (val) => {
                maxDate = val;
              }
            "
            @submit="submit"
            @addRules="addRules"
            @deleteData="deleteData"
          />
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import * as echarts from "echarts";
import Pagination from "../components/pagination.vue";
import api from "../API/index";
import tableSearch from "../components/tableSearch.vue";
import Card from "../components/card.vue";
import SalesCard from "../components/salesCard.vue";

export default {
  components: { Pagination, tableSearch, Card, SalesCard },
  data() {
    return {
      text: "",
      activeName: "1",
      loading: false,
      card: [],
      market: [],
      activetabs: "1",
      form: {
        target1: "impressions",
        target2: "clicks",
        target3: "cost",
        comparisonPeriod: "week",
      },
      dateForm: {
        minDate: "",
        maxDate: "",
        time: "",
        asin: "",
        sku: "",
        countryCode: "",
        queryFlag: 1,
      },
      target: [
        { id: "impressions", name: "Impressions | 曝光量" },
        { id: "clicks", name: "Clicks | 点击量" },
        { id: "attributed_units_ordered_7d", name: "Order | 订单量" },
        { id: "attributed_sales_7d", name: "Sales | 销售额" },
        { id: "cost", name: "Cost | 花费" },
        { id: "clicks/impressions", name: "CTR | 点击率" },
        { id: "attributed_units_ordered_7d/clicks", name: "CVR | 转化率" },
        { id: "cost/clicks", name: "CPC | 单次点击成本" },
        { id: "cost/attributed_units_ordered_7d", name: "CPA | 平均获客成本" },
        { id: "cost/attributed_sales_7d", name: "ACoS | 成本销售比" },
        { id: "attributed_sales_7d/cost", name: "RoAS | 投资回报率" },
      ],
      time: [
        { id: "day", name: "天" },
        { id: "week", name: "周" },
        { id: "month", name: "月" },
        { id: "quarter", name: "季" },
        { id: "year", name: "年" },
      ],
      content: "",
      column: [],
      todos: [
        { id: 1, prop: "isUsing", name: "状态" },
        { id: 2, prop: "sku", name: "SKU/ASIN", width: "280" },
        { id: 3, prop: "impressions", name: "曝光量" },
        { id: 4, prop: "clicks", name: "点击次数" },
        { id: 5, prop: "ctr", name: "点击率（%）" },
        { id: 6, prop: "cost", name: "花费($)" },
        { id: 7, prop: "cpc", name: "CPC" },
        { id: 8, prop: "orders", name: "订单" },
        { id: 9, prop: "sales", name: "销售额" },
        { id: 10, prop: "acos", name: "ACoS(%)" },
        { id: 11, prop: "roas", name: "RoAS(%)" },
      ],
      listColumn: [],

      rulesTable: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 10,
      type1: "line",
      type2: "line",
      type3: "line",
      cardDialog: false,
      adSaleType: 1,
      selects: [
        { id: 1, name: "Impressions" },
        { id: 2, name: "Clicks" },
        { id: 3, name: "Orders" },
        { id: 4, name: "Sales" },
        { id: 5, name: "Cost" },
        { id: 6, name: "CPC" },
        { id: 7, name: "CTR" },
        { id: 8, name: "CVR" },
        { id: 9, name: "ACoS" },
        { id: 10, name: "RoAS" },
      ],
      selectdata: [
        { id: 1, name: "Impressions" },
        { id: 2, name: "Clicks" },
        { id: 3, name: "Orders" },
        { id: 4, name: "Sales" },
        { id: 5, name: "Cost" },
        { id: 6, name: "CPC" },
        { id: 7, name: "CTR" },
        { id: 8, name: "CVR" },
        { id: 9, name: "ACoS" },
        { id: 10, name: "RoAS" },
      ],
      salesData: [
        { id: 11, name: "OrderProductSales" },
        { id: 12, name: "Sales" },
        { id: 13, name: "UnitOrder" },
        { id: 14, name: "Sessions" },
        { id: 15, name: "UnitSession" },
        { id: 16, name: "ACoS" },
        { id: 17, name: "AdProportion" },
        { id: 18, name: "SaleAdProportion" },
      ],
      selectTarget: "",
      sku: [],
      list: [],
      asin: [],
      conditionForm: {
        value: 0,
        metrics: "",
        symbol: "",
      },
      conditionName: [
        { id: "click", name: "Clicks" },
        { id: "spend", name: "Cost" },
        { id: "CPC", name: "CPC " },
        { id: "CTR", name: "CTR" },
        { id: "impr", name: "Impressions" },
        { id: "orders", name: "Orders" },
        { id: "sales", name: "Sales" },
      ],
      addContent: [],
      date: "",
      minDate: "",
      maxDate: "",
      targetName1: "",
      targetName2: "",
      targetName3: "",
      data1: "",
      data2: "",
      data3: "",
      chartsDate: "",
    };
  },
  updated() {
    switch (this.form.target1) {
      case "impressions":
        this.targetName1 = "Impressions";
        break;
      case "clicks":
        this.targetName1 = "Clicks";
        break;
      case "attributed_units_ordered_7d":
        this.targetName1 = "Order";
        break;
      case "attributed_sales_7d":
        this.targetName1 = "Sales";
        break;
      case "cost":
        this.targetName1 = "Cost";
        break;
      case "clicks/impressions":
        this.targetName1 = "CTR";
        break;
      case "attributed_units_ordered_7d/clicks":
        this.targetName1 = "CVR";
        break;
      case "cost/clicks":
        this.targetName1 = "CPC";
        break;
      case "cost/attributed_units_ordered_7d":
        this.targetName1 = "CPA";
        break;
      case "cost/attributed_sales_7d":
        this.targetName1 = "ACoS";
        break;
      case "attributed_sales_7d/cost":
        this.targetName1 = "RoAS";
        break;
    }
    switch (this.form.target2) {
      case "impressions":
        this.targetName2 = "Impressions";
        break;
      case "clicks":
        this.targetName2 = "Clicks";
        break;
      case "attributed_units_ordered_7d":
        this.targetName2 = "Order";
        break;
      case "attributed_sales_7d":
        this.targetName2 = "Sales";
        break;
      case "cost":
        this.targetName2 = "Cost";
        break;
      case "clicks/impressions":
        this.targetName2 = "CTR";
        break;
      case "attributed_units_ordered_7d/clicks":
        this.targetName2 = "CVR";
        break;
      case "cost/clicks":
        this.targetName2 = "CPC";
        break;
      case "cost/attributed_units_ordered_7d":
        this.targetName2 = "CPA";
        break;
      case "cost/attributed_sales_7d":
        this.targetName2 = "ACoS";
        break;
      case "attributed_sales_7d/cost":
        this.targetName2 = "RoAS";
        break;
    }
    switch (this.form.target3) {
      case "impressions":
        this.targetName3 = "Impressions";
        break;
      case "clicks":
        this.targetName3 = "Clicks";
        break;
      case "attributed_units_ordered_7d":
        this.targetName3 = "Order";
        break;
      case "attributed_sales_7d":
        this.targetName3 = "Sales";
        break;
      case "cost":
        this.targetName3 = "Cost";
        break;
      case "clicks/impressions":
        this.targetName3 = "CTR";
        break;
      case "attributed_units_ordered_7d/clicks":
        this.targetName3 = "CVR";
        break;
      case "cost/clicks":
        this.targetName3 = "CPC";
        break;
      case "cost/attributed_units_ordered_7d":
        this.targetName3 = "CPA";
        break;
      case "cost/attributed_sales_7d":
        this.targetName3 = "ACoS";
        break;
      case "attributed_sales_7d/cost":
        this.targetName3 = "RoAS";
        break;
    }
  },
  created() {
    this.sku = JSON.parse(localStorage.getItem("SKU"));
    this.asin = JSON.parse(localStorage.getItem("ASIN"));
    this.list = JSON.parse(localStorage.getItem("SITE"));
    this.listColumn = this.todos;
    const cardData = {
      storeName: "stayfineUS",
      adSaleType: this.adSaleType,
      queryFlag: 1,
      campaignId: this.$route.query.id,
    };
    this.text = this.$route.query.name;
    this.getCrad(cardData);
    const data = {
      minDate: this.minDate,
      maxDate: this.maxDate,
      queryCondition: this.addContent,
      campaignId: this.$route.query.id,
      adGroupName: this.content,
      current: this.currentPage,
      size: this.pageSize,
      queryFlag: 1,
    };
    this.getdata(data);

    const dataCharts = {
      customSoughtQuota: {
        target1: this.form.target1,
        target2: this.form.target2,
        target3: this.form.target3,
      },
      comparisonPeriod: this.form.comparisonPeriod,
      forCenterStartSpaceSize: 1,
      campaignId: this.$route.query.id,
      queryFlag: 1,
    };
    this.getCharts(dataCharts);
  },
  mounted() {
    this.firstMap();
  },
  methods: {
    //获取当前年月日
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
    getdata(data) {
      api
        .post("/AmazonProductAdsDay/findAdGroup", data)
        .then((res) => {
          this.totalPage = res.data.total;
          if (res.data.records.length > 0) {
            const arr = res.data.records;
            arr.map((item) => {
              if (item.isUsing == "1") {
                item.isUsing = "启用";
              } else {
                item.isUsing = "禁用";
              }
              item.sku = item.sku + "/" + item.asin;
            });
            this.$nextTick(() => {
              this.rulesTable = arr;
            });
          } else {
            this.rulesTable = "";
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    //自定义列
    handlChange() {
      console.log(this.column);
      const data = [];
      this.todos.forEach((item, index) => {
        if (this.column.includes(item.id)) {
          data.push(item);
        }
      });
      this.$nextTick(() => {
        this.listColumn = data;
      });
    },
    submit() {
      const data = {
        minDate: this.minDate,
        maxDate: this.maxDate,
        queryCondition: this.addContent,
        campaignId: this.$route.query.id,
        adGroupName: this.content,
        current: this.currentPage,
        size: this.pageSize,
        queryFlag: 1,
      };
      this.getdata(data);
    },
    enterSubmit() {
      const data = {
        minDate: this.minDate,
        maxDate: this.maxDate,
        queryCondition: this.addContent,
        campaignId: this.$route.query.id,
        adGroupName: this.content,
        current: this.currentPage,
        size: this.pageSize,
      };
      this.getdata(data);
    },
    //每页显示数据条数
    sizeChange(val) {
      this.pageSize = val;
      const data = {
        minDate: this.minDate,
        maxDate: this.maxDate,
        queryCondition: this.addContent,
        campaignId: this.$route.query.id,
        adGroupName: this.content,
        current: this.currentPage,
        size: this.pageSize,
        queryFlag: 1,
      };
      this.getdata(data);
    },
    //当前页数
    currentChange(val) {
      this.currentPage = val;
      const data = {
        minDate: this.minDate,
        maxDate: this.maxDate,
        queryCondition: this.addContent,
        campaignId: this.$route.query.id,
        adGroupName: this.content,
        current: this.currentPage,
        size: this.pageSize,
      };
      this.getdata(data);
    },
    deleteData(index) {
      this.addContent.splice(index, 1);
    },
    //添加规则
    addRules() {
      if (
        this.conditionForm.value == 0 ||
        !this.conditionForm.symbol ||
        !this.conditionForm.metrics
      ) {
        this.$message.error("请选择规则！！！");
      } else {
        this.addContent.push({
          value: this.conditionForm.value,
          symbol: this.conditionForm.symbol,
          metrics: this.conditionForm.metrics,
        });
        this.addContent.forEach((item) => {
          switch (item.metrics) {
            case "click":
              item.metrics = "Clicks";
              break;
            case "spend":
              item.metrics = "Cost";
              break;
            case "CPC":
              item.metrics = "CPC";
              break;
            case "CTR":
              item.metrics = "CTR";
              break;
            case "impr":
              item.metrics = "Impressions";
              break;
            case "orders":
              item.metrics = "Orders";
              break;
            case "sales":
              item.metrics = "Sales";
              break;
          }
          switch (item.symbol) {
            case 3:
              item.symbol = "等于";
              break;
            case 1:
              item.symbol = "大于";
              break;
            case 2:
              item.symbol = "小于";
              break;
            case 4:
              item.symbol = "大于等于";
              break;
            case 5:
              item.symbol = "小于等于";
              break;
          }
        });
      }
    },

    //指标
    getCrad(data) {
      api
        .post("/adDataStateVB/getIndicators", data)
        .then((res) => {
          if (this.adSaleType == 1) {
            this.card = res.data;
          } else {
            this.market = res.data;
          }
          const arr = [...res.data].map((item) => item.id);
          this.selects.forEach((item, index) => {
            if (arr.includes(item.id)) {
              this.$set(this.selects[index], "disabled", true);
            } else {
              this.$set(this.selects[index], "disabled", false);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    //删除卡片
    closeCard(id) {
      this.inShow = 0;
      const data = {
        id: id,
        inShow: this.inShow,
        queryFlag: 1,
      };
      this.$confirm("是否关闭？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api
            .post("/adDataStateVB/updateTableColumnsById", data)
            .then((res) => {
              this.$message.success(res.message);
              const cardData = {
                storeName: "stayfineUS",
                adSaleType: this.adSaleType,
                queryFlag: 1,
                campaignId: this.$route.query.id,
              };
              this.getCrad(cardData);
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {});
        })
        .catch(() => {});
    },
    //新增卡片
    submitCard() {
      this.inShow = 1;
      const data = {
        id: this.selectTarget,
        inShow: this.inShow,
        queryFlag: 1,
      };
      if (this.selectTarget) {
        api
          .post("/adDataStateVB/updateTableColumnsById", data)
          .then((res) => {
            this.$message.success(res.message);
            const cardData = {
              storeName: "stayfineUS",
              adSaleType: this.adSaleType,
              queryFlag: 1,
              campaignId: this.$route.query.id,
            };
            this.getCrad(cardData);
            this.selectTarget = "";
            this.cardDialog = false;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {});
      } else {
        this.$message.warning("请选择添加指标！！！");
      }
    },
    count(event) {
      if (event.name == 2) {
        this.adSaleType = 2;
        this.selects = this.salesData;
        const cardData = {
          storeName: "stayfineUS",
          adSaleType: this.adSaleType,
          queryFlag: 1,
          campaignId: this.$route.query.id,
        };
        this.getCrad(cardData);
      } else if (event.name == 1) {
        this.adSaleType = 1;
        this.selects = this.selectdata;
        const cardData = {
          storeName: "stayfineUS",
          adSaleType: this.adSaleType,
          queryFlag: 1,
          campaignId: this.$route.query.id,
        };
        this.getCrad(cardData);
      }
    },
    addCard() {
      this.cardDialog = !this.cardDialog;
    },
    //-------------------------eacharts-----------------------
    //时段高峰
    getTimeData(data) {
      api
        .post("/adDataStateVB/quotaPriceViewDataList", data)
        .then((res) => {
          this.timeMap(res.data.targtet2, res.data.targtet3, res.data.day);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    handleClick(event) {
      if (event.name == 2) {
        const data = {
          minDate: "",
          maxDate: "",
          asin: "",
          countryCode: "",
          queryFlag: 1,
          campaignId: this.$route.query.id,
        };
        this.getTimeData(data);
      }
    },
    submitForm() {
      if (this.dateForm.time) {
        this.dateForm.minDate = this.dateForm.time[0];
        this.dateForm.maxDate = this.dateForm.time[1];
      }
      this.getTimeData(this.dateForm);
    },
    //指标对比图
    getCharts(data) {
      api
        .post("/adDataStateVB/quotaList", data)
        .then((res) => {
          this.data1 = res.data.target1;
          this.data2 = res.data.target2;
          this.data3 = res.data.target3;
          this.chartsDate = res.data.request_date;
          this.firstMap(this.data1, this.data2, this.data3, this.chartsDate);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    submitImpAndClk() {
      this.form.target1 = "impressions";
      this.form.target2 = "clicks";
      this.form.target3 = "";
      this.targetName3 = "";
      const data = {
        customSoughtQuota: {
          target1: this.form.target1,
          target2: this.form.target2,
        },
        comparisonPeriod: this.form.comparisonPeriod,
        forCenterStartSpaceSize: 1,
        minDate: this.getNowFormatDate(),
        queryFlag: 1,
        campaignId: this.$route.query.id,
      };

      this.getCharts(data);
    },
    submitCvrAndCtr() {
      this.form.target1 = "attributed_units_ordered_7d/clicks";
      this.form.target2 = "clicks/impressions";
      this.form.target3 = "";
      this.targetName3 = "";
      const data = {
        customSoughtQuota: {
          target1: this.form.target1,
          target2: this.form.target2,
        },
        comparisonPeriod: this.form.comparisonPeriod,
        forCenterStartSpaceSize: 1,
        minDate: this.getNowFormatDate(),
        queryFlag: 1,
        campaignId: this.$route.query.id,
      };
      this.getCharts(data);
    },

    submitCostAndSale() {
      this.form.target1 = "cost";
      this.form.target2 = "attributed_sales_7d";
      this.form.target3 = "";
      this.targetName3 = "";
      const data = {
        customSoughtQuota: {
          target1: this.form.target1,
          target2: this.form.target2,
        },
        comparisonPeriod: this.form.comparisonPeriod,
        minDate: this.getNowFormatDate(),
        forCenterStartSpaceSize: 1,
        queryFlag: 1,
        campaignId: this.$route.query.id,
      };
      this.getCharts(data);
    },
    //生成图表
    newCharts() {
      const data = {
        customSoughtQuota: {
          target1: this.form.target1,
          target2: this.form.target2,
          target3: this.form.target3,
        },
        minDate: this.getNowFormatDate(),
        comparisonPeriod: this.form.comparisonPeriod,
        forCenterStartSpaceSize: 1,
        queryFlag: 1,
        campaignId: this.$route.query.id,
      };
      //target3为空的时候删除属性
      if (!this.form.target3) {
        this.$delete(data.customSoughtQuota, "target3");
      }
      this.getCharts(data);
    },
    typeLine1() {
      (this.type1 = "line"),
        this.firstMap(this.data1, this.data2, this.data3, this.chartsDate);
    },
    typeBar1() {
      this.type1 = "bar";
      this.firstMap(this.data1, this.data2, this.data3, this.chartsDate);
    },
    typeLine2() {
      (this.type2 = "line"),
        this.firstMap(this.data1, this.data2, this.data3, this.chartsDate);
    },
    typeBar2() {
      this.type2 = "bar";
      this.firstMap(this.data1, this.data2, this.data3, this.chartsDate);
    },
    typeLine3() {
      (this.type3 = "line"),
        this.firstMap(this.data1, this.data2, this.data3, this.chartsDate);
    },
    typeBar3() {
      this.type3 = "bar";
      this.firstMap(this.data1, this.data2, this.data3, this.chartsDate);
    },

    exportTable() {
      this.common.exportTable("rulesTable", "product");
    },

    firstMap(data1, data2, data3, chartsDate) {
      const chartDom = document.getElementById("firstMap");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: "对比指标图",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [this.targetName1, this.targetName2, this.targetName3],
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {},
          },
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "none",
            height: 20,
            start: 20,
            end: 80,
          },
        ],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "12%",
          containLabel: true,
        },
        color: ["#005a95", "#e27304", "#008a00"],

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: chartsDate,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: this.targetName1,
            type: this.type1,
            // stack: 'Total',//堆叠效果
            smooth: true, //折线平滑
            barWidth: 20,
            data: data1,
          },
          {
            name: this.targetName2,
            type: this.type2,
            smooth: true,
            barWidth: 20,
            data: data2,
          },
          {
            name: this.targetName3,
            type: this.type3,
            smooth: true,
            barWidth: 20,
            data: data3,
          },
        ],
      };
      option && myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    timeMap(data1, data2, date) {
      const chartDom = document.getElementById("timeMap");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: "成交量 | 成交额",
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: date,
        },
        tooltip: {
          trigger: "axis",
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "none",
            start: 20, //数据窗口范围的起始百分比0-100
            end: 80, //数据窗口范围的结束百分比0-100
            height: 20,
            bottom: 10,
          },
        ],
        color: ["#005a95", "#e27304"],
        grid: {
          left: "3%",
          right: "3%",
          bottom: "10%",
          containLabel: true,
        },

        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {},
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "成交量",
            data: data1,
            type: "bar",
            barWidth: 20,
          },
          {
            name: "成交额",
            data: data2,
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

<style lang="scss" scoped>
</style>