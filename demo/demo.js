var ciFormCheck;
;(function(){
	
	var options = {
		warringFlag:true,
		warringClass:"warringInputRed",//自定义不通过时输入框样式
	    onBlurCheck:true,
	    messageFunction:function(mess,$input){//可以自定义消息弹出
	    	$("#message").html(mess);
	    	$("#messageModal").modal("show");
	    },
	    passFunction:function($input){//可以自定义通过效果
	    	$input.addClass("warringInputGreen");
	    }
	};
	ciFormCheck = $("#csForm").ciFormCheck(options);
	
})();
function submitForm(){
	if(ciFormCheck.checkForm()){
		alert("数据校验完成，提交成功！");
	}
}
function removeCheck(){
	//删除校验
	ciFormCheck.removeCheck($("#age"));
	//重新设置元素的校验规则
	$("#age").attr("fccheck","int");
	$("#age").attr("fcname","年纪");
	$("#age").attr("fcrange","x>=1&&x<=200");
}

