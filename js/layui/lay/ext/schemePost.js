/*
 * spk-业财一体
 * other: yby
 * 2021-9-15
条件设置的 [方案列表]
对预警和指标操作生成的方案
对方案进行增删改查

*/

layui.define(["jquery","layer"],function(exports){
	var layer = layui.layer,
		$ = layui.jquery;//下拉菜单
	var schemePost = {
		del(id){
			// $.ajax({
			// 	type: 'POST',
			// 	url: 'http://localhost:9000/config/styleConfig/delete.json',
			// 	async: true,
			// 	data: { 'ids' : id },
			// 	success:function(){
					layer.msg('删除成功!!id='+id)
				// },
				// error:function(){
				// 	layer.msg('删除失败!!')
				// }
			// })
		},
		query:function(tableId,callback){
			//查询单个对象：'http://localhost:9000/config/styleConfig/view.json?id=' ,
			// $.ajax({
			// 	type: 'GET',
			// 	url:'http://localhost:9000/config/styleConfig/getStyleConfigByuserCodeAndTableId.json' ,
			// 	data: {
			// 		'tableId' : tableId
			// 	},
			// 	async: true,
			// 	success:function(res){
			// 		callback && callback(res);
			// 	},
			// 	error:function(){
					layer.msg(tableId + ' 查询失败!!')
			// 	}
			// })
		},
		add(obj,callback){
			var urls = '';
			if(obj['id']){
				urls =  'http://localhost:9000/config/styleConfig/update.json';
					layer.msg('修改成功!!')
			}else{
				urls =  'http://localhost:9000/config/styleConfig/add.json';
					layer.msg('添加成功!!')
			}
			return
			$.ajax({
				type: 'POST',
				url: urls,
				async: true,
				data: {
					'id': obj['id'],
					'tableId' : obj['table_Id'],
					'name' : obj['name'],
					'content':( typeof obj['content'] == "object" ? JSON.stringify(obj['content']) : obj['content'] )
				},
				success:function(){
					layer.msg('添加成功!!')
					callback && callback();
				},
				error:function(){
					layer.msg('添加失败!!')
				}
			})
		}
	}
	
	exports('schemePost', schemePost);
})