<template>
<div class="main1">
    <div class="login1">
    <div class="header1">
        <p>来骑哦后台管理系统</p>
    </div>
    <div class="contents1">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="username">
                <Input type="text" maxlength="11" v-model="formInline.username" placeholder="请输入名称">
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
                <Dropdown trigger="click" style="margin-left: 20px" @on-visible-change='selectrole'>
                    <Icon class="admin" type="md-contact" />
                    <Button class="choicerole">{{selectName}}
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem>驴打滚</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
            <!-- <FormItem prop="value">
                <Button class="getcode" @click="getCode()">{{flag == true ?'获取':second + 's'}}</Button>
                <Input type="text" maxlength="6" class="inputcode" v-model="formInline.value" placeholder="请输入验证码" style="width: 72%"/>
            </FormItem> -->
            <FormItem>
                <Button class="submit" type="primary" @click="handleSubmit()">登录</Button>
                <Button class="regist" type="primary" @click="handleRegist('formInline')">注册</Button>
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
                    // value:[
                    //     {required:true,message:'请输入正确的验证码',trigger:'blur'}
                    // ]
                },
                msg:'sdsds',
                flag:true,          //为false时获取验证码不可点击 
                selectName:'选择角色',
                // second:60,
            }
        },
        mounted(){
            // console.log(this.$store.state.count)
            // var count = this.$store.state.count;
            this.getrole();
            var count = localStorage.getItem('count')
                if(count){
                    if(count<0){
                        return
                    }else{
                        let timereold = setInterval(()=>{
                            -- count
                            console.log(count)
                            if(count < 0){
                                this.$router.go(0)
                                localStorage.setItem('count',-1)
                                clearInterval(timereold)
                            }
                        },500)
                }
            }
            else{
                count = 1;
                let timereold = setInterval(()=>{
                    -- count
                    console.log(count)
                    if(count < 0){
                        localStorage.setItem('count',-1)
                        this.$router.go(0)
                        clearInterval(timereold)
                    }
                },500)
            };
            
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
                        console.log(this.formInline.user)
                        var phone = this.formInline.user,
                            password = this.formInline.password,
                            // code = this.formInline.value;
                            username = this.formInline.username;
                        if(/^1[3456789]\d{9}$/.test(phone)){
                            console.log('手机号正确')
                        }
                        else{
                            this.$Message.error('手机格式不正确!');
                            return;
                        }
                        this.$Message.success('Success!');//信息不为空
                        that.$http.post(that.$store.state.url + '/user/register',{username:'zhc',password:'123456',phone:'15882004659',roleId:''}).then(function(res){
                            console.log(res)
                            if(res.data.code == '10000'){
                                console.log(11)
                                that.$router.push('/login')
                            }
                        }).catch(function(err){
                            console.log('错误'+err)
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            getCode(){
                console.log(111)
                if(this.flag == false ){
                    this.$Message.error('验证码已发送，请勿重复点击!');
                    return;
                }
                this.timeover()
            },
            timeover(){
                var that = this;
                let result = setInterval( ()=>{
                    --this.second;
                    console.log(this.second)
                if(this.second < 0){
                    clearInterval(result);
                    that.second = 60;
                    that.flag = true;        
                                    }
                                    else if(this.second < 60 && this.second >0){
                                        that.flag = fal}                   
                }, 1000);
            },
            selectrole(name){
                console.log(name)
            },
            getrole(){
                this.$http.get(this.$store.state.url + '/role/findAll',{params:{}}).then((res) =>{
                    console.log(res)
                }).catch((err) =>{
                    console.log(err)
                })
            }
        }
    }
</script>
<style lang="less">
    .main1{
        width: 100%;
        height: 100%;
        position: fixed;
        background-image: url('../assets/registbg.png');
        // background-repeat: no-repeat;
        background-size: 100% 100%;
        .login1{
        display: flex;
        flex-flow: column;
        width: 20%;
        border: 1px solid #333;
        margin:17% 0 0 75%;
        border-radius: 2%;
        .header1{
            width: 100%;
            height: 40px;
            p{
                font-size: 24px;
                text-align: center;
                color: antiquewhite;
            }
        }
        .contents1{
            width: 70%;
            margin: 0 auto;
            .inputcode{
                margin-left: 3px;
                border: none;
            }
            .regist{
                margin-left: 5%;
            }
            .admin{
                width: 29px;
                height: 32px;
                background: #f8f8f9;
                border: 1px solid #dcdee2;
                border-radius: 4px;
                padding: 7px 9px;
                margin-left: -15%;
                border-right: none;
                border-top-right-radius:0%;
                border-bottom-right-radius:0%;
            }
            .choicerole{
                border-top-left-radius:0%;
                border-bottom-left-radius:0%;
            }
        }
    }
    }
</style>
