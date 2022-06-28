/*
 @name: 本插件仅仅针对朝阳"门急诊指标汇总"的表格数据进行操作
 * @author: byb
 * @license: Spk
 * @version: v1.0.0
 * 
 需求:
 添加样式
 保存方案,修改,删除,添加
 
 添加预警
 同类项操作-
	tip同类的环比,同比等...
	添加事件 lay-event = 'filed'
	指标排序,显示隐藏
	
	数据和指标同一个数组返回回来的
	
	数据处理[条件,分页,高度,elem, done, sortDone....]
	参数和table.render的参数合并
	
	render() 返回table.render
	
	load
	sortDone - 页面预警颜色判断
	
 * setUpTable.render(myTable);//打开设置页面
 * table 添加属性
 * ,drag: false // 关闭拖拽列功能
 * ,overflow: 'tips'
 * sortDone 排序后加载
 * noSortRow : 2 //第几行不参与排序
 * classType: ['lc1','lc2'] //分类表头指标内是classItem
*/
layui.define(["table","layer","element","form",'colorpicker','schemePost'],function(exports){
	var $ = layui.$,
	table = layui.table,
	layer = layui.layer,
	colorpicker = layui.colorpicker,
	form = layui.form,
	element = layui.element,
	_BODY = $("body"),
	_DOC = $(document),
	menuList = [],//方案列表
	tableConfig = {},
	currentScheme = {
		'tableId':'',
		'name':'',
		'content' :{
			'cols':[],//指标排序和显示隐藏
			'classType' :[],//指标分类,针对单表头
			'where': [], //{}预警条件
			'basics': {//基本设置basicsSettings
				//format : '', //千分位  'format,id0,id2' 
				'tdStyle' : [] // 单元格样式设置{name:id0,value: css} //name="tdStyle"
			}
		}
	},//当前方案
	defaultConfig = {
//		format : true,false 默认true
//		sortDone : fn
//		noSortRow: 1,
//		setDate : !1, //设置默认参数使用 时间区间
//		fiexd : !1, //{}letf , right ,width :200
//		whereData :!1,//条件
//		classType : [], //通过基础设置分类
	};
	setupTable = {
		render(e){
			//!e && layer.msg('参数不能为空!!');
			tableConfig = $.extend({}, defaultConfig, e);
			tableConfig.setDate && new whereData(tableConfig);
			tableConfig.url && new colsData(tableConfig);
			
			//加按钮, 加事件
			this.toolbar(tableConfig);
			
			return table.render(tableConfig);
		},
		//弹窗操作
		toolbar : function(config){
			config['defaultToolbar'] = [{ 
						    title: '设置' //标题'print',
						    ,layEvent: 'LAYTABLE_SET' //事件名，用于 toolbar 事件中使用
						    ,icon: 'layui-icon-set' //图标类名
						  },'exports'];//
			this.eventToobar(config['elem'].substring(1));
		},
		eventToobar : function(filter){
			var that = this;
			table.on('toolbar('+filter+')',function(obj){
				if(obj.event == "LAYTABLE_SET"){ //打开方案列表
					that.menuList();//先请求方案列表
				}
			})
			table.on('tool('+filter+')',function(obj){
				var data = obj.data, str = ''
				var filerEvent = tableConfig.cols[0].filter(function(v){ return obj.event === v.field });
				  tableConfig.cols[0].forEach(function(v,index){
						if(filerEvent[0].name != v.name && v.name.split("&")[1] === filerEvent[0].title){
							str += v.title + ' : ' + data[v.field] + '<br/>';
						}
					})
					layer.tips( str , this, {
						tips: [1, '#3595CC'],
						time: 4000
					});
			})
		},
	//方案列表弹窗
	menuList:function(){
		var that = this;
		var tableId = (currentScheme['tableId'] ? currentScheme['tableId'] : (tableConfig['elem'].substring(1) + '_'+(tableConfig['id']?tableConfig['id']:tableConfig['elem'].substring(1) ) ));
		var schemeStrList = '';
		layui.schemePost.query(tableId,function(res){
			menuList = res['data'];
			schemeStrList = '<form class="layui-form">';
			if(menuList.length){
				menuList.map(function(v){
					v.content = JSON.parse(v.content);
					return v;
				})
				menuList.forEach(function(item){
					schemeStrList += '<div class="layui-inline spk-menuList"><input type="radio" lay-filter="menuList" name="menuList" value="'+item['id']+'" title="'+item['name']+'"/><i class="layui-icon layui-icon-close meun-close layui-unselect layui-tab-close" style="vertical-align: text-top;"></i></div>'
				});
			}else{
				schemeStrList += '<div class="layui-row layui-bg-red layui-text" style="padding: 5px 20px;">没有表格设置方案,请设置方案!</div>';
			}
			schemeStrList += '</form>';
			that.loadScheme(schemeStrList);
		});
	},
	reload: function(){
		var that = this;
		this.colsSortIndex();
		tableConfig.sortDone = function(){
			that.tableRanderRowWarning();//单元格条件设置
		}
		//获取显示隐藏列
		table.render(tableConfig);// 重载
	},
	
	//请求方案列表
	loadScheme:function(content){
		var that = this;
		layer.open({
			title: '方案列表设置',
			type : 1,
			id: 'scheme_list',
			area : ['500px','300px'],
			 btn: ['查看','修改','新增', '关闭'],
			content: content,
			success: function(layero){
				if(currentScheme['id']){
					$(layero).find('.spk-menuList').find('[value="'+currentScheme['id']+'"]').prop('checked',true);
				};
				$(layero).on('click','.meun-close',function(){
					var spk_schemId = $(this).parent('.spk-menuList').children('[name="menuList"]').val();
					//删除变量里的方案某一个
					menuList.map(function(v,i,all){
						if(v['id']==spk_schemId){
							layui.schemePost.del(v['id']);//删除方案
							return all.splice(i,1)
						}
					});
					//删除当前已选中的方案时清空数据
					if(currentScheme['id'] == spk_schemId){ 
						currentScheme = {
							'content': {'cols':[],'classType':[],'where':[],'basics':{tdStyle : [] } } //format : '',
						}
					};
					$(this).parent('.spk-menuList').remove();
				});
				form.render();
			},
			yes:function(i,layero){
				var spk_schem_id = $(layero).find('[name="menuList"]:checked').val();
				if(spk_schem_id){
					var checked_schem =	menuList.filter(function(v){if(v['id']==spk_schem_id)return v})
					currentScheme = {
						'id':checked_schem[0]['id'],
						'tableId':checked_schem[0]['tableId'],
						'name':checked_schem[0]['name'],
						'content' : checked_schem[0]['content']//当前方案
					};
					that.reload();//根据条件重载
					layer.close(i)
				}else{
					layer.msg('请选择要 <b> 查看 </b> 的方案!!');
					return false
				}
			},
			btn2: function(i, layero){
				var spk_schem_id = $(layero).find('[name="menuList"]:checked').val();
				if(spk_schem_id){
					var checked_schem =	menuList.filter(function(v){if(v['id']==spk_schem_id)return v})
					currentScheme = {
						'id':checked_schem[0]['id'],
						'tableId':checked_schem[0]['tableId'],
						'name':checked_schem[0]['name'],
						'content' : checked_schem[0]['content'] //选择当前方案
					};
					//修改
					that.colsSortIndex();
					var indexform = that.strCols(tableConfig);
					that.alertTab(indexform);
				}else{
					layer.msg('请选择要 <b> 修改 </b> 的方案!!');
					return false
				}
			},
			btn3: function(i, layero){
				//新增
				var tableId = (tableConfig['elem'].substring(1) + '_'+(tableConfig['id'] ?tableConfig['id'] : tableConfig['elem'].substring(1) ));
					currentScheme = {
						'id':'',
						'tableId':tableId,
						'name':'',
						'content': {'cols':[],'classType':[],'where':[],'basics':{ tdStyle : [] }}//创建新的方案去除变量数据format : '',
					}
					//修改
					var indexform = that.strCols(tableConfig);
					that.alertTab(indexform);
				layer.close(i)
			}
		})
		
	},
	//表格加载完成后,对表格的单元格进行预警
	tableRanderRowWarning:function(){
		//表格加载完成后,对表格的单元格进行预警
		var that = this;
		//预警条件-确定后渲染预警单元格
		if(currentScheme['content']['where'] && currentScheme['content']['where'].length){
			currentScheme['content']['where'].forEach(function(item){
				that.colTemplet(tableConfig['elem'].substring(1) , item);
			});
			form.render();
		};
		
	},
	//设置指标的条件
	colTemplet:function(elem,item){
		//['=','>','<','>=','<=','[]', '≠' , 'Empty']
		switch(item['rel']){
			case '=':
				$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
					if($(this).text().indexOf(',') == -1){
						if($(this).text().trim() == item['value']){
							tdtrset(this , item);
						}
					}else{
						let text = $(this).text();
						if(delcommafy(text) == item['value']){
							tdtrset(this , item);
						}
					}
				})
			break;
			case '>':
				$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
					if(delcommafy($(this).text()) > parseFloat(item['value']) ){
						tdtrset(this , item);
					}					
				})
			break;
			case '<':
				$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
					if(delcommafy($(this).text()) < parseFloat(item['value'])){
						tdtrset(this , item);
					}
				})
			break;
			case '>=':
				$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
					if(delcommafy($(this).text() ) >= parseFloat(item['value']) ){
						tdtrset(this , item);
					}
				})
			break;
			case '<=':
				$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
					if(delcommafy($(this).text()) <= parseFloat(item['value']) ){
						tdtrset(this , item);
					}
				})
			break;
			case '[]':
				$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
					if( parseFloat(item['value']) <= delcommafy($(this).text() ) && parseFloat(item['value1']) >= delcommafy($(this).text())){
						tdtrset(this , item);
					}
				})
			break;
			case '≠':
				$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
					if($(this).text().trim() != item['value']){
						tdtrset(this , item);
					}
				})
			break;
			default:
			$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
				if(!$(this).text().trim()){
					tdtrset(this , item);
				}
			})
				
		};
		function delcommafy(num) {//去掉千分位
			  if (num != undefined) {
			    num = num.toString();
			    num = num.replace(/[ ]/g, ""); //去除空格  
			    num = num.replace(/,/gi, '');
			    return Number(num);
			  }
			}
		function tdtrset(that , item){
			if(item['trtd'] == '格'){
				$(that).css({
					'color': item['color'],
					'backgroundColor': item['bgcolor']
				})
			}else if(item['trtd'] == '行'){
				$(that).parent('tr').css({
					'color': item['color'],
					'backgroundColor': item['bgcolor']
				})
			}else{
				$(that).parents('tbody').find('[data-field="'+item['field']+'"]').css({
					'color': item['color'],
					'backgroundColor': item['bgcolor']
				})
			}
		}
	},
	//指标拼接
	strCols:function(e){
		return function(cols){
			var type  = e.classType;
			var colslist = [];
		 if(e.cols.length == 1 && Array.isArray(type) && type.length){
				cols.forEach(function(item) {
					type.forEach( (p,index)=>{
						colslist.push('<div class="layui-colla-item"><div class="layui-colla-title"><span class="type">'+p+'</span></div><div class="layui-colla-content layui-show"><div class="layui-form-item"><input type="checkbox" lay-filter="LAY_TABLE_TOOL_allList" lay-skin="primary" name="allList'+index+'" title="全选"></div><div class="spk-item">')
						item.filter(function(v){if(v['classItem']==p) return v; }).forEach(function(i){
							if(i.field){
								currentScheme['content']['cols'].push({ field: i.field, hide:(i.hide?i.hide:false) })
								colslist.push('<div class="layui-inline fieldIndex" id="' + i.field + '"><input type="checkbox" name="' + i.field + '" data-key="' + i.key + '" data-parentkey="' + (i.parentKey || "") + '" lay-skin="primary" ' + (i.hide ? "": "checked") + ' title="' + (i.title || i.field) + '" lay-filter="LAY_TABLE_TOOL_COLS"></div>')
							}
						})
						colslist.push('</div></div></div>')
					})
				})
				}else{
					//多表头-单表头-不
					colslist = ['<div class="layui-form-item"><div class="layui-inline"><input type="checkbox" lay-filter="LAY_TABLE_TOOL_allList" lay-skin="primary" name="allList" title="全选"></div></div><div class="layui-row">']
					cols.forEach(function(item) {
						item.forEach(function(i){
							if(i.field){ 
								currentScheme['content']['cols'].push({ field: i.field, hide:(i.hide?i.hide:false) })
								colslist.push('<div class="layui-inline fieldIndex" id="' + i.field + '"><input type="checkbox" name="' + i.field + '" data-key="' + i.key + '" data-parentkey="' + (i.parentKey || "") + '" lay-skin="primary" ' + (i.hide ? "": "checked") + ' title="' + (i.title || i.field) + '" lay-filter="LAY_TABLE_TOOL_COLS"></div>')
							}
						})
					})
					colslist.push('</div>')
				}
			return '<form class="layui-form" lay-filter="colsform"><div class="layui-row layui-bg-red layui-text" style="padding: 5px 20px;">注:避免表格排序混乱,固定列指标请不要排序!!</div><div id="colsform" class="layui-collapse" style="margin:10px;background-color: #fff;">'+colslist.join('')+'</div></form>'
		}(e.cols);
	},
	//预警,基本设置回显和点击事件
	warningEvent :function(){
		var that = this;
			//预警值回显设置
		if(currentScheme['content']['where'].length){
			var tabItemeq = null;
			currentScheme['content']['where'].forEach(function(warning,index){
				that.earlyWarning( warning['field']);
				tabItemeq = $('#colsWarning').find('.layui-list');
					//渲染continue;
				for(let t in warning){
					if(t == 'filed')continue;
					if(t == 'color'){
						tabItemeq.children('.layui-row').eq(index).find('.colorpicker').attr('data-color',warning[t]);
					}else if(t == 'bgcolor'){
						tabItemeq.children('.layui-row').eq(index).find('.bgcolorpicker').attr('data-color',warning[t]);
					}else if(t == 'trtd'){
						var trtd = tabItemeq.children('.layui-row').eq(index).find('[name^="'+t+'"]');
						trtd.each(function(){
							if($(this).val() == warning[t]) $(this).attr('checked',true);
						})
					}else{
						if(t == 'value1' && warning[t]){
							tabItemeq.children('.layui-row').eq(index).find('[name="value"]').css("width",'60px')
							tabItemeq.children('.layui-row').eq(index).find('.layer_linksvalue').css({'display':'inline-block'})
						}
						tabItemeq.children('.layui-row').eq(index).find('[name="'+t+'"]').val(warning[t]);
					}
				}
			})
		};
		
		// 单元格样式设置--回显
		if(currentScheme['content']['basics']['tdStyle'].length){
			var tdStyleObj = null;
			tdStyleObj = $('#basicsSettings').find('.tdStyleList');
			currentScheme['content']['basics']['tdStyle'].forEach(function(item, i){
				that.basiceStyle(item['name']);//添加单元格设置
				tdStyleObj.find('[name="tdStyle"]').eq(i).val(item['value']);
			}) 
		}
			//增加指标-行
		$(".addWarningRow").click(function(){
			that.earlyWarning();
			that.colorpickerEvent();//选颜色
			form.render();
		});
		that.colorpickerEvent();//选颜色
		//删除预警条件
		$('#colsWarning').on('click','.layui-row .delete',function(){
			$(this).parents('.layui-row').remove();
		});
		//基本设置
		
		//单元格样式设置
		$('.tdStyle').on('click','#tdStyle_add',function(){
			that.basiceStyle();//添加单元格设置
		});
		$('.tdStyle').on('click','#tdStyle_del',function(){
			$(this).parents('.tdStyle').find('.tdStyleList .layui-row:last').remove();
		})
	},
	colorpickerEvent:function(){
	//颜色选择器
		lay('.colorpicker').each(function(){
			var that = this;
			colorpicker.render({ //无初始色值时
			  elem: that
			  ,alpha: true
				,color: $(that).attr('data-color')
			  ,format: 'rgb'
				,change: function(color){
					$(that).attr('data-color',color)
				}
				,done: function(color){
					$(that).attr('data-color',color)
				}
			});
		})
		lay('.bgcolorpicker').each(function(){
			var that = this;
			colorpicker.render({ //无初始色值时
			  elem: that
			  ,alpha: true
			  ,color: $(that).attr('data-color')
			  ,format: 'rgb'
				,change: function(color){
					$(that).prev('[name="bgcolor"]').css({"backgroundColor": color})
					$(that).attr('data-color',color)
				}
				,done: function(color){
					$(that).attr('data-color',color)
				}
			});
		})
	},
	//预警值设置-字符拼接
	earlyWarning : function(filed){
		var self = this;
		var relationship = ['=','>','<','>=','<=','[]', '≠' , 'Empty'];
		var relaOption = "";
				relationship.forEach(function(t){relaOption += '<option value="'+t+'">'+t+'</option>';})
			var lengthRow = new Date().getTime();
			var template = $(['<div class="layui-row"><div class="layui-inline"><div name="field" data-value="'+(filed?filed : "")+'" class="xm-select-filed">' , 
			'</div></div><div class="layui-inline selectminwidth"><select name="rel" lay-filter="relaOption" class="layui-select"><option></option>'+relaOption+'</select></div>',
			'<div class="layui-inline "><input type="text" name="value" placeholder="min" class="layui-input"/></div>',
			'<span class="layer_linksvalue layui-inline">-</span>',
			'<div class="layui-inline layer_linksvalue"><input type="text" placeholder="max" name="value1" class="layui-input"/></div>',
			'<div class="layui-inline">文字颜色:<div class="colorpicker"></div></div>',
			'<div class="layui-inline">背景颜色:<div class="bgcolorpicker"></div></div> ',
			'<div class="layui-inline" style="vertical-align: top;">',
			' <input type="radio" name="trtd_'+lengthRow+'" value="格" title="格">',
			' <input type="radio" name="trtd_'+lengthRow+'" value="行" title="行">',
			' <input type="radio" name="trtd_'+lengthRow+'" value="列" title="列">',
			'</div> <div class="layui-inline layui-icon layui-icon-delete delete" style="font-size: 25px; cursor: pointer;"></div></div>'].join(''));
			
			var element = template.find('.xm-select-filed')[0];
			xmSelect.render({
				el: element, 
				model: { label: { type: 'text' } },
				radio: true,
				clickClose: true,
				toolbar:{
					show: true,
				},
				filterable: true,
				height: '500px',
				paging: true,
				pageSize: 5,
				data:function(){ 
					return self.xmSelectData(filed);
				},
				on:function(data){
					if(data.arr.length){
						$(element).attr('data-value', data.arr[0]['value']);
					}else{
						$(element).attr('data-value', '');
					}
				}
			});
			$('#colsWarning .layui-list').append(template) ;
	},
	//单表头-不分类-拖拽排序
	colsOggMove:function(){ 
		var container = $("#colsform").children('.layui-row')[0];
		new Sortable(container, { group: 'shared', animation: 150,})
	},
	//指标分类拖拽
	colsFormMove:function(){ 	
		var container = document.getElementById("colsform");
		var sort = new Sortable(container, {
		  animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
		  handle: ".layui-colla-title", // Restricts sort start click/touch to the specified element
		  draggable: ".layui-colla-item", // Specifies which items inside the element should be sortable
		  onUpdate: function (evt/**Event*/){
		     var item = evt.item; // the current dragged HTMLElement
			}
		});
		sort.destroy();
		
		Sortable.create(container, {
			animation: 150,
			draggable: '.layui-colla-item',
			handle: '.layui-colla-title'
		});
	
		[].forEach.call(container.getElementsByClassName('spk-item'), function (el){
			Sortable.create(el, {
				group: {
					name: 'shared',
					pull: 'put',
					put: false // 不允许拖拽进这个列表
				},
				animation: 150
			});
		});
		
		
	},
	//指标cols根据数据排序
	colsSortIndex:function(){
		//类型排序
		if(currentScheme['content']['classType'].length){
			tableConfig['classType'] = currentScheme['content']['classType']
		}
		//千分位
		// if(currentScheme['content']['basics']["format"] != '' && currentScheme['content']['basics']["format"] != undefined && currentScheme['content']['basics']["format"] != null){
		// 	var format = currentScheme['content']['basics']["format"];
		// 	tableConfig['cols'].map(function(row){
		// 		row.map(function(item){
		// 			if(item['title'] && format.split(',').indexOf(item['field']) != -1){
		// 				item['format'] = true; //千分位
		// 			}else{
		// 				if(item['format'])item['format'] = false;//取消千分位
		// 			}
		// 			return item;
		// 		})
		// 	})
		// };
		// 单元格样式
		if(currentScheme['content']['basics']["tdStyle"].length){
			tableConfig['cols'].map(function(row){
				row.map(function(item){
					currentScheme['content']['basics']["tdStyle"].forEach(function(style){
						if(style['name'] == item['field']){
							item['style'] = style['value'];
						}
						return item;
					})
				})
			})
		};
		//单表头-排序/显示隐藏
		if(tableConfig['cols'].length == 1){
			var oneCols = [] , colsIndex = 0;
			tableConfig['cols'][0].forEach(function(col,index, all){
				if(col['field'] != undefined){
					if(col['field'] == currentScheme['content']['cols'][colsIndex]['field']){
						col['hide'] = currentScheme['content']['cols'][colsIndex]['hide'];
						oneCols.push(col)
					}else{
						oneCols.push(all.filter(function(v){ 
							if(v['field'] == currentScheme['content']['cols'][colsIndex]['field']){
							v['hide'] = currentScheme['content']['cols'][colsIndex]['hide']; return v; 
							}
						})[0]);
					}
					colsIndex++;
				}else{
					oneCols.push(col)
				}
			});
			tableConfig['cols'][0] = oneCols;
		}else{
			//多表头只支持显示隐藏列
			tableConfig['cols'].forEach(function(row){
				row.forEach(function(item){
					var itemCols = currentScheme['content']['cols'].filter(function(v){ if(item['field'] == v['field'])return v; })
					if(itemCols.length){
						item['hide'] = itemCols[0]['hide'];
					}
				})
			});
		};
	},
	// 功能添加-回显
	colsformEvent : function(layero) {
		var that = this;
		//单表头才可以拖拽排序(分类,不分类)
		if(tableConfig['cols'].length == 1){
			if(Array.isArray(tableConfig['classType']) && tableConfig['classType'].length){ 
				this.colsFormMove();//拖拽
				that.setcheckboxAll();//全选取消选中
			}else{ 
				that.colsOggMove(); //拖拽
			}
		};
		//指标选中
		form.on('checkbox(LAY_TABLE_TOOL_COLS)',function(res){
			that.allCheckbox(this);//全选取消选中
		})
		//全选
		form.on('checkbox(LAY_TABLE_TOOL_allList)',function(res){
			//分类指标的全选
			 if($(this).parents('.layui-card-header').length){
				$(this).parents('.layui-colla-content').find('.spk-item .fieldIndex').each(function(i){
					$(this).find('[type="checkbox"]').prop('checked',res.elem.checked);
				});
			 }else{
			 	//复杂表头和不分类的单表头全选
			 	$(this).parents('#colsform').children('.layui-row').find('.fieldIndex').each(function(i){
			 		$(this).find('[type="checkbox"]').prop('checked',res.elem.checked);
			 	});
			 }
			form.render()
		})
		//预警条件下拉操作-联动
		form.on('select(relaOption)',function(data){
			if(data.value == '[]'){
				$(this).parents('.layui-row').find('.layer_linksvalue').css({ 'display':'inline-block' });
				$(this).parents('.layui-row').find('[name="value"]').css("width",'60px')
			}else if(data.value == 'Empty'){
					$(this).parents('.layui-row').find('[name="value"],[name="value1"]').val('')
					$(this).parents('.layui-row').find('[name="value"]').hide();
					$(this).parents('.layui-row').find('.linksvalue').hide();
			}else{
					$(this).parents('.layui-row').find('[name="value1"]').val('')
				$(this).parents('.layui-row').find('[name="value"]').css({ "width":'160px', 'display':'inline-block' })
				$(this).parents('.layui-row').find('.layer_linksvalue').hide();
			}
		})
		
	},
	//全选反选
	allCheckbox(self){
		var checkbox = $(self).parents('.layui-colla-item').find('.fieldIndex').find('[type="checkbox"]').length,
			checked =$(self).parents('.layui-colla-item').find('.fieldIndex').find('[type="checkbox"]:checked').length;
		//只针对分类的表格
		if(checkbox == checked){
			$(self).parents('.layui-colla-item').find('.layui-form-item').find('[type="checkbox"]').prop('checked',true);
		}else{
			$(self).parents('.layui-colla-item').find('.layui-form-item').find('[type="checkbox"]').prop('checked',false);
		}
		form.render()
	},
	//全选-回显
	setcheckboxAll:function(res){	
		var checked = [], allList = null;
		//分类全选
		$('#colsform').find('.layui-colla-content').each(function(index,obj){
			checked = [];
			allList = $(this).children('.layui-form-item').find('[name ^= "allList"]');
				$(obj).find('.fieldIndex').each(function(i){
					if($(this).find('[type="checkbox"]').is(':checked') == false){
						allList.prop('checked',false);
					}else{
						checked.push($(this).find('[type="checkbox"]').is(':checked'));
					}
				});
			if(checked.length == $(obj).find('.fieldIndex').length){
				allList.prop('checked',true);
			}
		})
	},
	// 预警页面的字符拼接
	setupwarning : function(){
		return ['<form class="layui-form" style="margin:10px;" lay-filter="colsWarning"><div id="colsWarning" class="layui-form-item"><div style="margin-bottom: 0;">',
			'<b style="margin-right:10px;">指标设置预警</b>',
			'<button type="button" class="addWarningRow layui-btn layui-btn-xs">+增加指标</button></div>',
			'<div class="layui-list"></div></div></form>'].join('');
	},
