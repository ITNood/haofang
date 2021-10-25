<template>
  <div>
      <Title :icon="fonticon" :text="msg"/>
      <section>
          <el-row :gutter="20">
              <el-col :md="24" :lg="6" :xl="5">
                  <div class="publicTitle">预警统计表</div>
                  <ul class="warnTable">
                      <li>有效预警规则<span>{{warnRules}}</span></li>
                      <li>暂停中预警规则<span>{{suspend}}</span></li>
                      <li>监控中Campaign数量<span>{{Campaign}}</span></li>
                      <li>监控中Keyword数量<span>{{Keyword}}</span></li>
                      <li>Campaign预警触发未处理数量<span>{{campaignWarn}}</span></li>
                      <li>Keyword预警触发未处理数量<span>{{keywordWarn}}</span></li>
                      <li>已处理Campaign预警触发数量<span>{{processedCampaign}}</span></li>
                      <li>已处理Keyword预警触发数量<span>{{processedKeyword}}</span></li>
                  </ul>
              </el-col>
              <el-col :md="24" :lg="18" :xl="19">
                  <div class="publicTitle">预警触发表</div>
                  <el-row :gutter="20">
                      <el-col :span="12">
                        <el-table :data="warnTable" v-loading="loading" border max-height="500" :header-cell-style="{background:'#858796',color:'#fff'}">
                            <el-table-column label="Campaign/Keyword" prop="alertCampaign" width="200">
                              <template slot-scope="scope">
                                  <router-link :to="{path:'/campaign',query:{id:scope.row.id}}" class="posterName">{{scope.row.alertCampaign}}</router-link>
                              </template>
                            </el-table-column>
                            <el-table-column label="预警指标" prop="forewarnQuota"></el-table-column>
                            <el-table-column label="判断条件" prop="forewarnCondition"></el-table-column>
                            <el-table-column label="阈值" prop="threshold"></el-table-column>
                            <el-table-column label="持续天数" prop="continueDay"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="look(scope.$index,scope.row)">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination :currentPage="currentPage" :total="totalPage" @handleSizeChange="sizeChange" @handleCurrentChange="currentChange" />
                      </el-col>
                      <el-col :span="12">
                          <el-row :gutter="20">
                            <el-col :span="12">
                                <el-card class="card">
                                    <div slot="header" class="clearfix">
                                    <span>订单量 | Order</span>
                                    </div>
                                    <div class="num relative">
                                        <!-- <countTo :startVal='0' :endVal="1561" :duration='2000' style="font-size:2.5rem;" ></countTo> -->
                                        {{order}}
                                        <div class="absolute percentage">
                                            <p>{{1512}}</p>
                                            <p style="color:#008a00">154%</p>
                                            <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                        </div>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="12">
                                <el-card class="card">
                                    <div slot="header" class="clearfix">
                                    <span>销售额 | Sales</span>
                                    </div>
                                    <div class="num relative">
                                        {{sales}}
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
                                    <span>总花费 | Cost</span>
                                    </div>
                                    <div class="num relative">
                                        {{cost}}
                                        <div class="absolute percentage">
                                            <p>1512</p>
                                            <p style="color:#008a00">154%</p>
                                            <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                        </div>
                                    </div>
                                </el-card>
                            </el-col>
                            <!-- <el-col :span="12">
                                <el-card class="card" @click="addCard">
                                    <div class="lookDetails ellipsis">+ 查看Campaign/Keyword详情</div>
                                </el-card>
                            </el-col> -->
                        </el-row>
                        <div id="dataCharts"></div>
                      </el-col>
                  </el-row>
              </el-col>
          </el-row>
      </section>
      <section>
          <div class="operation">
              <el-button type="primary" size="medium" @click="openRule">创建新预警规则</el-button>
              <el-input placeholder="请输入内容" v-model="content" @keyup.enter.native="findSearch">
                <template slot="prepend"><i class="el-icon-search"></i></template>
              </el-input>
              <el-select placeholder="筛选条件" v-model="selectedName">
                  <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <!--right-->
              <div class="operationRight">
                  <!-- <el-select placeholder="列/自定义" multiple v-model="column" collapse-tags>
                      <el-option v-for="(item,index) in todos" :key="index" :label="item.label" :value="item.id"></el-option>
                  </el-select> -->
                  <el-select v-model="selectColumn" multiple collapse-tags class="selectColumn" placeholder="请选择" @change="handleColumn">
                      <el-option v-for="item in todos" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                  <el-select placeholder="日期范围" v-model="date">
                      <el-option v-for="(item,index) in dates" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <el-button type="primary" size="medium" style="margin-left:20px" @click="exportTable">导出</el-button>
              </div>
          </div>
          <el-table :data="rulesTable" v-loading="loading1" ref="rulesTable" id="rulesTable" border :header-cell-style="{background:'#858796',color:'#fff'}">
              <el-table-column label="规则名称" prop="rulesName" min-width="200"></el-table-column>
              <template v-for="(item,index) in tables">
                <el-table-column  :key="index" :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">{{scope.row[item.prop]}}</template>
                </el-table-column>
              </template>
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
          <el-dialog :title="tableTitle" :visible.sync="outerVisible" :close-on-click-modal="false" @close="clearDialog('tableForm')">

              <el-form :model="tableForm" ref="tableForm" :rules="rules" id="tableForms" label-width="100px">
                  <el-form-item label="规则名称：" prop="ruleName">
                      <!-- <el-select placeholder="请选择" v-model="tableForm.ruleName">
                          <el-option v-for="item in ruleNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select> -->
                      <el-input v-model="tableForm.ruleName" placeholder="输入规则名称" class="userIput"></el-input>
                  </el-form-item>
                  <el-form-item label="预警指标：" prop="forewarnQuota">
                      <el-select placeholder="请选择" v-model="tableForm.forewarnQuota">
                          <el-option v-for="item in ruleNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="判断条件：" prop="forewarnCondition">
                      <el-select placeholder="请选择" v-model="tableForm.forewarnCondition">
                          <el-option v-for="item in conditions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="提醒间隔：" >
                      <el-time-picker v-model="tableForm.remindInterval" value-format="HH:mm:ss" arrow-control  placeholder="任意时间点"></el-time-picker>
                  </el-form-item> -->
                  <el-form-item label="阈值：" prop="threshold">
                      <el-input-number v-model="tableForm.threshold" :min="0"  :step="0.01"></el-input-number>
                  </el-form-item>
                  <el-form-item label="持续天数：" prop="forewarnDay">
                      <el-input-number v-model="tableForm.forewarnDay" :min="0"  :step="1"></el-input-number>
                  </el-form-item>
                  <el-form-item label="起始时间：" prop="monitorStartDate">
                      <el-date-picker v-model="tableForm.monitorStartDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"> </el-date-picker>
                  </el-form-item>
                  <el-form-item label="结束时间：" prop="monitorEndDate">
                      <el-date-picker v-model="tableForm.monitorEndDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"> </el-date-picker>
                  </el-form-item>
                  <el-form-item label="创建人：" prop="updateUser">
                      <el-input v-model="tableForm.updateUser" placeholder="输入创建人" class="userIput"></el-input>
                  </el-form-item>
                  <el-form-item label="提醒方式：" prop="remindWay">
                      <el-checkbox-group v-model="tableForm.remindWay">
                          <el-checkbox label="1">系统内</el-checkbox>
                          <el-checkbox label="2">邮箱</el-checkbox>
                          <el-checkbox label="3">企业微信</el-checkbox>
                      </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="状态：" prop="state">
                      <el-switch v-model="tableForm.state" active-text="启用" active-value="1" inactive-value="0" inactive-text="暂停"></el-switch>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('tableForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('tableForm')">确定</el-button>
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
                      <el-table-column label="Campaign/Keyword" prop="alertCampaign" width="200">
                          <template slot-scope="scope">
                              <router-link :to="{path:'/campaign',query:{id:scope.row.conditionId}}" class="posterName">{{scope.row.alertCampaign}}</router-link>
                          </template>
                      </el-table-column>
                      <el-table-column label="状态" prop="state">
                          <template slot-scope="scope">
                              <p v-if="scope.row.state===1" style="color:#008a00">启用</p>
                              <p v-else style="color:#e74a3b">禁用</p>
                          </template>
                      </el-table-column>
                      <el-table-column label="起始时间" prop="alertMonitorStartDate"></el-table-column>
                      <el-table-column label="结束时间" prop="alertMonitorEndDate"></el-table-column>
                      <!-- <el-table-column label="是否触发" prop="isTrigger">
                          <template slot-scope="scope">
                               <p v-if="scope.row.isTrigger===1" style="color:#008a00">是</p>
                              <p v-else>否</p>
                          </template>
                      </el-table-column> -->
                      <el-table-column label="历史触发数" prop="triggerNumber"></el-table-column>
                      <el-table-column label="已达标天数" prop="reachDay"></el-table-column>
                      <el-table-column label="创建日期" prop="createDateTime"></el-table-column>
                      <el-table-column label="创建人" prop="alertCreateUser"></el-table-column>
                      <el-table-column label="操作">
                          <template slot-scope="scope">
                              <div class="tableBtn">
                                <el-button @click="deleRules(scope.$index,scope.row)" type="danger" size="mini">删除</el-button>
                                <el-button @click="ruleLook(scope.row)" type="primary" size="mini">查看</el-button>
                              </div>
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
                                {{ruleOrder}}
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
                            <span>销售额 | Sales</span>
                            </div>
                            <div class="num relative">
                                {{ruleSales}}
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
                            <span>总花费 | Cost</span>
                            </div>
                            <div class="num relative">
                                {{ruleCost}}
                                <div class="absolute percentage">
                                    <p>1512</p>
                                    <p style="color:#008a00">154%</p>
                                    <!-- <p v-else style="color:#e74a3b">{{item.percent}}%</p> -->
                                </div>
                            </div>
                         </el-card>
                      </el-col>
                      <!-- <el-col :span="12">
                        <el-card class="card" @click="addCard">
                            <div class="lookDetails ellipsis">+ 查看Campaign/Keyword详情</div>
                        </el-card>
                      </el-col> -->
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
import api from '../API/index'
export default {
  components:{Title,Pagination,Pagination1,Pagination2,countTo},
  data() { 
    return {
        fonticon:'icon-warning',
        msg:'预警中心',
        warnRules:'',
        suspend:'',
        Campaign:'',
        Keyword:'',
        campaignWarn:'',
        keywordWarn:'',
        processedCampaign:'',
        processedKeyword:'',
        loading:false,
        loading1:false,
        loading2:false,
        warnTable:[],
        currentPage:1,
        totalPage:10,
        currentPage1:1,
        totalPage1:8,
        currentPage2:1,
        totalPage2:20,
        content:'',
        selectedName:'',
        items:[],
        selectColumn:[],
        todos:[
            {id:1,prop:'isEffective',label:'是否有效'},
            // {id:2,prop:'rulesName',label:'规则名称'},
            {id:3,prop:'number',label:'关联天数'},
            {id:4,prop:'warnNumber',label:'预警触发数'},
            {id:5,prop:'startDate',label:'起始时间'},
            {id:6,prop:'endDate',label:'结束时间'},
            {id:7,prop:'dayNumber',label:'持续天数'},
            {id:8,prop:'warnName',label:'预警指示'},
            {id:9,prop:'conditions',label:'判断条件'},
            {id:10,prop:'threshold',label:'阈值'},
            {id:11,prop:'way',label:'提醒方式'},
            {id:12,prop:'date',label:'创建日期'},
            {id:13,prop:'user',label:'创建人'},
            {id:14,prop:'status',label:'状态'},
        ],
        date:'',
        dates:[],
        datas:[
            {id:1,isEffective:'有效',rulesName:'大客户的',status:'启用',number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:'无效',rulesName:'大客户的',status:'禁用',number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:'有效',rulesName:'大客户的',status:'启用',number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:'无效',rulesName:'大客户的',status:'禁用',number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:'有效',rulesName:'大客户的',status:'启用',number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'},
            {id:1,isEffective:'有效',rulesName:'大客户的',status:'启用',number:6,warnNumber:3,startDate:'2021-09-21',endDate:'2021-09-28',dayNumber:7,warnName:'点击量 | click',conditions:3,threshold:'4543.3',way:'系统内/邮件/企业微信',time:'2h',date:'2021-09-21',user:'张三'}
        ],
        outerVisible:false,
        tableTitle:'',
        ruleNames:[
            {id:'clicks',name:'点击量'},
            {id:'cost',name:'花费'},
            {id:'sales',name:'销售额'}
        ],
        conditions:[
            {id:'<',name:'小于'},
            {id:'>',name:'大于'},
            {id:'=',name:'等于'},
            {id:'>=',name:'大于等于'},
            {id:'<=',name:'小于等于'},
        ],
        tableForm:{
            ruleName:'',
            threshold:'0.01',
            forewarnDay:1,
            state:'1',
            remindWay:['1'],
            forewarnQuota:'',
            forewarnCondition:'',
            monitorStartDate:'',
            monitorEndDate:'',
            updateUser:'',
            remindInterval:'',
            userId:'',
        },
        rules:{
            forewarnQuota:[{required:true,message:'请选择预警指标',trigger: 'change'}],
            forewarnCondition:[{required:true,message:'请选择判断条件',trigger: 'change'}]
        },
        ruleData:[],
        order:'',
        sales:'',
        cost:'',
        ruleOrder:'',
        ruleSales:'',
        ruleCost:'',
        rulesTable:[],
        tables:[]
    }
  },
  created() {
      this.getWarnTable()
      this.tables=this.todos
      console.log(this.tables)
  },
  mounted() {
      this.charts()
      this.ruleCharts()
      this.getwarnRules()
      this.getWarnTrigger()
      this.rulesTable=this.datas
  },
  methods:{
      restForm(formName){
        console.log(this.$refs[formName])
        this.$refs[formName].resetFields()
      },
      //新增修改预警规则
      submitForm(formName){
          const data=this.tableForm.remindWay.join()
          this.tableForm.remindWay=data
          api.post('/adAlterCenter/insertAlertCenter',this.tableForm).then(res=>{
              this.$message.success('新增成功！！！')
              this.outerVisible=false
              this.restForm(formName)
          }).catch(err=>{
              console.log(err)
          }).finally(()=>{
              
          })
      },
      //自定义列
      handleColumn(val){
        const data=[]
        this.todos.forEach((item,index)=>{
            if(this.selectColumn.includes(item.id)){
               data.push(item)
            }
        })
        this.$nextTick(()=>{
            this.tables=data
        })
      },
      cancel(formName){
          this.outerVisible=false
          this.restForm(formName)
      },
      clearDialog(formName){
          this.restForm(formName)
      },
      //预警统计表
      getWarnTable(){
          api.get('adAlterCenter/warningStatistics').then(res=>{
              this.suspend=res.data.alertCenterStopCount
              this.warnRules=res.data.alertCenterMoveCount
              this.Campaign=res.data.sumCampaignNumber
              this.Keyword=res.data.sumKeyWordNumber
          }).catch(err=>{
              console.log(err)
          }).finally(()=>{

          })
      },
      
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      //预警规则
      getwarnRules(){
          api.get('adAlterCenter/findAllAlertCenter').then(res=>{
            if(res.data.length>0){
                this.ruleData=res.data
                const now=this.getNowFormatDate()
                this.ruleData.map((item,index)=>{
                    const start=item.alertMonitorStartDate,
                        end=item.alertMonitorEndDate;
                        if(now>start && now<end){
                            item.isEffective=true
                        }else{
                            item.isEffective=false
                        }
                })
                //默认取第一条数据渲染右侧
                this.ruleOrder=res.data[0].sumOrder
                this.ruleSales=res.data[0].sumSales
                this.ruleCost=res.data[0].sumCost

            }
          }).catch(err=>{
              console.log(err)
          }).finally(()=>{

          })
      },
      //预警规则查看
      ruleLook(row){
        this.ruleOrder=row.sumOrder
        this.ruleSales=row.sumSales
        this.ruleCost=row.sumCost
      },
      //删除预警规则
      deleRules(index,row){
          console.log(row)
          api.post('',{id:row.id}).then(res=>{
              
          }).catch(err=>{
              console.log(err)
          }).finally(()=>{

          })
          this.ruleData.splice(index,1)
      },
      //预警触发表
      getWarnTrigger(){
          api.get('adAlterCenter/findAllAlertCenterTrigger').then(res=>{
              console.log(res)
              if(res.data.length>0){
                this.warnTable=res.data
                //初始化默认第一条数据渲染右侧
                // this.order=res.data[0].
              }
             
          }).catch(err=>{
              console.log(err)
          }).finally(()=>{

          })
      },
      //回车键
      findSearch(){
            console.log('sdd')
      },
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
    look(row){
        console.log(row)
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