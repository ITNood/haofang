<template>
  <div>
    <div class="addCondition"><i class="el-icon-plus"></i>添加筛选条件</div>
    <div class="condition">
      <el-form :model="conditionForm" ref="conditionForm">
        <el-form-item prop="metrics" class="conditionSelect">
          <el-select v-model="conditionForm.metrics" placeholder="请选择">
            <el-option
              v-for="item in conditionName"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="symbol" class="conditionSelect">
          <el-select v-model="conditionForm.symbol" placeholder="请选择">
            <el-option
              v-for="item in symbol"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="value" class="conditionSelect">
          <el-input-number
            v-model="conditionForm.value"
            :min="0"
            :step="0.01"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-button class="el-icon-plus addform" @click="addRules()"></el-button>
      </el-form>
      <ul class="addContent">
        <li v-for="(item, index) in addContent" :key="index">
          <i class="el-icon-plus"></i>筛选条件:<span>{{ item.metrics }}</span
          >{{ item.symbol }}<span>{{ item.value }}</span>
          <el-button
            class="el-icon-close"
            @click="deleteData(index)"
          ></el-button>
        </li>
      </ul>
    </div>
    <el-date-picker
      v-model="minDateCopy"
      type="date"
      value-format="yyyy-MM-dd"
      style="width: 100%"
      placeholder="起始日期"
    ></el-date-picker>

    <el-date-picker
      v-model="maxDateCopy"
      type="date"
      value-format="yyyy-MM-dd"
      style="margin-top: 20px; width: 100%"
      placeholder="结束日期"
    ></el-date-picker>

    <el-button
      size="medium"
      type="primary"
      style="margin-top: 20px; width: 100%"
      class="el-icon-search"
      @click="submit"
      >&nbsp;查找</el-button
    >
  </div>
</template>

<script>
export default {
  name: "tableSearch",
  props: {
    addContent: Array,
    conditionName: Array,
    conditionForm: Object,
    minDate: String,
    maxDate: String,
  },
  data() {
    return {
      symbol: [
        { name: "大于", id: 1 },
        { name: "小于", id: 2 },
        { name: "等于", id: 3 },
        { name: "大于等于", id: 4 },
        { name: "小于等于", id: 5 },
      ],
    };
  },
  computed: {
    minDateCopy: {
      get() {
        return this.minDate;
      },
      set(val) {
        this.$emit("updateMinDate", val);
      },
    },
    maxDateCopy: {
      get() {
        return this.maxDate;
      },
      set(val) {
        this.$emit("updateMaxDate", val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$emit("submit");
    },
    //删除
    deleteData(index) {
      this.$emit("deleteData", index);
    },
    addRules() {
      this.$emit("addRules");
    },
  },
  mounted() {},
};
</script>

<style  scoped>
</style>