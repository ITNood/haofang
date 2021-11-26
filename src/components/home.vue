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

        <el-col :md="8" :lg="8" :xl="4" style="margin-bottom: 22px">
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

        <el-col :md="8" :lg="8" :xl="4" style="margin-bottom: 22px">
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

    <div class="formData">
      <span class="pagetitle">数据看板</span> -
      <span class="shaky">广告活动:</span>
      <p v-if="searchForm.projectName">
        {{ searchForm.projectName ? " 项目:" : "" }}{{ searchForm.projectName }}
      </p>
      <p v-if="searchForm.semName">
        {{ searchForm.semName ? " SEM:" : "" }}{{ searchForm.semName }}
      </p>
      <p v-if="searchForm.storeName">
        {{ searchForm.storeName ? " 店铺:" : "" }}{{ searchForm.storeName }}
      </p>
      <p v-if="searchForm.countryCode">
        {{ searchForm.countryCode ? " 站点:" : "" }}{{ searchForm.countryCode }}
      </p>
      <p v-if="searchForm.asin">
        {{ searchForm.asin ? " ASIN:" : "" }}{{ searchForm.asin }}
      </p>
      <p v-if="searchForm.sku">
        {{ searchForm.sku ? " SKU:" : "" }}{{ searchForm.sku }}
      </p>
      <p v-if="searchForm.campaignName">
        {{ searchForm.campaignName ? " 广告系列名:" : ""
        }}{{ searchForm.campaignName }}
      </p>
      <p v-if="searchForm.minDate">
        {{ searchForm.minDate ? " 起始时间:" : "" }}{{ searchForm.minDate }}
      </p>
      <p v-if="searchForm.comparisonPeriod">
        {{ searchForm.comparisonPeriod ? " 对比周期:" : ""
        }}{{
          searchForm.comparisonPeriod === "week"
            ? "周"
            : searchForm.comparisonPeriod === "month"
            ? "月"
            : searchForm.comparisonPeriod === "quarter"
            ? "季"
            : searchForm.comparisonPeriod === "year"
            ? "年"
            : "日"
        }}
      </p>
    </div>
  </div>
</template>

<script>
import api from "../API/index";
let _minDate = 0;
let millisecondOfDay = 1 * 24 * 60 * 60 * 1000;
export default {
  name: "Home",
  props: {
    searchForm: Object,
  },
  data() {
    return {
      items: [],
      list: [],
      asin: [],
      sku: [],
      campaigns: [],
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
  created() {
    this.getAsinselect();
    this.getCampaignName();
    this.getSiteData();
    this.getSkuData();
    this.getStoreData();
  },
  mounted() {},
  methods: {
    //获取asin下拉数据
    getAsinselect() {
      let that = this;
      api
        .get("/adDataStateVB/getAllAsin")
        .then((res) => {
          that.asin = res.data;
          localStorage.setItem("ASIN", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    //广告系列名
    getCampaignName() {
      let that = this;
      api
        .get("/adDataStateVB/getAllCampaignName")
        .then((res) => {
          that.campaigns = res.data;
          localStorage.setItem("CampaignName", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    //站点
    getSiteData() {
      let that = this;
      api
        .get("/adDataStateVB/getAllCountryCode")
        .then((res) => {
          localStorage.setItem("SITE", JSON.stringify(res.data));
          that.list = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    //sku
    getSkuData() {
      let that = this;
      api
        .get("/adDataStateVB/getAllsku")
        .then((res) => {
          localStorage.setItem("SKU", JSON.stringify(res.data));
          that.sku = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    getStoreData() {
      let that = this;
      api
        .get("/adDataStateVB/getAllStoreName")
        .then((res) => {
          localStorage.setItem("Store", JSON.stringify(res.data));
          that.items = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    handlePickerBlur(date) {
      _minDate = 0;
    },
    screen() {
      this.$emit("screen");
    },
    //刷新
    reload() {
      this.$emit("reload");
    },
    //清空
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style  scoped>
.name_title {
  width: 120px !important;
}
.name {
  width: calc(100% - 120px);
}
</style>