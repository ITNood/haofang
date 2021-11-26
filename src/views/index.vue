<template>
  <div>
    <Title :icon="fonticon" :text="msg" />

    <home :searchForm="searchForm" @screen="screen" @reload="reload" />

    <!--tabs-->
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

    <!--echarts-->
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
            <el-form :model="dateForm">
              <ul class="formlist timeForm">
                <li>
                  <el-form-item prop="time">
                    <el-button size="medium">付款时间</el-button>
                    <!-- <el-select v-model="dateForm.payDate" placeholder="请选择" style="width:80%">
                        <el-option v-for="item in payTime" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select> -->
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

    <!--指标排序表-->
    <el-tabs v-model="current" class="tabs" style="margin: 30px 0">
      <el-tab-pane lazy label="指标排序表" name="1">
        <el-row :gutter="20">
          <!--左侧-->

          <el-col
            :sm="24"
            :md="24"
            :lg="24"
            :xl="12"
            style="margin-bottom: 20px"
          >
            <el-row :gutter="20">
              <el-col :sm="14" :md="14" :xl="16" :lg="16">
                <el-table
                  :data="tableData"
                  v-if="isData"
                  border
                  max-height="426"
                  :header-cell-style="{
                    background: '#858796',
                    color: '#fff',
                    fontWeight: 'normal',
                  }"
                >
                  <el-table-column
                    label="广告活动"
                    prop="campaignName"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <router-link
                        :to="{
                          path: '/campaign',
                          query: { id: scope.row.campaignId },
                        }"
                        class="posterName"
                        >{{ scope.row.campaignName }}</router-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="曝光量"
                    prop="impressions"
                    width="120"
                  ></el-table-column>
                  <el-table-column
                    label="点击量"
                    prop="clicks"
                  ></el-table-column>
                  <el-table-column
                    label="广告花费($)"
                    prop="cost"
                    width="100"
                  ></el-table-column>
                  <el-table-column
                    label="订单量"
                    prop="orders"
                  ></el-table-column>
                  <el-table-column
                    label="点击率(%)"
                    prop="CTR"
                  ></el-table-column>
                </el-table>

                <el-table
                  :data="tableData"
                  v-else
                  border
                  max-height="426"
                  :header-cell-style="{
                    background: '#858796',
                    color: '#fff',
                    fontWeight: 'normal',
                  }"
                >
                  <el-table-column
                    label="广告活动"
                    prop="campaignName"
                    width="200"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <router-link
                        :to="{
                          path: '/campaign',
                          query: {
                            id: scope.row.campaignId,
                            name: scope.row.campaignName,
                          },
                        }"
                        class="posterName"
                        >{{ scope.row.campaignName }}</router-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="(item, index) in lists"
                    :key="index"
                    :label="item.name"
                    :prop="item.prop"
                  ></el-table-column>
                </el-table>
              </el-col>
              <el-col :sm="10" :md="10" :xl="8" :lg="8">
                <el-form :model="campaignForm" ref="campaignForm">
                  <ul class="formlist tableForm">
                    <li>
                      <el-button size="medium">排序指标</el-button>
                      <el-select
                        v-model="campaignForm.orderName"
                        placeholder="请选择"
                        class="campaign"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                      <el-radio-group
                        class="selectRadio"
                        v-model="campaignForm.orderAreAsc"
                        size="medium"
                      >
                        <el-radio-button label="true">升序</el-radio-button>
                        <el-radio-button label="false">降序</el-radio-button>
                      </el-radio-group>
                    </li>
                    <li>
                      <el-button size="medium">显示条数</el-button>
                      <el-radio-group
                        v-model="campaignForm.findRows"
                        class="selectPage"
                      >
                        <el-radio-button label="5"></el-radio-button>
                        <el-radio-button label="10"></el-radio-button>
                        <el-radio-button label="15"></el-radio-button>
                        <el-radio-button label="20"></el-radio-button>
                      </el-radio-group>
                    </li>
                    <li>
                      <el-button size="medium">对比指标1</el-button>
                      <el-select
                        v-model="campaignForm.norm"
                        placeholder="请选择"
                        class="selectPage"
                        @change="changenorm1"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-button size="medium">对比指标2</el-button>
                      <el-select
                        v-model="campaignForm.norm1"
                        placeholder="请选择"
                        class="selectPage"
                        @change="changenorm2"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-button size="medium">对比指标3</el-button>
                      <el-select
                        v-model="campaignForm.norm2"
                        placeholder="请选择"
                        class="selectPage"
                        @change="changenorm3"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-button size="medium">对比指标4</el-button>
                      <el-select
                        v-model="campaignForm.norm3"
                        placeholder="请选择"
                        class="selectPage"
                        @change="changenorm4"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </li>

                    <li>
                      <el-button
                        class="el-icon-s-open preparation"
                        @click="submitCampaignForm"
                        >&nbsp;&nbsp;筛选 | 广告活动</el-button
                      >
                    </li>
                  </ul>
                </el-form>
              </el-col>
            </el-row>
          </el-col>
          <!--右侧-->
          <el-col :sm="24" :md="24" :lg="24" :xl="12">
            <el-row :gutter="20">
              <el-col :sm="14" :md="14" :xl="16" :lg="16">
                <el-table
                  v-if="hasData"
                  :data="tableData1"
                  border
                  max-height="426"
                  :header-cell-style="{ background: '#858796', color: '#fff' }"
                >
                  <el-table-column
                    label="广告关键词"
                    prop="keywordText"
                    min-width="200"
                  ></el-table-column>
                  <el-table-column label="ACoS" prop="acos"></el-table-column>
                  <el-table-column
                    label="点击量"
                    prop="clicks"
                  ></el-table-column>
                  <el-table-column
                    label="广告花费"
                    prop="cost"
                  ></el-table-column>
                  <el-table-column
                    label="曝光量"
                    prop="impressions"
                  ></el-table-column>
                  <el-table-column label="点击率" prop="ctr"></el-table-column>
                  <el-table-column
                    label="订单量"
                    prop="orders"
                  ></el-table-column>
                </el-table>
                <el-table
                  v-else
                  :data="tableData1"
                  border
                  max-height="426"
                  :header-cell-style="{ background: '#858796', color: '#fff' }"
                >
                  <el-table-column
                    v-for="(item, index) in columns"
                    :key="index"
                    :prop="item.prop"
                    :label="item.name"
                    :min-width="item.width"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                </el-table>
              </el-col>
              <el-col :sm="10" :md="10" :xl="8" :lg="8">
                <el-form :model="campaignForm1" ref="campaignForm1">
                  <ul class="formlist tableForm">
                    <li>
                      <el-button size="medium">排序指标</el-button>
                      <el-select
                        v-model="campaignForm1.sortField"
                        placeholder="请选择"
                        class="campaign"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                      <el-radio-group
                        class="selectRadio"
                        v-model="campaignForm1.sortRule"
                        size="medium"
                      >
                        <el-radio-button label="0">升序</el-radio-button>
                        <el-radio-button label="1">降序</el-radio-button>
                      </el-radio-group>
                    </li>
                    <li>
                      <el-button size="medium">显示条数</el-button>
                      <el-radio-group
                        v-model="campaignForm1.row"
                        class="selectPage"
                      >
                        <el-radio-button label="5"></el-radio-button>
                        <el-radio-button label="10"></el-radio-button>
                        <el-radio-button label="15"></el-radio-button>
                        <el-radio-button label="20"></el-radio-button>
                      </el-radio-group>
                    </li>
                    <li>
                      <el-button size="medium">匹配类型</el-button>
                      <el-select
                        v-model="campaignForm1.type"
                        placeholder="请选择"
                        class="selectType"
                      >
                        <el-option
                          v-for="item in typeed1"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                      <el-select
                        v-model="campaignForm1.matchType"
                        placeholder="请选择"
                        class="selectType"
                      >
                        <el-option
                          v-for="item in typeed2"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-button size="medium">对比指标1</el-button>
                      <el-select
                        v-model="campaignForm1.comparisonIndexOne"
                        placeholder="请选择"
                        class="selectPage"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-button size="medium">对比指标2</el-button>
                      <el-select
                        v-model="campaignForm1.comparisonIndexTwo"
                        placeholder="请选择"
                        class="selectPage"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-button size="medium">对比指标3</el-button>
                      <el-select
                        v-model="campaignForm1.comparisonIndexThree"
                        placeholder="请选择"
                        class="selectPage"
                      >
                        <el-option
                          v-for="item in sorts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </li>
                    <!-- <li>
                      <el-popover placement="bottom" width="400" trigger="click">
                          <el-checkbox-group v-model="campaignForm1.checkList2">
                            <el-checkbox label="曝光量"></el-checkbox>
                            <el-checkbox label="点击量"></el-checkbox>
                            <el-checkbox label="点击率"></el-checkbox>
                            <el-checkbox label="CAP"></el-checkbox>
                          </el-checkbox-group>
                          <el-button slot="reference" class="el-icon-edit editNorm">&nbsp;&nbsp;修改对比指标</el-button>
                      </el-popover>
                    </li>-->
                    <li>
                      <el-button
                        class="el-icon-s-open preparation"
                        @click="submitPoster"
                        >&nbsp;&nbsp;筛选 | 广告关键词</el-button
                      >
                    </li>
                  </ul>
                </el-form>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-model="active" class="tabs" @tab-click="selectTab">
      <el-tab-pane label="广告活动" name="1">
        <el-row :gutter="20">
          <el-col :md="16" :lg="16" :xl="19">
            <div class="tableSearch">
              <el-input
                v-model="searchOne"
                clearable
                prefix-icon="el-icon-search"
                size="medium"
                placeholder="请输入内容"
                @keydown.enter.native="submitCampaign"
              ></el-input>
            </div>
            <el-table
              :data="posterData"
              border
              show-summary
              :summary-method="getNumber"
              :header-cell-style="{ background: '#858796', color: '#fff' }"
              id="tableId"
            >
              <el-table-column
                sortable
                label="广告活动"
                prop="campaignName"
                min-width="250"
              >
                <template slot-scope="scope">
                  <router-link
                    :to="{
                      path: '/adGroup',
                      query: {
                        campaignId: scope.row.campaignId,
                        adGroupId: scope.row.adGroupId,
                        adType: scope.row.adType,
                        name: scope.row.campaignName,
                      },
                    }"
                    class="posterName"
                    >{{ scope.row.campaignName }}</router-link
                  >
                </template>
              </el-table-column>
              <el-table-column
                sortable
                label="竞价策略"
                prop="price"
              ></el-table-column>
              <el-table-column sortable label="每日预算" prop="budget">
                <template slot-scope="scope">
                  <p>${{ scope.row.budget }}</p>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                label="曝光量"
                prop="impressions"
              ></el-table-column>
              <el-table-column
                sortable
                label="点击量"
                prop="clicks"
              ></el-table-column>
              <el-table-column sortable label="点击率" prop="ctr">
                <template slot-scope="scope"> {{ scope.row.ctr }}% </template>
              </el-table-column>
              <el-table-column
                sortable
                label="花费"
                prop="cost"
              ></el-table-column>
              <el-table-column
                sortable
                label="CPC"
                prop="cpc"
              ></el-table-column>
              <el-table-column
                sortable
                label="订单量"
                prop="orders"
              ></el-table-column>
              <el-table-column
                sortable
                label="销售额"
                prop="sales"
              ></el-table-column>
              <el-table-column sortable label="ACOS" prop="acos">
                <template slot-scope="scope"> {{ scope.row.acos }}% </template>
              </el-table-column>
              <el-table-column sortable label="ROAS" prop="roas">
                <template slot-scope="scope"> {{ scope.row.roas }}% </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="copyPoster(scope.row)"
                    size="mini"
                    type="primary"
                    >复制</el-button
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
              @submit="submitCampaign"
              @addRules="addRules"
              @deleteData="deleteData"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="广告类型" name="2">
        <el-row :gutter="20">
          <el-col :md="16" :lg="16" :xl="19">
            <div class="tableSearch">
              <el-input
                v-model="searchTwo"
                prefix-icon="el-icon-search"
                clearable
                @keydown.enter.native="submitPosterType"
                size="medium"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <el-table
              :data="posterTyle"
              border
              show-summary
              :summary-method="sumPosterType"
              :header-cell-style="{ background: '#858796', color: '#fff' }"
              id="tableId2"
            >
              <el-table-column
                label="类型"
                prop="adsOverview"
              ></el-table-column>
              <el-table-column
                sortable
                label="曝光量"
                prop="impressions"
              ></el-table-column>
              <el-table-column
                sortable
                label="点击量"
                prop="clicks"
              ></el-table-column>
              <el-table-column
                sortable
                label="订单量"
                prop="orders"
              ></el-table-column>
              <el-table-column
                sortable
                label="花费"
                prop="cost"
              ></el-table-column>
              <el-table-column
                sortable
                label="销售额"
                prop="sales"
              ></el-table-column>
              <el-table-column sortable label="CTR" prop="ctr">
                <template slot-scope="scope"> {{ scope.row.ctr }}% </template>
              </el-table-column>
              <el-table-column
                sortable
                label="CVR"
                prop="cvr"
              ></el-table-column>
              <el-table-column
                sortable
                label="CPC"
                prop="cpc"
              ></el-table-column>
              <el-table-column sortable label="ACoS" prop="acos">
                <template slot-scope="scope"> {{ scope.row.acos }}% </template>
              </el-table-column>
              <el-table-column sortable label="RoAS" prop="roas">
                <template slot-scope="scope"> {{ scope.row.roas }}% </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="copyType(scope.row)"
                    size="mini"
                    type="primary"
                    >复制</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <Pagination1
              :currentPage="currentPage1"
              :total="totalPage1"
              @handleSizeChange="sizeChange1"
              @handleCurrentChange="currentChange1"
            />
          </el-col>
          <el-col :md="8" :lg="8" :xl="5">
            <div class="condition">
              <el-radio-group
                v-model="pieCharts"
                class="pie"
                @change="selectPosterTyle"
              >
                <el-radio-button label="1">曝光量</el-radio-button>
                <el-radio-button label="2">点击量</el-radio-button>
                <el-radio-button label="3">花费</el-radio-button>
                <el-radio-button label="4">销售额</el-radio-button>
                <el-radio-button label="5">订单量</el-radio-button>
              </el-radio-group>
              <div id="pieChart"></div>
              <el-date-picker
                v-model="minDate1"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="起始日期"
              ></el-date-picker>
              <el-date-picker
                v-model="maxDate1"
                type="date"
                value-format="yyyy-MM-dd"
                style="margin-top: 20px; width: 100%"
                placeholder="结束日期"
              ></el-date-picker>
              <el-button
                size="medium"
                type="primary"
                style="margin-top: 20px; width: 100%"
                class="el-icon-search preparation"
                @click="submitPosterType"
                >&nbsp;查找</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="站点" name="3">
        <el-row :gutter="20">
          <el-col :md="16" :lg="16" :xl="19">
            <div class="tableSearch">
              <el-input
                v-model="searchThree"
                prefix-icon="el-icon-search"
                clearable
                @keydown.enter.native="submitSite"
                size="medium"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <el-table
              :data="webSite"
              border
              show-summary
              :summary-method="getSite"
              :header-cell-style="{ background: '#858796', color: '#fff' }"
              id="tableId3"
            >
              <el-table-column label="站点" prop="countryCode">
              </el-table-column>
              <el-table-column
                label="买家访问数"
                prop="impressions"
              ></el-table-column>
              <el-table-column
                sortable
                label="曝光量"
                prop="impressions"
              ></el-table-column>
              <el-table-column
                sortable
                label="点击量"
                prop="clicks"
              ></el-table-column>
              <el-table-column
                sortable
                label="订单量"
                prop="orders"
              ></el-table-column>
              <el-table-column
                sortable
                label="广告花费"
                prop="cost"
              ></el-table-column>
              <el-table-column
                sortable
                label="广告销售额"
                prop="sales"
              ></el-table-column>
              <el-table-column sortable label="ACoS" prop="acos">
                <template slot-scope="scope"> {{ scope.row.acos }}% </template>
              </el-table-column>
              <el-table-column sortable label="RoAS" prop="roas">
                <template slot-scope="scope"> {{ scope.row.roas }}% </template>
              </el-table-column>
              <el-table-column
                sortable
                label="花费占比"
                prop=""
              ></el-table-column>
              <el-table-column
                sortable
                label="销售占比"
                prop=""
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="copySite(scope.row)"
                    size="mini"
                    type="primary"
                    >复制</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <Pagination2
              :currentPage="currentPage2"
              :total="totalPage2"
              @handleSizeChange="sizeChange2"
              @handleCurrentChange="currentChange2"
            />
          </el-col>
          <el-col :md="8" :lg="8" :xl="5">
            <div class="condition">
              <el-radio-group
                v-model="siteValue"
                class="pie"
                @change="selectSite"
              >
                <el-radio-button label="1">广告花费</el-radio-button>
                <el-radio-button label="2">广告销售</el-radio-button>
              </el-radio-group>
              <div id="pieChart2"></div>
              <el-date-picker
                v-model="minDate2"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="起始日期"
              ></el-date-picker>
              <el-date-picker
                v-model="maxDate2"
                type="date"
                value-format="yyyy-MM-dd"
                style="margin-top: 20px; width: 100%"
                placeholder="结束日期"
              ></el-date-picker>
              <el-button
                size="medium"
                type="primary"
                style="margin-top: 20px; width: 100%"
                class="el-icon-search preparation"
                @click="submitSite"
                >&nbsp;查找</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="ASIN" name="4">
        <el-row :gutter="20">
          <el-col :md="16" :lg="16" :xl="19">
            <div class="tableSearch">
              <el-input
                v-model="searchFour"
                prefix-icon="el-icon-search"
                @keydown.enter.native="submitAsin"
                clearable
                size="medium"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <el-table
              :data="asinData"
              border
              show-summary
              :summary-method="getAsin"
              :header-cell-style="{ background: '#858796', color: '#fff' }"
              id="tableId4"
            >
              <el-table-column label="ASIN" prop="asin"></el-table-column>
              <el-table-column
                label="买家访问数"
                prop="impressions"
              ></el-table-column>
              <el-table-column
                sortable
                label="曝光量"
                prop="impressions"
              ></el-table-column>
              <el-table-column
                sortable
                label="点击量"
                prop="clicks"
              ></el-table-column>
              <el-table-column
                sortable
                label="广告花费"
                prop="cost"
              ></el-table-column>
              <el-table-column
                sortable
                label="广告销售额"
                prop="sales"
              ></el-table-column>
              <el-table-column
                sortable
                label="商品销售额"
                prop=""
              ></el-table-column>
              <el-table-column sortable label="ACoS" prop="acos">
                <template slot-scope="scope"> {{ scope.row.acos }}% </template>
              </el-table-column>
              <el-table-column sortable label="RoAS" prop="roas">
                <template slot-scope="scope"> {{ scope.row.roas }}% </template>
              </el-table-column>
              <el-table-column
                sortable
                label="花费占比"
                prop=""
              ></el-table-column>
              <el-table-column
                sortable
                label="销售占比"
                prop=""
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="copyAsin(scope.row)"
                    size="mini"
                    type="primary"
                    >复制</el-button
                  >
                </template>
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
            <!-- <div class="addCondition"><i class="el-icon-plus"></i>添加筛选条件</div> -->
            <div class="condition">
              <el-radio-group
                v-model="asinValue"
                class="pie"
                @change="selectAsin"
              >
                <el-radio-button label="1">广告花费</el-radio-button>
                <el-radio-button label="2">广告销售</el-radio-button>
              </el-radio-group>
              <div id="pieChart3"></div>
              <el-date-picker
                v-model="minDate3"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="起始日期"
              ></el-date-picker>
              <el-date-picker
                v-model="maxDate3"
                type="date"
                value-format="yyyy-MM-dd"
                style="margin-top: 20px; width: 100%"
                placeholder="结束日期"
              ></el-date-picker>
              <el-button
                size="medium"
                type="primary"
                style="margin-top: 20px; width: 100%"
                class="el-icon-search preparation"
                @click="submitAsin"
                >&nbsp;查找</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import api from "../Http/index";
