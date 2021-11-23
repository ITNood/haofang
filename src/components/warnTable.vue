<template>
  <div>
    <div class="publicTitle">预警统计表</div>
    <ul class="warnTable">
      <li>
        有效预警规则<span>{{ warnRules }}</span>
      </li>
      <li>
        暂停中预警规则<span>{{ suspend }}</span>
      </li>
      <li>
        监控中Campaign数量<span>{{ Campaign }}</span>
      </li>
      <li>
        监控中Keyword数量<span>{{ Keyword }}</span>
      </li>
      <li>
        Campaign预警触发未处理数量<span>{{ campaignWarn }}</span>
      </li>
      <li>
        Keyword预警触发未处理数量<span>{{ keywordWarn }}</span>
      </li>
      <li>
        已处理Campaign预警触发数量<span>{{ processedCampaign }}</span>
      </li>
      <li>
        已处理Keyword预警触发数量<span>{{ processedKeyword }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../API/index";
export default {
  name: "warnTable",
  data() {
    return {
      warnRules: 0,
      suspend: 0,
      Campaign: 0,
      Keyword: 0,
      campaignWarn: 0,
      keywordWarn: 0,
      processedCampaign: 0,
      processedKeyword: 0,
    };
  },
  created() {
    this.getWarnTable();
  },
  mounted() {},
  methods: {
    //预警统计表
    getWarnTable() {
      api
        .get("adAlterCenter/warningStatistics")
        .then((res) => {
          this.suspend = res.data.alertCenterStopCount;
          this.warnRules = res.data.alertCenterMoveCount;
          this.Campaign = res.data.sumCampaignNumber;
          this.Keyword = res.data.sumKeyWordNumber;
          this.campaignWarn = res.data.campaignCenterUntreated;
          this.keywordWarn = res.data.KeyWordCenterUntreated;
          this.processedCampaign = res.data.campaignCenterProcessed;
          this.processedKeyword = res.data.KeyWordCenterProcessed;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
  },
};
</script>

<style  scoped>
</style>