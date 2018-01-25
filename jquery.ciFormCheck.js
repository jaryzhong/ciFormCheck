/**
 * ciFormCheck表单校验插件
 * 1.用法：input中加入属性fccheck，如fccheck="empty"，表示不能为空，或者fccheck="empty&&int"，表示不能为空，并且只能为整数,fccheck里的值只支持检查两项
 * 每个要校验的元素中必须加上fcname或者fcmsg两者中的一个，用来弹出校验信息，例如：只设置fcname="用户名"时，当用户名为空时，会弹出fcname的值加上"不能为空！"，你也可以用fcmsg自定义
 * 这个消息，如fcmsg="用户名必填！"
 * 调用时var ciFormCheck = $("#csForm").ciFormCheck()使用默认参数，也可以传入options设置想用到的参数，
 * var options = {onBlurCheck:false};var ciFormCheck = $("#csForm").ciFormCheck(options);
 * 在form要提交时调用ciFormCheck.checkForm()方法，该方法有返回值，true表示校验通过,false表示校验不通过
 * 
 * 2.fccheck值支持如下：
 * empty:表示非空校验,如果类型是radio和checkBox的非空判断，一组的radio或checkBox，需要设置一样的name;select标签的非空判断，第一项option必须设置为""
 * int:表示整数校验 有fcrange范围属性,值用表达式如：x>=0&&x<=999999999999，也可以写成x>100||x<80，甚至可以(x>0&&x<18)||(x>60&&x<200),作数据大小范围判断
 * number:表示全部数字校验 有fclength,fcminlength,fcmaxlength三个长度属性,字符长度判断
 * string:表示字符校验 有fclength,fcminlength,fcmaxlength三个长度属性,字符长度判断 fclength='11' fcminlength='16' fcmaxlength='19'
 * float:表示浮点型校验 有fcrange范围属性,数据大小范围判断 有fcscale精度属性，只作格式化，不作fcscale精度判断
 * email:表示邮箱校验
 * multiEmil:表示多个邮箱校验 有fcsplit字符切隔符号属性，用来切隔每个邮箱，用来判断
 * regExp:表示正则校验 有fcexpression属性，传入一个判断的正则regExp.test(fcexpression的值)
 * 
 * 3.options参数解释:
 * warringFlag:false,//校验不通过时是否需要输入框警告
 * warringClass:"csFormInput",//，可以自定义校验不通过时输入框警告样式，默认为边框为红色
 * onBlurCheck:false,//是否失去焦点也校验
 * messageFunction:null,//自定义实现的消息方法,接收两个参数,function(消息,被校验的input JQ对象)
 * passFunction:null//自定义校验通过的回调，传入一个回调函数，接收一个参数，function(被校验通过的input JQ对象)，可以用来执行这个input通过后想要的操作,比如解除自定义的消息
 * 
 * 4.备注：这个插件只能在jq1.7以上版本运行，jQuery 1.7 已经将 live 和 die 移除，取而代之的是 on 和 off，所以这个插件只能在jq1.7以上版本运行
 * 如在低版本报on或off不是方法，请修改on和off对应低版本的live和die方法即可，或者升级jq为1.7以上版本
 */
/* ========================================================================
 * ciFormCheck: ciFormCheck.js v1.0.0
 * ========================================================================
 * Copyright 2018 classinstance.cn
 * ======================================================================== */