import * as echarts from "echarts";
import Title from "../components/title.vue";
import Pagination from "../components/pagination.vue";
import Pagination1 from "../components/pagination.vue";
import Pagination2 from "../components/pagination.vue";
import Pagination3 from "../components/pagination.vue";
import tableSearch from "../components/tableSearch.vue";
import Card from "../components/card.vue";
import SalesCard from "../components/salesCard.vue";
import Home from "../components/home.vue";
let _minDate = 0;
let millisecondOfDay = 1 * 24 * 60 * 60 * 1000;
export default {
  components: {
    Title,
    Pagination,
    Pagination1,
    Pagination2,
    Pagination3,
    tableSearch,
    Card,
    SalesCard,
    Home,
  },
  data() {
    return {
      list: [],
      sku: [],
      asin: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,

      currentPage1: 1,
      totalPage1: 0,
      pageSize1: 10,

      currentPage2: 1,
      totalPage2: 0,
      pageSize2: 10,

      currentPage3: 1,
      totalPage3: 0,
      pageSize3: 10,
      msg: "数据看板",
      fonticon: "icon-brokenLine",
      searchForm: {
        projectName: "",
        semName: "",
        storeName: "",
        countryCode: "",
        asin: "",
        sku: "",
        campaignName: "",
        minDate: "",
        comparisonPeriod: "week",
        queryType: 0,
      },
      form: {
        target1: "impressions",
        target2: "clicks",
        target3: "cost",
        comparisonPeriod: "week",
      },
      time: [
        { id: "day", name: "天" },
        { id: "week", name: "周" },
        { id: "month", name: "月" },
        { id: "quarter", name: "季" },
        { id: "year", name: "年" },
      ],
      dateForm: {
        minDate: "",
        maxDate: "",
        time: "",
        asin: "",
        sku: "",
        countryCode: "",
      },
      payTime: [],
      activeName: "1",
      cardDialog: false,
      selectTarget: "",
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
      card: [],
      market: [],
      activetabs: "1",
      current: "1",
      tableData: [],
      tableData1: [],
      campaignForm: {
        indicator: [],
        orderAreAsc: "true",
        findRows: "10",
        orderName: 1,
        queryType: 0,
      },
      campaignForm1: {
        sortField: 1,
        sortRule: "1",
        row: "10",
        type: 1,
        matchType: 1,
        comparisonIndexOne: "",
        comparisonIndexTwo: "",
        comparisonIndexThree: "",
        queryType: 0,
      },
      sorts: [
        { id: 1, name: "acos" },
        { id: 2, name: "impressions" },
        { id: 3, name: "clicks" },
        { id: 4, name: "CTR" },
        { id: 5, name: "cost" },
        { id: 6, name: "orders" },
      ],
      typeed1: [
        { id: 0, name: "SB" },
        { id: 1, name: "SP" },
      ],
      typeed2: [
        { id: 1, name: "BROAD" },
        { id: 2, name: "PHRASE" },
        { id: 3, name: "EXACT" },
      ],
      active: "1",
      posterData: [], //广告活动
      posterTyle: [], //广告类型
      searchOne: "",
      searchTwo: "",
      searchThree: "",
      searchFour: "",
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
      day: "",
      dates: [],
      pieCharts: "1",
      type1: "line",
      type2: "line",
      type3: "line",
      columns: [],
      hasData: true,
      minDate: "",
      maxDate: "",
      minDate1: "",
      maxDate1: "",
      minDate2: "",
      maxDate2: "",
      minDate3: "",
      maxDate3: "",
      adsOverview: "",
      impSp: "",
      clickSp: "",
      costSp: "",
      salesSp: "",
      ordersSp: "",
      impSd: "",
      clickSd: "",
      costSd: "",
      salesSd: "",
      ordersSd: "",
      pieName: "曝光量",
      webSite: [],
      country: "",
      //站点饼图
      siteAllCost: "",
      siteAllSales: "",
      siteName: "广告花费",
      allSiteName: "China",
      asinData: [],
      asinName: "广告花费",
      allAsinName: "总广告花费",
      isData: true,
      lists: [],
      adsQueryType: 1,
      name1: "",
      name2: "",
      name3: "",
      name4: "",
      targetName1: "",
      targetName2: "",
      targetName3: "",
      data1: "",
      data2: "",
      data3: "",
      date: "",
      asinValue: "1",
      siteValue: "1",
      array: [],
      asinTitle: "广告花费Top5",
      inShow: 0,
      adSaleType: 1,
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
      siteArr: [],
    };
  },
  computed: {
    //控制日期选择范围
    renderPickerOptions() {
      const that = this;
      return {
        disabledDate(time) {
          if (_minDate > 0) {
            return (
              time.getTime() >
                Math.min(Date.now(), _minDate + 6 * millisecondOfDay) ||
              time.getTime() <
                Math.max(
                  _minDate - 6 * millisecondOfDay,
                  Date.now() - dayRange * millisecondOfDay
                )
            );
          } else {
            let dayRang = 7;
            if (that.searchForm.comparisonPeriod === "day") {
              dayRang = 1;
            } else if (that.searchForm.comparisonPeriod === "week") {
              dayRang = 7;
            } else if (that.searchForm.comparisonPeriod === "month") {
              dayRang = 30;
            } else if (that.searchForm.comparisonPeriod === "quarter") {
              dayRang = 90;
            } else {
              dayRang = 365;
            }
            return (
              time.getTime() > Date.now() ||
              time.getTime() < Date.now() - dayRang * millisecondOfDay
            );
          }
        },
        onPick({ maxDate, minDate }) {
          _minDate = minDate && new Date(minDate).getTime();
        },
      };
    },
  },

  updated() {
    this.campaignForm.indicator = [
      this.name1,
      this.name2,
      this.name3,
      this.name4,
    ];
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
    const res = {
      current: this.currentPage,
      size: this.pageSize,
      minDate: this.minDate,
      maxDate: this.maxDate,
      queryCondition: this.addContent,
      comparisonPeriod: this.searchForm.comparisonPeriod,
      adsQueryType: this.adsQueryType,
    };
    this.getData(this.campaignForm1);
    this.getPoster(res);

    const respones = {
      comparisonPeriod: this.searchForm.comparisonPeriod,
      minDate: this.getNowFormatDate(),
      queryType: 0,
    };
    this.getresult(respones);
    const data = {
      customSoughtQuota: {
        target1: this.form.target1,
        target2: this.form.target2,
        target3: this.form.target3,
      },
      minDate: this.getNowFormatDate(),
      comparisonPeriod: this.form.comparisonPeriod,
      forCenterStartSpaceSize: 1,
    };
    this.getCharts(data);
    const cardData = {
      storeName: "stayfineUS",
      minDate: this.getNowFormatDate(),
      comparisonPeriod: this.searchForm.comparisonPeriod,
      adSaleType: this.adSaleType,
    };
    this.getCrad(cardData);
  },

  methods: {
    reload() {
      location.reload();
    },

    //全局筛选
    screen() {
      const dataPoster = Object.assign(
        { adsQueryType: this.adsQueryType },
        this.searchForm
      );
      this.getPoster(dataPoster);

      this.getTimeData(this.searchForm);

      this.getData(this.searchForm);

      this.getresult(this.searchForm);

      const charts = {
        customSoughtQuota: {
          target1: this.form.target1,
          target2: this.form.target2,
          target3: this.form.target3,
        },
        comparisonPeriod: this.form.comparisonPeriod,
        forCenterStartSpaceSize: 1,
      };
      this.$delete(charts, "comparisonPeriod");
      const result = Object.assign(charts, this.searchForm);
      this.getCharts(result);
      const card = Object.assign(
        { adSaleType: this.adSaleType },
        this.searchForm
      );
      this.getCrad(card);
    },

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
                minDate: this.getNowFormatDate(),
                comparisonPeriod: this.searchForm.comparisonPeriod,
                adSaleType: this.adSaleType,
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
      };
      if (this.selectTarget) {
        api
          .post("/adDataStateVB/updateTableColumnsById", data)
          .then((res) => {
            this.$message.success(res.message);
            const cardData = {
              storeName: "stayfineUS",
              minDate: this.getNowFormatDate(),
              comparisonPeriod: this.searchForm.comparisonPeriod,
              adSaleType: this.adSaleType,
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
          minDate: this.getNowFormatDate(),
          comparisonPeriod: this.searchForm.comparisonPeriod,
          adSaleType: this.adSaleType,
        };
        this.getCrad(cardData);
      } else if (event.name == 1) {
        this.adSaleType = 1;
        this.selects = this.selectdata;
        const cardData = {
          storeName: "stayfineUS",
          minDate: this.getNowFormatDate(),
          comparisonPeriod: this.searchForm.comparisonPeriod,
          adSaleType: this.adSaleType,
        };
        this.getCrad(cardData);
      }
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
      };
      this.getCharts(data);
    },
    //指标对比图
    getCharts(data) {
      api
        .post("/adDataStateVB/quotaList", data)
        .then((res) => {
          this.data1 = res.data.target1;
          this.data2 = res.data.target2;
          this.data3 = res.data.target3;
          this.date = res.data.request_date;
          this.firstMap(this.data1, this.data2, this.data3, this.date);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
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
          comparisonPeriod: this.searchForm.comparisonPeriod,
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
      };
      //target3为空的时候删除属性
      if (!this.form.target3) {
        this.$delete(data.customSoughtQuota, "target3");
      }
      this.getCharts(data);
    },
    //指标排序表
    getresult(data) {
      api
        .post("/adDataStateVB/advertisingCampaign", data)
        .then((res) => {
          if (res.data.length > 0) {
            this.isData = false;
            const data = res.data[0];
            const arr = Object.keys(data);
            const newArr = arr.filter((item) => {
              return (
                item == "CTR" ||
                item == "cost" ||
                item == "clicks" ||
                item == "impressions" ||
                item == "orders" ||
                item == "acos"
              );
            });
            let obj = {};
            // 将数组转化为对象
            for (let key in newArr) {
              obj[key] = newArr[key];
            }
            const newObj = Object.keys(obj).map((val) => ({
              prop: obj[val],
              name: obj[val],
            }));
            this.lists = newObj;
            newObj.map((item) => {
              switch (item.name) {
                case "CTR":
                  item.name = "点击率(%)";
                  break;
                case "impressions":
                  item.name = "曝光量";
                  break;
                case "cost":
                  item.name = "广告花费($)";
                  break;
                case "clicks":
                  item.name = "点击量";
                  break;
                case "orders":
                  item.name = "订单量";
                  break;
                case "acos":
                  item.name = "ACOS(%)";
                  break;
              }
            });
          }
          this.$nextTick(() => {
            this.tableData = res.data;
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    submitCampaignForm() {
      if (
        this.campaignForm.norm ||
        this.campaignForm.norm1 ||
        this.campaignForm.norm2 ||
        this.campaignForm.norm3
      ) {
        this.campaignForm.queryType = 1;
      } else {
        this.campaignForm.queryType = 0;
      }
      switch (this.campaignForm.orderName) {
        case 1:
          this.campaignForm.orderName = "acos";
          break;
        case 2:
          this.campaignForm.orderName = "impressions";
          break;
        case 3:
          this.campaignForm.orderName = "clicks";
          break;
        case 4:
          this.campaignForm.orderName = "ctr";
          break;
        case 5:
          this.campaignForm.orderName = "cost";
          break;
        case 6:
          this.campaignForm.orderName = "orders";
          break;
      }
      const data = Object.assign(this.campaignForm, {
        comparisonPeriod: this.searchForm.comparisonPeriod,
      });

      if (this.name1 || this.name2 || this.name3 || this.name4) {
        if (
          this.campaignForm.orderName !== this.name1 &&
          this.campaignForm.orderName !== this.name2 &&
          this.campaignForm.orderName !== this.name3 &&
          this.campaignForm.orderName !== this.name4
        ) {
          this.$message.error("排序指标与对标指标不一致");
        } else {
          this.getresult(data);
        }
      } else {
        this.getresult(data);
      }
    },
    changenorm1(val) {
      const data = this.sorts.filter((item) => {
        return item.id == val;
      });
      this.name1 = data[0].name;
    },
    changenorm2(val) {
      const data = this.sorts.filter((item) => {
        return item.id == val;
      });
      this.name2 = data[0].name;
    },
    changenorm3(val) {
      const data = this.sorts.filter((item) => {
        return item.id == val;
      });
      this.name3 = data[0].name;
    },
    changenorm4(val) {
      const data = this.sorts.filter((item) => {
        return item.id == val;
      });
      this.name4 = data[0].name;
    },

    //请求数据
    getData(data) {
      //广告关键词
      api
        .post("/adDataStateVB/findKeywords", data)
        .then((res) => {
          if (res.data.length > 0) {
            this.hasData = false;
            //提取一条数据渲染表头
            const data = res.data[0];
            const arr = Object.keys(data);
            const newArr = arr.filter((item) => {
              return item !== "attributedSales14d";
            });
            let obj = {};
            // 将数组转化为对象
            for (let key in newArr) {
              obj[key] = newArr[key];
            }
            const newObj = Object.keys(obj).map((val) => ({
              prop: obj[val],
              name: obj[val],
            }));
            newObj.map((item) => {
              switch (item.name) {
                case "keywordText":
                  item.name = "广告关键词";
                  item.width = "200";
                  break;
                case "impressions":
                  item.name = "曝光量";
                  break;
                case "cost":
                  item.name = "广告花费($)";
                  break;
                case "clicks":
                  item.name = "点击量";
                  break;
                case "orders":
                  item.name = "订单量";
                  break;
                case "ctr":
                  item.name = "点击率(%)";
                  break;
                default:
                  item.name = "ACoS(%)";
              }
            });
            this.columns = newObj;
          } else {
            this.hasData = true;
          }
          this.$nextTick(() => {
            this.tableData1 = res.data;
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    //广告关键词条件筛选
    submitPoster() {
      this.campaignForm1.queryType = 1;
      const data = Object.assign(this.campaignForm1, {
        comparisonPeriod: this.searchForm.comparisonPeriod,
      });
      if (
        this.campaignForm1.comparisonIndexOne ||
        this.campaignForm1.comparisonIndexTwo ||
        this.campaignForm1.comparisonIndexThree
      ) {
        if (
          this.campaignForm1.sortField !==
            this.campaignForm1.comparisonIndexOne &&
          this.campaignForm1.sortField !==
            this.campaignForm1.comparisonIndexTwo &&
          this.campaignForm1.sortField !==
            this.campaignForm1.comparisonIndexThree
        ) {
          this.$message.error("排序指标与对标指标不一致");
        } else {
          this.getData(data);
        }
      } else {
        this.campaignForm1.queryType = 0;
        this.getData(data);
      }
    },
    //广告活动筛选
    getPoster(res) {
      api
        .post("/adDataStateVB/findCampaign", res)
        .then((res) => {
          switch (this.active) {
            case "1":
              this.posterData = res.data.records;
              this.totalPage = res.data.total;
              break;

            case "2":
              this.totalPage1 = res.data.total;
              this.posterTyle = res.data.records;
              if (res.data.records.length > 0) {
                //过滤SP SD类型
                this.$nextTick(() => {
                  const spData = this.posterTyle.filter((item) => {
                    return item.adsOverview == "SP";
                  });
                  this.impSp = spData[0].impressions;
                  this.clickSp = spData[0].clicks;
                  this.costSp = spData[0].cost;
                  this.salesSp = spData[0].sales;
                  this.ordersSp = spData[0].orders;
                  const sdData = this.posterTyle.filter((item) => {
                    return item.adsOverview == "SD";
                  });
                  this.impSd = sdData[0].impressions;
                  this.clickSd = sdData[0].clicks;
                  this.costSd = sdData[0].cost;
                  this.salesSd = sdData[0].sales;
                  this.ordersSd = sdData[0].orders;
                  this.sd = this.impSd;
                  this.sp = this.impSp;
                  this.pieChart();
                });
              }
              break;

            case "3":
              this.totalPage2 = res.data.total;
              this.webSite = res.data.records;
              if (res.data.records.length > 0) {
                this.$nextTick(() => {
                  const obj = this.webSite.map((item) => {
                    return {
                      value: item.cost,
                      name: item.countryCode,
                    };
                  });
                  this.siteArr = obj;
                  this.pieChart2(obj);
                });
              }
              break;

            case "4":
              this.totalPage3 = res.data.total;
              this.asinData = res.data.records;
              if (res.data.records.length > 0) {
                //广告花费排序
                this.asinData.sort(this.compare("cost", false));
                const newData = this.asinData.slice(0, 5);
                newData.sort(this.compare("cost", true));
                const obj = [["amount", "product"]];
                newData.map((item) => {
                  obj.push([item.cost, item.asin]);
                });
                this.array = obj;
                this.pieChart3(this.array);
              }
              break;
          }
        })
        .catch((err) => {})
        .finally(() => {});
    },
    //排序方法
    compare(property, desc) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (desc == true) {
          //升序排列
          return value1 - value2;
        } else {
          return value2 - value1;
        }
      };
    },
    //提交广告类型
    submitPosterType() {
      const res = {
        queryName: this.searchTwo,
        current: this.currentPage1,
        size: this.pageSize1,
        minDate: this.minDate1,
        maxDate: this.maxDate1,
        adsQueryType: this.adsQueryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    //提交站点
    submitSite() {
      const res = {
        queryName: this.searchThree,
        current: this.currentPage2,
        size: this.pageSize2,
        minDate: this.minDate2,
        maxDate: this.maxDate2,
        adsQueryType: this.adsQueryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    //提交ASIN
    submitAsin() {
      const res = {
        queryName: this.searchFour,
        current: this.currentPage3,
        size: this.pageSize3,
        minDate: this.minDate3,
        maxDate: this.maxDate3,
        adsQueryType: this.adsQueryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    //切换ASIN饼图
    selectAsin(val) {
      switch (val) {
        case "1":
          //广告花费排序
          this.asinTitle = "广告花费Top5";
          this.asinData.sort(this.compare("cost", false));
          const newData = this.asinData.slice(0, 5);
          newData.sort(this.compare("cost", true));
          const obj = [["amount", "product"]];
          newData.map((item) => {
            obj.push([item.cost, item.asin]);
          });
          this.array = obj;
          this.pieChart3(this.array);
          break;

        case "2":
          this.asinTitle = "广告销售Top5";
          this.asinData.sort(this.compare("sales", false));
          const newArr = this.asinData.slice(0, 5);
          newArr.sort(this.compare("sales", true));
          const arr = [["amount", "product"]];
          newArr.map((item) => {
            arr.push([item.sales, item.asin]);
          });
          this.array = arr;
          this.$nextTick(() => {
            this.pieChart3(this.array);
          });
          break;
      }
    },

    //切换站点饼图
    selectSite(val) {
      switch (val) {
        case "1":
          this.$set(this, "siteName", "广告花费");
          this.pieChart2(this.siteArr);
          break;

        case "2":
          this.$set(this, "siteName", "广告销售");
          const obj = this.webSite.map((item) => {
            return {
              value: item.sales,
              name: item.countryCode,
            };
          });
          this.pieChart2(obj);
          break;
      }
    },
    //切换广告类型饼图
    selectPosterTyle(val) {
      switch (val) {
        case "1":
          this.sd = this.impSd;
          this.sp = this.impSp;
          this.pieName = "曝光量";
          this.pieChart();
          break;
        case "2":
          this.sd = this.clickSd;
          this.sp = this.clickSp;
          this.pieName = "点击量";
          this.pieChart();
          break;
        case "3":
          this.sd = this.costSd;
          this.sp = this.costSp;
          this.pieName = "花费";
          this.pieChart();
          break;
        case "4":
          this.sd = this.salesSd;
          this.sp = this.salesSp;
          this.pieName = "销售额";
          this.pieChart();
          break;
        default:
          this.sd = this.ordersSd;
          this.sp = this.ordersSp;
          this.pieName = "订单量";
          this.pieChart();
      }
    },
    submitCampaign() {
      const res = {
        queryName: this.searchOne,
        current: this.currentPage,
        size: this.pageSize,
        minDate: this.minDate,
        maxDate: this.maxDate,
        queryCondition: this.addContent,
        adsQueryType: this.adsQueryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      if (this.minDate || this.addContent) {
        this.getPoster(res);
      } else {
        this.$message.warning("起始时间和筛选条件不能为空！！！");
      }
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
    selectTab(event) {
      if (event.name == 2) {
        this.adsQueryType = 2;
        const res = {
          current: this.currentPage1,
          size: this.pageSize1,
          minDate: this.minDate1,
          maxDate: this.maxDate1,
          adsQueryType: this.adsQueryType,
          comparisonPeriod: this.searchForm.comparisonPeriod,
        };
        this.getPoster(res);
        this.$nextTick(() => {
          this.pieChart();
        });
      } else if (event.name == 3) {
        this.adsQueryType = 3;
        const res = {
          current: this.currentPage2,
          size: this.pageSize2,
          minDate: this.minDate2,
          maxDate: this.maxDate3,
          adsQueryType: this.adsQueryType,
          comparisonPeriod: this.searchForm.comparisonPeriod,
        };
        this.getPoster(res);
        this.$nextTick(() => {
          this.pieChart2(this.siteArr);
        });
      } else if (event.name == 4) {
        this.adsQueryType = 4;
        const res = {
          current: this.currentPage3,
          size: this.pageSize3,
          minDate: this.minDate3,
          maxDate: this.maxDate3,
          adsQueryType: this.adsQueryType,
          comparisonPeriod: this.searchForm.comparisonPeriod,
        };
        this.getPoster(res);
        this.$nextTick(() => {
          this.pieChart3(this.array);
        });
      } else {
        this.adsQueryType = 1;
        const res = {
          current: this.currentPage,
          size: this.pageSize,
          minDate: this.minDate,
          maxDate: this.maxDate,
          queryCondition: this.addContent,
          comparisonPeriod: this.searchForm.comparisonPeriod,
          adsQueryType: this.adsQueryType,
        };
        this.getPoster(res);
      }
    },

    //每页显示数据条数
    sizeChange(val) {
      this.pageSize = val;
      const res = {
        adsQueryType: this.adsQueryType,
        current: this.currentPage,
        size: this.pageSize,
        minDate: this.minDate,
        maxDate: this.maxDate,
        queryCondition: this.addContent,
        queryType: this.queryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    //当前页数
    currentChange(val) {
      this.currentPage = val;
      const res = {
        adsQueryType: this.adsQueryType,
        current: this.currentPage,
        size: this.pageSize,
        minDate: this.minDate,
        maxDate: this.maxDate,
        queryCondition: this.addContent,
        queryType: this.queryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    //广告类型
    sizeChange1(val) {
      this.pageSize1 = val;
      const res = {
        adsQueryType: this.adsQueryType,
        current: this.currentPage1,
        size: this.pageSize1,
        minDate: this.minDate1,
        maxDate: this.maxDate1,
        queryType: this.queryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    currentChange1(val) {
      this.currentPage1 = val;
      const res = {
        adsQueryType: this.adsQueryType,
        current: this.currentPage1,
        size: this.pageSize1,
        minDate: this.minDate1,
        maxDate: this.maxDate1,
        queryType: this.queryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    //站点
    sizeChange2(val) {
      this.pageSize2 = val;
      const res = {
        adsQueryType: this.adsQueryType,
        current: this.currentPage2,
        size: this.pageSize2,
        minDate: this.minDate2,
        maxDate: this.maxDate2,
        queryType: this.queryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    currentChange2(val) {
      this.currentPage2 = val;
      const res = {
        adsQueryType: this.adsQueryType,
        current: this.currentPage2,
        size: this.pageSize2,
        minDate: this.minDate2,
        maxDate: this.maxDate2,
        queryType: this.queryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    //ASIN
    sizeChange3(val) {
      this.pageSize3 = val;
      const res = {
        adsQueryType: this.adsQueryType,
        current: this.currentPage3,
        size: this.pageSize3,
        minDate: this.minDate3,
        maxDate: this.maxDate3,
        queryType: this.queryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    currentChange3(val) {
      this.currentPage3 = val;
      const res = {
        adsQueryType: this.adsQueryType,
        current: this.currentPage3,
        size: this.pageSize3,
        minDate: this.minDate3,
        maxDate: this.maxDate3,
        queryType: this.queryType,
        comparisonPeriod: this.searchForm.comparisonPeriod,
      };
      this.getPoster(res);
    },
    typeLine1() {
      (this.type1 = "line"),
        this.firstMap(this.data1, this.data2, this.data3, this.date);
    },
    typeBar1() {
      this.type1 = "bar";
      this.firstMap(this.data1, this.data2, this.data3, this.date);
    },
    typeLine2() {
      (this.type2 = "line"),
        this.firstMap(this.data1, this.data2, this.data3, this.date);
    },
    typeBar2() {
      this.type2 = "bar";
      this.firstMap(this.data1, this.data2, this.data3, this.date);
    },
    typeLine3() {
      (this.type3 = "line"),
        this.firstMap(this.data1, this.data2, this.data3, this.date);
    },
    typeBar3() {
      this.type3 = "bar";
      this.firstMap(this.data1, this.data2, this.data3, this.date);
    },

    copy(data) {
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = data; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message.success("复制成功");
    },
    //广告活动复制
    copyPoster(row) {
      const data =
        row.campaignName +
        " " +
        row.id +
        " " +
        row.impressions +
        " " +
        row.clicks +
        " " +
        row.cvr +
        " " +
        row.ctr +
        "%" +
        " " +
        row.cost +
        " " +
        row.cpc +
        " " +
        row.orders +
        " " +
        row.sales +
        " " +
        row.acos +
        "%" +
        " " +
        row.roas +
        "%"; //每一行的某个值，如选中的当前行的url
      this.copy(data);
    },
    //广告类型复制
    copyType(row) {
      const data =
        row.adsOverview +
        " " +
        row.impressions +
        " " +
        row.clicks +
        " " +
        row.orders +
        " " +
        row.cost +
        " " +
        row.sales +
        " " +
        row.ctr +
        "%" +
        " " +
        row.cvr +
        " " +
        row.cpc +
        " " +
        row.acos +
        "%" +
        " " +
        row.roas +
        "%";
      this.copy(data);
    },
    //站点复制
    copySite(row) {
      const data =
        row.countryCode +
        " " +
        row.impressions +
        " " +
        row.impressions +
        " " +
        row.clicks +
        " " +
        row.orders +
        " " +
        row.cost +
        " " +
        row.sales +
        " " +
        row.acos +
        "%" +
        " " +
        row.roas +
        "%";
      this.copy(data);
    },
    copyAsin(row) {
      const data =
        row.asin +
        " " +
        row.impressions +
        " " +
        row.impressions +
        " " +
        row.clicks +
        " " +
        row.cost +
        " " +
        row.sales +
        " " +
        row.acos +
        "%" +
        " " +
        row.roas +
        "%";
      this.copy(data);
    },
    //导出广告活动
    exportTable() {
      this.common.exportTable("tableId", "广告活动");
    },
    //导出广告类型
    exportPoster() {
      this.common.exportTable("tableId2", "广告类型");
    },
    //导出站点
    exportSite() {
      this.common.exportTable("tableId3", "站点");
    },
    //导出Asin
    exportAsin() {
      this.common.exportTable("tableId4", "Asin");
    },
    getNumber(param) {
      //自定义合计
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = param.data.length + "条";
          return;
        }
        if (index === columns.length - 1) {
          sums[index] = (
            <el-button class="export" size="mini" onClick={this.exportTable}>
              导出
            </el-button>
          );
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          switch (index) {
            case 5:
              sums[index] = sums[index].toFixed(2);
              break;
            case 6:
              sums[index] = sums[index].toFixed(2);
              break;
            case 7:
              sums[index] = sums[index].toFixed(2);
              break;
            case 8:
              sums[index] = sums[index].toFixed(2);
              break;
            case 9:
              sums[index] = sums[index].toFixed(2);
              break;
            case 10:
              sums[index] = sums[index].toFixed(2);
              break;
            case 11:
              sums[index] = sums[index].toFixed(2);
              break;
          }
        }
      });

      return sums;
    },
    //广告类型
    sumPosterType(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = param.data.length + "条";
          return;
        }
        if (index === columns.length - 1) {
          sums[index] = (
            <el-button class="export" size="mini" onClick={this.exportPoster}>
              导出
            </el-button>
          );
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          switch (index) {
            case 4:
              sums[index] = sums[index].toFixed(2);
              break;
            case 6:
              sums[index] = sums[index].toFixed(2);
              break;
            case 7:
              sums[index] = sums[index].toFixed(2);
              break;
            case 8:
              sums[index] = sums[index].toFixed(2);
              break;
          }
        }
      });
      return sums;
    },
    //站点合计
    getSite(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = param.data.length + "条";
          return;
        }
        if (index === columns.length - 1) {
          sums[index] = (
            <el-button class="export" size="mini" onClick={this.exportSite}>
              导出
            </el-button>
          );
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          switch (index) {
            case 6:
              //花费
              const siteCost = (sums[index] = sums[index].toFixed(2));
              this.siteAllCost = siteCost;
              break;
            case 7:
              //销售额
              const siteSale = (sums[index] = sums[index].toFixed(2));
              this.siteAllSales = siteSale;
              break;
          }
        }
      });
      return sums;
    },
    //asin合计
    getAsin(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = param.data.length + "条";
          return;
        }
        if (index === columns.length - 1) {
          sums[index] = (
            <el-button class="export" size="mini" onClick={this.exportAsin}>
              导出
            </el-button>
          );
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          switch (index) {
            case 4:
              sums[index] = sums[index].toFixed(2);
              break;
            case 6:
              sums[index] = sums[index].toFixed(2);
              break;
            case 7:
              sums[index] = sums[index].toFixed(2);
              break;
            case 8:
              sums[index] = sums[index].toFixed(2);
              break;
          }
        }
      });

      return sums;
    },
    //饼图
    pieChart() {
      const chartDom = document.getElementById("pieChart");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          left: "center",
        },
        color: ["#008a00", "#e27304"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "12%",
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: this.pieName,
            type: "pie",
            radius: "50%",
            data: [
              { value: this.sd, name: "SD" },
              { value: this.sp, name: "SP" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option && myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    //站点
    pieChart2(data) {
      const chartDom = document.getElementById("pieChart2");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          left: "center",
          text: this.siteName,
        },
        color: [
          "#008a00",
          "#e27304",
          "#409EFF",
          "#e74a3b",
          "#4e73df",
          "#f6c23e",
          "#005a95",
          "#e138cb",
        ],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "12%",
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: this.siteName,
            type: "pie",
            radius: "50%",
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option && myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    pieChart3(data) {
      const chartDom = document.getElementById("pieChart3");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: this.asinTitle,
        },
        dataset: {
          source: data,
        },
        color: ["#409EFF"],
        tooltip: {
          trigger: "axis",
        },
        grid: {
          containLabel: true,
          left: "3%",
          right: "8%",
          bottom: "12%",
        },
        xAxis: { name: "amount" },
        yAxis: { type: "category" },
        series: [
          {
            type: "bar",
            encode: {
              x: "amount",
              y: "product",
            },
          },
        ],
      };
      option && myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    firstMap(data1, data2, data3, date) {
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
            start: 40, //数据窗口范围的起始百分比0-100
            end: 60, //数据窗口范围的结束百分比0-100
            height: 20,
          },
        ],
        grid: {
          left: "3%",
          right: "5%",
          bottom: "13%",
          containLabel: true,
        },
        color: ["#005a95", "#e27304", "#008a00"],

        xAxis: {
          type: "category",
          boundaryGap: true,
          data: date,
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
            start: 40, //数据窗口范围的起始百分比0-100
            end: 60, //数据窗口范围的结束百分比0-100
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
  mounted() {},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.name_title {
  width: 120px !important;
}
.name {
  width: calc(100% - 120px);
}
</style>
