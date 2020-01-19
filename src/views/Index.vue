<template>
    <div class="layout">
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <div class="headerimg">
                <img src="../assets/logo.png" alt="">
            </div>
            <Menu active-name="homeProgress" theme="dark" width="auto" :open-names="['1']" @on-select="changemenu">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        技术部
                    </template>
                    <MenuItem  v-for="(i,k) in menuArr" :key="k" :name="i.name">{{i.text}}</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-keypad"></Icon>
                        人事部
                    </template>
                    <!-- <MenuItem name="establish">人员新增</MenuItem> -->
                    <!-- <MenuItem name="timeProgress">时间进度</MenuItem> -->
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="md-person" />
                        客服部
                    </template>
                    <!-- <MenuItem name="cycleProgress">周期进度</MenuItem>
                    <MenuItem name="timeProgress">时间进度</MenuItem> -->
                </Submenu>
                <Submenu name="4">
                    <template slot="title">
                        <Icon type="md-mic" />
                        讲师部
                    </template>
                    <!-- <MenuItem name="cycleProgress">周期进度</MenuItem>
                    <MenuItem name="timeProgress">时间进度</MenuItem> -->
                </Submenu>
                <Submenu name="5">
                    <template slot="title">
                        <Icon type="md-bicycle" />
                        线下租赁部门
                    </template>
                    <!-- <MenuItem name="cycleProgress">周期进度</MenuItem>
                    <MenuItem name="timeProgress">时间进度</MenuItem> -->
                </Submenu>
            </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
            <Header class="container" :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
                <div class="item item-1">
                    <p><Icon class="theme" type="md-bicycle" />来骑哦欢迎您</p>
                </div>
                <div class="item item-2"></div>
                <div class="item item-3">
                    <p>UserName:{{username}}<span @click="loginout">退出</span></p>
                </div>
            </Header>
            <Content :style="{padding: '0 16px 16px'}">
                <Breadcrumb :style="{margin: '16px 0'}" @click.native="handlechange">
                    <BreadcrumbItem to="/" index='1'>Home</BreadcrumbItem>
                    <BreadcrumbItem to="/allProject" index='2'>{{navigationHeader2}}</BreadcrumbItem>
                    <BreadcrumbItem>{{navigationHeader}}</BreadcrumbItem>
                </Breadcrumb>
                <Card class="contents">
                    <!-- <keep-alive>
                    <router-view class="content-view"></router-view>
                    </keep-alive> -->
                    <router-view class="content-view"></router-view>
                </Card>
            </Content>
        </Layout>
    </div>
</template>
<script>
import { defer } from 'q';
export default {
    data(){
        return{
            navigationHeader2:'Components',
            navigationHeader:'',
            username:'',
            permissions:[],         //登录用户权限说明
            menuArr:[
                {name:'homeProgress',text:'项目首页',},
                {name:'allProject',text:'全部项目',},
                {name:'nowProject',text:'当前任务',},
                {name:'createProject',text:'创建项目',},
                {name:'createTast',text:'创建任务',},
                {name:'distributionTast',text:'我的任务',},
                {name:'cycleProgress',text:'周期进度',},
                {name:'timeProgress',text:'时间进度',},//个人日报统计图表
                {name:'todayPlan',text:'今日计划',},
                {name:'entryDaily',text:'日报录入',},
            ],
            selectMenu:'',
        }
    },
    mounted(){
        this.username = localStorage.getItem('username');
        this.permissions = JSON.parse(localStorage.getItem('permissions'));
    },
    methods:{
        /**左侧菜单栏点击事件 */
        changemenu(e){
            var that = this;
            for(let i=0;i<this.menuArr.length;i++){
                if(that.menuArr[i].name == e){
                    for(let j=0;j<that.permissions.length;j++){
                        if(that.permissions[j] == that.menuArr[i].text){
                            console.log(that.menuArr[i].text,that.permissions[j])
                            that.$router.push({path:e})
                            that.navigationHeader = e
                            this.$Message.success('权限验证通过')
                            return;
                        }
                    }
                }
            }
            // if(e){
            //     that.$router.push({path:e})
            //     this.navigationHeader = e
            // }
        },
        /**面包屑点击事件 */
        handlechange(e){
            console.log(e)
            if(e.target.textContent == 'Home'){
                this.navigationHeader = '';
            }
            // else{
            //     this.navigationHeader = 'allProject';
            // }
        },
        /**登出事件 */
        loginout(){
            localStorage.clear('userInfo');
            this.$router.push('/login')
        },
    }
}
</script>
<style lang="less">
.layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    .ivu-layout-sider{
        .ivu-layout-sider-children{
            .headerimg{
                height: 60px;
                text-align: center;
                img{
                    width: 40%;
                    height: 80%;
                    margin-top: 10%;
                }
            }
        }
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        }
    .ivu-card-body{
        padding: 0;
    }
    .container{
        display: grid;
        grid-template-columns: 200px auto 300px;        //横列设置
        grid-template-rows: 62px auto;           //纵列设置
        .item{
            color:black;
        }
        .item-1{
                background: #fff;
                p{
                .theme{
                    width: 30%;
                    font-size: 50px;
                    color: green;
                    }
                }
                
            }
            .item-2{
                background:#fff;
            }
            .item-3{
                background: #fff;
                span{
                    width: 90px;
                    text-align: right;
                    display: inline-block;
                }
            }
    }
    .contents{
        height: 80%;
        .content-view{
            // height: 100%;
            height: 700px;
        }
    }
    }
    
</style>

