# ciFormCheck
ciFormCheck is a jquery plugin for form data validation

## what can I do?
--------------
1.快速定义表单需要的校验，只需设置dom几个属性即可开启校验，简化js表单校验业务代码<br/>
2.支持非空、整数、浮点数、数字、字符串、邮箱等常规校验，复杂校验可以设置正则校验<br/>
3.支持自定义input校验样式，默认校验不通过的input边框显示为红色<br/>
4.支持自定义校验消息展示，默认为alert消息，可以用别的插件将消息展示或者弹出<br/>

## how to use it?
--------------
### 1.快速上手
导入jquery.js，和jquery.ciFormCheck.min.js<br/><br/>
如要校验下面表单用户名与年龄不能为空时<br/>
只要设置需要校验input的两个属性fccheck和fcname，并调用插件就可以了<br/>
```javascript
<script type="text/javascript" src="jquery-1.10.2.js"></script>
<script type="text/javascript" src="jquery.ciFormCheck.min.js"></script>
<form id="form">
<input type="text" fccheck="empty" fcname="用户名">
<input type="text" fccheck="empty" fcname="年龄">
</form>
<script type="text/javascript">
var form = $("#form").ciFormCheck();
if(form.checkForm()){
	//do submit
}
</script>
```

就可以省去很多表单校验的代码了

### 2.fccheck属性值列表与可以设置的dom属性
* empty:表示非空校验,如果类型是radio和checkBox的非空判断，一组的radio或checkBox，需要设置一样的name;select标签的非空判断，第一项option value必须设置为""<br/>
* int:表示整数校验 有fcrange范围属性,值用表达式如：x>=0&&x<=999999999999，也可以写成x>100||x<80，甚至可以(x>0&&x<18)||(x>60&&x<200),作数据大小范围判断<br/>
* number:表示全部数字校验 有fclength,fcminlength,fcmaxlength三个长度属性,fclength='11' fcminlength='16' fcmaxlength='19',字符长度判断<br/>
* string:表示字符校验 有fclength,fcminlength,fcmaxlength三个长度属性,字符长度判断<br/>
* float:表示浮点型校验 有fcrange范围属性,数据大小范围判断 有fcscale精度属性，只作格式化，不作fcscale精度判断<br/>
* email:表示邮箱校验<br/>
* multiEmil:表示多个邮箱校验 有fcsplit字符切隔符号属性，用来切隔每个邮箱<br/>
* regExp:表示正则校验,有fcexpression属性，用来传入一个判断的正则，插件会调用regExp.test(fcexpression的值)判断<br/>

fccheck可以设置成一个或两个属性，最多两个，如：fccheck="empty&&int" 表示只能输入非空的整形

### 3.options参数列表
要校验的dom设置好fccheck属性后，就可以用 $("#form").ciFormCheck()来调用插件，也可以用options参数来调用，用来自定义你想要的效果，比如自定义input校验后样式，自定义弹出消息的方式等等
options参数如下：
* warringFlag:false,//校验不通过时是否需要输入框警告<br/>
* warringClass:"csFormInput",//，传入样式名，可以自定义校验不通过时输入框警告样式，默认为边框为红色<br/>
* onBlurCheck:false,//是否开启失去焦点也校验<br/>
* messageFunction:null,//自定义实现的消息方法,传入一个回调函数，接收两个参数,function(消息,被校验的input JQ对象)<br/>
* passFunction:null//自定义校验通过的回调，传入一个回调函数，接收一个参数，function(被校验通过的input JQ对象)，可以用来执行这个input通过后想要的操作,比如解除自定义的消息<br/>
如何调用如下：
```javascript
var options = {
    warringFlag:true,
    warringClass:"warringInputRed",//自定义输入框样式名
    onBlurCheck:true,
    messageFunction:function(mess,$input){//可以自定义消息弹出
        //do something
    },
    passFunction:function($input){//可以自定义通过效果
	//do something
    }
};
var ciFormCheck = $("#csForm").ciFormCheck(options);
ciFormCheck.checkForm();
```
### 4.插件对象提供的方法列表
* checkForm():校验表单，表单提交时，可以调用此方法用来校验表单，表单通过校验时，返回true，有数据不符合规则时，返回false
* removeCheck($input):删除对某个input的校验，$input为要删除校验的jquery对象

### 5.最后
如需要知道更具体的如何使用插件，大家可以运行源码里的demo，希望对您有帮助，有问题和建议可以发邮件给我(1196365905@qq.com)，我会尽快回复

