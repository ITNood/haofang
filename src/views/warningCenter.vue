<template>
  <div>
      <Title :icon="fonticon" :text="msg"/>
      <section>
          <el-row :gutter="20">
              <el-col :md="24" :lg="6" :xl="5">
                  <div class="publicTitle">预警统计表</div>
                  <ul class="warnTable">
                      <li>有效预警规则<span>{{rules}}</span></li>
                      <li>暂停中预警规则<span>{{suspend}}</span></li>
                      <li>监控中Campaign数量<span>{{Campaign}}</span></li>
                      <li>监控中Keyword数量<span>{{Keyword}}</span></li>
                      <li>Campaign预警触发未处理数量<span>{{campaignWarn}}</span></li>
                      <li>Keyword预警触发未处理数量<span>{{keywordWarn}}</span></li>
                      <li>已处理Campaign预警触发数量<span>{{processedCampaign}}</span></li>
                      <li>已处理Keyword预警触发数量<span>{{processedKeyword}}</span></li>
                  </ul>
              </el-col>
              <el-col :md="24" :lg="10" :xl="10">
                  <div class="publicTitle">预警触发表</div>
                  <el-table :data="warnTable" v-loading="loading" border max-height="500" :header-cell-style="{background:'#858796',color:'#fff'}">
                      <el-table-column label="Campaign/Keyword" prop="name" width="200"></el-table-column>
                      <el-table-column label="预警指标" prop="target"></el-table-column>
                      <el-table-column label="判断条件" prop="condition"></el-table-column>
                      <el-table-column label="阈值" prop="threshold"></el-table-column>
                      <el-table-column label="持续天数" prop="day"></el-table-column>
                      <el-table-column label="操作">
                          <template slot-scope="scope">
                              <el-button size="mini" type="primary" @click="look(scope.$index,scope.row)">查看</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
                  <Pagination :currentPage="currentPage" :total="totalPage" @handleSizeChange="sizeChange" @handleCurrentChange="currentChange" />
              </el-col>
              <el-col :md="24" :lg="8" :xl="9">
                  <div class="publicTitle">Campaign/Keyword: Name</div>
                  <el-row :gutter="20">
                      <el-col :span="12">
                          <el-card class="card">
                            <div slot="header" class="clearfix">
                            <span>订单量 | Order</span>
                            </div>
                            <div class="num relative">
                                <countTo :startVal='0' :endVal="1561" :duration='2000' style="font-size:2.5rem;" ></countTo>
                                <div class="absolute percentage">
                                    <p>1512</p>
                                    <p style="color:#008a00">154%</p>
                                    <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                </div>
                            </div>
                         </el-card>
                      </el-col>
                      <el-col :span="12">
                          <el-card class="card">
                            <div slot="header" class="clearfix">
                            <span>订单量 | Order</span>
                            </div>
                            <div class="num relative">
                                <countTo :startVal='0' :endVal="1561" :duration='2000' style="font-size:2.5rem;" ></countTo>
                                <div class="absolute percentage">
                                    <p>1512</p>
                                    <p style="color:#008a00">154%</p>
                                    <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                </div>
                            </div>
                         </el-card>
                      </el-col>
                      <el-col :span="12">
                          <el-card class="card">
                            <div slot="header" class="clearfix">
                            <span>订单量 | Order</span>
                            </div>
                            <div class="num relative">
                                <countTo :startVal='0' :endVal="1561" :duration='2000' style="font-size:2.5rem;" ></countTo>
                                <div class="absolute percentage">
                                    <p>1512</p>
                                    <p style="color:#008a00">154%</p>
                                    <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                </div>
                            </div>
                         </el-card>
                      </el-col>
                      <el-col :span="12">
                        <el-card class="card" @click="addCard">
                            <div class="lookDetails ellipsis">+ 查看Campaign/Keyword详情</div>
                        </el-card>
                      </el-col>
                  </el-row>
                  <div id="dataCharts"></div>
              </el-col>
          </el-row>
      </section>
      <section>
          <div class="operation">
              <el-button type="primary" size="medium" @click="openRule">创建新预警规则</el-button>
              <el-input placeholder="请输入内容" v-model="content">
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
          <el-table :data="rulesTable" v-loading="loading1" ref="rulesTable" id="rulesTable" border :header-cell-style="{background:'#858796',color:'#fff'}">
              <el-table-column label="是否有效" prop="isEffective">
                  <template slot-scope="scope">
                      <el-switch v-model="scope.row.isEffective" disabled></el-switch>
                  </template>
              </el-table-column>
              <el-table-column label="规则名称" prop="rulesName" width="200"></el-table-column>
              <el-table-column label="状态" prop="status">
                  <template slot-scope="scope">
                      {{scope.row.status===0 ?'启用':'禁用'}}
                  </template>
              </el-table-column>
              <el-table-column label="关联数量" prop="number"></el-table-column>
              <el-table-column label="预警触发数" prop="warnNumber"></el-table-column>
              <el-table-column label="起始时间" prop="startDate"></el-table-column>
              <el-table-column label="结束时间" prop="endDate"></el-table-column>
              <el-table-column label="持续天数" prop="dayNumber"></el-table-column>
              <el-table-column label="预警指示" prop="warnName"></el-table-column>
              <el-table-column label="判断条件" prop="conditions">
                  <template slot-scope="scope">
                      {{scope.row.conditions===0?'等于':(scope.row.conditions===1?'大于':(scope.row.conditions===2 ? '小于':(scope.row.conditions===3 ? '小于等于':'大于等于')))}}
                  </template>
              </el-table-column>
              <el-table-column label="阈值" prop="threshold"></el-table-column>
              <el-table-column label="提醒方式" prop="way" width="200"></el-table-column>
              <el-table-column label="提醒间隔" prop="time"></el-table-column>
              <el-table-column label="创建日期" prop="date"></el-table-column>
              <el-table-column label="创建人" prop="user"></el-table-column>
              <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                      <div class="tableBtn">
                        <el-button @click="editTable(scope.row)" type="primary" size="mini" >编辑</el-button>
                        <el-button @click="dele(scope.$index,scpoe.row)" type="danger" size="mini">删除</el-button>
                      </div>
                  </template>
              </el-table-column>
          </el-table>
          <Pagination1 :currentPage="currentPage1" :total="totalPage1" @handleSizeChange="sizeChange1" @handleCurrentChange="currentChange1"/>
          <!--新增修改-->
          <el-dialog :title="tableTitle" :visible.sync="outerVisible" :close-on-click-modal="false">
              <el-form :model="tableForm" ref="tableForm" id="tableForm" label-width="100px">
                  <el-form-item label="规则名称：">
                      <el-select placeholder="请选择" v-model="tableForm.name">
                          <el-option v-for="item in ruleName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="预警指标：" >
                      <el-select placeholder="请选择" v-model="tableForm.warnName">
                          <el-option v-for="item in ruleName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="判断条件：" >
                      <el-select placeholder="请选择" v-model="tableForm.conditions">
                          <el-option v-for="item in ruleName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="提醒间隔：" >
                      <el-time-picker v-model="tableForm.time" arrow-control  placeholder="任意时间点"></el-time-picker>
                  </el-form-item>
                  <el-form-item label="阈值：" >
                      <el-input-number v-model="tableForm.threshold" :min="0"  :step="0.01"></el-input-number>
                  </el-form-item>
                  <el-form-item label="持续天数：">
                      <el-input-number v-model="tableForm.dayNumber" :min="0"  :step="0.01"></el-input-number>
                  </el-form-item>
                  <el-form-item label="起始时间：">
                      <el-date-picker v-model="tableForm.startDate" type="date" placeholder="选择日期"> </el-date-picker>
                  </el-form-item>
                  <el-form-item label="结束时间：">
                      <el-date-picker v-model="tableForm.endDate" type="date" placeholder="选择日期"> </el-date-picker>
                  </el-form-item>
                  <el-form-item label="创建人：">
                      <el-input v-model="tableForm.user" placeholder="输入创建人" class="userIput"></el-input>
                  </el-form-item>
                  <el-form-item label="提醒方式：">
                      <el-checkbox-group v-model="tableForm.way">
                          <el-checkbox label="1">系统内</el-checkbox>
                          <el-checkbox label="2">邮箱</el-checkbox>
                          <el-checkbox label="3">企业微信</el-checkbox>
                      </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="状态：">
                      <el-switch v-model="tableForm.status" active-text="启用" inactive-text="暂停"></el-switch>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="outerVisible = false">取 消</el-button>
                <el-button type="primary" @click="innerVisible = true">确定</el-button>
              </div>
          </el-dialog>
      </section>

      <section>
          <div class="publicTitle">预警规则</div>
          <el-row :gutter="20">
              <el-col :md="24" :lg="16" :xl="15">
                  <el-table :data="ruleData" v-loading="loading2" border :header-cell-style="{background:'#858796',color:'#fff'}" max-height="560">
                      <el-table-column label="是否有效" prop="isEffective">
                          <template slot-scope="scope">
                              <el-switch v-model="scope.row.isEffective" disabled></el-switch>
                          </template>
                      </el-table-column>
                      <el-table-column label="Campaign/Keyword" prop="name" width="200"></el-table-column>
                      <el-table-column label="状态" prop="status">
                          <template slot-scope="scope">
                              <p v-if="scope.row.status===1" style="color:#008a00">启用</p>
                              <p v-else style="color:#e74a3b">禁用</p>
                          </template>
                      </el-table-column>
                      <el-table-column label="起始时间" prop="startTime"></el-table-column>
                      <el-table-column label="结束时间" prop="endTime"></el-table-column>
                      <el-table-column label="是否触发" prop="isTrigger">
                          <template slot-scope="scope">
                               <p v-if="scope.row.isTrigger===1" style="color:#008a00">是</p>
                              <p v-else>否</p>
                          </template>
                      </el-table-column>
                      <el-table-column label="历史触发数" prop="number"></el-table-column>
                      <el-table-column label="已达标天数" prop="dateNumber"></el-table-column>
                      <el-table-column label="创建日期" prop="newDate"></el-table-column>
                      <el-table-column label="创建人" prop="user"></el-table-column>
                      <el-table-column label="操作">
                          <template slot-scope="scope">
                              <el-button @click="deleRules(scope.row)" type="danger" size="mini">删除</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
                  <Pagination2 :currentPage="currentPage2" :total="totalPage2" @handleSizeChange="sizeChange2" @handleCurrentChange="currentChange2"/>
              </el-col>
              <el-col :md="24" :lg="8" :xl="9">
                  <el-row :gutter="20">
                      <el-col :span="12">
                          <el-card class="card">
                            <div slot="header" class="clearfix">
                            <span>订单量 | Order</span>
                            </div>
                            <div class="num relative">
                                4156
                                <div class="absolute percentage">
                                    <p>1512</p>
                                    <p style="color:#008a00">154%</p>
                                    <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                </div>
                            </div>
                         </el-card>
                      </el-col>
                      <el-col :span="12">
                          <el-card class="card">
                            <div slot="header" class="clearfix">
                            <span>订单量 | Order</span>
                            </div>
                            <div class="num relative">
                                4156
                                <div class="absolute percentage">
                                    <p>1512</p>
                                    <p style="color:#008a00">154%</p>
                                    <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                </div>
                            </div>
                         </el-card>
                      </el-col>
                      <el-col :span="12">
                          <el-card class="card">
                            <div slot="header" class="clearfix">
                            <span>订单量 | Order</span>
                            </div>
                            <div class="num relative">
                                4156
                                <div class="absolute percentage">
                                    <p>1512</p>
                                    <p style="color:#008a00">154%</p>
                                    <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                </div>
                            </div>
                         </el-card>
                      </el-col>
                      <el-col :span="12">
                        <el-card class="card" @click="addCard">
                            <div class="lookDetails ellipsis">+ 查看Campaign/Keyword详情</div>
                        </el-card>
                      </el-col>
                  </el-row>
                  <div id="ruleCharts"></div>
              </el-col>
          </el-row>
      </section>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import Title from '../components/title.vue'
