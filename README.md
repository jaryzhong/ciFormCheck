# ciFormCheck
ciFormCheck is a jquery plugin for form data validation

what can I do?
--------------
1.快速定义表单需要的校验，只需设置dom几个属性即可开启校验，简化js表单校验业务代码<br/>
2.支持非空、整数、浮点数、数字、字符串、邮箱等常规校验，复杂校验可以设置正则校验<br/>
3.支持自定义input校验样式，默认校验不通过的input边框显示为红色<br/>
4.支持自定义校验消息展示，默认为alert消息，可以用别的插件将消息展示或者弹出<br/>

how to use it?
--------------
1.快速上手
导入jquery.js，和jquery.ciFormCheck.min.js
如要校验下面表单用户名与年龄不能为空时
只要设置需要校验input的两个属性fccheck和fcname，并调用插件就可以了
```
<script type="text/javascript" src="jquery-1.10.2.js"></script>
<script type="text/javascript" src="jquery.ciFormCheck.min.js" charset="UTF-8"></script>
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
