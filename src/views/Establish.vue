<template>
<div class="main2">
    <div class="login2">
    <div class="header2">
        <p>来骑哦后台管理系统</p>
    </div>
    <div class="contents2">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="username">
                <Input type="text" v-model="formInline.username" placeholder="请输入名称">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="user">
                <Input type="text" maxlength="11" v-model="formInline.user" placeholder="请输入手机号码">
                    <Icon type="ios-call-outline" slot="prepend" />
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" v-model="formInline.password" placeholder="请输入密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="role">
                <Dropdown trigger="click" style="margin-left: 20px" @on-click='selectrole'>
                    <Icon class="admin2" type="md-contact" />
                    <Button class="choicerole2">{{selectName}}
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list" v-for="(i,k) in roleList" :key="k">
                        <DropdownItem :name="i.departmentName">{{i.departmentName}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown trigger="click" style="margin-left: -20px" @on-click='selectroles'>
                    <Button class="">{{selectRole}}
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list" v-for="(o,j) in listRole" :key="j">
                        <DropdownItem :name="o.roleNmae">{{o.roleNmae}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
            <FormItem>
                <Button class="regist2" type="primary" @click="handleRegist('formInline')">注册</Button>
            </FormItem>
        </Form>
    </div>
</div>
</div>
</template>
<script>
import axios from 'axios';
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: '',
                    value:'',
                    username:'',
                },
                ruleInline: {
                    username: [
                        { required: true, message: '请输入员工名称', trigger: 'blur' }
                    ],
                    user: [
                        { required: true, message: '请输入正确的手机号码', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入正确的密码.', trigger: 'blur' },
                        { type: 'string', min: 6, message: '请输入正确的密码', trigger: 'blur' }
                    ],
                },
                msg:'sdsds',
                flag:true,          //为false时获取验证码不可点击 
                selectName:'选择部门',
                departmentId:'',    //部门id
                roleList:[],    //部门合集
                selectRole:'角色',  //选择部门中的角色身份
                listRole:[],    //角色合集
                roleId:'',      //角色id
            }
        },
        mounted(){
            this.getrole();
        },
        methods: {
            handleSubmit() {
                localStorage.setItem('count',1)
                this.$router.push('/login')
            },
            handleRegist(name){
                var that = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var phone = this.formInline.user,
                            password = this.formInline.password,
                            username = this.formInline.username,
                            departmentId = this.departmentId;
                        if(/^1[3456789]\d{9}$/.test(phone)){
                            console.log('手机号正确')
                        }
                        else{
                            this.$Message.error('手机格式不正确!');
                            return;
                        }
                        this.$Message.success('Success!');//信息不为空
                        for(let i=0;i<that.listRole.length;i++){        //遍历获取选择的角色id
                            if(that.listRole[i].roleNmae == that.selectRole){
                                that.roleId = that.listRole[i].id;
                            }
                        }
                            that.$http.post(that.$store.state.url + '/user/register',{username:username,password:password,phone:phone,roleId:that.roleId,departmentId:departmentId}).then(function(res){
                                console.log(res)
                                if(res.data.code == '10000'){
                                    console.log(11)
                                    that.$router.push('/login')
                                }else if(res.data.code == '10001'){
                                    if(decodeURIComponent(window.atob(localStorage.getItem('userInfo')))){
                                        this.$Message.error('登录超时或其他人登录此账号!');
                                        that.$router.push('/login')
                                    }else{this.$Message.error('未获取到验证密钥!');}
                                }
                            }).catch(function(err){
                                console.log('错误'+err)
                                this.$Message.error('所填写信息不正确!');
                            })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            selectrole(name){
                console.log(name)
                var that = this;
                if(name){
                    this.selectName = name;
                    for(let i=0;i<that.roleList.length;i++){
                        if(that.roleList[i].departmentName == name){
                            that.departmentId = that.roleList[i].id;
                            that.$http.get(that.$store.state.url + '/role/findByRoleId',{params:{departmentId:that.roleList[i].id}}).then((res) =>{
                                console.log(res)
                                if(res.data.code == '10000'){
                                    that.listRole = res.data.object;
                                }
                                }).catch((err)=>{
                                    console.log(err)
                                })
                        }
                    }
                    return;
                    
                }
            },
            selectroles(name){
                console.log(name)
                if(name){
                    this.selectRole = name;
                }
            },
            getrole(){
                var that = this;
                if(decodeURIComponent(window.atob(localStorage.getItem('userInfo')))){
                    this.$http.get(this.$store.state.url + '/department/findAll',{params:{}}).then((res) =>{
                    console.log(res)
                    if(res.data.code == '10000'){
                        this.roleList = res.data.object;
                    }else if(res.data.code == '10001'){
                            this.$Message.error('token传递失败!');
                        }
                }).catch((err) =>{
                    console.log(err)
                })
                }else{this.$Message.error('未获取到验证密钥!');}
            }
        }
    }
</script>
<style lang="less">
    .main2{
        img{
            width: 100%;
            height: 100%;
            position: relative;
        }
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #999;
        background-image: url('../assets/bg-2.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .login2{
        position: relative;
        width: 20%;
        height: 40%;
        top: 30%;
        left: 30%;
        border-radius: 2%;
        .header2{
            width: 100%;
            height: 40px;
            p{
                font-size: 24px;
                text-align: center;
                color: antiquewhite;
            }
        }
        .contents2{
            width: 70%;
            margin: 0 auto;
            .inputcode{
                margin-left: 3px;
                border: none;
            }
            .regist2{
                margin-left: 5%;
            }
            .admin2{
                width: 29px;
                height: 32px;
                background: #f8f8f9;
                border: 1px solid #dcdee2;
                border-radius: 4px;
                padding: 8px 9px;
                margin-left: -15%;
                border-right: none;
                border-top-right-radius:0%;
                border-bottom-right-radius:0%;
            }
            .choicerole2{
                width: 80%;
                border-top-left-radius:0%;
                border-bottom-left-radius:0%;
            }
        }
    }
    }
</style>