import Pagination from '../components/pagination.vue'
import Pagination1 from '../components/pagination.vue'
import Pagination2 from '../components/pagination.vue'
import countTo from 'vue-count-to';
export default {
  components:{Title,Pagination,Pagination1,Pagination2,countTo},
  data() { 
    return {
        fonticon:'icon-warning',
        msg:'预警中心',
        rules:222,
        suspend:13,
        Campaign:666,
        Keyword:55,
        campaignWarn:55,
        keywordWarn:96,
        processedCampaign:54,
        processedKeyword:11,
        loading:false,
        loading1:false,
        loading2:false,
        warnTable:[
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6},
            {id:1,name:'Campaign/Keyword',target:'COST',condition:'>=',threshold:'8.22',day:6}
        ],
        currentPage:1,
        totalPage:10,
        currentPage1:1,
        totalPage1:8,
        currentPage2:1,
        totalPage2:20,
        content:'',
        selectedName:'',
        items:[],
        column:'',
        todos:[],
        date:'',
        dates:[],
        rulesTable:[
            {id:1,isEffective:true,rulesName:'大客户的',status:0,number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:false,rulesName:'大客户的',status:0,number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:true,rulesName:'大客户的',status:0,number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:false,rulesName:'大客户的',status:0,number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:true,rulesName:'大客户的',status:0,number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:true,rulesName:'大客户的',status:0,number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'}
        ],
        outerVisible:false,
        tableTitle:'',
        ruleName:[],
        tableForm:{
            threshold:0,
            dayNumber:1,
            status:true,
            way:['1']
        },
        // rules:{}
        ruleData:[
            {id:1,isEffective:false,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:2,isEffective:true,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:3,isEffective:false,name:'Campaign/Keyword',status:2,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:2,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:4,isEffective:true,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:2,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:5,isEffective:true,name:'Campaign/Keyword',status:2,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:6,isEffective:true,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:1,isEffective:false,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:2,isEffective:true,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:3,isEffective:false,name:'Campaign/Keyword',status:2,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:2,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:4,isEffective:true,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:2,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:5,isEffective:true,name:'Campaign/Keyword',status:2,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:3,isEffective:false,name:'Campaign/Keyword',status:2,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:2,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:4,isEffective:true,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:2,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:5,isEffective:true,name:'Campaign/Keyword',status:2,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'},
            {id:6,isEffective:true,name:'Campaign/Keyword',status:1,startTime:'2021-10-01',endTime:'2021-10-08',isTrigger:1,number:6,dateNumber:3,newDate:'2021-09-30',user:'张三'}
        ]
    }
  },
  created() {

  },
  mounted() {
      this.charts()
      this.ruleCharts()
  },
  methods:{
    editTable(row){
        console.log(row)
        this.outerVisible=!this.outerVisible
    },
    dele(index,row){
        console.log(index,row)
    },
    openRule(){
        this.outerVisible=!this.outerVisible
    },
      //每页显示数据条数
    sizeChange(val){
      console.log(val)
    },
    //当前页数
    currentChange(val){
      console.log(val)
    },
     //每页显示数据条数
    sizeChange1(val){
      console.log(val)
    },
    //当前页数
    currentChange1(val){
      console.log(val)
    },
     //每页显示数据条数
    sizeChange2(val){
      console.log(val)
    },
    //当前页数
    currentChange2(val){
      console.log(val)
    },
    addCard(){},
    look(index,row){
        console.log(index,row)
    },
    //导出xsl
    exportTable(){
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(document.querySelector('#rulesTable'), xlsxParam)
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '广告活动.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    },
    //echarts
    charts(){
        const chartDom = document.getElementById('dataCharts');
        const myChart = echarts.init(chartDom);
        const option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '12%',
                top:'5%',
                containLabel: true
            },
            color:['#409EFF'],
            tooltip: {
                trigger: 'item'
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                barWidth: 20,
                }
            ]
        };
        option && myChart.setOption(option,true);
    },
    ruleCharts(){
        const chartDom = document.getElementById('ruleCharts');
        const myChart = echarts.init(chartDom);
        const option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '12%',
                top:'5%',
                containLabel: true
            },
            color:['#409EFF'],
            tooltip: {
                trigger: 'item'
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                barWidth: 20,
                }
            ]
        };
        option && myChart.setOption(option,true);
    }
  },
 }
</script>

<style  scoped>
</style>