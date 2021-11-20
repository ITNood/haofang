<template>
  <div class="app_wapper">
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside class="slider_container">
        <el-menu
          class="sub_meuns_wapper"
          mode="vertical"
          unique-opened
          :default-active="$route.path"
          text-color="#fff"
          active-text-color="white"
        >
          <!-- 菜单组件 -->
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              height: 70px;
              cursor: pointer;
              font-weight: 800;
            "
            @click="onReload"
          >
            <!-- logo -->
            <img src="../assets/logo.png" style="width: 50px" />广告智能投放
          </div>
          <!--路由组件-->
          <side-Meuns :routes="getRoutes"></side-Meuns>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <!--顶部-->
      <el-header height="70px" style="text-align: right">
        <el-input
          placeholder="请输入内容"
          v-model="search"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <!--提醒中心-->
        <el-popover
          placement="bottom"
          trigger="click"
          class="zindex"
          popper-class="popverClass"
        >
          <div class="openNews">
            <h5>提醒中心</h5>
            <div class="newlist">
              <router-link
                :to="{ path: '/main', query: { id: item.id } }"
                v-for="item in items"
                :key="item.id"
              >
                <img :src="item.img" />
                <p class="date">{{ item.date }}</p>
                <p>{{ item.text }}</p>
              </router-link>
            </div>
            <div class="more" @click="loadingMore">显示更多提醒</div>
          </div>
          <el-button slot="reference" class="el-icon-message-solid popovericon"
            ><el-badge :value="total" class="bageItem"></el-badge
          ></el-button>
        </el-popover>
        <!--消息中心-->
        <el-popover
          placement="bottom"
          trigger="click"
          class="zindex"
          popper-class="popverClass"
        >
          <div class="openNews">
            <h5 style="background: #409eff">消息中心</h5>
            <div class="newlist">
              <router-link
                :to="{ path: '/main', query: { id: item.id } }"
                v-for="item in items"
                :key="item.id"
              >
                <img :src="item.img" />
                <p class="date">{{ item.date }}</p>
                <p>{{ item.text }}</p>
              </router-link>
            </div>
            <div class="more" @click="loadingMore">阅读更多消息</div>
          </div>
          <el-button
            slot="reference"
            class="icon iconfont icon-news popovericon"
            ><el-badge :value="total2" class="bageItem"></el-badge
          ></el-button>
        </el-popover>
        <!--预警中心-->
        <el-popover
          placement="bottom"
          trigger="click"
          class="zindex"
          popper-class="popverClass"
        >
          <div class="openNews">
            <h5 style="background: #f6c23e">预警中心</h5>
            <div class="newlist">
              <router-link
                :to="{ path: '/main', query: { id: item.id } }"
                v-for="item in items"
                :key="item.id"
              >
                <i class="icon iconfont icon-warning iswarn"></i>
                <p class="date">{{ item.date }}</p>
                <p>{{ item.text }}</p>
              </router-link>
            </div>
            <div class="more" @click="loadingMore">更多预警</div>
          </div>
          <el-button
            slot="reference"
            class="icon iconfont icon-warning popovericon"
            ><el-badge :value="total3" class="bageItem"></el-badge
          ></el-button>
        </el-popover>
        <el-dropdown>
          <span
            class="el-dropdown-link"
            style="color: #858796; font-weight: 600"
          >
            浩方<img src="../assets/HoFan_Logo.jpg" style="width: 38px" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              ><i class="el-icon-user-solid"></i>个人中心</el-dropdown-item
            >
            <el-dropdown-item
              ><i class="el-icon-s-tools"></i>设置</el-dropdown-item
            >
            <el-dropdown-item style="border-bottom: 1px solid #e3e6f0"
              ><i class="el-icon-s-operation"></i>活动日志</el-dropdown-item
            >
            <el-dropdown-item @click.native="outSystem"
              ><i class="el-icon-s-unfold"></i>登出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container class="app_content">
        <!-- 内容区域 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
