<template>
  <div>
    <el-row :gutter="20" class="form">
      <el-form :model="searchForm" ref="searchForm">
        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="projectName">
            <el-input placeholder="请输入内容" v-model="searchForm.projectName">
              <template slot="prepend">项目：</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="semName">
            <el-input placeholder="请输入内容" v-model="searchForm.semName">
              <template slot="prepend">SEM:</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="storeName">
            <div class="flex">
              <el-button class="publicBtn">店铺:</el-button>
              <el-select
                placeholder="请选择"
                clearable
                v-model="searchForm.storeName"
                class="select"
              >
                <el-option
                  v-for="item in items"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="countryCode">
            <div class="flex">
              <el-button class="publicBtn">站点:</el-button>
              <el-select
                placeholder="请选择"
                clearable
                v-model="searchForm.countryCode"
                class="select"
              >
                <el-option
                  v-for="item in list"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="asin">
            <div class="flex">
              <el-button class="publicBtn">ASIN:</el-button>
              <el-select
                placeholder="请选择"
                clearable
                v-model="searchForm.asin"
                class="select"
              >
                <el-option
                  v-for="item in asin"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="sku">
            <div class="flex">
              <el-button class="publicBtn">SKU:</el-button>
              <el-select
                placeholder="请选择"
                clearable
                v-model="searchForm.sku"
                class="select"
              >
                <el-option
                  v-for="item in sku"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="campaignName">
            <div class="flex">
              <el-button class="publicBtn name_title">广告系列名:</el-button>
              <el-select
                placeholder="请选择"
                clearable
                v-model="searchForm.campaignName"
                class="select name"
              >
                <el-option
                  v-for="item in campaigns"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="minDate">
            <div class="flex">
              <el-button class="publicBtn name_title">起始时间:</el-button>
              <el-date-picker
                v-model="searchForm.minDate"
                type="date"
                placeholder="年/月/日"
                value-format="yyyy-MM-dd"
                :picker-options="renderPickerOptions"
                @blur="handlePickerBlur"
                class="select name"
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-col>

        <!-- <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="maxDate">
            <div class="flex">
              <el-button class="publicBtn name_title">结束时间:</el-button>
              <el-date-picker v-model="searchForm.maxDate" placeholder="年/月/日" value-format="yyyy-MM-dd" class="select name"></el-date-picker>
            </div>
          </el-form-item>
        </el-col>   -->

        <el-col :md="8" :lg="8" :xl="4">
          <el-form-item prop="comparisonPeriod">
            <div class="flex">
              <el-button class="publicBtn name_title">对比周期:</el-button>
              <el-radio-group
                v-model="searchForm.comparisonPeriod"
                class="selecttime"
              >
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="quarter">季</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-row :gutter="15">
            <el-col :span="8">
              <el-button
                class="el-icon-s-open screen"
                size="medium"
                @click="screen"
                >&nbsp;&nbsp;筛选</el-button
              >
            </el-col>
            <el-col :span="8">
              <el-button
                class="el-icon-refresh-right road"
                size="medium"
                @click="reload"
                >&nbsp;&nbsp;刷新</el-button
              >
            </el-col>
            <el-col :span="8">
              <el-button
                class="el-icon-delete-solid delete"
                size="medium"
                @click="resetForm('searchForm')"
                style="line-height: 18px"
                >&nbsp;&nbsp;清空</el-button
              >
            </el-col>
          </el-row>
        </el-col>

        <el-col :md="8" :lg="8" :xl="4">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button class="el-icon-bottom screen" size="medium"
                >&nbsp;&nbsp;报告下载</el-button
              >
            </el-col>
            <el-col :span="12">
              <el-button class="el-icon-message screen" size="medium"
                >&nbsp;&nbsp;发送报告</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "searchForm",
  props: { searchForm: Array },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    screen() {
      this.$emit("screen");
    },
  },
};
</script>

<style  scoped>
</style>