<template>
    <div class="home">
      <h1>欢迎来到来骑哦后台管理系统</h1>
    </div>
</template>
<script>
    export default {
        data () {
            return {}
        },
        mounted(){
          this.loginVerification();
        },
        methods:{
          loginVerification:function(){
            var that = this;
            this.$http.get(this.$store.state.url + '/project/findProName',{params:{}}).then((res) =>{
                        if(res.data.code == '10000'){
                            return;
                        }if(res.data.code == '10001'){
                            // localStorage.clear();
                            that.$router.push('/login');
                            this.$Message.error('登录超时,请重新登录验证')
                        }
                    }).catch((err) =>{
                        console.log(err)
                    })
          },
        },
    }
</script>
<style lang="less" scoped>
.home{
  width: 100%;
  display: flex;
  h1{
    display: flex;
    width: 100%;
    line-height: 100px;
    align-items: center;
    justify-content: center;
  }
}
</style>
