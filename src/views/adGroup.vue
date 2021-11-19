<template>
  <div>
    <div class="title">
      Ad group<i></i><dfn>{{ text }}</dfn>
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
                    <el-button class="el-icon-check plot" @click="newCharts"
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
                        <el-button size="medium" class="plotBtn el-icon-edit edit">修改常用图</el-button>
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
              <el-form :mpodel="dateForm">
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
              placeholder="查找产品"
              v-model="content"
              @keydown.enter.native="submit"
              style="margin: 0"
            >
              <template slot="prepend"><i class="el-icon-search"></i></template>
            </el-input>
            <!--right-->
            <div class="operationRight">
              <el-select
                placeholder="列/自定义"
                v-model="column1"
                @change="handlChange"
                multiple
                collapse-tags
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
                @click="exportProduct"
                >导出</el-button
              >
            </div>
          </div>
          <el-table
            :data="rulesTable"
            ref="rulesTable"
            id="rulesTable"
            border
            :header-cell-style="{ background: '#858796', color: '#fff' }"
            max-height="600"
          >
            <el-table-column label="是否有效" prop="isUsing">
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.isUsing"
                  active-value="1"
                  inactive-value="0"
                  @click.native="setProduct(scope.$index, scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="Product" min-width="200" prop="adGroupName">
              <template slot-scope="scope">
                <div class="product">
                  <!-- <img :src="scope.row.img"> -->
                  <p>{{ scope.row.adGroupName }}</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              v-for="(item, index) in listColumn"
              :key="index"
              :prop="item.prop"
              :label="item.name"
              :width="item.width"
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
          />
        </el-col>
      </el-row>
    </section>

    <!-- <section>
        <div class="operation">
            <el-input placeholder="查找类目或产品" v-model="content" style="margin:0">
              <template slot="prepend"><i class="el-icon-search"></i></template>
            </el-input>
            <el-select placeholder="筛选条件" v-model="selectedName">
                <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <div class="operationRight">
                <el-select placeholder="列/自定义" v-model="column">
                    <el-option v-for="(item,index) in todos" :key="index" :label="item.name"></el-option>
                </el-select>
                <el-select placeholder="日期范围" v-model="date">
                    <el-option v-for="(item,index) in dates" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-button type="primary" size="medium" style="margin-left:20px" @click="exportTable">导出</el-button>
            </div>
        </div>
        <el-table :data="rulesTable2"  ref="rulesTable" id="rulesTable" border :header-cell-style="{background:'#858796',color:'#fff'}" max-height="600">
            <el-table-column label="是否有效" prop="isEffective">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isEffective" disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="Categories&products" prop="name" width="200"></el-table-column>
            <el-table-column label="Match Type" prop="matchType"></el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    {{scope.row.status===0 ?'启用':'禁用'}}
                </template>
            </el-table-column>
            <el-table-column label="bid" prop="bid">
              <template slot-scope="scope">${{scope.row.bid}}</template>
            </el-table-column>
            <el-table-column label="曝光量" prop="exposure"></el-table-column>
            <el-table-column label="点击次数" prop="clickNumber"></el-table-column>
            <el-table-column label="点击率（CTR）" prop="ctr">
              <template slot-scope="scope">{{scope.row.ctr}}%</template>
            </el-table-column>
            <el-table-column label="花费" prop="spend">
              <template slot-scope="scope">${{scope.row.spend}}</template>
            </el-table-column>
            <el-table-column label="CPC" prop="cpc">
              <template slot-scope="scope">${{scope.row.cpc}}</template>
            </el-table-column>
            <el-table-column label="订单" prop="order"></el-table-column>
            <el-table-column label="销售额" prop="salesVolume"></el-table-column>
            <el-table-column label="ACoS" prop="acos">
              <template slot-scope="scope">{{scope.row.acos}}%</template>
            </el-table-column>
            <el-table-column label="RoAS" prop="roas"></el-table-column>
        </el-table>
        <Pagination2 :currentPage="currentPage2" :total="totalPage2" @handleSizeChange="sizeChange2" @handleCurrentChange="currentChange2"/>
      </section>-->

    <section>
      <el-row :gutter="20">
        <el-col :md="16" :lg="16" :xl="19">
          <div class="operation">
            <el-input
              placeholder="查找关键词"
              v-model="keywordName"
              @keydown.enter.native="submitKeyword"
              clearable
              style="margin: 0"
            >
              <template slot="prepend"><i class="el-icon-search"></i></template>
            </el-input>
            <div class="operationRight">
              <el-select
                placeholder="列/自定义"
                v-model="formcolumn"
                @change="changeForm"
                multiple
                collapse-tags
                class="selectColumn"
              >
                <el-option
                  v-for="(item, index) in lists"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button
                type="primary"
                size="medium"
                style="margin-left: 20px"
                @click="exportKeyword"
                >导出</el-button
              >
            </div>
          </div>
          <el-table
            :data="keywordData"
            ref="keywordData"
            id="keyword"
            border
            :header-cell-style="{ background: '#858796', color: '#fff' }"
            max-height="600"
          >
            <el-table-column label="是否有效" prop="isUsing">
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.isUsing"
                  active-value="1"
                  inactive-value="0"
                  @click.native="setSwitch(scope.$index, scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="Keyword"
              prop="keywordText"
              min-width="200"
            ></el-table-column>
            <el-table-column
              v-for="(item, index) in keyword"
              :key="index"
              :prop="item.prop"
              :label="item.name"
              :width="item.width"
            >
              <template slot-scope="scope">{{ scope.row[item.prop] }}</template>
            </el-table-column>
          </el-table>
          <Pagination3
            :currentPage="currentPage3"
            :total="totalPage3"
            @handleSizeChange="sizeChange3"
            @handleCurrentChange="currentChange3"
          />
        </el-col>
        <el-col :md="8" :lg="8" :xl="5">
          <tableSearch1
            :addContent="formArray"
            :conditionName="conditionName"
            :minDate="startDate"
            :maxDate="endDate"
            :conditionForm="formtable"
            @updateMinDate="
              (val) => {
                startDate = val;
              }
            "
            @updateMaxDate="
              (val) => {
                endDate = val;
              }
            "
            @submit="submitKeyword"
            @addRules="addFormRules"
          />
        </el-col>
      </el-row>
    </section>
    <!--<section>
        <div class="operation">
            <el-input placeholder="请输入内容" v-model="content" style="margin:0">
              <template slot="prepend"><i class="el-icon-search"></i></template>
            </el-input>
            <el-select placeholder="筛选条件" v-model="selectedName">
                <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <div class="operationRight">
                <el-select placeholder="列/自定义" v-model="column">
                    <el-option v-for="(item,index) in todos" :key="index" :label="item.name"></el-option>
                </el-select>
                <el-select placeholder="日期范围" v-model="date">
                    <el-option v-for="(item,index) in dates" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-button type="primary" size="medium" style="margin-left:20px" @click="exportTable">导出</el-button>
            </div>
        </div>
        <el-table :data="rulesTable4" ref="rulesTable" id="rulesTable" border :header-cell-style="{background:'#858796',color:'#fff'}" max-height="600">
            <el-table-column label="是否有效" prop="isEffective">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isEffective" disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="Automatic targeting groups" prop="name" width="200"></el-table-column>
            <el-table-column label="Match Type" prop="matchType"></el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    {{scope.row.status===0 ?'启用':'禁用'}}
                </template>
            </el-table-column>
            <el-table-column label="Suggested Bid" prop="suggestedBid">
              <template slot-scope="scope">$ {{scope.row.suggestedBid}} Apply</template>
            </el-table-column>
            <el-table-column label="bid" prop="bid">
              <template slot-scope="scope">${{scope.row.bid}}</template>
            </el-table-column>
            <el-table-column label="曝光量" prop="exposure"></el-table-column>
            <el-table-column label="点击次数" prop="clickNumber"></el-table-column>
            <el-table-column label="点击率（CTR）" prop="ctr">
              <template slot-scope="scope">{{scope.row.ctr}}%</template>
            </el-table-column>
            <el-table-column label="花费" prop="spend">
              <template slot-scope="scope">${{scope.row.spend}}</template>
            </el-table-column>
            <el-table-column label="CPC" prop="cpc">
              <template slot-scope="scope">${{scope.row.cpc}}</template>
            </el-table-column>
            <el-table-column label="订单" prop="order"></el-table-column>
            <el-table-column label="销售额" prop="salesVolume"></el-table-column>
            <el-table-column label="ACoS" prop="acos">
              <template slot-scope="scope">{{scope.row.acos}}%</template>
            </el-table-column>
            <el-table-column label="RoAS" prop="roas"></el-table-column>
        </el-table>
        <Pagination4 :currentPage="currentPage4" :total="totalPage4" @handleSizeChange="sizeChange4" @handleCurrentChange="currentChange4"/>
      </section> -->
  </div>
