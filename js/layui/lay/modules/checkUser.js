/**
 @Name：checkOrg 树组件
 @Author：wyh
 @License：MIT
    
 */
layui.define('jquery', function(exports){
	"use strict";
  
	var $ = layui.$
	,hint = layui.hint();
  
	var enterSkin = '', CheckUser = function(options){
		this.options = options;
	};
	 
	//初始化
	CheckUser.prototype.init = function(options){
		var that = this;
		var isRecursive = "";
		var multipleChoice = "";
		var isAll = "";
		if(that.options.isRecursive){
			isRecursive = "y";
		}
		if(that.options.multipleChoice){
			multipleChoice = "y";
		}
		if(that.options.isAll){
			isAll = "y";
		}
		var index=layer.open({
    	  	type: 2,
    	  	shade: false,
    	  	btn: ['确定', '取消'],
    	  	area: ['1000px', '500px'],
    	  	maxmin: true,
    	  	content: Common.ctxPath + '/admin/user/userList.do?isRecursive='+isRecursive+'&multipleChoice='+multipleChoice+'&isAll='+isAll,
    	  	zIndex: layer.zIndex, //重点1
    	  	success: function(layero){
    	    	layer.setTop(layero); //重点2
    	  	},
    	  	yes: function(index, layero){
    			var res = window["layui-layer-iframe" + index].callbackdata();
    			
    			var flag = false;
    			if(that.options.ascertain){
					 flag = that.ascertain(res);
				}
    			if(flag){
    				layer.close(index);
    			}
    		},
    		cancel: function(index){ 
    			if(that.options.close){
    				that.options.close();
    			}
    		},
    		btn2: function(index, layero){
    			if(that.options.close){
    				that.options.close();
    			}
    		}
    	});
		
		layer.full(index);
	};
	
	//点击节点回调
	CheckUser.prototype.click = function(zTreeObj,treeNode){
		var that = this, options = that.options;
		var nodes = zTreeObj.getCheckedNodes();
		zTreeObj.checkNode(treeNode, !treeNode.checked, true); 
		var nodes = zTreeObj.getCheckedNodes();
		if(that.options.click){
			that.options.click(nodes);
		}
	};
	//确定回调
	CheckUser.prototype.ascertain = function(data){
		var that = this, options = that.options;
		var ids = "";
		var names = "";
		var codes="";
		if(null == data || "" == data || "undefined" == data){
			Common.info("请选中记录");
			return false;
		}
		if(that.options.multipleChoice){
			for(var i = 0;i<data.length;i++){
				ids = ids + data[i].id+";";
				names = names + data[i].name+";";
			}
		}else{
			if(data.length>1){
				Common.info("请选中一条记录");
				return false;
			}else{
				ids = data[0].id;
				names = data[0].name;
			}
		}
		if(that.options.inputId){
			that.options.inputId.val(ids);
		}
		if(that.options.inputName){
			that.options.inputName.val(names);
		}
		if(that.options.ascertain){
			that.options.ascertain(data);
		}
		return true;
	};
  
  	//暴露接口
	exports('checkUser', function(options){
		var checkUser = new CheckUser(options = options || {});
		checkUser.init(options);
	});
});