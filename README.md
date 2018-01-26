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
* number:表示全部数字校验 有fclength,fcminlength,fcmaxlength三个长度属性,fclength='11' fcminlength='16' fcmaxlength='19'字符长度判断<br/>
* number:表示全部数字校验 有fclength,fcminlength,fcmaxlength三个长度属性,字符长度判断,<br/>
* string:表示字符校验 有fclength,fcminlength,fcmaxlength三个长度属性,字符长度判断<br/>
* float:表示浮点型校验 有fcrange范围属性,数据大小范围判断 有fcscale精度属性，只作格式化，不作fcscale精度判断<br/>
* email:表示邮箱校验<br/>
* multiEmil:表示多个邮箱校验 有fcsplit字符切隔符号属性，用来切隔每个邮箱<br/>
* regExp:表示正则校验 有fcexpression属性，传入一个判断的正则regExp.test(fcexpression的值)<br/>