// 左侧菜单组件
import sideMeuns from "@/components/sideMeuns";
// import { permissionRouter } from '@/router'
export default {
  computed: {
    getRoutes() {
      return global.antRouter;
    },
  },
  components: {
    sideMeuns,
  },
  data() {
    return {
      userRole: "Topest",
      total: 3,
      total2: 3,
      total3: 3,
      search: "",
      // show: false,
      // show1: false,
      // show2: false,
      // collapse: false,
      items: [
        {
          id: 1,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
        {
          id: 2,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
        {
          id: 3,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
      ],
      news: [
        {
          id: 1,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
        {
          id: 2,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
        {
          id: 3,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
      ],
      warn: [
        {
          id: 1,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
        {
          id: 2,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
        {
          id: 3,
          img: require("../assets/HoFan_Logo.jpg"),
          date: "2021-08-10",
          text: "这是一个新的消息",
        },
      ],
    };
  },
  created() {
    this.WebSocketTest();
  },
  methods: {
    //websocket
    WebSocketTest() {
      let that = this;
      //   let id = that.$route.query.id;
      //   let type = that.$route.query.type;
      if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");
        // 打开一个 web socket
        var ws = new WebSocket("ws://10.17.10.222:8080/alertCenterWebSocket"); //66.42.54.253  192.168.0.105
        ws.onopen = function () {
          //   var json = JSON.stringify({
          //     token: window.localStorage.getItem("token"),
          //     id: id,
          //     type: 1,
          //     type_id: type
          //   });
          //   console.log(11)
          // Web Socket 已连接上，使用 send() 方法发送数据
          ws.send("1111");
          //   var t1 = window.setInterval(function() {
          //     ws.send(JSON.stringify({ type: 2 }));
          //   }, 30000);
          console.log("数据发送中...");
        };
        //接收数据
        ws.onmessage = function (evt) {
          console.logevt;
          //   const data = JSON.parse(evt.data);
          //   console.log(data);
          //   that.items = that.items.concat(data.res);
        };
        ws.onclose = function () {
          // 关闭 websocket
          console.log("连接已关闭...");
        };
      } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
      }
    },
    // isCollapse(){
    //   this.collapse=!this.collapse
    // },
    // hide(){
    //   console.log(2222)
    //   this.show=false
    //   this.show1=false
    //   this.show2=false
    // },
    // remind(){
    //   this.show=!this.show
    //   this.show1=false
    //   this.show2=false
    // },
    // newsCenter(){
    //   this.show1=!this.show1
    //   this.show=false
    //   this.show2=false
    // },
    // warning(){
    //   this.show2=!this.show2
    //   this.show=false
    //   this.show1=false
    // },
    loadingMore() {},
    outSystem() {
      //退出系统
      this.$confirm("是否退出登录？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.setItem("userRole", "unload");
          this.$router.push("/");
        })
        .catch(() => {
          console.log("没有退出登录状态！！！");
        });

      // window.location.href = window.location.origin + window.location.pathname
    },

    onReload() {
      this.$router.push("/main").catch((err) => err);
    },
  },
  mounted() {
    // console.log("菜单的展开跟路由有关系，查看elementui--el-menu  的default-active 属性")
    // console.log(this.$route.path)
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss"  scoped>
.input-with-select .el-button {
  background: rgb(3, 59, 102);
  color: white;
}
.input-with-select {
  >>> .el-input-group__append,
  >>> .el-input-group__prepend {
    border-color: rgb(3, 59, 102) !important;
  }
}
.input-with-select {
  >>> .el-button i {
    color: white !important;
    font-size: 16px;
  }
}
.el-dropdown {
  padding-left: 20px;
  border-left: 1px solid #e3e6f0;
  margin-left: 10px;
  margin-top: 5px;
  cursor: pointer;
}
.el-dropdown span {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white !important;
}
.el-header::after {
  clear: both;
  display: block;
  overflow: visible;
  content: "";
}
/*wapper*/
.app_wapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.app_content {
  margin-left: 230px;
  margin-top: 30px;
  /* border: 1px solid #eee; */
  box-sizing: border-box;
}

.el-header {
  background-color: #005a95;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  -webkit-box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  color: #333;
  line-height: 60px;
}

.item {
  color: white;
  margin: 0 15px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  i {
    font-size: 1.5rem;
  }
}
.item p {
  margin: 0;
  font-size: 14px;
}

.app_wapper .el-aside,
.slider_container .el-menu {
  color: #333;
  transition: width 0.28s;
  width: 230px !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  background: #012a4a;
  overflow-y: auto;
}
</style>
