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
                                  <router-link :to="{path:'/campaign',query:{id:scope.row.id,name:scope.row.alertCampaign}}" class="posterName">{{scope.row.alertCampaign}}</router-link>
                              </template>
                            </el-table-column>
                            <el-table-column label="预警指标" prop="forewarnQuota"></el-table-column>
                            <el-table-column label="判断条件" prop="forewarnCondition"></el-table-column>
                            <el-table-column label="阈值" prop="threshold"></el-table-column>
                            <el-table-column label="持续天数" prop="continueDay"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="look(scope.row)">查看</el-button>
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
                        </el-row>
                        <div id="dataCharts"></div>
                      </el-col>
                  </el-row>
              </el-col>
          </el-row>
      </section>
      <section>
          <el-row :gutter="20">
              <el-col :md="16" :lg="16" :xl="19">
                  <div class="operation">
                    <el-button type="primary" size="medium" @click="openRule('tableForm')">创建新预警规则</el-button>
                    <el-input placeholder="请输入规则名称" v-model="ruleName" @keydown.enter.native="lookup">
                       <template slot="prepend"><i class="el-icon-search"></i></template>
                    </el-input>
                    <!--right-->
                    <div class="operationRight">
                        <el-select v-model="selectColumn" multiple collapse-tags class="selectColumn" placeholder="自定义列" @change="handleColumn">
                            <el-option v-for="item in todos" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                        
                        <el-button type="primary" size="medium" style="margin-left:20px" @click="exportTable">导出</el-button>
                    </div>
                </div>
                <el-table :data="rulesTable" v-loading="loading1" ref="rulesTable" id="rulesTable" max-height="560px" border :header-cell-style="{background:'#858796',color:'#fff'}">
                    <el-table-column label="规则名称" prop="ruleName" min-width="200"></el-table-column>
                    <el-table-column  v-for="(item,index) in tables" :key="index" :prop="item.prop" :label="item.label">
                        <template slot-scope="scope">{{scope.row[item.prop]}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <div class="tableBtn">
                                <el-button @click="editTable(scope.row)" type="primary" size="mini" >编辑</el-button>
                                <el-button @click="deleData(scope.$index,scope.row)" type="danger" size="mini">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination1 :currentPage="currentPage1" :total="totalPage1" @handleSizeChange="sizeChange1" @handleCurrentChange="currentChange1"/>
              </el-col>
              <el-col :md="8" :lg="8" :xl="5">
                <div class="addCondition"><i class="el-icon-plus"></i>添加筛选条件</div>
                <div class="condition">
                    <el-form :model="formtable" ref="formtable">
                        <el-form-item prop="metrics" class="conditionSelect">
                        <el-select v-model="formtable.metrics" placeholder="请选择">
                            <el-option v-for="item in conditionName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item prop="symbol" class="conditionSelect">
                        <el-select v-model="formtable.symbol"  placeholder="请选择">
                            <el-option v-for="item in symbol" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item prop="value" class="conditionSelect">
                        <el-input-number v-model="formtable.value" :min="0" :max="100" :step="0.01" controls-position="right"></el-input-number>
                        </el-form-item>
                        <el-button class="el-icon-plus addform" @click="addFormRules" ></el-button>
                    </el-form>
                    <ul class="addContent">
                        <li v-for="(item,index) in formArray" :key="index"><i class="el-icon-plus"></i>筛选条件:<span>{{item.metrics}}</span>{{item.symbol}}<span>{{item.value}}</span><el-button class="el-icon-close" @click="delformArray(index)"></el-button></li>
                    </ul>
                </div>
                <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" style="width:100%" placeholder="起始日期"></el-date-picker>
                <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" style="margin-top:20px;width:100%" placeholder="结束日期"></el-date-picker>
                <el-button size="medium" type="primary" style="margin-top:20px;width:100%" class="el-icon-search" @click="lookup">&nbsp;查找</el-button>
              </el-col>
          </el-row>
          
          <!--新增修改-->
          <el-dialog :title="tableTitle" :visible.sync="outerVisible" :close-on-click-modal="false" :before-close="clearDialog('tableForm')">

              <el-form :model="tableForm" ref="tableForm" :rules="formRules" id="tableForms" label-width="100px">
                  <el-form-item label="规则名称：" prop="ruleName">
                      <el-input v-model="tableForm.ruleName" placeholder="输入规则名称" class="userIput"></el-input>
                  </el-form-item>
                  <el-form-item label="预警指标：" prop="forewarnQuota">
                      <el-select placeholder="请选择" v-model="tableForm.forewarnQuota" clearable>
                          <el-option v-for="(item,index) in ruleNames" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="判断条件：" prop="forewarnCondition">
                      <el-select placeholder="请选择" v-model="tableForm.forewarnCondition" clearable>
                          <el-option v-for="(item,index) in conditions" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                  </el-form-item>
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
                  <el-form-item label="操作人" prop="updateUser">
                      <el-input v-model="tableForm.updateUser" placeholder="输入操作人" class="userIput"></el-input>
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
        pagesize:10,
        totalPage:0,
        currentPage1:1,
        pagesize1:10,
        totalPage1:0,
        currentPage2:1,
        pagesize2:10,
        totalPage2:0,
        items:[],
        selectColumn:[],
        todos:[
            {id:3,prop:'reachDay',label:'关联天数'},
            {id:4,prop:'triggerNumber',label:'预警触发数'},
            {id:5,prop:'monitorStartDate',label:'起始时间'},
            {id:6,prop:'monitorEndDate',label:'结束时间'},
            {id:7,prop:'forewarnDay',label:'持续天数'},
            {id:8,prop:'forewarnQuota',label:'预警指示'},
            {id:9,prop:'forewarnCondition',label:'判断条件'},
            {id:10,prop:'threshold',label:'阈值'},
            {id:11,prop:'remindWay',label:'提醒方式'},
            {id:12,prop:'createDateTime',label:'创建日期'},
            {id:13,prop:'updateUser',label:'操作人'},
            {id:14,prop:'state',label:'状态'},
        ],
        formtable:{
            value:0,
            metrics: '',
            symbol:'',
       },
       conditionName:[
        {id:'click',name:'Clicks'},
        {id:'CPC',name:'CPC '},
        {id:'CTR',name:'CTR'},
        {id:'impr',name:'Impressions'},
        {id:'orders',name:'Orders'},
        {id:'sales',name:'Sales'},
        {id:'ACOS',name:'ACoS'},
        {id:'ROAS',name:'RoAs'},
        {id:'conversions',name:'Conversions'},
        {id:'CVR',name:'CVR'}
      ],
      symbol:[
        {name:'大于',id:1},
        {name:'小于',id:2},
        {name:'等于',id:3},
        {name:'大于等于',id:4},
        {name:'小于等于',id:5}
      ],
       formArray:[],
        date:'',
        datas:[],
        outerVisible:false,
        tableTitle:'',
        ruleNames:[
            {id:'spend',name:'Spend'},
            {id:'orders',name:'Orders'},
            {id:'conversions',name:'Conversions'},
            {id:'sales',name:'Sales'},
            {id:'roas',name:'ROAS'},
            {id:'acos',name:'ACoS'},
            {id:'impressions',name:'Impressions'},
            {id:'clicks',name:'Clicks'},
            {id:'cpc',name:'CPC'},
            {id:'ctr',name:'CTR'},
            {id:'cvr',name:'CVR'},
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
            id:''
        },
        formRules:{
            ruleName:[{required:true,message:"请输入规则名称",trigger:'blur'}],

            forewarnQuota:[{required:true,message:"请选择预警指标",trigger:'change'}],

            forewarnCondition:[{required:true,message:"请选择判断条件",trigger:'change'}],

            monitorStartDate:[{required:true,message:"请选择起始日期",trigger:'blur'}],

            threshold:[{required:true,message:"请设置阈值",trigger:'blur'}],

            forewarnDay:[{required:true,message:"请设置持续天数",trigger:'blur'}]
        },
        ruleData:[],
        order:'',
        sales:'',
        cost:'',
        ruleOrder:'',
        ruleSales:'',
        ruleCost:'',
        rulesTable:[],
        tables:[],
        ruleName:'',
        condition:'',
        startDate:'',
        endDate:'',
        url:'insertAlertCenter'
    }
  },
