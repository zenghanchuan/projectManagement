<template>
<div class="main">
    <div class="login">
    <div class="header">
        <p>来骑哦后台管理系统</p>
    </div>
    <div class="contents">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="user">
                <Input type="text" maxlength="11" v-model="formInline.user" @keyup.enter.native="ajaxLoginApi()" placeholder="Phone">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" v-model="formInline.password" @keyup.enter.native="ajaxLoginApi()" placeholder="Password">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button class="submit" type="primary" @click="handleSubmit('formInline')">登录</Button>
                <!-- <Button class="regist" type="primary" @click="handleRegist()">注册</Button> -->
            </FormItem>
        </Form>
    </div>
</div>
</div>
</template>
<script>
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请输入正确的手机号码', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入正确的密码.', trigger: 'blur' },
                        { type: 'string', min: 6, message: '请输入正确的密码', trigger: 'blur' }
                    ]
                }
            }
        },
        watch:{         //刷新页面数据
        $route(){
            //跳转到该页面后需要进行的操作
            this.$router.go(0);
        }
        },
        methods: {
            /**登录提交事件及验证 */
            handleSubmit(name) {
                var that = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var phone = this.formInline.user,
                            password = this.formInline.password;
                        if(/^1[3456789]\d{9}$/.test(phone)){
                            that.$http.post(that.$store.state.url + '/user/login',{phone:phone,password:password}).then((res) =>{
                                if(res.data.code == '10000'){
                                    this.$Message.success('登录成功!');
                                    that.$store.commit('settoken',{token: res.data.object.token})
                                    localStorage.setItem('userId',res.data.object.id)
                                    localStorage.setItem('username',res.data.object.username)
                                    localStorage.setItem('permissions',JSON.stringify(res.data.object.permissions))
                                    localStorage.setItem("userInfo",window.btoa(window.encodeURIComponent(res.data.object.token)));   //加密本地信息
                                    this.$router.push('/')
                                }else{
                                    this.$Message.error('账号密码错误');
                                }
                            }).catch((err) =>{
                                console.log(err)
                            })
                        }else{
                            this.$Message.error('手机格式不正确!');
                            return;
                        }
                    } else {
                        this.$Message.error('请填写完整信息');
                    }
                })
            },
            /**回车键点击登录事件 */
            ajaxLoginApi(){
                var that = this;
                var phone = this.formInline.user,
                    password = this.formInline.password;
                if(this.formInline.password){
                    if(/^1[3456789]\d{9}$/.test(phone)){
                        that.$http.post(that.$store.state.url + '/user/login',{phone:phone,password:password}).then((res) =>{
                            if(res.data.code == '10000'){
                                this.$Message.success('登录成功!');
                                localStorage.setItem('userId',res.data.object.id)
                                localStorage.setItem('username',res.data.object.username)
                                localStorage.setItem('permissions',JSON.stringify(res.data.object.permissions))
                                localStorage.setItem("userInfo",window.btoa(window.encodeURIComponent(res.data.object.token)));   //加密本地信息
                                this.$router.push('/')
                            }
                        }).catch((err) =>{
                            console.log(err)
                        })
                    }else{this.$Message.error('手机格式不正确!');}
                }else{this.$Message.error('信息不完整!');}
            },
            // handleRegist(){
            //     localStorage.setItem('count',1)
            //     this.$router.push('/regist')
            // }
        },
    }
</script>
<style lang="less">
    .main{
        width: 100%;
        height: 100%;
        position: fixed;
        background-image: url('../assets/bgsym2.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .login{
        display: flex;
        flex-flow: column;
        width: 20%;
        border: 1px solid #333;
        margin:10% 0 0 43%;
        border-radius: 2%;
        .header{
            width: 100%;
            height: 40px;
            p{
                font-size: 24px;
                text-align: center;
                color: antiquewhite;
            }
        }
        .contents{
            width: 70%;
            margin: 0 auto;
            .regist{
                    margin-left: 5%;
                }
            }
        }
    }
</style>
