/**
 @Name：checkOrg 树组件
 @Author：wyh
 @License：MIT
    
 */
layui.define('jquery', function(exports){
	"use strict";
  
	var $ = layui.$
	,hint = layui.hint();
  
	var enterSkin = '', CheckOrg = function(options){
		this.options = options;
	};
  
	//初始化
	CheckOrg.prototype.init = function(options){
		var that = this;
		var isAll = "";
		var isChild = "";
		if(that.options.isAll){
			isAll = "y";
		}
		if(that.options.iscity){
			isAll = "c";
		}
		if(that.options.isChild){
			isChild = "y";
		}
		$.post(Common.ctxPath + "/core/user/org.json?isChild="+isChild+"&orgId="+that.options.orgId+"&isAll="+isAll, {}, function(data) {
			var zNodes = data;
			console.log(zNodes)
			var zTreeObj = null;
			var index = layer.open({
				type : 0,
				area : [ '500px', '400px' ],
				offset : 't',
				anim : 5,
				title : '选择组织机构',
				content : "<ul id='_treeDemo' class='ztree'></ul>",
				btn: ['确定','重置'],
				success: function(layero, index){
					zTreeObj = that.setting(zNodes);
					that.spread(zTreeObj);
				},
				yes : function(index, layero) {
					if(that.options.ascertain){
						 that.ascertain(zTreeObj);
					}
					layer.close(index);
				},
				btn2: function(index, layero){
					if(that.options.inputId){
						that.options.inputId.val('');
					}
					if(that.options.inputName){
						that.options.inputName.val('');
					}
					zTreeObj.cancelSelectedNode();
				}
			
			});
		});
	};
  
  
	//多选级联
	CheckOrg.prototype.setting = function(zNodes){
		var that = this, options = that.options;
		var zTreeObj = null;
		var setting = {};
		if(that.options.multipleChoice){
			setting = {
			        view: {
			            dblClickExpand: false,
			            showLine: false
			        },
			        data: {
			            simpleData: {
			                enable: true
			            }
			        },
			        check: {
			            enable: true,
			            chkboxType: {"Y": "", "N": ""}
			        },
			        callback: {
			        	onClick: function (e, treeId, treeNode, clickFlag) { 
			        		that.click(zTreeObj,treeNode);
					 	} 
			        }

			    };
			if(that.options.isRecursive){
				setting = {
				        view: {
				            dblClickExpand: false,
				            showLine: false
				        },
				        data: {
				            simpleData: {
				                enable: true
				            }
				        },
				        check: {
				            enable: true,
				            chkboxType: {"Y": "ps", "N": ""}
				        },
				        callback: {
				        	onClick: function (e, treeId, treeNode, clickFlag) { 
				        		that.click(zTreeObj,treeNode);
						 	} 
				        }

				    };
			}
		}else{
			setting = {
			        view: {
			            dblClickExpand: false,
			            showLine: false
			        },
			        data: {
			            simpleData: {
			                enable: true
			            }
			        },
			        check: {
			            enable: true,
			            chkStyle: "radio",
						radioType: "all"
			        },
			        callback: {
			        	onClick: function (e, treeId, treeNode, clickFlag) { 
			        		that.click(zTreeObj,treeNode);
					 	} 
			        }

			    };
		}
		zTreeObj = $.fn.zTree.init($("#_treeDemo"), setting, zNodes.data);
		return zTreeObj;
	};
	//点击节点回调
	CheckOrg.prototype.click = function(zTreeObj,treeNode){
		var that = this, options = that.options;
		var nodes = zTreeObj.getCheckedNodes();console.log(that,nodes)
		zTreeObj.checkNode(treeNode, !treeNode.checked, true); 
		var nodes = zTreeObj.getCheckedNodes();
		if(that.options.click){
			that.options.click(nodes);
		}
	};
	//确定回调
	CheckOrg.prototype.ascertain = function(zTreeObj){
		var that = this, options = that.options;
		var nodes = zTreeObj.getCheckedNodes();
		var ids = "";
		var names = "";console.log(that,nodes)
		if(that.options.multipleChoice){
			for(var i = 0;i<nodes.length;i++){
				ids = ids + nodes[i].id+";";
				names = names + nodes[i].name+";";
			}
		}else{
			if (nodes.length == 1) {
				var org = nodes[0];
				ids = org.id;
				names = org.name;
			}
		}
		if(that.options.inputId){
			that.options.inputId.val(ids);
		}
		if(that.options.inputName){
			that.options.inputName.val(names);
		}
		if(that.options.ascertain){
			that.options.ascertain(nodes);
		}
	};
  	//伸展节点spk-plm-core
	CheckOrg.prototype.spread = function(zTreeObj){
	    var that = this, options = that.options;
	    if(that.options.inputId){
			if(that.options.inputId.val()){
				if(that.options.multipleChoice){
					var arr = that.options.inputId.val().split(",");
					console.log(arr);
					for(var i = 0;i<arr.length;i++){
						if(""==arr[i]){
							continue;
						}
						var node = zTreeObj.getNodeByParam("id",arr[i]);
						zTreeObj.selectNode(node,true);  
						zTreeObj.checkNode(node,true);  
						zTreeObj.expandNode(node, true, false); 
					}
				}else{
					var node = zTreeObj.getNodeByParam("id",that.options.inputId.val());
					zTreeObj.selectNode(node,true);  
					zTreeObj.checkNode(node,true);  
					zTreeObj.expandNode(node, true, false); 
				}
			}
		}
	}
  
  	//暴露接口
	exports('checkOrg', function(options){
		var checkOrg = new CheckOrg(options = options || {});
		checkOrg.init(options);
	});
});