/**校验整数及浮点数的正则方法 */
const regular = function(val,err){
    if(val.replace(/[^\-?\d.]/g,'')){
        val = val
    }else{
        err = 1;            //err为1时正则验证错误
        return err
    }
}
/**默认选择当前时间作为任务创建的时间 */
const addDate = function(){
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
}
export default{
    regular,
    addDate,
}