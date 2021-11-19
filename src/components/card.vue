<template>
  <div>
    <el-col :md="8" :lg="6" :xl="4" v-for="(item, index) in card" :key="index">
      <el-card class="card">
        <i @click="closeCard(item.id)" class="el-icon-circle-close"></i>
        <div slot="header" class="clearfix">
          <span
            >{{ item.chineseName }}
            {{ item.chineseName && item.columns ? "|" : "" }}
            {{ item.columns }}</span
          >
        </div>
        <div class="num relative">
          {{ item.number }}
          <div class="absolute percentage">
            <p>{{ item.amount }}</p>
            <p v-if="item.percent > 0" style="color: #008a00">
              {{ item.percent }}%
            </p>
            <p v-else style="color: #e74a3b">{{ item.percent }}%</p>
          </div>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: { card: Array },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    closeCard(id) {
      this.$emit("closeCard", id);
    },
  },
};
</script>

<style  scoped>
</style>