</template>

<script>
import * as echarts from "echarts";
import Pagination from "../components/pagination.vue";
import Pagination2 from "../components/pagination.vue";
import Pagination3 from "../components/pagination.vue";
import Pagination4 from "../components/pagination.vue";
import api from "../API/index";
import tableSearch from "../components/tableSearch.vue";
import tableSearch1 from "../components/tableSearch.vue";
import Card from "../components/card.vue";
import SalesCard from "../components/salesCard.vue";
export default {
  components: {
    Pagination,
    Pagination2,
    Pagination3,
    Pagination4,
    tableSearch,
    tableSearch1,
    Card,
    SalesCard,
  },
  data() {
    return {
      text: "",
      activeName: "1",
      activetabs: "1",
      //-----------------echarts----------------------
      form: {
        target1: "impressions",
        target2: "clicks",
        target3: "cost",
        comparisonPeriod: "week",
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
      targetName1: "",
      targetName2: "",
      targetName3: "",
      data1: "",
      data2: "",
      data3: "",
      chartsDate: "",
      type1: "line",
      type2: "line",
      type3: "line",
      //-----------------echarts end----------------------
      dateForm: {
        minDate: "",
        maxDate: "",
        time: "",
        asin: "",
        sku: "",
        countryCode: "",
        queryFlag: 1,
      },
      currentPage2: 1,
      pageSize2: 10,
      totalPage2: 10,
      currentPage4: 1,
      pageSize4: 10,
      totalPage4: 10,

      selectedName: "",
      date: "",
      items: [],

      //-----------卡片--------
      card: [],
      market: [],
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
      cardDialog: false,

      //--------------------------table one----------------------
      currentPage: 1,
      pageSize: 10,
      totalPage: 10,
      conditionForm: {
        value: 0,
        metrics: "",
        symbol: "",
      },
      conditionName: [
        { id: "click", name: "Clicks" },
        { id: "CPC", name: "CPC " },
        { id: "CTR", name: "CTR" },
        { id: "impr", name: "Impressions" },
        { id: "orders", name: "Orders" },
        { id: "sales", name: "Sales" },
        { id: "ACOS", name: "ACoS" },
        { id: "ROAS", name: "RoAs" },
      ],
      addContent: [],
      products: [],
      listColumn: [],
      todos: [
        { id: 1, prop: "state", name: "状态" },
        { id: 2, prop: "sku", name: "SKU/ASIN", width: "280" },
        { id: 3, prop: "impressions", name: "曝光量" },
        { id: 4, prop: "clicks", name: "点击次数" },
        { id: 5, prop: "CTR", name: "点击率（%）" },
        { id: 6, prop: "cost", name: "花费($)" },
        { id: 7, prop: "CPC", name: "CPC" },
        { id: 8, prop: "orders", name: "订单" },
        { id: 9, prop: "sales", name: "销售额" },
        { id: 10, prop: "ACOS", name: "ACoS(%)" },
        { id: 11, prop: "ROAS", name: "RoAS(%)" },
      ],
      column1: [],
      content: "",
      column: "",
      minDate: "",
      maxDate: "",

      //-----------------------------------table three
      startDate: "",
      endDate: "",
      currentPage3: 1,
      pageSize3: 10,
      totalPage3: 10,
      keywordName: "",
      lists: [
        { id: 1, prop: "matchType", name: "Match Type", width: 150 },
        { id: 2, prop: "state", name: "状态" },
        { id: 3, prop: "suggestBid", name: "Suggest Bid", width: 150 },
        { id: 4, prop: "bid", name: "Bid" },
        { id: 5, prop: "impressions", name: "曝光量" },
        { id: 6, prop: "clicks", name: "点击量" },
        { id: 7, prop: "CTR", name: "点击率(%)" },
        { id: 8, prop: "cost", name: "花费($)" },
        { id: 9, prop: "CPC", name: "CPC" },
        { id: 10, prop: "orders", name: "订单量" },
        { id: 11, prop: "sales", name: "销售额" },
        { id: 12, prop: "ACOS", name: "ACoS" },
        { id: 13, prop: "ROAS", name: "RoAS" },
      ],
      formArray: [],
      formtable: {
        value: 0,
        metrics: "",
        symbol: "",
      },
      startDate: "",
      endDate: "",
      formcolumn: [],
      keywordData: [],

      dates: [],
      rulesTable: [],
      rulesTable2: [
        {
          id: 1,
          isEffective: true,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: false,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: false,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "",
          name: "jkajdajdijp",
          status: 0,
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
      ],
      rulesTable3: [],
      rulesTable4: [
        {
          id: 1,
          isEffective: true,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: false,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: false,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
        {
          id: 1,
          isEffective: true,
          matchType: "Exact",
          name: "Close match",
          status: 0,
          suggestedBid: "153.44",
          bid: "44.56",
          exposure: 52,
          clickNumber: 484,
          ctr: 21,
          spend: "12.55",
          cpc: "13.55",
          order: 4845,
          salesVolume: 46948,
          acos: "12.45",
          roas: 464.55,
        },
      ],
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
    this.listColumn = this.todos;
    this.keyword = this.lists;
    this.sku = JSON.parse(localStorage.getItem("SKU"));
    this.asin = JSON.parse(localStorage.getItem("ASIN"));
    this.list = JSON.parse(localStorage.getItem("SITE"));
    this.text = this.$route.query.name;
    const cardData = {
      storeName: "stayfineUS",
      adSaleType: this.adSaleType,
      queryFlag: 1,
      campaignId: this.$route.query.campaignId,
      adGroupId: this.$route.query.adGroupId,
      adType: this.$route.query.adType,
    };
    this.getCrad(cardData);

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
      campaignId: this.$route.query.campaignId,
      adGroupId: this.$route.query.adGroupId,
      adType: this.$route.query.adType,
    };
    this.getCharts(dataCharts);

    const data = {
      minDate: this.minDate,
      maxDate: this.maxDate,
      queryCondition: this.addContent,
      campaignId: this.$route.query.campaignId,
      adGroupId: this.$route.query.adGroupId,
      adType: this.$route.query.adType,
      adGroupName: this.content,
      current: this.currentPage,
      size: this.pageSize,
      queryFlag: 1,
    };
    this.getdata(data);

    const result = {
      adGroupId: this.$route.query.adGroupId,
      adType: this.$route.query.adType,
      campaignId: this.$route.query.campaignId,
      adGroupName: this.keywordName,
      size: this.pageSize3,
      queryFlag: 1,
      current: this.currentPage3,
      size: this.pageSize3,
      minDate: this.startDate,
      maxDate: this.endDate,
      queryCondition: this.formArray,
    };
    this.getkeyword(result);
  },
  mounted() {},
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
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
                campaignId: this.$route.query.campaignId,
                adGroupId: this.$route.query.adGroupId,
                adType: this.$route.query.adType,
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
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
              campaignId: this.$route.query.campaignId,
              adGroupId: this.$route.query.adGroupId,
              adType: this.$route.query.adType,
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
          campaignId: this.$route.query.campaignId,
          adGroupId: this.$route.query.adGroupId,
          adType: this.$route.query.adType,
        };
        this.getCrad(cardData);
      } else if (event.name == 1) {
        this.adSaleType = 1;
        this.selects = this.selectdata;
        const cardData = {
          storeName: "stayfineUS",
          adSaleType: this.adSaleType,
          queryFlag: 1,
          campaignId: this.$route.query.campaignId,
          adGroupId: this.$route.query.adGroupId,
          adType: this.$route.query.adType,
        };
        this.getCrad(cardData);
      }
    },

    //----------------------------------卡片end---------------------------

    //-------------------------------echarts------------------------------------
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
      };
      //target3为空的时候删除属性
      if (!this.form.target3) {
        this.$delete(data.customSoughtQuota, "target3");
      }
      this.getCharts(data);
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
      };
      this.getCharts(data);
    },

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
          campaignId: this.$route.query.campaignId,
          adGroupId: this.$route.query.adGroupId,
          adType: this.$route.query.adType,
        };
        this.getTimeData(data);
      }
    },
    submitForm() {
      if (this.dateForm.time) {
        this.dateForm.minDate = this.dateForm.time[0];
        this.dateForm.maxDate = this.dateForm.time[1];
      }
      const data = Object.assign(
        {
          campaignId: this.$route.query.campaignId,
          adGroupId: this.$route.query.adGroupId,
          adType: this.$route.query.adType,
        },
        this.dateForm
      );
      this.getTimeData(data);
    },
    //-----------------------------------------------table one

    getdata(data) {
      api
        .post("/AmazonProductAdsDay/findAdGroup", data)
        .then((res) => {
          this.totalPage = res.data.total;
          if (res.data.records.length > 0) {
            const arr = res.data.records;
            arr.map((item) => {
              if (item.isUsing == "1") {
                item.state = "启用";
              } else {
                item.state = "禁用";
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
    setProduct(index, row) {
      let number = 1;
      if (row.isUsing === "1") {
        number = 0;
      } else {
        number = 1;
      }
      this.$confirm(`是否设置${row.isUsing === "1" ? "有效" : "无效"}？？？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((success) => {
          const data = {
            campaignId: row.campaignId,
            adGroupId: row.adGroupId,
            isUsing: number,
          };
          api
            .post("/AmazonProductAdsDay/updateIsUsing", data)
            .then((res) => {
              if (res.code == 200) {
                this.$message.success("设置成功");
                if (row.isUsing == "0") {
                  this.$set(this.rulesTable[index], "isUsing", "1");
                } else {
                  this.$set(this.rulesTable[index], "isUsing", "0");
                }
                const data = {
                  minDate: this.minDate,
                  maxDate: this.maxDate,
                  queryCondition: this.addContent,
                  campaignId: this.$route.query.campaignId,
                  adGroupId: this.$route.query.adGroupId,
                  adType: this.$route.query.adType,
                  adGroupName: this.content,
                  current: this.currentPage,
                  size: this.pageSize,
                  queryFlag: 1,
                };
                this.getdata(data);
              } else {
                this.$message.error("设置失败");
                if (row.isUsing == "0") {
                  this.$set(this.rulesTable[index], "isUsing", "0");
                } else {
                  this.$set(this.rulesTable[index], "isUsing", "1");
                }
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {});
        })
        .catch((error) => {
          this.$message.error("设置失败");
          if (row.isUsing == "1") {
            this.$set(this.rulesTable[index], "isUsing", "1");
          } else {
            this.$set(this.rulesTable[index], "isUsing", "0");
          }
        });
    },
    //自定义列
    handlChange() {
      const data = [];
      this.todos.forEach((item, index) => {
        if (this.column1.includes(item.id)) {
          data.push(item);
        }
      });
      console.log(data);
      this.$nextTick(() => {
        this.listColumn = data;
      });
    },
    exportProduct() {
      this.common.exportTable("rulesTable", "Product");
    },
    submit() {
      const data = {
        minDate: this.minDate,
        maxDate: this.maxDate,
        queryCondition: this.addContent,
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
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
        campaignId: this.$route.query.campaignId,
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
        adGroupName: this.content,
        current: this.currentPage,
        size: this.pageSize,
      };
      this.getdata(data);
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

    //----------------------------------------table three

    getkeyword(data) {
      api
        .post("/AmazonProductAdsDay/findKeyWord", data)
        .then((res) => {
          console.log(res);
          this.totalPage3 = res.data.total;
          if (res.data.records.length > 0) {
            const arr = res.data.records;
            arr.map((item) => {
              if (item.isUsing == "1") {
                item.state = "启用";
              } else {
                item.state = "禁用";
              }
            });
            this.keywordData = arr;
          } else {
            this.keywordData = "";
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    setSwitch(index, row) {
      let number = 1;
      if (row.isUsing === "1") {
        number = 0;
      } else {
        number = 1;
      }
      console.log(row.isUsing, number);
      const data = {
        campaignId: row.campaignId,
        adGroupId: row.adGroupId,
        keywordId: row.keywordId,
        adType: this.$route.query.adType,
        isUsing: number,
      };
      this.$confirm(`是否设置${row.isUsing === "1" ? "有效" : "无效"}？？？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((success) => {
          api.post("/AmazonProductAdsDay/updateIsUsing", data).then((res) => {
            if (res.code == 200) {
              this.$message.success("设置成功");
              if (row.isUsing == "1") {
                this.$set(this.keywordData[index], "isUsing", "0");
              } else {
                this.$set(this.keywordData[index], "isUsing", "1");
              }
              const result = {
                adGroupId: this.$route.query.adGroupId,
                adType: this.$route.query.adType,
                campaignId: this.$route.query.campaignId,
                adGroupName: this.keywordName,
                size: this.pageSize3,
                queryFlag: 1,
                current: this.currentPage3,
                size: this.pageSize3,
                minDate: this.startDate,
                maxDate: this.endDate,
                queryCondition: this.formArray,
              };
              this.getkeyword(result);
            } else {
              this.$message.error("设置失败");
              if (row.isUsing == "1") {
                this.$set(this.keywordData[index], "isUsing", "1");
              } else {
                this.$set(this.keywordData[index], "isUsing", "0");
              }
            }
          });
        })
        .catch((error) => {
          this.$message.error("设置失败");
          if (row.isUsing == "1") {
            this.$set(this.keywordData[index], "isUsing", "1");
          } else {
            this.$set(this.keywordData[index], "isUsing", "0");
          }
        });
    },
    changeForm() {
      const data = [];
      this.lists.forEach((item, index) => {
        if (this.formcolumn.includes(item.id)) {
          data.push(item);
        }
      });
      this.keyword = data;
    },
    exportKeyword() {
      this.common.exportTable("keyword", "Keyword");
    },
    addFormRules() {
      if (
        this.formtable.value == 0 ||
        !this.formtable.symbol ||
        !this.formtable.metrics
      ) {
        this.$message.error("请选择规则！！！");
      } else {
        this.formArray.push({
          value: this.formtable.value,
          symbol: this.formtable.symbol,
          metrics: this.formtable.metrics,
        });
        console.log(this.formArray);
        this.formArray.forEach((item) => {
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
    sizeChange3(val) {
      this.pageSize3 = val;
      const result = {
        adGroupId: this.$route.query.adGroupId,
        campaignId: this.$route.query.campaignId,
        adType: this.$route.query.adType,
        adGroupName: this.keywordName,
        size: this.pageSize1,
        queryFlag: 1,
        current: this.currentPage3,
        size: this.pageSize3,
        minDate: this.startDate,
        maxDate: this.endDate,
        queryCondition: this.formArray,
      };
      this.getkeyword(result);
    },
    //当前页数
    currentChange3(val) {
      this.currentPage3 = val;
      const result = {
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
        campaignId: this.$route.query.campaignId,
        adGroupName: this.keywordName,
        size: this.pageSize1,
        queryFlag: 1,
        current: this.currentPage3,
        size: this.pageSize3,
        minDate: this.startDate,
        maxDate: this.endDate,
        queryCondition: this.formArray,
      };
      this.getkeyword(result);
    },
    submitKeyword() {
      const data = {
        adGroupId: this.$route.query.adGroupId,
        adType: this.$route.query.adType,
        adGroupName: this.keywordName,
        campaignId: this.$route.query.campaignId,
        size: this.pageSize1,
        queryFlag: 1,
        current: this.currentPage3,
        size: this.pageSize3,
        minDate: this.startDate,
        maxDate: this.endDate,
        queryCondition: this.formArray,
      };
      this.getkeyword(data);
    },

    sizeChange2(val) {
      console.log(val);
    },
    //当前页数
    currentChange2(val) {
      console.log(val);
    },

    sizeChange4(val) {
      console.log(val);
    },
    //当前页数
    currentChange4(val) {
      console.log(val);
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
    },
  },
};
</script>

<style  scoped>
</style>