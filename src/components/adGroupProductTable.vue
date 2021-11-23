<template>
  <div>
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
            @deleteData="deleteData"
          />
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import Pagination from "../components/pagination.vue";
import api from "../API/index";
import tableSearch from "../components/tableSearch.vue";
export default {
  name: "adGroupProductTable",
  props: {
    adGroupId: String,
    campaignId: String,
    adType: String,
  },
  components: { Pagination, tableSearch },
  data() {
    return {
      rulesTable: [],
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
        { id: 5, prop: "ctr", name: "点击率（%）" },
        { id: 6, prop: "cost", name: "花费($)" },
        { id: 7, prop: "cpc", name: "CPC" },
        { id: 8, prop: "orders", name: "订单" },
        { id: 9, prop: "sales", name: "销售额" },
        { id: 10, prop: "acos", name: "ACoS(%)" },
        { id: 11, prop: "roas", name: "RoAS(%)" },
      ],
      column1: [],
      content: "",
      column: "",
      minDate: "",
      maxDate: "",
    };
  },
  created() {
    this.listColumn = this.todos;
    const data = {
      minDate: this.minDate,
      maxDate: this.maxDate,
      queryCondition: this.addContent,
      campaignId: this.campaignId,
      adGroupId: this.adGroupId,
      adType: this.adType,
      adGroupName: this.content,
      current: this.currentPage,
      size: this.pageSize,
      queryFlag: 1,
    };
    this.getdata(data);
  },
  mounted() {},
  methods: {
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
      this.$confirm(`是否设置${row.isUsing === "1" ? "无效" : "有效"}？？？`, {
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
                  campaignId: this.campaignId,
                  adGroupId: this.adGroupId,
                  adType: this.adType,
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
        campaignId: this.campaignId,
        adGroupId: this.adGroupId,
        adType: this.adType,
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
        campaignId: this.campaignId,
        adGroupId: this.adGroupId,
        adType: this.adType,
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
        campaignId: this.campaignId,
        adGroupId: this.adGroupId,
        adType: this.adType,
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
        campaignId: this.campaignId,
        adGroupId: this.adGroupId,
        adType: this.adType,
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
            case 1:
              item.symbol = "大于";
              break;
            case 2:
              item.symbol = "小于";
              break;
            case 3:
              item.symbol = "等于";
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
  },
};
</script>

<style  scoped>
</style>