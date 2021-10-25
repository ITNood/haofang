<template>
  <div>
      <div class="title">Campaign<i></i><dfn>{{text}}</dfn></div>
      <section>
      <el-tabs v-model="activeName" class="tabs" @tab-click="count">
        <el-tab-pane label="广告活动指标" name="1">
          <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="(item,index) in card" :key="index">
              <el-card class="card">
                <i @click="closeCard(item.id)" class="el-icon-circle-close"></i>
                <div slot="header" class="clearfix">
                  <span>{{item.name}} | {{item.englishName}}</span>
                </div>
                <div class="num relative">
                  <countTo :startVal='0' :endVal="item.number" ref="addCount" :duration='2000' style="font-size:2.5rem;" ></countTo>
                  <div class="absolute percentage">
                    <p>{{item.amount}}</p>
                    <p v-if="item.percent>0" style="color:#008a00">{{item.percent}}%</p>
                    <p v-else style="color:#e74a3b">{{item.percent}}%</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="12" :sm="8" :md="6" :lg="4">
              <el-card class="card" @click="addCard">
                <div slot="header" class="clearfix" style="text-align:center;color:#005a95">
                  <span>添加指标 | Add Metrics</span>
                </div>
                <div class="addicoon el-icon-plus"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="销售数据指标" name="2">
          <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="(item,index) in market" :key="index">
              <el-card class="card">
                <i @click="closeCard(item.id)" class="el-icon-circle-close"></i>
                <div slot="header" class="clearfix">
                  <span>{{item.name}} | {{item.englishName}}</span>
                </div>
                <div class="num relative">
                  <countTo :startVal='0' :endVal="item.number" ref="countdown" :duration='2000' style="font-size:2.5rem;" ></countTo>
                  <div class="absolute percentage">
                    <p>{{item.amount}}</p>
                    <p v-if="item.percent>0" style="color:#008a00">{{item.percent}}%</p>
                    <p v-else style="color:#e74a3b">{{item.percent}}%</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="12" :sm="8" :md="6" :lg="4">
              <el-card class="card" @click="addCard">
                <div slot="header" class="clearfix" style="text-align:center;color:#005a95">
                  <span>添加指标 | Add Metrics</span>
                </div>
                <div class="addicoon el-icon-plus"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </section>

    <section>
      <el-tabs v-model="activetabs" class="tabs" style="margin-top:20px" @tab-click="handleClick">
        <el-tab-pane  lazy label="指标对比图" name="1">
          <el-row :gutter="40">
            <el-col :lg="18" :md="16">
              <div id="firstMap"></div>
            </el-col>
            <el-col :lg="6" :md="8">
              <el-form :model="form" ref="form">
                <ul class="formlist">
                  <li>
                    <el-button size="medium">对比指标1：</el-button>
                    <el-select v-model="form.target" placeholder="请选择">
                      <el-option v-for="item in target" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <dfn class="icon iconfont icon-brokenLine" @click="typeLine1"></dfn>
                    <dfn class="el-icon-s-data" @click="typeBar1"></dfn>
                  </li>
                  <li>
                    <el-button size="medium">对比指标2：</el-button>
                    <el-select v-model="form.target" placeholder="请选择">
                      <el-option v-for="item in target" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <dfn class="icon iconfont icon-brokenLine" @click="typeLine2"></dfn>
                    <dfn class="el-icon-s-data" @click="typeBar2"></dfn>
                  </li>
                  <li>
                    <el-button size="medium">对比指标3：</el-button>
                    <el-select v-model="form.target" placeholder="请选择">
                      <el-option v-for="item in target" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <dfn class="icon iconfont icon-brokenLine" @click="typeLine3"></dfn>
                    <dfn class="el-icon-s-data" @click="typeBar3"></dfn>
                  </li>
                  <li>
                    <el-button size="medium">时间</el-button>
                    <el-select v-model="form.date" placeholder="请选择">
                      <el-option v-for="item in time"  :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <el-button class="el-icon-check plot">生成图表</el-button>
                  </li>
                  <li>
                    <el-row :gutter="30">
                      <el-col :span="12">
                        <el-button size="medium" class="plotBtn">Imp vs Clk</el-button>
                      </el-col>
                      <el-col :span="12">
                        <el-button size="medium" class="plotBtn">Cost VS Sale</el-button>
                      </el-col>
                    </el-row>
                  </li>
                  <li>
                    <el-row :gutter="30">
                      <el-col :span="12">
                        <el-button size="medium" class="plotBtn">CVR VS CTR</el-button>
                      </el-col>
                      <el-col :span="12">
                        <el-button size="medium" class="plotBtn el-icon-edit edit">修改常用图</el-button>
                      </el-col>
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
              <el-form :mpodel="dateForm" ref="dateForm">
                <ul class="formlist timeForm">
                  <li>
                    <el-button size="medium">付款时间</el-button>
                    <el-select v-model="dateForm.payDate" placeholder="请选择" style="width:80%">
                      <el-option v-for="item in payTime" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </li>
                  <li>
                    <el-button size="medium">站点</el-button>
                    <el-select v-model="dateForm.payDate" placeholder="请选择" style="width:80%">
                      <el-option v-for="item in payTime" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </li>
                  <li>
                    <el-button size="medium">ASIN</el-button>
                    <el-select v-model="dateForm.payDate" placeholder="请选择" style="width:80%">
                      <el-option v-for="item in payTime" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </li>
                  <li>
                    <el-button size="medium">品牌商</el-button>
                    <el-select v-model="dateForm.payDate" placeholder="请选择" style="width:80%">
                      <el-option v-for="item in payTime" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </li>
                  <li>
                    <el-button size="medium">月份</el-button>
                    <el-select v-model="dateForm.payDate" placeholder="请选择" style="width:80%">
                      <el-option v-for="item in payTime" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </li>
                  <li>
                    <el-button size="medium">产品编码</el-button>
                    <el-select v-model="dateForm.payDate" placeholder="请选择" style="width:80%">
                      <el-option v-for="item in payTime" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </li>
                </ul>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </section>

    <section>
        <div class="operation">
            <el-input placeholder="查找广告组" v-model="content" style="margin:0">
              <template slot="prepend"><i class="el-icon-search"></i></template>
            </el-input>
            <el-select placeholder="筛选条件" v-model="selectedName">
                <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <!--right-->
            <div class="operationRight">
                <el-select placeholder="列/自定义" v-model="column">
                    <el-option v-for="(item,index) in todos" :key="index" :label="item.name"></el-option>
                </el-select>
                <el-select placeholder="日期范围" v-model="date">
                    <el-option v-for="(item,index) in dates" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-button type="primary" size="medium" style="margin-left:20px" @click="exportTable">导出</el-button>
            </div>
        </div>
        <el-table :data="rulesTable" v-loading="loading" ref="rulesTable" id="rulesTable" border :header-cell-style="{background:'#858796',color:'#fff'}" max-height="600">
            <el-table-column label="是否有效" prop="isEffective">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isEffective" disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="Product" width="200">
              <template slot-scope="scope" >
                <div class="product">
                  <img :src="scope.row.img">
                  <p>{{scope.row.productName}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    {{scope.row.status===0 ?'启用':'禁用'}}
                </template>
            </el-table-column>
            <el-table-column label="SKU/ASIN" prop="name"></el-table-column>
            <el-table-column label="暴光量" prop="exposure"></el-table-column>
            <el-table-column label="点击次数" prop="clickNumber"></el-table-column>
            <el-table-column label="点击率（CTR）" prop="ctr">
              <template slot-scope="scope">{{scope.row.ctr}}%</template>
            </el-table-column>
            <el-table-column label="花费" prop="spend">
              <template slot-scope="scope">${{scope.row.spend}}</template>
            </el-table-column>
            <el-table-column label="CPC" prop="cpc">
              <template slot-scope="scope">${{scope.row.cpc}}</template>
            </el-table-column>
            <el-table-column label="订单" prop="order"></el-table-column>
            <el-table-column label="销售额" prop="salesVolume"></el-table-column>
            <el-table-column label="ACoS" prop="acos">
              <template slot-scope="scope">{{scope.row.acos}}%</template>
            </el-table-column>
            <el-table-column label="RoAS" prop="roas"></el-table-column>
        </el-table>
        <Pagination :currentPage="currentPage" :total="totalPage" @handleSizeChange="sizeChange" @handleCurrentChange="currentChange"/>
      </section>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import Pagination from '../components/pagination.vue'
import countTo from 'vue-count-to';
export default {
  components:{Pagination,countTo},
  data() { 
    return {
      text:'Campaign名称',
      activeName:'1',
      loading:false,
      card:[
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:-58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:-58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:-58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:-58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:58},
        {id:1,name:'点击量',englishName:'Clicks',number:200,amount:38,percent:-58},
      ],
      market:[
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:-58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:-58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:-58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:-58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:58},
        {id:1,name:'访问总量',englishName:'Clicks',number:1555,amount:38,percent:-58},
      ],
      activetabs:'1',
      form:{},
      dateForm:{},
      target:[],
      time:[],
      payTime:[],
      content:'',
      selectedName:'',
      items:[],
      column:'',
      todos:[],
      date:'',
      dates:[],
      rulesTable:[
        {id:1,isEffective:true,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:true,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:true,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:true,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:false,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:true,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:false,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:true,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:true,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55},
        {id:1,isEffective:true,img:require('../assets/HoFan_Logo.jpg'),productName:'大客户的',status:0,name:'SKU/ASIN',exposure:52,clickNumber:484,ctr:21,spend:'12.55',cpc:'13.55',order:4845,salesVolume:46948,acos:'12.45',roas:464.55}
      ],
      currentPage:1,
      totalPage:10,
      type1:'line',
      type2:'line',
      type3:'line'
    }
  },
  created() {

  },
  mounted() {
      this.firstMap()
  },
  methods:{
      addCard(){},
      handleClick(event){
      if(event.name==2){
        this.$nextTick(()=>{
          this.timeMap()
        })
      }
    },
    typeLine1(){
      this.type1='line',
      this.firstMap()
    },
    typeLine2(){
      this.type2='line',
      this.firstMap()
    },
    typeLine3(){
      this.type3='line',
      this.firstMap()
    },
    typeBar1(){
      this.type1='bar',
      this.firstMap()
    },
    typeBar2(){
      this.type2='bar',
      this.firstMap()
    },
    typeBar3(){
      this.type3='bar',
      this.firstMap()
    },
    count(event){
      if(event.name==2){
        this.market.forEach((item,i)=>{
          this.$refs.countdown[i].start()
        })
      }else{
        this.card.forEach((item,i)=>{
          this.$refs.addCount[i].start()
        })
      }
    },
    //每页显示数据条数
    sizeChange(val){
      console.log(val)
    },
    //当前页数
    currentChange(val){
      console.log(val)
    },
    exportTable(){
        var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(document.querySelector('#rulesTable'), xlsxParam)
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'product.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    },
     //删除卡片
    closeCard(id){
      console.log(id)
      this.$confirm('是否关闭？',{
          confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=>{
          console.log('关闭成功！！')
        }).catch(()=>{
          console.log('取消关闭！！')
        })
    },
    firstMap(){
      const chartDom = document.getElementById('firstMap');
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: 'Stacked Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Email', 'Union Ads', 'Video Ads']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom:[
          {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'none',
              height:20,
              start:20,
              end:80
            },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        color:['#005a95','#e27304','#008a00'],
        
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Email',
            type: this.type1,
            // stack: 'Total',//堆叠效果
            smooth: true,//折线平滑
            barWidth: 20,
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: this.type2,
            smooth: true,
            barWidth: 20,
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: this.type3,
            smooth: true,
            barWidth: 20,
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      };
    option && myChart.setOption(option,true);
  },
  timeMap(){
    const chartDom = document.getElementById('timeMap');
    const myChart = echarts.init(chartDom);
    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      color:['#005a95','#e27304'],
      grid: {
        left: '3%',
        right: '3%',
        bottom: '10%',
        containLabel: true
      },
       dataZoom:[
          {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'none',
              height:20,
              start:20,
              end:80
            },
        ],
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barWidth: 20,
        },
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barWidth: 20,
        }
      ]
    };
    option && myChart.setOption(option,true);
   },
  },
 }
</script>

<style  scoped>
</style>