created() {
    //预警触发表
    const res={current:this.currentPage,size:this.pagesize}
    this.getWarnTrigger(res)
    //预警规则
    const data={current:this.currentPage2,size:this.pagesize2}
    this.getwarnRules(data)

    this.getWarnTable()
    this.tables=this.todos
   
},
mounted() {
    this.charts()
    this.ruleCharts()
    const result={
         ruleName:this.content,
         condition:this.selectedName,
         current:this.currentPage1,
         size:this.pagesize1
    }
    this.getAddRules(result)
},
methods:{
    
    //每页显示数据条数
    sizeChange(val){
      this.pagesize=val
      const res={current:this.currentPage,size:this.pagesize}
      this.getWarnTrigger(res)
    },
    //当前页数
    currentChange(val){
       this.currentPage=val
       const res={current:this.currentPage,size:this.pagesize}
        this.getWarnTrigger(res)
    },
       //预警触发表
    getWarnTrigger(res){
        api.post('adAlterCenter/findAllAlertCenterTrigger',res).then(res=>{
            if(res.data.records.length>0){
                this.warnTable=res.data.records
            }else{
                this.warnTable=''
            }
            this.totalPage=res.data.total
            this.order=res.data.records[0].sumOrder
            this.sales=res.data.records[0].sumSales
            this.cost=res.data.records[0].sumCost
        }).catch(err=>{
            console.log(err)
        }).finally(()=>{

        })
    },
     look(row){
        this.order=row.sumOrder
        this.sales=row.sumSales
        this.cost=row.sumCost
    },
    restForm(formName){
        this.$refs[formName].resetFields()
    },
      //新增修改预警规则
    submitForm(formName){
        console.log(this.tableForm.id)
        if(this.tableForm.id){
            this.url='updateAlertCenter'
        }else{
            this.url='insertAlertCenter'
        }
        this.$refs[formName].validate(valid=>{
            if(valid){
                const data=this.tableForm.remindWay.join()
                this.tableForm.remindWay=data
                api.post('/adAlterCenter/'+this.url,this.tableForm).then(res=>{
                    if(res.code==200){
                        this.$message.success('成功！！！')
                        this.outerVisible=false
                        const result={
                            ruleName:this.content,
                            condition:this.selectedName,
                            current:this.currentPage1,
                            size:this.pagesize1
                        }
                        this.getAddRules(result)
                        this.$refs[formName].resetFields()
                    }else{
                        this.$message.error('失败！！！')
                    }
                }).catch(err=>{
                    console.log(err)
                }).finally(()=>{
                    
                })
            }else{
                return false
            }
        })
    },
    arrayList() {
  	  return Array.prototype.slice.call(arguments);
    },
    //新增预警规则table数据
    getAddRules(data){
        api.post('adAlterCenter/findAllAlertCondition',data).then(res=>{
            this.totalPage1=res.data.total
            if(res.data.records.length>0){
                const arr=res.data.records
                arr.map(item=>{
                    if(item.state==1){
                        item.state='启用'
                    }else{
                        item.state='禁用'
                    } 
                    //修改提醒方式的值
                    const array=[{id:1,name:'系统内'},{id:2,name:'邮箱'},{id:3,name:'企业微信'}]
                    const aa=item.remindWay.split(',')
                    let add = array.filter(item => aa.some(ele=>ele==item.id));
                    const newData=add.map(item=>{
                        return item.name
                    })
                    item.remindWay=newData.join('/')
                })
                this.$nextTick(()=>{
                    this.rulesTable=arr
                })
            }else{
                this.rulesTable=''
            }
        }).catch(err=>{
            console.log(err)
        }).finally(()=>{

        })
    },
    openRule(){
        this.outerVisible=!this.outerVisible
        this.tableForm.ruleName=''
        this.tableForm.forewarnCondition=''
        this.tableForm.monitorEndDate=''
        this.tableForm.monitorStartDate=''
        this.tableForm.threshold='0.01'
        this.tableForm.id=''
        this.tableForm.remindWay=['1']
        this.tableForm.forewarnDay=1
        this.tableForm.updateUser=''
        this.tableForm.forewarnQuota=''
    },
    addFormRules(){
      if(this.formtable.value==0 || !this.formtable.symbol || !this.formtable.metrics){
        this.$message.error('请选择规则！！！')
      }else{
        this.formArray.push({value:this.formtable.value,symbol:this.formtable.symbol,metrics:this.formtable.metrics})
        this.formArray.forEach(item=>{
          switch(item.metrics){
            case 'click':
              item.metrics='Clicks'
              break;
            case 'spend':
              item.metrics='Cost'
            break;
            case 'CPC':
              item.metrics='CPC'
            break;
            case 'CTR':
              item.metrics='CTR'
            break;
            case 'impr':
              item.metrics='Impressions'
            break;
            case 'orders':
              item.metrics='Orders'
            break;
            case 'sales':
              item.metrics='Sales'
            break;
          }
          switch(item.symbol){
            case 3:
              item.symbol='等于'
            break;
            case 1:
              item.symbol='大于'
            break;
            case 2:
              item.symbol='小于'
            break;
            case 4:
              item.symbol='大于等于'
            break;
            case 5:
              item.symbol='小于等于'
            break;
          }
        })
      }
    },
    delformArray(index){
      this.formArray.splice(index,1)
    },
    //查看新增规则
    lookup(){

    },
     //每页显示数据条数
    sizeChange1(val){
      this.pagesize1=val
      const result={
        ruleName:this.content,
        condition:this.selectedName,
        current:this.currentPage1,
        size:this.pagesize1
      }
      this.getAddRules(result)
    },
    //当前页数
    currentChange1(val){
      this.currentPage1=val
      const result={
        ruleName:this.content,
        condition:this.selectedName,
        current:this.currentPage1,
        size:this.pagesize1
      }
      this.getAddRules(result)
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
        this.$refs[formName].resetFields()
        this.outerVisible=false
        console.log(this.$refs[formName])
    },
    clearDialog(formName){
        // this.restForm(formName)
        // console.log('sasda')
    },
      //预警统计表
    getWarnTable(){
        api.get('adAlterCenter/warningStatistics').then(res=>{
            this.suspend=res.data.alertCenterStopCount
            this.warnRules=res.data.alertCenterMoveCount
            this.Campaign=res.data.sumCampaignNumber
            this.Keyword=res.data.sumKeyWordNumber
            this.campaignWarn=res.data.campaignCenterUntreated
            this.keywordWarn=res.data.KeyWordCenterUntreated
            this.processedCampaign=res.data.campaignCenterProcessed
            this.processedKeyword=res.data.KeyWordCenterProcessed
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
    getwarnRules(data){
        api.post('adAlterCenter/findAllAlertCenter',data).then(res=>{
            if(res.data.list.length>0){
                this.ruleData=res.data.list
                this.totalPage2=res.data.total
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
                this.ruleOrder=res.data.list[0].sumOrder
                this.ruleSales=res.data.list[0].sumSales
                this.ruleCost=res.data.list[0].sumCost

            }
          }).catch(err=>{
              console.log(err)
          }).finally(()=>{

        })
    },
        //每页显示数据条数
    sizeChange2(val){
      this.pagesize2=val
      const data={current:this.currentPage2,size:this.pagesize2}
      this.getwarnRules(data)
    },
    //当前页数
    currentChange2(val){
      this.currentPage2=val
      const data={current:this.currentPage2,size:this.pagesize2}
      this.getwarnRules(data)
    },
      //预警规则查看
    ruleLook(row){
        console.log(row)
        this.ruleOrder=row.sumOrder
        this.ruleSales=row.sumSales
        this.ruleCost=row.sumCost
    },
      //删除预警规则
    deleRules(index,row){
        console.log(index,row)
        this.$confirm('是否删除？',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            api.put('adAlterCenter/alertCondition',{id:row.conditionId}).then(res=>{
                if(res.code==200){
                    this.$message.success('删除成功！！！')
                    const data={current:this.currentPage2,size:this.pagesize2}
                    this.getwarnRules(data)   
                }else if(res.code==400){
                    this.$message.error('删除失败！！！')
                }
            }).catch(err=>{
                console.log(err)
            }).finally(()=>{

            })
            
        }).catch(err=>{

        })
        
    },
    editTable(row){
        console.log(row)
        this.outerVisible=!this.outerVisible
        this.tableForm.ruleName=row.ruleName
        this.tableForm.forewarnCondition=row.forewarnCondition
        this.tableForm.monitorEndDate=row.monitorEndDate
        this.tableForm.monitorStartDate=row.monitorStartDate
        this.tableForm.threshold=row.threshold
        this.tableForm.id=row.id

        const array=[{id:'1',name:'系统内'},{id:'2',name:'邮箱'},{id:'3',name:'企业微信'}]
        const aa=row.remindWay.split('/')
        let add = array.filter(item => aa.some(ele=>ele==item.name));
        const newData=add.map(item=>{
            return item.id
        })
        this.tableForm.remindWay=newData
        
        this.tableForm.forewarnDay=row.forewarnDay
        this.tableForm.updateUser=row.updateUser
        this.tableForm.forewarnQuota=row.forewarnQuota
    },
    deleData(index,row){
        console.log(index,row)
        this.$confirm('是否删除？',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            api.put('adAlterCenter/deleteAlertCenter',{id:row.id}).then(res=>{
                if(res.code==200){
                    this.$message.success('删除成功！！！')
                    //预警规则
                    const result={
                        ruleName:this.content,
                        condition:this.selectedName,
                        current:this.currentPage1,
                        size:this.pagesize1
                    }
                    this.getAddRules(result)
                }else if(res.code==400){
                    this.$message.error('删除失败！！！')
                }
            }).catch(err=>{
                console.log(err)
            }).finally(()=>{

            })
            
        }).catch(err=>{

        })
    },
    //导出xsl
    exportTable(){
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(document.querySelector('#rulesTable'), xlsxParam)
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '预警规则.xlsx')
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