//基础条件
	basicsPage: function(){
		/*'<!-- div class="format layui-card"><div class="layui-card-header">添加千分位列 </div>',
		'<div class="layui-card-body"><div class="layui-form-item formatList"><label class="layui-form-label">千分位</label><div name="format" id="format_xm_select" class="layui-input-block"></div></div></div></div-->',*/
		return ['<form class="layui-form layui-form-pane" lay-filter="basicsSettings"><div style="margin:10px;" id="basicsSettings">',
			
		'<div class="tdStyle"><div class="layui-form-item">添加单元格样式 <button type="button" class="layui-btn layui-btn-xs" id="tdStyle_add">添加</button>&nbsp;<button type="button" id="tdStyle_del" class="layui-btn layui-btn-xs layui-btn-warm">删除</button></div><div class="layui-form-item">',
		'<div class="layui-row tdStyleList"></div>','</div></div></div></form>'].join('')
	},
	formatSelect :function(filed){
		xmSelect.render({
			el: '#format_xm_select', 
			model: { label: { type: 'text' } },
			toolbar: {show: true},
			clickClose: false,
			filterable: true,
			height: '500px',
			paging: true,
			pageSize: 5,
			data:function(){
				var data = []
				filed && $('#format_xm_select').attr('data-value',filed);
				tableConfig['cols'].forEach(function(item){
					item.forEach(function(col){
						if(filed && filed.indexOf(col.field) != -1){
							data.push({ name: col.title, value:col.field , selected: true})
						}else{
							data.push({ name: col.title, value:col.field })
						};
					})
				})
				return data
			},
			on: function(data){
				var value = [];
				if(data.arr.length){
					data.arr.forEach(function(v){ 	value.push(v['value']); })
				
					$('#format_xm_select').attr('data-value', value.join(','));
				}else{
					$('#format_xm_select').attr('data-value', '');
				}
			}
		});
	},
	//添加设置单元格样式
	basiceStyle: function(filed){
		var self = this;
		var tdstyle = $('<div class="layui-row" style="margin:10px;"><div class="layui-inline"><label class="layui-form-label">单元格样式</label><div class="layui-input-inline tdStyleSelect" data-value="'+(filed?filed:'')+'"></div></div><div class="layui-block"><input type="text" name="tdStyle" class="layui-input" placeholder="color:red;"/></div></div>');
		var element = tdstyle.find('.tdStyleSelect')[0];
			xmSelect.render({
				el: element, 
				model: { label: { type: 'text' } },
				radio: true,
				clickClose: true,
				filterable: true,
				height: '500px',
				paging: true,
				pageSize: 5,
				data:function(){ 
					return self.xmSelectData(filed);
				},
				on: function(data){
					if(data.arr.length){
						$(element).attr('data-value', data.arr[0]['value']);
					}else{
						$(element).attr('data-value', '');
					}
				}
			});
		$('.tdStyleList').append(tdstyle);
		form.render();
	},
	alertTab(colsForm){
		var that = this ,
		 warning = this.setupwarning(),
		 basicsPage = this.basicsPage();
		layer.tab({
			id: 'layer_setTable',
			area: ['90%', '90%'],
			tab: [{
				title: '筛选列', 
				content: colsForm
			}, {
				title: '预警设置', 
				content: warning
			}, {
				title: '基础设置', 
				content: basicsPage
			}],
			resize : true,
			btn:["确定","取消"],
			yes:function(i,layero){
				that.getColsTabWhere(function(){
					
					//获取显示隐藏列
					that.reload();// 重载
					
					if(sessionStorage.getItem('tipSave') == null || sessionStorage.getItem('tipSave') == 'false'){
						layer.open({
							title: '保存/修改当前设置',
							content: '<input type="text" id="schemeName" class="layui-input" placeholder="请设置方案名">',
							success: function(layero){
								currentScheme['name'] && $(layero).find('#schemeName').val(currentScheme['name']);
							},
							yes:function(i,layero){
								var tableId = (currentScheme['tableId'] ? currentScheme['tableId'] : (tableConfig['elem'].substring(1) + '_'+(tableConfig['id'] ? tableConfig['id'] : tableConfig['elem'].substring(1))));
								 layui.schemePost.add({
								 	'id': (currentScheme['id'] ? currentScheme['id'] : ''),
								 	'tableId': tableId,
								 	'name' : $(layero).find('#schemeName').val(),
								 	'content' : JSON.stringify(currentScheme['content'])
								 },function(){
								 	layer.closeAll();
								 })
							}
						});
					}else{
						layer.closeAll();
					}
					
				});
			},
			success:function(layero){
				var checkedTip = (sessionStorage.getItem('tipSave') =='true' ?'checked':'');
				var tipsave = $('<form class="layui-form" style="position:absolute;left:10px;bottom:18px;"><lable class="layui-inline"><input type="checkbox" lay-skin="primary" lay-filter="tipSave" title="不保存" name="tipSave" '+checkedTip+'/></lable></form>');
				
				$(layero).find('.layui-layer-btn').css({    
					'border-top': '1px solid rgb(193, 193, 193)',
					'box-shadow': '0px -1px 2px 0px #eee',
				}).append(tipsave);
				form.on('checkbox(tipSave)',function(res){
					(res.elem.checked ? sessionStorage.setItem('tipSave','true'):sessionStorage.setItem('tipSave','false'))
				});
				
				$(layero).find('.layui-layer-title span').click(function(){
					 
					form.render()
					element.render();
				})
				//拖拽指标排序
				that.colsformEvent(layero)
				
				//预警tab内的事件
				that.warningEvent();
				form.render();
				element.render();
			}
		}); 
	},
	getColsTabWhere:function(callback){
		var attrCols = [], colsType = [] ;
		 currentScheme['content']['cols'] = [];
		//修改分类顺序
		if($("#colsform").find('span.type').length){
			$("#colsform").find('span.type').each(function(){
				colsType.push($(this).text())
			});
			
			tableConfig['classType'] = colsType;
			currentScheme['content']['classType'] = colsType;//指标分类
		}
		//修改指标顺序--------------------------------未知复杂表头是否正常--------------------------------
		
		$("#colsform").find('.fieldIndex').each(function(){
			var field = $(this).attr('id');
				attrCols.push({"field" : field ,'hide': !$(this).find('input').is(':checked') });
		});
		
		currentScheme['content']['cols'] = attrCols;//保存集合里
		
	//指标分类
		if(tableConfig['classType'].length){
			tableConfig['classType'] = currentScheme['content']['classType'];
		};
	//------------------------------------------------end---------------------------------
	//预警条件获取-赋值
		var warningThis = [];
		var warningObj = $("#colsWarning").find('.layui-list');
		if(warningObj.find('.layui-row').length){
			warningObj.find('.layui-row').each(function(i,item){
				warningThis.push({
					field: $(this).find('[name="field"]').attr('data-value'),
					rel: $(this).find('[name="rel"]').val(),
					value: $(this).find('[name="value"]').val(),
					value1: $(this).find('[name="value1"]').val(),
					color: $(this).find('.colorpicker').attr('data-color'),
					bgcolor: $(this).find('.bgcolorpicker').attr('data-color'),
					trtd : $(this).find('[name^="trtd_"]:checked').val()
				});
			});
			currentScheme['content']['where'] = warningThis; //用于保存预警
		};
		//千分位设置
		// var formatList = $('#format_xm_select').attr('data-value');
		// if(formatList){
		// 	currentScheme['content']['basics']['format'] = formatList;
		// }
		
		//单元格样式设置--获取
		var tdstyleList = $(".tdStyle .tdStyleList"), tdstyleAttay = [];
		if(tdstyleList.find('.layui-row').length){
			tdstyleList.find('.layui-row').each(function(){
				tdstyleAttay.push({"name": $(this).find('.tdStyleSelect').attr('data-value'), "value": $(this).find('[name="tdStyle"]').val()})
			});
			currentScheme['content']['basics']['tdStyle'] = tdstyleAttay;
		};
		
		//获取并设置基础条件 / 单元格提示, 不参与排序行(默认放在第一条)
		console.log('currentScheme:',currentScheme)
		callback && callback();
	},
	
	//指标预警多选分类
	xmSelectData:function(checked){
		var list = [];
		if(tableConfig['classType']){
			//分类
			tableConfig['classType'].forEach( (p,index)=>{
				list.push({ name: p, children:[]});
			})
			
			tableConfig['cols'].forEach(function(item){
				item.forEach(function(col){
						var select = list.filter(function(v){if(v['name']==col['classItem']) return v; })
						if(select.length){
							if(checked == col.field){
								select[0]['children'].push({ name: col.title, value:col.field , selected: true})
							}else{
								select[0]['children'].push({ name: col.title, value:col.field })
							};
						};
					})
			});
		}else{
			tableConfig['cols'].forEach(function(item){
				item.forEach(function(col){
					if(checked == col.field){
						list.push({ name: col.title, value:col.field , selected: true})
					}else{
						list.push({ name: col.title, value:col.field })
					};
				})
			})
		}
		return list;
	},
	},
	
	//根据url 请求到cols 和data 数据
	colsData = function(config){
		this.config = config;
		this.ajax();
	},
	colsData.prototype.ajax = function(){
		var loadingindex = layer.load(2,{
			shadeClose: false,
			title: '加载中..',
			shade: [0.8,'#fff']
		}), self = this;
		// 显示加载中状态
		$.ajax({
			type: 'post',
			async : false,
			url : this.config.url,
			data : this.config.whereData ?  this.config.whereData : {},
			beforeSend : function(){
			},
			success : function(res){
				self.setupTableData(res);
			},
			error :function(xml ,josn){
				layer.msg("请求失败!")
				console.log('报错');
			},
			complete : function(){
				// 关闭加载中状态
				layer.close(loadingindex);
			}
		});
	},
	colsData.prototype.setupTableData = function(data){
		//如果使用方案--有表头, 就使用已经存在的表头
		this.setcols(data[0]); //默认为单表头
		
		this.tableData(data); //数据格式
		
	},
	colsData.prototype.tableData = function(data){
		var dataList = [];//表格数据
		if(data.length > 1){
			data.forEach(function(item){
				var json = {};
				item.forEach(function(val,i){
					json['id'+i] = (!Number(val) ? val : ( val.split('')[0] == '0' ? val : parseFloat(val)));
				})
				dataList.push( json );
			});
			dataList.shift();//删除数据的第一行(默认为表头)
		}
		delete this.config['url'];
		this.config['data'] = dataList;
	},
	colsData.prototype.setcols = function(array){
		var cols = [], obj = this.config , classType = [];
		var cosrow = {} , addEventItem = [];
		/*数据要指标分类就都分类,要么就都不分类"分类名称_指标名称&关联指标&CY" (CY = 默认隐藏列)
		 * */
		cols.push(array.map(function(val , i , all){
			if(val.indexOf("_") != -1){
				if(classType.indexOf(val.split("_")[0]) == -1){
					classType.push(val.split("_")[0])
				}
				cosrow = { field : 'id' + i , title : val.split("_")[1].split('&')[0],format:(obj.format == null||obj.format == undefined || obj.format == true? true : false) , classItem :val.split("_")[0]  , name : val.split("_")[1] };
				addEventItem = all.filter(function (v) { 
					if(v.split('_')[1] && v.split('_')[1].split('&')[1] && v.split('_')[1].split('&')[1] == val.split('_')[1] && val.split('_')[1] != v.split('_')[1]){
						return true
					}
					return false
					
				} );
			}else{
				cosrow = { field : 'id' + i , title : val.split('&')[0], format:true , classItem :val  , name : val };
				addEventItem = all.filter(function (v) { return v.split('&')[1] && v.split('&')[1] == val && val != v} );
			}
			//隐藏为0的列
			val.indexOf('CY') != -1 && (cosrow['hide'] = true);
			if(i >= 3){ cosrow['sort'] = true; }//除了第一列,其他都加排序
			//固定列
			if(obj['fiexd'] && obj['fiexd']['left'] >= i){ cosrow['fixed'] = 'left'; }
			if(obj['fiexd'] && obj['fiexd']['right'] >= (all.length - i)){ cosrow['fixed'] = 'right'; }
			if(obj['fiexd'] && parseFloat(obj['fiexd']['width'])){ cosrow['width'] = obj['fiexd']['width']; }
			
			//添加event 事件
			if( addEventItem.length ){
				cosrow['event'] = cosrow['field'];
				cosrow['style'] = 'color:blue;'
			}
			if(obj.col instanceof Array){ //选择第几列对齐方向
				 for(item in obj.col){
					if( Number(obj.col[item]) == i ){
						cosrow['align'] = 'left'; 
					}else if(i == item['col']){
						cosrow['align'] = item['align'];
					}
				 }
			};
			return cosrow;
		}));
		this.config['classType'] = classType;//分类
		this.config['cols'] = cols;
	},
	
	//-----------------------------------------------------------------------------------
	//参数处理--公共参数
	whereData = function(config){
		this.config = config;
		this.config.setDate && this.setDate();
		
		return this.config;
	},
	whereData.prototype.setDate = function(){
		if(this.config.setDate){ //需要传时间参数
			if(!this.config.whereData) this.config.whereData = {};
			var data = {  
					"CONDITION_year" : this.config.setDate.split('-')[0] , //年
					"CONDITION_month" : this.config.setDate.split('-')[1],// 月
					"CONDITION_sDate" : this.config.setDate.split('-')[0] +this.config.setDate.split('-')[1],//年月
					"CONDITION_eDate" : this.config.setDate.split(' - ')[1].split('-')[0] + this.config.setDate.split(' - ')[1].split('-')[1],//结束年月
					"CONDITION_startDate" : this.config.setDate.split(' - ')[0], //开始时间
					"CONDITION_endDate" : this.config.setDate.split(' - ')[1] //结束时间
				};
			for(t in data){
				this.config.whereData[t] = data[t];
			}
		};
	}
	
	//样式添加#layer_setTable{ background-color: #F3F3F3; }
	addStyle()
	function addStyle(){
		var style = document.createElement("style");
		var cssSetupTable = [ "#scheme_list{padding: 10px; box-sizing: border-box;}#colsform .layui-form-item .layui-inline{ width: 120px;}#colsform .layui-card-header .layui-inline {vertical-align: bottom;}",
		  "#colsform .layui-form-item .layui-inline::after{ content: ''; 	display: inline-block; clear: both; }",
			'#colsWarning .selectminwidth{width: 120px;}#basicsSettings .tdStyleSelect{width: 145px;}',
			'#colsWarning [name="value"]{ width:160px; }',
			'#colsWarning [name="value1"]{ width: 60px; }',
			'#colsWarning .layer_linksvalue{display: none;}',
			'#colsWarning .xm-select-filed{width: 160px;}',
			'.spk-menuList{ padding: 5px;margin-right: 4px;border: 1px solid greenyellow;border-radius: 5px; }',
			'.meun-close{ border-radius: 2px;padding: 2px;cursor: pointer; }',
			'.meun-close:hover{background-color: #FFB800;color: #fff;}'].join('');
		style.type = "text/css";
		style.id = "setUp_Table_Style";
		try{
		　　style.appendChild(document.createTextNode(cssSetupTable));
		}catch(ex){
		　　style.styleSheet.cssText = cssSetupTable;//针对IE
		}
		var loadStyle_setup = $(document).find('#setUp_Table_Style').length;
		if(!loadStyle_setup){
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(style);
		}
	};	
	
	exports('setupTable',setupTable);
})