<template>
  <div>
      <div class="title">智能广告投放<i></i><span :class="icon" class="icon iconfont"></span><dfn>{{text}}</dfn></div>
  </div>
</template>

<script>
export default {
  name: "Title",
  props:['icon','text'],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style  scoped>

</style>