;(function ($) {
	var ciFormCheckAttr = ["fccheck","fcname","fcmsg","fcrange","fclength","fcminlength","fcmaxlength","fcmaxlength","fcscale","fcsplit","fcexpression"];
	$.fn.ciFormCheck = function(options) {
		var instance = this;
	    var defaults = {
	    	warringFlag:false,//校验不通过时是否需要输入框警告
	    	warringClass:"csFormInput",//，可以自定义校验不通过时输入框警告样式，默认为边框为红色
	        onBlurCheck:false,//是否失去焦点也校验
	        messageFunction:null,//自定义实现的消息方法,接收两个参数,function(消息,被校验的input JQ对象)
	        passFunction:null//自定义校验通过的回调，传入一个回调函数，接收一个参数，function(被校验通过的input JQ对象)，可以用来执行这个input通过后想要的操作,比如解除自定义的消息
	    };
	    var settings = $.extend({},defaults, options);
	    this.settings = settings;
	    //校验类
	    this.CheckClass = function(){//插件的校验类(内部类)
	    	var ccObj = this;
	    	this.checkForm = function(){
	    		var flag = true;
	    		$(instance).find("[fccheck]").each(function(i,e){
	    			var $obj = $(this);
	    			flag = ccObj.halderCheck(true,$obj);
	    			if(flag == false){//有检查到错误
	    				return false;//跳出循环
	    			}
	    		});
	    		return flag;
	    	};
	    	//校验最多两项
	    	this.halderCheck =function(ischeckEmpty,$obj){
	    		var fcCheck = $obj.attr("fccheck");
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		ccObj._selfAttrCheck(otherName,mess);
	    		if(fcCheck != null && fcCheck != ''){
	    			var checkTypeArr = fcCheck.split("&&");
	    		
	    			var type1 = checkTypeArr[0];
	    			var flag1 = ccObj.doCheck(ischeckEmpty, $obj, type1);
	    			if(checkTypeArr.length == 2){
	    				var type2 = checkTypeArr[1];
	    				var flag2 = ccObj.doCheck(ischeckEmpty, $obj, type2);
	    				
	    				if(flag1 && flag2){
	    					ccObj._noWarring($obj);//边框红色警告取消
	    					return true;
	    				}else{
	    					ccObj._warring($obj);//边框红色警告
	    					return false;
	    				}
	    			}else{
	    				if(flag1){
	    					ccObj._noWarring($obj);//边框红色警告取消
	    					return true;
	    				}else{
	    					ccObj._warring($obj);//边框红色警告
	    					return false;
	    				}
	    			}
	    		}
	    		return true;
	    	};
	    	this.doCheck = function(ischeckEmpty,$obj,type){
	    		if(type == 'empty' && ischeckEmpty == true){//空检查 onblur事件不检查非空
	    			return ccObj._checkEmpty($obj);
	    		}
	    		if($obj.attr("type") == 'radio' || $obj.attr("type") == 'checkBox' || $obj[0].tagName == 'SELECT'){
	    			console.error("radio,checkBox,select support empty check only!");
	    			return true;
	    		}
	    		if(type == 'int'){//整数检查
	    			return ccObj._checkInt($obj);
	    		}
	    		if(type == 'number'){//数字检查（电话，手机等号码）
	    			return ccObj._checkNumber($obj);
	    		}
	    		if(type == 'string'){//字符检查
	    			return ccObj._checkString($obj);
	    		}
	    		if(type == 'float'){//浮点型检查
	    			return ccObj._checkFloat($obj);
	    		}
	    		if(type == 'email'){//邮箱检查
	    			return ccObj._checkEmail($obj);
	    		}
	    		if(type == 'multiEmil'){//多个邮箱检查
	    			return ccObj._checkMultiEmil($obj);
	    		}
	    		if(type == 'regExp'){//多个邮箱检查
	    			return ccObj._checkRegExp($obj);
	    		}
	    		return true;
	    	};
	    	//检查是不是空
	    	this._checkEmpty = function($obj){
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		var value = '';
	    		var type = $obj.attr("type");
	    		var name = $obj.attr("name");
	    		var selectObj = false;//选择性的标签
	    		if(type == 'radio'){
	    			if(!name){
	    				console.error("radio's name is undefined!");
	    				return false;
	    			}
	    			value = $("input[name='"+name+"']:checked").val();
	    			selectObj = true;
	    		}else if(type == 'checkBox'){
	    			if(!name){
	    				console.error("checkBox's name is undefined!");
	    				return false;
	    			}
	    			value = $("input[name='"+name+"']:checked").val();
	    			selectObj = true;
	    		}else{
	    			if($obj[0].tagName == 'SELECT'){
	    				selectObj = true;
	    			}
	    			value = $obj.val();
	    		}
	    		if(value =='' || value == undefined){
	    			//$obj.val('');
	    			if(mess && mess != ''){
	    				ccObj._alert(mess,$obj);
	    			}else{
	    				if(selectObj ==  false){
	    					ccObj._alert(otherName+"不能为空！",$obj);
	    				}else{
	    					ccObj._alert("请选择"+otherName+"!",$obj);
	    				}
	    			}
	    			ccObj._focus($obj);
	    			return false;//有检查到错误
	    		}
	    		return true;
	    	}
	    	//检查是不是整数和范围
	    	this._checkInt = function($obj){
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		var range = $obj.attr("fcrange");//范围属性
	    		var value = $obj.val();
	    		if ((value != null) && (value.length > 0)) {
	    			//判断是不是整数
	    			if (isNaN(value) || value.indexOf('.') != -1 || value.indexOf(' ') != -1) {
	    				$obj.val('');
	    				if(mess && mess != ''){
	    					ccObj._alert(mess,$obj);
	    				}else{
	    					ccObj._alert(otherName+"格式不正确,只能输入整数！",$obj);
	    				}
	    				ccObj._focus($obj);
	    				return false;
	    			}
	    			value = parseInt(value);
	    			//值判断是不是在范围内
	    			var condition= "x>=0&&x<=999999999999";//默认0-999999999999
	    			var showCondition = "";
	    			if(range && range != ''){
	    				condition = range;
	    			}
	    			showCondition = condition;
	    			while(showCondition.indexOf('&&') != -1 || showCondition.indexOf('||') != -1){
	    				showCondition = showCondition.replace("&&","且").replace("||","或者");
	    			}
	    			
	    			while (condition.indexOf('x') != -1) {
	    				condition =condition.replace("x",value);
	    			}
	    			
	    			$obj.val(value);
	    			if(eval(condition) == false){
	    				$obj.val('');
	    				if(mess && mess != ''){
	    					ccObj._alert(mess,$obj);
	    				}else{
	    					ccObj._alert(otherName+"格式不正确,必须"+showCondition+"！",$obj);
	    				}
	    				ccObj._focus($obj);
	    				return false;
	    			}
	    		}
	    		return true;
	    	}
	    	//检查是否全是数字和长度，比如手机号，电话:0105209111
	    	this._checkNumber = function($obj){
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		
	    		var value = $obj.val();
	    		if ((value != null) && (value.length > 0)) {
	    			if (isNaN(value) || value.indexOf(' ') != -1) {
	    				$obj.val('');
	    				if(mess && mess != ''){
	    					ccObj._alert(mess,$obj);
	    				}else{
	    					ccObj._alert(otherName+"格式不正确,只能输入数字！",$obj);
	    				}
	    				ccObj._focus($obj);
	    				return false;
	    			}
	    			//检查长度
	    			return ccObj._checkLength($obj);
	    		}
	    		return true;
	    	}
	    	//检查字符串长度
	    	this._checkString = function($obj){
	    		
	    		var value = $obj.val();
	    		if ((value != null) && (value.length > 0)) {
	    			//检查长度
	    			return ccObj._checkLength($obj);
	    		}
	    		return true;
	    	}
	    	//检查浮点型与范围，并格式化精度
	    	this._checkFloat = function($obj){
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		var range = $obj.attr("fcrange");//范围属性
	    		var scale = $obj.attr("fcscale");//精度属性
	    		var value = $obj.val();
	    		if ((value != null) && (value.length > 0)) {
	    			//判断是不是整数
	    			if (isNaN(value) || value.indexOf(' ') != -1) {
	    				$obj.val('');
	    				if(mess && mess != ''){
	    					ccObj._alert(mess,$obj);
	    				}else{
	    					ccObj._alert(otherName+"格式不正确,只能输入数字！",$obj);
	    				}
	    				ccObj._focus($obj);
	    				return false;
	    			}
	    			var n = 0;
	    			if(scale && scale !=''){
	    				n = parseInt(scale);
	    			}
	    			value = parseFloat(value).toFixed(n);
	    			//值判断是不是在范围内
	    			var condition= "x>=0&&x<=999999999999";//默认0-999999999999
	    			var showCondition = "";
	    			if(range && range != ''){
	    				condition = range;
	    			}
	    			showCondition = condition;
	    			while(showCondition.indexOf('&&') != -1 || showCondition.indexOf('||') != -1){
	    				showCondition = showCondition.replace("&&","且").replace("||","或者");
	    			}
	    			
	    			while (condition.indexOf('x') != -1) {
	    				condition =condition.replace("x",value);
	    			}
	    			
	    			$obj.val(value);
	    			if(eval(condition) == false){
	    				$obj.val('');
	    				if(mess && mess != ''){
	    					ccObj._alert(mess,$obj);
	    				}else{
	    					ccObj._alert(otherName+"格式不正确,必须"+showCondition+"！",$obj);
	    				}
	    				ccObj._focus($obj);
	    				return false;
	    			}
	    			$obj.val(value);
	    		}
	    		return true;
	    	}
	    	//检查邮箱地址是否正确
	    	this._checkEmail = function($obj){
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		
	    		var value = $obj.val();
	    		if ((value != null) && (value.length > 0)) {
	    			var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	    			var isok= reg.test(value );
	    			if (!isok) {
	    				$obj.val('');
	    				if(mess && mess != ''){
	    					ccObj._alert(mess,$obj);
	    				}else{
	    					ccObj._alert(otherName+"格式不正确，请重新输入！",$obj);
	    				}
	    				ccObj._focus($obj);
	    				return false;
	    			}
	    		}
	    		return true;
	    	}
	    	//检查多个邮箱地址是否正确，用fcsplit切隔
	    	this._checkMultiEmil = function($obj){
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		var splitStr = $obj.attr("fcsplit");
	    		if(splitStr && splitStr != ''){
	    		}else{
	    			splitStr = ",";
	    		}
	    		var value = $obj.val();
	    		if ((value != null) && (value.length > 0)) {
	    			var emails = value;
	    			var emailArray = emails.split(splitStr);
	    			for ( var index in emailArray) {
	    				var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	    				var isok= reg.test(emailArray[index] );
	    				if (!isok) {
	    					$obj.val('');
	    					if(mess && mess != ''){
	    						ccObj._alert(mess,$obj);
	    					}else{
	    						ccObj._alert(otherName+"格式不正确，请重新输入！",$obj);
	    					}
	    					ccObj._focus($obj);
	    					return false;
	    				}
	    			}
	    		}
	    		return true;
	    	}
	    	//检查正则表达式，fcexpression属性为要校验的表达式
	    	this._checkRegExp = function($obj){
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		var expression = $obj.attr("fcexpression");
	    		if(expression && expression != ''){
	    		}else{
	    			alert(otherName+"Regular check lack 'fcexpression' attribute！");
	    			return false;
	    		}
	    		var value = $obj.val();
	    		if ((value != null) && (value.length > 0)) {
	    			var reg = new RegExp(expression);
	    			var isok= reg.test(value );
	    			if (!isok) {
	    				$obj.val('');
	    				if(mess && mess != ''){
	    					ccObj._alert(mess,$obj);
	    				}else{
	    					ccObj._alert(otherName+"格式不正确，请重新输入！",$obj);
	    				}
	    				ccObj._focus($obj);
	    				return false;
	    			}
	    		}
	    		return true;
	    	}
	    	//判断字符长度
	    	this._checkLength = function($obj){
	    		var otherName = $obj.attr("fcname");
	    		var mess = $obj.attr("fcmsg");
	    		var length = $obj.attr("fclength");//定长
	    		var minLength = $obj.attr("fcminlength");//最小长度
	    		var maxLength = $obj.attr("fcmaxlength");//最大长度
	    		var ln = $obj.val().length;
	    		
	    		var flag = true;
	    		var messageLength = "";
	    		var messageMinLength = "";
	    		var messageMaxLength = "";
	    		if(length && length != ''){
	    			if(ln != parseInt(length)){
	    				flag = false;
	    				messageLength ="必须是"+length;
	    			}
	    		}
	    		if(minLength && minLength != ''){
	    			if(ln < parseInt(minLength)){
	    				flag = false;
	    			}
	    			messageMinLength = "必须大于等于"+minLength;
	    		}
	    		if(maxLength && maxLength != ''){
	    			if(ln > parseInt(maxLength)){
	    				flag = false;
	    			}
	    			if(messageMinLength != ""){
	    				messageMaxLength = "且必须小于等于"+maxLength;
	    			}else{
	    				messageMaxLength = "必须小于等于"+maxLength;
	    			}
	    		}
	    		if(flag == false){
	    			$obj.val('');
	    			if(mess && mess != ''){
	    				ccObj._alert(mess,$obj);
	    			}else{
	    				ccObj._alert(otherName+"的长度"+messageLength+messageMinLength+messageMaxLength+"!",$obj);
	    			}
	    			ccObj._focus($obj);
	    			return false;
	    		}
	    		return true;
	    	}
	    	//初始时给页面添加样式
	    	this._initClass = function(){
	    		if(settings.warringClass == 'csFormInput'){
		    		var oHead = document.getElementsByTagName('HEAD').item(0);
		    		var style = document.createElement("style");
					$(style).html(".csFormInput{border:1px solid red;}");
					oHead.appendChild(style);
	    		}
	    	}
	    	//插件属性检查
	    	this._selfAttrCheck = function(fcname,fcmsg){
	    		if(!fcname && !fcmsg){
	    			console.error("The attribute 'fcname' and 'fcmsg' must set one!");
	    		}
	    	}
	    	//设置校验不通过的input边框为红色
	    	this._warring = function($obj){
	    		if(settings.warringFlag){
	    			var type = $obj.attr("type");
//	    			if(type == 'radio' || type == 'checkBox'){//设置边框没有用
//	    				return;
//	    			}
	    			$obj.addClass(settings.warringClass);
	    		}
	    	}
	    	//边框红色警告解除，以及调用自定义的passFunction
	    	this._noWarring = function($obj){
	    		var v = $obj.val();
	    		if(settings.warringFlag &&  v){
	    			$obj.removeClass(settings.warringClass);
	    		}
	    		if(settings.passFunction &&  v){
	    			settings.passFunction($obj);
	    		}
	    	}
	    	//弹出消息，或自己实现的消息方法
	    	this._alert = function(message,$obj){
	    		if(!settings.messageFunction){
	    			alert(message);
	    		}else{
	    			settings.messageFunction(message,$obj);
	    		}
	    	}
	    	this._focus = function($obj){
	    		window.setTimeout( function(){ $obj.focus(); }, 0);
	    	}
	    };
	    //表单校验
	    this.checkForm = function (){
	    	var cc = new instance.CheckClass();
    		return cc.checkForm();
	    }
	    //解除校验
	    this.removeCheck = function($obj){
	    	$obj.each(function(){
	    		for(var i in ciFormCheckAttr){
	    			$(this).removeAttr(ciFormCheckAttr[i]);
	    			$(this).removeClass(settings.warringClass);
	    		}
	    	});
	    }
        return this.each(function(){
        	var cclass = new instance.CheckClass();
        	//给要检查的input绑定失去焦点事件
        	cclass._initClass();
        	if(settings.onBlurCheck){
            	$(instance).find("[fccheck]").off().on("blur",function(){
        			var $obj = $(this);
        			var fccheck = $obj.attr("fccheck");
        			if(!fccheck){//被删除fccheck属性的input
        				//$obj.unbind("blur");//解除blur事件
        				return;
        			}
        			var flag = cclass.halderCheck(false,$obj);
        			if(flag == false){
        				return false;
        			}
        		});
            }
        });
	};
	
})(jQuery);
