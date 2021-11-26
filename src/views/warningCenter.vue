<template>
  <div>
    <Title :icon="fonticon" :text="msg" />
    <section>
      <el-row :gutter="20">
        <el-col :md="24" :lg="6" :xl="5">
          <warn-table />
        </el-col>
        <el-col :md="24" :lg="18" :xl="19">
          <warn-trigger-table />
        </el-col>
      </el-row>
    </section>
    <section>
      <el-row :gutter="20">
        <el-col :md="16" :lg="16" :xl="19">
          <div class="operation">
            <el-button
              type="primary"
              size="medium"
              @click="openRule('tableForm')"
              >创建新预警规则</el-button
            >
            <el-input
              placeholder="请输入规则名称"
              v-model="ruleName"
              clearable
              @keydown.enter.native="lookup"
            >
              <template slot="prepend"><i class="el-icon-search"></i></template>
            </el-input>
            <!--right-->
            <div class="operationRight">
              <el-select
                v-model="selectColumn"
                multiple
                collapse-tags
                class="selectColumn"
                placeholder="自定义列"
                @change="handleColumn"
              >
                <el-option
                  v-for="item in todos"
                  :key="item.id"
                  :label="item.label"
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
            ref="rulesTable"
            id="rulesTable"
            max-height="560px"
            border
            :header-cell-style="{ background: '#858796', color: '#fff' }"
          >
            <el-table-column
              label="规则名称"
              prop="ruleName"
              min-width="200"
            ></el-table-column>
            <el-table-column
              v-for="(item, index) in tables"
              :key="index"
              :prop="item.prop"
              :label="item.label"
            >
              <template slot-scope="scope">{{ scope.row[item.prop] }}</template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-button
                    @click="editTable(scope.row)"
                    type="primary"
                    size="mini"
                    >编辑</el-button
                  >
                  <el-button
                    @click="deleData(scope.$index, scope.row)"
                    type="danger"
                    size="mini"
                    >删除</el-button
                  >
                </div>
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
          <tableSearch
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
            @submit="lookup"
            @addRules="addFormRules"
            @deleteData="deleteData"
          />
        </el-col>
      </el-row>

      <!--新增修改-->
      <el-dialog
        :title="tableTitle"
        :visible.sync="outerVisible"
        :close-on-click-modal="false"
        :before-close="clearDialog('tableForm')"
      >
        <el-form
          :model="tableForm"
          ref="tableForm"
          :rules="formRules"
          id="tableForms"
          label-width="100px"
        >
          <el-form-item label="规则名称：" prop="ruleName">
            <el-input
              v-model="tableForm.ruleName"
              placeholder="输入规则名称"
              class="userIput"
            ></el-input>
          </el-form-item>
          <el-form-item label="预警指标：" prop="forewarnQuota">
            <el-select
              placeholder="请选择"
              v-model="tableForm.forewarnQuota"
              clearable
            >
              <el-option
                v-for="(item, index) in ruleNames"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="判断条件：" prop="forewarnCondition">
            <el-select
              placeholder="请选择"
              v-model="tableForm.forewarnCondition"
              clearable
            >
              <el-option
                v-for="(item, index) in conditions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="阈值：" prop="threshold">
            <el-input-number
              v-model="tableForm.threshold"
              :min="0"
              :step="0.01"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="持续天数：" prop="forewarnDay">
            <el-input-number
              v-model="tableForm.forewarnDay"
              :min="0"
              :step="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="起始时间：" prop="monitorStartDate">
            <el-date-picker
              v-model="tableForm.monitorStartDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="monitorEndDate">
            <el-date-picker
              v-model="tableForm.monitorEndDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作人" prop="updateUser">
            <el-input
              v-model="tableForm.updateUser"
              placeholder="输入操作人"
              class="userIput"
            ></el-input>
          </el-form-item>
          <el-form-item label="提醒方式：" prop="remindWay">
            <el-checkbox-group v-model="tableForm.remindWay">
              <el-checkbox label="1">系统内</el-checkbox>
              <el-checkbox label="2">邮箱</el-checkbox>
              <el-checkbox label="3">企业微信</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="状态：" prop="state">
            <el-switch
              v-model="tableForm.state"
              active-text="启用"
              active-value="1"
              inactive-value="0"
              inactive-text="暂停"
            ></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel('tableForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('tableForm')"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </section>

    <section>
      <div class="publicTitle">预警规则</div>
      <warn-rule />
    </section>
  </div>
</template>

<script>
import Title from "../components/title.vue";
import Pagination1 from "../components/pagination.vue";
import api from "../API/index";
import tableSearch from "../components/tableSearch.vue";
import WarnTable from "../components/warnTable.vue";
import WarnTriggerTable from "../components/warnTriggerTable.vue";
import WarnRule from "../components/warnRule.vue";
export default {
  components: {
    Title,
    Pagination1,
    tableSearch,
    WarnTable,
    WarnTriggerTable,
    WarnRule,
  },
  data() {
    return {
      fonticon: "icon-warning",
      msg: "预警中心",
      currentPage1: 1,
      pagesize1: 10,
      totalPage1: 0,
      items: [],
      selectColumn: [],
      todos: [
        { id: 3, prop: "reachDay", label: "关联天数" },
        { id: 4, prop: "triggerNumber", label: "预警触发数" },
        { id: 5, prop: "monitorStartDate", label: "起始时间" },
        { id: 6, prop: "monitorEndDate", label: "结束时间" },
        { id: 7, prop: "forewarnDay", label: "持续天数" },
        { id: 8, prop: "forewarnQuota", label: "预警指示" },
        { id: 9, prop: "forewarnCondition", label: "判断条件" },
        { id: 10, prop: "threshold", label: "阈值" },
        { id: 11, prop: "remindWay", label: "提醒方式" },
        { id: 12, prop: "createDateTime", label: "创建日期" },
        { id: 13, prop: "updateUser", label: "操作人" },
        { id: 14, prop: "state", label: "状态" },
      ],
      formtable: {
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
        { id: "conversions", name: "Conversions" },
        { id: "CVR", name: "CVR" },
      ],
      formArray: [],
      date: "",
      datas: [],
      outerVisible: false,
      tableTitle: "",
      ruleNames: [
        { id: "spend", name: "Spend" },
        { id: "orders", name: "Orders" },
        { id: "conversions", name: "Conversions" },
        { id: "sales", name: "Sales" },
        { id: "roas", name: "ROAS" },
        { id: "acos", name: "ACoS" },
        { id: "impressions", name: "Impressions" },
        { id: "clicks", name: "Clicks" },
        { id: "cpc", name: "CPC" },
        { id: "ctr", name: "CTR" },
        { id: "cvr", name: "CVR" },
      ],
      conditions: [
        { id: "<", name: "小于" },
        { id: ">", name: "大于" },
        { id: "=", name: "等于" },
        { id: ">=", name: "大于等于" },
        { id: "<=", name: "小于等于" },
      ],
      tableForm: {
        ruleName: "",
        threshold: "0.01",
        forewarnDay: 1,
        state: "1",
        remindWay: ["1"],
        forewarnQuota: "",
        forewarnCondition: "",
        monitorStartDate: "",
        monitorEndDate: "",
        updateUser: "",
        remindInterval: "",
        id: "",
      },
      formRules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],

        forewarnQuota: [
          { required: true, message: "请选择预警指标", trigger: "change" },
        ],

        forewarnCondition: [
          { required: true, message: "请选择判断条件", trigger: "change" },
        ],

        monitorStartDate: [
          { required: true, message: "请选择起始日期", trigger: "blur" },
        ],

        threshold: [{ required: true, message: "请设置阈值", trigger: "blur" }],

        forewarnDay: [
          { required: true, message: "请设置持续天数", trigger: "blur" },
        ],
      },

      rulesTable: [],
      tables: [],
      ruleName: "",
      condition: "",
      startDate: "",
      endDate: "",
      url: "insertAlertCenter",
      newArray: [],
    };
  },
  created() {
    this.tables = this.todos;
    const result = {
      ruleName: this.ruleName,
      monitorStartDate: this.strDate,
      monitorEndDate: this.endDate,
      condition: this.formArray,
      current: this.currentPage1,
      size: this.pagesize1,
    };
    this.getAddRules(result);
  },
  mounted() {},
  methods: {
    //导出
    exportTable() {
      this.common.exportTable("rulesTable", "预警规则");
    },

    restForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新增修改预警规则
    submitForm(formName) {
      if (this.tableForm.id) {
        this.url = "updateAlertCenter";
      } else {
        this.url = "insertAlertCenter";
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.tableForm.remindWay.join();
          this.tableForm.remindWay = data;
          api
            .post("/adAlterCenter/" + this.url, this.tableForm)
            .then((res) => {
              if (res.code == 200) {
                this.$message.success("成功！！！");
                this.outerVisible = false;
                const result = {
                  ruleName: this.ruleName,
                  condition: this.formArray,
                  monitorStartDate: this.strDate,
                  monitorEndDate: this.endDate,
                  current: this.currentPage1,
                  size: this.pagesize1,
                };
                this.getAddRules(result);
                this.$refs[formName].resetFields();
              } else {
                this.$message.error("失败！！！");
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {});
        } else {
          return false;
        }
      });
    },
    arrayList() {
      return Array.prototype.slice.call(arguments);
    },
    //新增预警规则table数据
    getAddRules(data) {
      api
        .post("adAlterCenter/findAllAlertCondition", data)
        .then((res) => {
          this.totalPage1 = res.data.total;
          if (res.data.records.length > 0) {
            const arr = res.data.records;
            arr.map((item) => {
              if (item.state == 1) {
                item.state = "启用";
              } else {
                item.state = "禁用";
              }
              //修改提醒方式的值
              const array = [
                { id: 1, name: "系统内" },
                { id: 2, name: "邮箱" },
                { id: 3, name: "企业微信" },
              ];
              const aa = item.remindWay.split(",");
              let add = array.filter((item) =>
                aa.some((ele) => ele == item.id)
              );
              const newData = add.map((item) => {
                return item.name;
              });
              item.remindWay = newData.join("/");
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
    openRule() {
      this.outerVisible = !this.outerVisible;
      this.tableForm.ruleName = "";
      this.tableForm.forewarnCondition = "";
      this.tableForm.monitorEndDate = "";
      this.tableForm.monitorStartDate = "";
      this.tableForm.threshold = "0.01";
      this.tableForm.id = "";
      this.tableForm.remindWay = ["1"];
      this.tableForm.forewarnDay = 1;
      this.tableForm.updateUser = "";
      this.tableForm.forewarnQuota = "";
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
        this.newArray.push({
          value: this.formtable.value,
          symbol: this.formtable.symbol,
          metrics: this.formtable.metrics,
        });
        this.newArray.forEach((item) => {
          switch (item.symbol) {
            case 1:
              item.symbol = ">";
              break;
            case 2:
              item.symbol = "<";
              break;
            case 3:
              item.symbol = "=";
              break;
            case 4:
              item.symbol = ">=";
              break;
            case 5:
              item.symbol = "<=";
              break;
          }
        });
      }
    },
    deleteData(index) {
      this.formArray.splice(index, 1);
      this.newArray.splice(index, 1);
    },
    //查看新增规则
    lookup() {
      const result = {
        ruleName: this.ruleName,
        condition: this.newArray,
        monitorStartDate: this.startDate,
        monitorEndDate: this.endDate,
        current: this.currentPage1,
        size: this.pagesize1,
      };
      this.getAddRules(result);
    },
    //每页显示数据条数
    sizeChange1(val) {
      this.pagesize1 = val;
      const result = {
        ruleName: this.ruleName,
        condition: this.formArray,
        monitorStartDate: this.strDate,
        monitorEndDate: this.endDate,
        current: this.currentPage1,
        size: this.pagesize1,
      };
      this.getAddRules(result);
    },
    //当前页数
    currentChange1(val) {
      this.currentPage1 = val;
      const result = {
        ruleName: this.ruleName,
        condition: this.formArray,
        monitorStartDate: this.strDate,
        monitorEndDate: this.endDate,
        current: this.currentPage1,
        size: this.pagesize1,
      };
      this.getAddRules(result);
    },
    //自定义列
    handleColumn(val) {
      const data = [];
      this.todos.forEach((item, index) => {
        if (this.selectColumn.includes(item.id)) {
          data.push(item);
        }
      });
      this.$nextTick(() => {
        this.tables = data;
      });
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.outerVisible = false;
    },
    clearDialog(formName) {
      // this.restForm(formName)
      // console.log('sasda')
    },

    editTable(row) {
      this.outerVisible = !this.outerVisible;
      this.tableForm.ruleName = row.ruleName;
      this.tableForm.forewarnCondition = row.forewarnCondition;
      this.tableForm.monitorEndDate = row.monitorEndDate;
      this.tableForm.monitorStartDate = row.monitorStartDate;
      this.tableForm.threshold = row.threshold;
      this.tableForm.id = row.id;

      const array = [
        { id: "1", name: "系统内" },
        { id: "2", name: "邮箱" },
        { id: "3", name: "企业微信" },
      ];
      const aa = row.remindWay.split("/");
      let add = array.filter((item) => aa.some((ele) => ele == item.name));
      const newData = add.map((item) => {
        return item.id;
      });
      this.tableForm.remindWay = newData;

      this.tableForm.forewarnDay = row.forewarnDay;
      this.tableForm.updateUser = row.updateUser;
      this.tableForm.forewarnQuota = row.forewarnQuota;
    },
    deleData(index, row) {
      this.$confirm("是否删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api
            .put("adAlterCenter/deleteAlertCenter", { id: row.id })
            .then((res) => {
              if (res.data == true) {
                this.$message.success("删除成功！！！");
                //预警规则
                const result = {
                  ruleName: this.ruleName,
                  condition: this.formArray,
                  current: this.currentPage1,
                  monitorStartDate: this.strDate,
                  monitorEndDate: this.endDate,
                  size: this.pagesize1,
                };
                this.getAddRules(result);
              } else if (res.data == false) {
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
  },
};
</script>

<style  scoped>
</style>