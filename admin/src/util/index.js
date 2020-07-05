


// 日期参数 格式YYYY-MM-DD
// 传入2017-10-09 月份是10 在函数中会被转换为9，因为从0开始的 
var util = {

	source_url:'http://examlab.cn/img/',

    randomString:function (length) {
        var str = '';
        for ( ; str.length < length;){
           str += Math.random().toString(36).substr(2) ;
        } 
        return str.substr(0, length);
    }



}



export default util;

