/*
 @name:  表格增强插件-本插件仅仅针对朝阳"门急诊指标汇总"的表格数据进行操作
 * @author: byb
 * @license: Spk
 * @version: v1.6.2
 * soulTable.render(this)先引入在done加载
 * 
 * setUpTable.render(myTable);//打开设置页面
 * soulTable.export(myTable,{  filename: '包含表单元素.xlsx'  })
 * table 添加属性
 * ,drag: false // 关闭拖拽列功能
 * ,overflow: 'tips'
 * sortDone 排序后加载
 * format : off千分位(加指标对象里)
 * noSortRow : 2 //第几行不参与排序
 * classType: ['lc1','lc2'] //分类表头指标内是classItem
*/
layui.define(["table","layer","element","form",'colorpicker','schemePost'],function(exports){
	$ = layui.$,
	table = layui.table,
	layer = layui.layer,
	colorpicker = layui.colorpicker,
	form = layui.form,
	element = layui.element,
	menuList = [],
	tableConfig = {},
	originCols = {
		cols:[],//指标排序和显示隐藏
		classType :[],//指标分类,针对单表头
		where: [], //{}预警条件
		basics: [],//基本设置basicsSettings
	},//当前方案
	currentScheme = {'table_Id':'','name':''},
	defaultConfig = {};
	mod = {
		//方案列表弹窗
		menu:function(e){
			var that = this;
			
			var tableId = (currentScheme['table_Id'] ? currentScheme['table_Id'] : (tableConfig['config']['elem']['selector'] + '_'+tableConfig['config']['id']));
			var schemeStrList = '';
				///layui.schemePost.query(tableId,function(res){
					menuList = []//res['data'];
					schemeStrList = '<form class="layui-form">';
					menuList.forEach(function(item){
						schemeStrList += '<div class="layui-inline spk-menuList"><input type="radio" lay-filter="menuList" name="menuList" value="'+item['id']+'" title="'+item['name']+'"/><i class="layui-icon layui-icon-close meun-close layui-unselect layui-tab-close" style="vertical-align: text-top;"></i></div>'
					});
					schemeStrList += '</form>';
					that.loadScheme(schemeStrList);
				//});
		},
		init: function(){
			var that = this;
			this.colsSortIndex();
			tableConfig.config.sortDone = function(){
				that.tableRanderRowWarning();//单元格条件设置
			}
			//获取显示隐藏列
			tableConfig.reload(tableConfig);// 重载
		},
		//打开设置弹窗
		render: function(e) {
			var that = this;
			if(JSON.stringify(tableConfig) == '{}'){
				tableConfig = $.extend({}, defaultConfig, e);
			}
			
			that.menu();
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
								return all.splice(i,1)
							}
						});
						//删除当前已选中的方案时清空数据
						if(currentScheme['id'] == spk_schemId){ currentScheme = {},originCols = {'cols':[],'classType':[],'where':[]} };
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
							'table_Id':checked_schem[0]['tableId'],
							'name':checked_schem[0]['name']
						}
						originCols = JSON.parse( checked_schem[0]['content']);//当前方案
						that.init();//根据条件重载
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
							'table_Id':checked_schem[0]['tableId'],
							'name':checked_schem[0]['name']
						}
						originCols = JSON.parse( checked_schem[0]['content']);//当前方案
						//修改
						var indexform = that.strCols(tableConfig.config);
						that.alertTab(indexform);
					}else{
						layer.msg('请选择要 <b> 修改 </b> 的方案!!');
						return false
					}
				},
				btn3: function(i, layero){
					//新增
					var tableId = (tableConfig['config']['elem']['selector'] + '_'+tableConfig['config']['id']);
						currentScheme = {
							'id':'',
							'table_Id':tableId,
							'name':''
						}
						originCols = {'cols':[],'classType':[],'where':[]};//创建新的方案去除变量数据
						//修改
						var indexform = that.strCols(tableConfig.config);
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
			if(originCols['where'] && originCols['where'].length){
				originCols['where'].forEach(function(item){
					that.colTemplet(tableConfig['config']['id'] , item);
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
						if($(this).text().trim() == item['value']){
							tdtrset(this , item);
						}
					})
				break;
				case '>':
					$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
						if($(this).text().trim() > item['value']){
							tdtrset(this , item);
						}
					})
				break;
				case '<':
					$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
						if($(this).text().trim() < item['value']){
							tdtrset(this , item);
						}
					})
				break;
				case '>=':
					$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
						if($(this).text().trim() >= item['value']){
							tdtrset(this , item);
							}
					})
				break;
				case '<=':
					$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
						if($(this).text().trim() <= item['value']){
							tdtrset(this , item);
						}
					})
				break;
				case '[]':
					$('[lay-id="'+elem+'"]').find('[data-field="'+item['field']+'"]').each(function(){
						if( parseFloat(item['value']) <= parseFloat($(this).text().trim()) && parseFloat(item['value1']) >= parseFloat($(this).text().trim())){
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
				if(cols.length == 1 && Array.isArray(type)){
					cols.forEach(function(item) {
						type.forEach( (p,index)=>{
							colslist.push('<div class="layui-card"><div class="layui-card-header"><div class="layui-inline"><input type="checkbox" lay-filter="LAY_TABLE_TOOL_allList" lay-skin="primary" name="allList'+index+'" title="全选"></div>类型<span class="type">'+p+'</span></div><div class="layui-card-body">')
							item.filter(function(v){if(v['classItem']==p) return v; }).forEach(function(i){
								if(i.field){
									originCols['cols'].push({ field: i.field, hide:(i.hide?i.hide:false) })
									colslist.push('<div class="layui-inline fieldIndex" id="' + i.field + '"><input type="checkbox" name="' + i.field + '" data-key="' + i.key + '" data-parentkey="' + (i.parentKey || "") + '" lay-skin="primary" ' + (i.hide ? "": "checked") + ' title="' + (i.title || i.field) + '" lay-filter="LAY_TABLE_TOOL_COLS"></div>')
								}
							})
							colslist.push('</div></div>')
						})
					})
					}else{
						//多表头
						colslist = ['<div class="layui-form-item"><div class="layui-inline"><input type="checkbox" lay-filter="LAY_TABLE_TOOL_allList" lay-skin="primary" name="allList" title="全选"></div></div>']
							cols.forEach(function(item) {
								item.forEach(function(i){
									if(i.field){
										originCols['cols'].push({ field: i.field, hide:(i.hide?i.hide:false) })
										colslist.push('<div class="layui-inline fieldIndex" id="' + i.field + '"><input type="checkbox" name="' + i.field + '" data-key="' + i.key + '" data-parentkey="' + (i.parentKey || "") + '" lay-skin="primary" ' + (i.hide ? "": "checked") + ' title="' + (i.title || i.field) + '" lay-filter="LAY_TABLE_TOOL_COLS"></div>')
									}
								})
							})
					}
				return '<form class="layui-form" lay-filter="colsform"><div id="colsform" class="layui-form-item" style="margin:10px;">'+colslist.join('')+'</div></form>'
			}(e.cols);
		
		},
		//预警tab增加预警指标-删除-创建tab
		warningEvent :function(){
			var that = this;
				//预警值回显设置
			if(originCols['where'].length){
				var tabItemeq = null;
				originCols['where'].forEach(function(warning,index){
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
			
		},
		colorpickerEvent:function(row){
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
						// $(that).attr('data-color',color)
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
						// $(that).attr('data-color',color)
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
				var template = $(['<div class="layui-row"><div class="layui-inline"><div name="field" class="xm-select-filed">' , 
				'</div></div><div class="layui-inline selectminwidth"><select name="rel" lay-filter="relaOption" class="layui-select"><option></option>'+relaOption+'</select></div>',
				'<div class="layui-inline "><input type="text" name="value" class="layui-input"/></div>',
				'<span class="layer_linksvalue layui-inline">&</span>',
				'<div class="layui-inline layer_linksvalue"><input type="text" name="value1" class="layui-input"/></div>',
				'<div class="layui-inline">文字颜色:<div class="colorpicker"></div></div>',
				'<div class="layui-inline">背景颜色:<div class="bgcolorpicker"></div></div> ',
				'<div class="layui-inline" style="vertical-align: top;">',
				' <input type="radio" name="trtd_'+lengthRow+'" value="格" title="格">',
				' <input type="radio" name="trtd_'+lengthRow+'" value="行" title="行">',
				' <input type="radio" name="trtd_'+lengthRow+'" value="列" title="列">',
				'</div> <div class="layui-inline layui-icon layui-icon-delete delete" style="font-size: 25px; cursor: pointer;"></div></div>'].join(''));
				var element = template.find('.xm-select-filed')[0]
				xmSelect.render({
					el: element, 
					model: { label: { type: 'text' } },
					radio: true,
					clickClose: true,
					// toolbar:{
					// 	show: true,
					// },
					filterable: true,
					height: '500px',
					paging: true,
					pageSize: 5,
					data:function(){ 
						return self.xmSelectData(filed);
					}
				});
				$('#colsWarning .layui-list').append(template) ;
		},
		//单表头-不分类-拖拽排序
		colsOggMove:function(){ 
			var container = document.getElementById("colsform");
			new Sortable(container, { group: 'shared', animation: 150,})
		},
		//指标分类拖拽
		colsFormMove:function(){ 	
			var container = document.getElementById("colsform");
			var sort = new Sortable(container, {
			  animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
			  handle: ".layui-card-header", // Restricts sort start click/touch to the specified element
			  draggable: ".layui-card", // Specifies which items inside the element should be sortable
			  onUpdate: function (evt/**Event*/){
			     var item = evt.item; // the current dragged HTMLElement
				}
			});
			sort.destroy();
			
			Sortable.create(container, {
				animation: 150,
				draggable: '.layui-card',
				handle: '.layui-card-header'
			});
		
			[].forEach.call(container.getElementsByClassName('layui-card-body'), function (el){
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
			if(originCols['classType'].length){
				tableConfig['config']['classType'] = originCols['classType']
			}
			//单表头
			if(tableConfig['config']['cols'].length == 1){
				var oneCols = [] , colsIndex = 0;
				tableConfig['config']['cols'][0].forEach(function(col,index, all){
					if(col['field'] != undefined){
						if(col['field'] == originCols['cols'][colsIndex]['field']){
							col['hide'] = originCols['cols'][colsIndex]['hide'];
							oneCols.push(col)
						}else{
							oneCols.push(all.filter(function(v){ if(v['field'] == originCols['cols'][colsIndex]['field']){v['hide'] = originCols['cols'][colsIndex]['hide']; return v; } })[0]);
						}
						colsIndex++;
					}else{
						oneCols.push(col)
					}
				});
				tableConfig['config']['cols'][0] = oneCols;
			}else{
				//多表头只支持显示隐藏列
				tableConfig['config']['cols'].forEach(function(row){
					row.forEach(function(item){
						var itemCols = originCols['cols'].filter(function(v){ if(item['field'] == v['field'])return v; })
						if(itemCols.length){
							item['hide'] = itemCols[0]['hide'];
						}
					})
				});
			};
		},
		//获取设置的指标和预警条件和基础条件--之后进行加载渲染
		getColsTabWhere:function(callback){
			var attrCols = [], colsType = [] ;
			 originCols['cols'] = [];
			//修改分类顺序
			if($("#colsform").find('span.type').length){
				$("#colsform").find('span.type').each(function(){
					colsType.push($(this).text())
				});
				
				tableConfig['config']['classType'] = colsType;
				originCols['classType'] = colsType;//指标分类
			}
			//修改指标顺序--------------------------------未知复杂表头是否正常--------------------------------
			
			$("#colsform").find('.fieldIndex').each(function(){
				var field = $(this).attr('id');
					attrCols.push({"field" : field ,'hide': !$(this).find('input').is(':checked') });
			});
			originCols['cols'] = attrCols;//保存集合里
			//单表头
			if(tableConfig['config']['cols'].length == 1){
				var oneCols = [] , colsIndex = 0;
				tableConfig['config']['cols'][0].forEach(function(col,index, all){
					if(col['field'] != undefined){
						if(col['field'] == attrCols[colsIndex]['field']){
							col['hide'] = attrCols[colsIndex]['hide'];
							oneCols.push(col)
						}else{
							oneCols.push(all.filter(function(v){ if(v['field'] == attrCols[colsIndex]['field']){v['hide'] = attrCols[colsIndex]['hide']; return v; } })[0]);
						}
						colsIndex++;
					}else{
						oneCols.push(col)
					}
				});
				tableConfig.config['cols'][0] = oneCols;
			}else{
				//多表头只支持显示隐藏列
				tableConfig['config']['cols'].forEach(function(row){
					row.forEach(function(item){
						var itemCols = attrCols.filter(function(v){ if(item['field'] == v['field'])return v; })
						if(itemCols.length){
							item['hide'] = itemCols[0]['hide'];
						}
					})
				})
				
			};
		//指标分类
			if(originCols['classType'].length){
				tableConfig['config']['classType'] = originCols['classType'];
			};
		//------------------------------------------------end---------------------------------
		//预警条件获取-赋值
			var warningThis = [];
			var warningObj = $("#colsWarning").find('.layui-list');
			if(warningObj.find('.layui-row').length){
				
				var selectArr = xmSelect.batch(null, 'getValue', 'value');
					
				warningObj.find('.layui-row').each(function(i,item){
						warningThis.push({
							field: selectArr[i][0],
							rel: $(this).find('[name="rel"]').val(),
							value: $(this).find('[name="value"]').val(),
							value1: $(this).find('[name="value1"]').val(),
							color: $(this).find('.colorpicker').attr('data-color'),
							bgcolor: $(this).find('.bgcolorpicker').attr('data-color'),
							trtd : $(this).find('[name^="trtd_"]:checked').val()
						});
				});
				
				originCols['where'] = warningThis; //用于保存预警
			}
			//获取并设置基础条件 / 单元格提示, 不参与排序行(默认放在第一条)
				console.log('originCols:',originCols)
				callback && callback();
		},
		
		colsformEvent : function(layero) {
			var that = this;
			//单表头才可以拖拽排序(分类,不分类)
			if(tableConfig['config']['cols'].length == 1){
				if(Array.isArray(tableConfig['config']['classType'])){ 
					this.colsFormMove();
					that.setcheckboxAll();//全选取消选中
				}else{ 
					this.colsOggMove(); 
				}
			};
			//指标选中
			form.on('checkbox(LAY_TABLE_TOOL_COLS)',function(res){
				that.setcheckboxAll(res);//全选取消选中
			})
			//全选
			form.on('checkbox(LAY_TABLE_TOOL_allList)',function(res){
				//分类指标的全选
				if($(this).parents('.layui-card-header').length){
					$(this).parents('.layui-card-header').next('.layui-card-body').find('.fieldIndex').each(function(i){
						$(this).find('[type="checkbox"]').prop('checked',res.elem.checked);
					});
				}else{
					//复杂表头和不分类的单表头全选
					$(this).parents('.layui-form-item').siblings('.fieldIndex').each(function(i){
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
		//全选
		setcheckboxAll:function(res){	
			var checked = [];
			var allformItem = $('#colsform').find('.layui-form-item');
			//单列全选
			if(allformItem.length){
				checked = [];
				$('#colsform').find('.fieldIndex').each(function(i){
					if($(this).find('[type="checkbox"]').is(':checked') == false){
						allformItem.find('[type="checkbox"]').prop('checked',false);
					}else{
						checked.push($(this).find('[type="checkbox"]').is(':checked'));
					}
					if(checked.length ==$('#colsform').find('.fieldIndex').length){
						allformItem.find('[type="checkbox"]').prop('checked',true);
					}
					form.render()
				});
			}else{
				//分类全选
				$('#colsform').find('.layui-card-body').each(function(index,obj){
					checked = [];
					var allList = $(this).parents('.layui-card').children('.layui-card-header').find('[name ^= "allList"]')
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
					form.render()
				})
			}
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
			return ['<form class="layui-form layui-form-pane" lay-filter="basicsSettings"><div style="margin:10px;" id="basicsSettings"><div class="layui-form-item">',
			'<div class="layui-inline"><label class="layui-form-label">不排序行</label><div class="layui-input-inline">',
			,'<input type="number" placeholder="输入行数" name="noSortRow" class="layui-input" lay-verify="number"/></div>',
			'<div class="layui-inline"><label class="layui-form-label">文本提示</label>',
			'<div class="layui-input-inline"><input type="checkbox" lay-skin="switch" lay-text="开|关" name="overflow"></div></div></div></div></form>'
			].join('')
		},
		alertTab(colsForm){
			var that = this ,
			 warning = this.setupwarning(),
			 basicsPage = this.basicsPage();
			layer.tab({
				id: 'layer_setTable',
				area: ['80%', '80%'],
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
						//排序后dom处理
						tableConfig.config.sortDone = function(){
							that.tableRanderRowWarning();//单元格条件设置
						}
						//获取显示隐藏列
							tableConfig.reload(tableConfig);// 重载
						if(sessionStorage.getItem('tipSave') == null || sessionStorage.getItem('tipSave') == 'false'){
							layer.open({
							  title: '保存/修改当前设置',
								content: '<input type="text" id="schemeName" class="layui-input" placeholder="请设置方案名">',
								success: function(layero){
									currentScheme['name'] && $(layero).find('#schemeName').val(currentScheme['name']);
								},
								yes:function(i,layero){
									var tableId = (currentScheme['table_Id'] ? currentScheme['table_Id'] : (tableConfig['config']['elem']['selector'] + '_'+tableConfig['config']['id']));
									layui.schemePost.add({
										'id': (currentScheme['id'] ? currentScheme['id'] : ''),
										'table_Id': tableId,
										'name' : $(layero).find('#schemeName').val(),
										'content' : JSON.stringify(originCols)
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
					var tipsave = $('<form class="layui-form" style="position:absolute;left:10px;bottom:18px;"><lable class="layui-inline"><input type="checkbox" lay-skin="primary" lay-filter="tipSave" title="不再提示保存" name="tipSave" '+checkedTip+'/></lable></form>');
					
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
				}
			}); 
		},
		//指标预警多选分类
		xmSelectData:function(checked){
			var list = [];
			if(tableConfig['config']['classType']){
				//分类
				tableConfig['config']['classType'].forEach( (p,index)=>{
					list.push({ name: p, children:[]});
				})
				
				tableConfig['config']['cols'].forEach(function(item){
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
				tableConfig['config']['cols'].forEach(function(item){
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

	}
	addStyle()
function addStyle(){
	var style = document.createElement("style");
	var cssSetupTable = [ "#scheme_list{padding: 10px; box-sizing: border-box;}#layer_setTable{ background-color: #F3F3F3; }#colsform .layui-form-item .layui-inline{ width: 120px;}#colsform .layui-card-header .layui-inline {vertical-align: bottom;}",
	  "#colsform .layui-form-item .layui-inline::after{ content: ''; 	display: inline-block; clear: both; }",
		'#colsWarning .selectminwidth{width: 120px;}',
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
	exports("setUpTable", mod)
});