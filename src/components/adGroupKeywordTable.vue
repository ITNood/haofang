<template>
  <div>
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
          <Pagination
            :currentPage="currentPage"
            :total="totalPage"
            @handleSizeChange="sizeChange"
            @handleCurrentChange="currentChange"
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
            @deleteData="delkeyWord"
          />
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import api from "../API/index";
import Pagination from "../components/pagination.vue";
import tableSearch1 from "../components/tableSearch.vue";
export default {
  name: "adGroupKeywordTable",
  props: { adGroupId: String, campaignId: String, adType: String },
  components: { Pagination, tableSearch1 },
  data() {
    return {
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
      startDate: "",
      endDate: "",
      currentPage: 1,
      pageSize: 10,
      totalPage: 10,
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
    };
  },
  created() {
    this.keyword = this.lists;
    const result = {
      adGroupId: this.adGroupId,
      adType: this.adType,
      campaignId: this.campaignId,
      adGroupName: this.keywordName,
      queryFlag: 1,
      current: this.currentPage,
      size: this.pageSize,
      minDate: this.startDate,
      maxDate: this.endDate,
      queryCondition: this.formArray,
    };
    this.getkeyword(result);
  },
  mounted() {},
  methods: {
    getkeyword(data) {
      api
        .post("/AmazonProductAdsDay/findKeyWord", data)
        .then((res) => {
          console.log(res);
          this.totalPage = res.data.total;
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
        adType: this.adType,
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
                adGroupId: this.adGroupId,
                adType: this.adType,
                campaignId: this.campaignId,
                adGroupName: this.keywordName,
                queryFlag: 1,
                current: this.currentPage,
                size: this.pageSize,
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
    delkeyWord(index) {
      this.formArray.splice(index, 1);
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
        adGroupId: this.adGroupId,
        campaignId: this.campaignId,
        adType: this.adType,
        adGroupName: this.keywordName,
        queryFlag: 1,
        current: this.currentPage3,
        size: this.pageSize,
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
        adGroupId: this.adGroupId,
        adType: this.adType,
        campaignId: this.campaignId,
        adGroupName: this.keywordName,
        queryFlag: 1,
        current: this.currentPage,
        size: this.pageSize,
        minDate: this.startDate,
        maxDate: this.endDate,
        queryCondition: this.formArray,
      };
      this.getkeyword(result);
    },
    submitKeyword() {
      const data = {
        adGroupId: this.adGroupId,
        adType: this.adType,
        adGroupName: this.keywordName,
        campaignId: this.campaignId,
        queryFlag: 1,
        current: this.currentPage,
        size: this.pageSize,
        minDate: this.startDate,
        maxDate: this.endDate,
        queryCondition: this.formArray,
      };
      this.getkeyword(data);
    },
  },
};
</script>

<style  scoped>
</style>