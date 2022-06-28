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
	menuList = [{
		"id":"123456","tableId":"yxInfoList_yxInfoList","name":"方案1",
		"content":{
			"cols":[{"field":"id0","title":"出诊科室","classItem":"出诊","name":"出诊_出诊科室","fixed":"left","key":"0-0","hide":false,"type":"normal","width":0,"style":"text-decoration: underline;color:blue;"},{"field":"id1","title":"出诊单元数","classItem":"出诊","name":"出诊_出诊单元数","key":"0-1","hide":false,"type":"normal","width":0},{"field":"id2","title":"每单元诊疗人次","classItem":"人次","name":"人次_每单元诊疗人次","key":"0-2","hide":false,"type":"normal","width":0},{"field":"id3","title":"门急诊人次","classItem":"人次","name":"人次_门急诊人次","sort":true,"key":"0-3","hide":false,"type":"normal","width":0},{"field":"id4","title":"门诊人次","classItem":"人次","name":"人次_门诊人次","sort":true,"key":"0-4","hide":false,"type":"normal","width":0},{"field":"id5","title":"通医师门急诊人次","classItem":"人次","name":"人次_通医师门急诊人次","sort":true,"key":"0-5","hide":false,"type":"normal","width":0},{"field":"id6","title":"副主任医师门急诊人次","classItem":"人次","name":"人次_副主任医师门急诊人次","sort":true,"key":"0-6","hide":false,"type":"normal","width":0},{"field":"id7","title":"主任医师门急诊人次","classItem":"人次","name":"人次_主任医师门急诊人次","sort":true,"key":"0-7","hide":false,"type":"normal","width":0},{"field":"id8","title":"知名专家医师门急诊人次","classItem":"人次","name":"人次_知名专家医师门急诊人次","sort":true,"key":"0-8","hide":false,"type":"normal","width":0},{"field":"id9","title":"急诊人次","classItem":"人次","name":"人次_急诊人次","sort":true,"key":"0-9","hide":false,"type":"normal","width":0},{"field":"id10","title":"互联网诊疗服务人次","classItem":"人次","name":"人次_互联网诊疗服务人次","sort":true,"key":"0-10","hide":false,"type":"normal","width":0},{"field":"id11","title":"互联网诊疗服务人次占比%","classItem":"人次","name":"人次_互联网诊疗服务人次占比%","sort":true,"key":"0-11","hide":false,"type":"normal","width":0},{"field":"id12","title":"低配号门急诊人次","classItem":"人次","name":"人次_低配号门急诊人次","sort":true,"key":"0-12","hide":false,"type":"normal","width":0},{"field":"id13","title":"低配号人次占比%","classItem":"人次","name":"人次_低配号人次占比%","sort":true,"key":"0-13","hide":false,"type":"normal","width":0},{"field":"id14","title":"空挂号门急诊人次","classItem":"人次","name":"人次_空挂号门急诊人次","sort":true,"key":"0-14","hide":false,"type":"normal","width":0},{"field":"id15","title":"空挂号人次占比%","classItem":"人次","name":"人次_空挂号人次占比%","sort":true,"key":"0-15","hide":false,"type":"normal","width":0},{"field":"id16","title":"门急诊只开药人次","classItem":"开药人次","name":"开药人次_门急诊只开药人次","sort":true,"key":"0-16","hide":false,"type":"normal","width":0},{"field":"id17","title":"门急诊只开药人次占比%","classItem":"开药人次","name":"开药人次_门急诊只开药人次占比%","sort":true,"key":"0-17","hide":false,"type":"normal","width":0},{"field":"id18","title":"门诊只开药人次","classItem":"开药人次","name":"开药人次_门诊只开药人次","sort":true,"key":"0-18","hide":false,"type":"normal","width":0},{"field":"id19","title":"门诊只开药人次占比%","classItem":"开药人次","name":"开药人次_门诊只开药人次占比%","sort":true,"key":"0-19","hide":false,"type":"normal","width":0},{"field":"id20","title":"急诊只开药人次","classItem":"开药人次","name":"开药人次_急诊只开药人次","sort":true,"key":"0-20","hide":false,"type":"normal","width":0},{"field":"id21","title":"急诊只开药人次占比%","classItem":"开药人次","name":"开药人次_急诊只开药人次占比%","sort":true,"key":"0-21","hide":false,"type":"normal","width":0},{"field":"id22","title":"特需只开药人次","classItem":"开药人次","name":"开药人次_特需只开药人次","sort":true,"key":"0-22","hide":false,"type":"normal","width":0},{"field":"id23","title":"特需只开药人次占比%","classItem":"开药人次","name":"开药人次_特需只开药人次占比%","sort":true,"key":"0-23","hide":false,"type":"normal","width":0},{"field":"id24","title":"医保只开药人次","classItem":"开药人次","name":"开药人次_医保只开药人次","sort":true,"key":"0-24","hide":false,"type":"normal","width":0},{"field":"id25","title":"医保只开药人次占比%","classItem":"开药人次","name":"开药人次_医保只开药人次占比%","sort":true,"key":"0-25","hide":false,"type":"normal","width":0},{"field":"id26","title":"开住院预约单人数","classItem":"入院人数","name":"入院人数_开住院预约单人数","sort":true,"key":"0-26","hide":false,"type":"normal","width":0},{"field":"id27","title":"入院人数","classItem":"入院人数","name":"入院人数_入院人数","sort":true,"key":"0-27","hide":false,"type":"normal","width":0},{"field":"id28","title":"其中急诊入院人数","classItem":"入院人数","name":"入院人数_其中急诊入院人数","sort":true,"key":"0-28","hide":false,"type":"normal","width":0},{"field":"id29","title":"其中急诊入院人数占比%","classItem":"入院人数","name":"入院人数_其中急诊入院人数占比%","sort":true,"key":"0-29","hide":false,"type":"normal","width":0},{"field":"id30","title":"其中门诊入院人数","classItem":"入院人数","name":"入院人数_其中门诊入院人数","sort":true,"key":"0-30","hide":false,"type":"normal","width":0},{"field":"id31","title":"其中门诊入院人数占比%","classItem":"入院人数","name":"入院人数_其中门诊入院人数占比%","sort":true,"key":"0-31","hide":false,"type":"normal","width":0},{"field":"id32","title":"门急诊收入","classItem":"收入","name":"收入_门急诊收入","sort":true,"key":"0-32","hide":false,"type":"normal","width":0},{"field":"id33","title":"其中医疗服务收入","classItem":"收入","name":"收入_其中医疗服务收入","sort":true,"key":"0-33","hide":false,"type":"normal","width":0},{"field":"id34","title":"其中医疗服务收入占比%","classItem":"收入","name":"收入_其中医疗服务收入占比%&其中医疗服务收入&CY","hide":true,"sort":true,"key":"0-34","type":"normal"},{"field":"id35","title":"门急诊收入(不含药品材料)","classItem":"收入","name":"收入_门急诊收入(不含药品材料)","sort":true,"key":"0-35","hide":false,"type":"normal","width":0},{"field":"id36","title":"门急诊收入(不含药品材料)比例%","classItem":"收入","name":"收入_门急诊收入(不含药品材料)比例%&门急诊收入(不含药品材料)&CY","hide":true,"sort":true,"key":"0-36","type":"normal"},{"field":"id37","title":"门急诊收入(不含药品)","classItem":"收入","name":"收入_门急诊收入(不含药品)","sort":true,"key":"0-37","hide":false,"type":"normal","width":0},{"field":"id38","title":"门急诊收入(不含药品)比例%","classItem":"收入","name":"收入_门急诊收入(不含药品)比例%&门急诊收入(不含药品)&CY","hide":true,"sort":true,"key":"0-38","type":"normal"},{"field":"id39","title":"门急诊收入(不含材料)","classItem":"收入","name":"收入_门急诊收入(不含材料)","sort":true,"key":"0-39","hide":false,"type":"normal","width":0},{"field":"id40","title":"门急诊收入(不含材料)比例%","classItem":"收入","name":"收入_门急诊收入(不含材料)比例%&门急诊收入(不含材料)&CY","hide":true,"sort":true,"key":"0-40","type":"normal"},{"field":"id41","title":"门急诊次均费用","classItem":"门急诊费用","name":"门急诊费用_门急诊次均费用","sort":true,"key":"0-41","hide":false,"type":"normal","width":0},{"field":"id42","title":"门急诊次均费用(不含药品材料)","classItem":"门急诊费用","name":"门急诊费用_门急诊次均费用(不含药品材料)","sort":true,"key":"0-42","hide":false,"type":"normal","width":0},{"field":"id43","title":"门急诊次均费用(不含药品)","classItem":"门急诊费用","name":"门急诊费用_门急诊次均费用(不含药品)","sort":true,"key":"0-43","hide":false,"type":"normal","width":0},{"field":"id44","title":"门急诊次均费用(不含材料)","classItem":"门急诊费用","name":"门急诊费用_门急诊次均费用(不含材料)","sort":true,"key":"0-44","hide":false,"type":"normal","width":0},{"field":"id45","title":"药品收入","classItem":"门急诊费用","name":"门急诊费用_药品收入","sort":true,"key":"0-45","hide":false,"type":"normal","width":0},{"field":"id46","title":"门急诊药占比%","classItem":"门急诊费用","name":"门急诊费用_门急诊药占比%&门急诊次均药费&CY","hide":true,"sort":true,"key":"0-46","type":"normal"},{"field":"id47","title":"门急诊药占比(不含中药饮片)%","classItem":"门急诊费用","name":"门急诊费用_门急诊药占比(不含中药饮片)%&门急诊次均药费(不含中药饮片)&CY","hide":true,"sort":true,"key":"0-47","type":"normal"},{"field":"id48","title":"门急诊次均药费","classItem":"门急诊费用","name":"门急诊费用_门急诊次均药费","sort":true,"key":"0-48","hide":false,"type":"normal","width":0},{"field":"id49","title":"门急诊次均药费(不含中药饮片)","classItem":"门急诊费用","name":"门急诊费用_门急诊次均药费(不含中药饮片)","sort":true,"key":"0-49","hide":false,"type":"normal","width":0},{"field":"id50","title":"卫生材料收入","classItem":"门急诊费用","name":"门急诊费用_卫生材料收入","sort":true,"key":"0-50","hide":false,"type":"normal","width":0},{"field":"id51","title":"其中高值材料收入","classItem":"门急诊费用","name":"门急诊费用_其中高值材料收入","sort":true,"key":"0-51","hide":false,"type":"normal","width":0},{"field":"id52","title":"门急诊卫生材料费占比","classItem":"门急诊费用","name":"门急诊费用_门急诊卫生材料费占比&门急诊次均卫生材料费&CY","hide":true,"sort":true,"key":"0-52","type":"normal"},{"field":"id53","title":"门急诊卫生材料费占比(不含药品费)%","classItem":"门急诊费用","name":"门急诊费用_门急诊卫生材料费占比(不含药品费)%&门急诊收入(不含药品)&CY","hide":true,"sort":true,"key":"0-53","type":"normal"},{"field":"id54","title":"门急诊次均卫生材料费","classItem":"门急诊费用","name":"门急诊费用_门急诊次均卫生材料费","sort":true,"key":"0-54","hide":false,"type":"normal","width":0},{"field":"id55","title":"医保人次","classItem":"医保","name":"医保_医保人次","sort":true,"key":"0-55","hide":false,"type":"normal","width":0},{"field":"id56","title":"医保人次占比%","classItem":"医保","name":"医保_医保人次占比%","sort":true,"key":"0-56","hide":false,"type":"normal","width":0},{"field":"id57","title":"医保门急诊收入","classItem":"医保","name":"医保_医保门急诊收入","sort":true,"key":"0-57","hide":false,"type":"normal","width":0},{"field":"id58","title":"医保门急诊收入占比%","classItem":"医保","name":"医保_医保门急诊收入占比%","sort":true,"key":"0-58","hide":false,"type":"normal","width":0},{"field":"id59","title":"其中医保药品收入","classItem":"医保","name":"医保_其中医保药品收入","sort":true,"key":"0-59","hide":false,"type":"normal","width":0},{"field":"id60","title":"医保药占比%","classItem":"医保","name":"医保_医保药占比%&医保次均药费&CY","hide":true,"sort":true,"key":"0-60","type":"normal"},{"field":"id61","title":"其中医保药品收入(不含中药饮片)","classItem":"医保","name":"医保_其中医保药品收入(不含中药饮片)","sort":true,"key":"0-61","hide":false,"type":"normal","width":0},{"field":"id62","title":"医保药占比(不含中药饮片)%","classItem":"医保","name":"医保_医保药占比(不含中药饮片)%&医保次均药费(不含中药饮片)&CY","hide":true,"sort":true,"key":"0-62","type":"normal"},{"field":"id63","title":"其中医保卫生材料收入","classItem":"医保","name":"医保_其中医保卫生材料收入","sort":true,"key":"0-63","hide":false,"type":"normal","width":0},{"field":"id64","title":"医保卫生材料占比%","classItem":"医保","name":"医保_医保卫生材料占比%&医保次均卫生材料费&CY","hide":true,"sort":true,"key":"0-64","type":"normal"},{"field":"id65","title":"医保次均费用","classItem":"医保","name":"医保_医保次均费用","sort":true,"key":"0-65","hide":false,"type":"normal","width":0},{"field":"id66","title":"医保次均药费","classItem":"医保","name":"医保_医保次均药费","sort":true,"key":"0-66","hide":false,"type":"normal","width":0},{"field":"id67","title":"医保次均药费(不含中药饮片)","classItem":"医保","name":"医保_医保次均药费(不含中药饮片)","sort":true,"key":"0-67","hide":false,"type":"normal","width":0},{"field":"id68","title":"医保次均卫生材料费","classItem":"医保","name":"医保_医保次均卫生材料费","sort":true,"key":"0-68","hide":false,"type":"normal","width":0},{"field":"id69","title":"其中外地医保","classItem":"医保","name":"医保_其中外地医保","sort":true,"key":"0-69","hide":false,"type":"normal","width":0},{"field":"id70","title":"其中外地医保占比%","classItem":"医保","name":"医保_其中外地医保占比%","sort":true,"key":"0-70","hide":false,"type":"normal","width":0},{"field":"id71","title":"其中外地医保收入","classItem":"医保","name":"医保_其中外地医保收入","sort":true,"key":"0-71","hide":false,"type":"normal","width":0},{"field":"id72","title":"其中外地医保收入占比%","classItem":"医保","name":"医保_其中外地医保收入占比%","sort":true,"key":"0-72","hide":false,"type":"normal","width":0},{"field":"id73","title":"其中外地医保药品收入","classItem":"医保","name":"医保_其中外地医保药品收入","sort":true,"key":"0-73","hide":false,"type":"normal","width":0},{"field":"id74","title":"其中外地医保材料收入","classItem":"医保","name":"医保_其中外地医保材料收入","sort":true,"key":"0-74","hide":false,"type":"normal","width":0},{"field":"id75","title":"其中外地医保次均费用","classItem":"医保","name":"医保_其中外地医保次均费用","sort":true,"key":"0-75","hide":false,"type":"normal","width":0},{"field":"id76","title":"特需人次","classItem":"医保","name":"医保_特需人次","sort":true,"key":"0-76","hide":false,"type":"normal","width":0},{"field":"id77","title":"特需人次占比%","classItem":"特需","name":"特需_特需人次占比%","sort":true,"key":"0-77","hide":false,"type":"normal","width":0},{"field":"id78","title":"特需门急诊收入","classItem":"特需","name":"特需_特需门急诊收入","sort":true,"key":"0-78","hide":false,"type":"normal","width":0},{"field":"id79","title":"特需门急诊收入占比%","classItem":"特需","name":"特需_特需门急诊收入占比%","sort":true,"key":"0-79","hide":false,"type":"normal","width":0},{"field":"id80","title":"其中特需药品收入","classItem":"特需","name":"特需_其中特需药品收入","sort":true,"key":"0-80","hide":false,"type":"normal","width":0},{"field":"id81","title":"其中特需材料收入","classItem":"特需","name":"特需_其中特需材料收入","sort":true,"key":"0-81","hide":false,"type":"normal","width":0},{"field":"id82","title":"特需药占比%","classItem":"特需","name":"特需_特需药占比%&特需次均药费&CY","hide":true,"sort":true,"key":"0-82","type":"normal"},{"field":"id83","title":"特需药占比(不含中药饮片)%","classItem":"特需","name":"特需_特需药占比(不含中药饮片)%&特需次均药费(不含中草药)&CY","hide":true,"sort":true,"key":"0-83","type":"normal"},{"field":"id84","title":"特需卫生材料费占比%","classItem":"特需","name":"特需_特需卫生材料费占比%&特需次均卫生材料费&CY","hide":true,"sort":true,"key":"0-84","type":"normal"},{"field":"id85","title":"特需次均费用","classItem":"特需","name":"特需_特需次均费用","sort":true,"key":"0-85","hide":false,"type":"normal","width":0},{"field":"id86","title":"特需次均药费","classItem":"特需","name":"特需_特需次均药费","sort":true,"key":"0-86","hide":false,"type":"normal","width":0},{"field":"id87","title":"特需次均药费(不含中草药)","classItem":"特需","name":"特需_特需次均药费(不含中草药)","sort":true,"key":"0-87","hide":false,"type":"normal","width":0},{"field":"id88","title":"特需次均卫生材料费","classItem":"特需","name":"特需_特需次均卫生材料费","sort":true,"key":"0-88","hide":false,"type":"normal","width":0},{"field":"id89","title":"西药费","classItem":"费用","name":"费用_西药费","sort":true,"key":"0-89","hide":false,"type":"normal","width":0},{"field":"id90","title":"中成药费","classItem":"费用","name":"费用_中成药费","sort":true,"key":"0-90","hide":false,"type":"normal","width":0},{"field":"id91","title":"中草药费","classItem":"费用","name":"费用_中草药费","sort":true,"key":"0-91","hide":false,"type":"normal","width":0},{"field":"id92","title":"常规检查费","classItem":"费用","name":"费用_常规检查费","sort":true,"key":"0-92","hide":false,"type":"normal","width":0},{"field":"id93","title":"CT","classItem":"费用","name":"费用_CT","sort":true,"key":"0-93","hide":false,"type":"normal","width":0},{"field":"id94","title":"磁共振","classItem":"费用","name":"费用_磁共振","sort":true,"key":"0-94","hide":false,"type":"normal","width":0},{"field":"id95","title":"放射线","classItem":"费用","name":"费用_放射线","sort":true,"key":"0-95","hide":false,"type":"normal","width":0},{"field":"id96","title":"化验费","classItem":"费用","name":"费用_化验费","sort":true,"key":"0-96","hide":false,"type":"normal","width":0},{"field":"id97","title":"病理","classItem":"费用","name":"费用_病理","sort":true,"key":"0-97","hide":false,"type":"normal","width":0},{"field":"id98","title":"治疗费","classItem":"费用","name":"费用_治疗费","sort":true,"key":"0-98","hide":false,"type":"normal","width":0},{"field":"id99","title":"血液透析","classItem":"费用","name":"费用_血液透析","sort":true,"key":"0-99","hide":false,"type":"normal","width":0},{"field":"id100","title":"输血费","classItem":"费用","name":"费用_输血费","sort":true,"key":"0-100","hide":false,"type":"normal","width":0},{"field":"id101","title":"输氧费","classItem":"费用","name":"费用_输氧费","sort":true,"key":"0-101","hide":false,"type":"normal","width":0},{"field":"id102","title":"高压氧费","classItem":"费用","name":"费用_高压氧费","sort":true,"key":"0-102","hide":false,"type":"normal","width":0},{"field":"id103","title":"手术费","classItem":"费用","name":"费用_手术费","sort":true,"key":"0-103","hide":false,"type":"normal","width":0},{"field":"id104","title":"床位费","classItem":"费用","name":"费用_床位费","sort":true,"key":"0-104","hide":false,"type":"normal","width":0},{"field":"id105","title":"诊疗费","classItem":"费用","name":"费用_诊疗费","sort":true,"key":"0-105","hide":false,"type":"normal","width":0},{"field":"id106","title":"护理费","classItem":"费用","name":"费用_护理费","sort":true,"key":"0-106","hide":false,"type":"normal","width":0},{"field":"id107","title":"特需费用","classItem":"费用","name":"费用_特需费用","sort":true,"key":"0-107","hide":false,"type":"normal","width":0},{"field":"id108","title":"其他费用","classItem":"费用","name":"费用_其他费用","sort":true,"key":"0-108","hide":false,"type":"normal","width":0},{"field":"id109","title":"出诊单元数同比%","classItem":"同环比","name":"同环比_出诊单元数同比%","sort":true,"key":"0-109","hide":true,"type":"normal","width":0},{"field":"id110","title":"出诊单元数环比%","classItem":"同环比","name":"同环比_出诊单元数环比%","sort":true,"key":"0-110","hide":true,"type":"normal","width":0},{"field":"id111","title":"每单元诊疗人次同比%","classItem":"同环比","name":"同环比_每单元诊疗人次同比%","sort":true,"key":"0-111","hide":true,"type":"normal","width":0},{"field":"id112","title":"每单元诊疗人次环比%","classItem":"同环比","name":"同环比_每单元诊疗人次环比%","sort":true,"key":"0-112","hide":true,"type":"normal","width":0},{"field":"id113","title":"门急诊人次同比%","classItem":"同环比","name":"同环比_门急诊人次同比%","sort":true,"key":"0-113","hide":true,"type":"normal","width":0},{"field":"id114","title":"门急诊人次环比%","classItem":"同环比","name":"同环比_门急诊人次环比%","sort":true,"key":"0-114","hide":true,"type":"normal","width":0},{"field":"id115","title":"门诊人次同比%","classItem":"同环比","name":"同环比_门诊人次同比%","sort":true,"key":"0-115","hide":true,"type":"normal","width":0},{"field":"id116","title":"门诊人次环比%","classItem":"同环比","name":"同环比_门诊人次环比%","sort":true,"key":"0-116","hide":true,"type":"normal","width":0},{"field":"id117","title":"普通医师门急诊人次同比%","classItem":"同环比","name":"同环比_普通医师门急诊人次同比%","sort":true,"key":"0-117","hide":true,"type":"normal","width":0},{"field":"id118","title":"普通医师门急诊人次环比%","classItem":"同环比","name":"同环比_普通医师门急诊人次环比%","sort":true,"key":"0-118","hide":true,"type":"normal","width":0},{"field":"id119","title":"副主任医师门急诊人次同比%","classItem":"同环比","name":"同环比_副主任医师门急诊人次同比%","sort":true,"key":"0-119","hide":true,"type":"normal","width":0},{"field":"id120","title":"副主任医师门急诊人次环比%","classItem":"同环比","name":"同环比_副主任医师门急诊人次环比%","sort":true,"key":"0-120","hide":true,"type":"normal","width":0},{"field":"id121","title":"主任医师门急诊人次同比%","classItem":"同环比","name":"同环比_主任医师门急诊人次同比%","sort":true,"key":"0-121","hide":true,"type":"normal","width":0},{"field":"id122","title":"主任医师门急诊人次环比%","classItem":"同环比","name":"同环比_主任医师门急诊人次环比%","sort":true,"key":"0-122","hide":true,"type":"normal","width":0},{"field":"id123","title":"知名专家医师门急诊人次同比%","classItem":"同环比","name":"同环比_知名专家医师门急诊人次同比%","sort":true,"key":"0-123","hide":true,"type":"normal","width":0},{"field":"id124","title":"知名专家医师门急诊人次环比%","classItem":"同环比","name":"同环比_知名专家医师门急诊人次环比%","sort":true,"key":"0-124","hide":true,"type":"normal","width":0},{"field":"id125","title":"急诊人次同比%","classItem":"同环比","name":"同环比_急诊人次同比%","sort":true,"key":"0-125","hide":true,"type":"normal","width":0},{"field":"id126","title":"急诊人次环比%","classItem":"同环比","name":"同环比_急诊人次环比%","sort":true,"key":"0-126","hide":true,"type":"normal","width":0},{"field":"id127","title":"互联网诊疗服务人次同比%","classItem":"同环比","name":"同环比_互联网诊疗服务人次同比%","sort":true,"key":"0-127","hide":true,"type":"normal","width":0},{"field":"id128","title":"互联网诊疗服务人次环比%","classItem":"同环比","name":"同环比_互联网诊疗服务人次环比%","sort":true,"key":"0-128","hide":true,"type":"normal","width":0},{"field":"id129","title":"互联网诊疗服务人次占比同比%","classItem":"同环比","name":"同环比_互联网诊疗服务人次占比同比%","sort":true,"key":"0-129","hide":true,"type":"normal","width":0},{"field":"id130","title":"互联网诊疗服务人次占比环比%","classItem":"同环比","name":"同环比_互联网诊疗服务人次占比环比%","sort":true,"key":"0-130","hide":true,"type":"normal","width":0},{"field":"id131","title":"低配号门急诊人次同比%","classItem":"同环比","name":"同环比_低配号门急诊人次同比%","sort":true,"key":"0-131","hide":true,"type":"normal","width":0},{"field":"id132","title":"低配号门急诊人次环比%","classItem":"同环比","name":"同环比_低配号门急诊人次环比%","sort":true,"key":"0-132","hide":true,"type":"normal","width":0},{"field":"id133","title":"低配号人次占比同比%","classItem":"同环比","name":"同环比_低配号人次占比同比%","sort":true,"key":"0-133","hide":true,"type":"normal","width":0},{"field":"id134","title":"低配号人次占比环比%","classItem":"同环比","name":"同环比_低配号人次占比环比%","sort":true,"key":"0-134","hide":true,"type":"normal","width":0},{"field":"id135","title":"空挂号门急诊人次同比%","classItem":"同环比","name":"同环比_空挂号门急诊人次同比%","sort":true,"key":"0-135","hide":true,"type":"normal","width":0},{"field":"id136","title":"空挂号门急诊人次环比%","classItem":"同环比","name":"同环比_空挂号门急诊人次环比%","sort":true,"key":"0-136","hide":true,"type":"normal","width":0},{"field":"id137","title":"空挂号人次占比同比%","classItem":"同环比","name":"同环比_空挂号人次占比同比%","sort":true,"key":"0-137","hide":true,"type":"normal","width":0},{"field":"id138","title":"空挂号人次占比环比%","classItem":"同环比","name":"同环比_空挂号人次占比环比%","sort":true,"key":"0-138","hide":true,"type":"normal","width":0},{"field":"id139","title":"门急诊只开药人次同比%","classItem":"同环比","name":"同环比_门急诊只开药人次同比%","sort":true,"key":"0-139","hide":true,"type":"normal","width":0},{"field":"id140","title":"门急诊只开药人次环比%","classItem":"同环比","name":"同环比_门急诊只开药人次环比%","sort":true,"key":"0-140","hide":true,"type":"normal","width":0},{"field":"id141","title":"门急诊只开药人次占比同比%","classItem":"同环比","name":"同环比_门急诊只开药人次占比同比%","sort":true,"key":"0-141","hide":true,"type":"normal","width":0},{"field":"id142","title":"门急诊只开药人次占比环比%","classItem":"同环比","name":"同环比_门急诊只开药人次占比环比%","sort":true,"key":"0-142","hide":true,"type":"normal","width":0},{"field":"id143","title":"门诊只开药人次同比%","classItem":"同环比","name":"同环比_门诊只开药人次同比%","sort":true,"key":"0-143","hide":true,"type":"normal","width":0},{"field":"id144","title":"门诊只开药人次环比%","classItem":"同环比","name":"同环比_门诊只开药人次环比%","sort":true,"key":"0-144","hide":true,"type":"normal","width":0},{"field":"id145","title":"门诊只开药人次占比同比%","classItem":"同环比","name":"同环比_门诊只开药人次占比同比%","sort":true,"key":"0-145","hide":true,"type":"normal","width":0},{"field":"id146","title":"门诊只开药人次占比环比%","classItem":"同环比","name":"同环比_门诊只开药人次占比环比%","sort":true,"key":"0-146","hide":true,"type":"normal","width":0},{"field":"id147","title":"急诊只开药人次同比%","classItem":"同环比","name":"同环比_急诊只开药人次同比%","sort":true,"key":"0-147","hide":true,"type":"normal","width":0},{"field":"id148","title":"急诊只开药人次环比%","classItem":"同环比","name":"同环比_急诊只开药人次环比%","sort":true,"key":"0-148","hide":true,"type":"normal","width":0},{"field":"id149","title":"急诊只开药人次占比同比%","classItem":"同环比","name":"同环比_急诊只开药人次占比同比%","sort":true,"key":"0-149","hide":true,"type":"normal","width":0},{"field":"id150","title":"急诊只开药人次占比环比%","classItem":"同环比","name":"同环比_急诊只开药人次占比环比%","sort":true,"key":"0-150","hide":true,"type":"normal","width":0},{"field":"id151","title":"特需只开药人次同比%","classItem":"同环比","name":"同环比_特需只开药人次同比%","sort":true,"key":"0-151","hide":true,"type":"normal","width":0},{"field":"id152","title":"特需只开药人次环比%","classItem":"同环比","name":"同环比_特需只开药人次环比%","sort":true,"key":"0-152","hide":true,"type":"normal","width":0},{"field":"id153","title":"特需只开药人次占比同比%","classItem":"同环比","name":"同环比_特需只开药人次占比同比%","sort":true,"key":"0-153","hide":true,"type":"normal","width":0},{"field":"id154","title":"特需只开药人次占比环比%","classItem":"同环比","name":"同环比_特需只开药人次占比环比%","sort":true,"key":"0-154","hide":true,"type":"normal","width":0},{"field":"id155","title":"医保只开药人次同比%","classItem":"同环比","name":"同环比_医保只开药人次同比%","sort":true,"key":"0-155","hide":true,"type":"normal","width":0},{"field":"id156","title":"医保只开药人次环比%","classItem":"同环比","name":"同环比_医保只开药人次环比%","sort":true,"key":"0-156","hide":true,"type":"normal","width":0},{"field":"id157","title":"开住院预约单人数同比%","classItem":"同环比","name":"同环比_开住院预约单人数同比%","sort":true,"key":"0-157","hide":true,"type":"normal","width":0},{"field":"id158","title":"开住院预约单人数环比%","classItem":"同环比","name":"同环比_开住院预约单人数环比%","sort":true,"key":"0-158","hide":true,"type":"normal","width":0},{"field":"id159","title":"入院人数同比%","classItem":"同环比","name":"同环比_入院人数同比%","sort":true,"key":"0-159","hide":true,"type":"normal","width":0},{"field":"id160","title":"入院人数环比%","classItem":"同环比","name":"同环比_入院人数环比%","sort":true,"key":"0-160","hide":true,"type":"normal","width":0},{"field":"id161","title":"其中急诊入院人数同比%","classItem":"同环比","name":"同环比_其中急诊入院人数同比%","sort":true,"key":"0-161","hide":true,"type":"normal","width":0},{"field":"id162","title":"其中急诊入院人数环比%","classItem":"同环比","name":"同环比_其中急诊入院人数环比%","sort":true,"key":"0-162","hide":true,"type":"normal","width":0},{"field":"id163","title":"其中急诊入院人数占比同比%","classItem":"同环比","name":"同环比_其中急诊入院人数占比同比%","sort":true,"key":"0-163","hide":true,"type":"normal","width":0},{"field":"id164","title":"其中急诊入院人数占比环比%","classItem":"同环比","name":"同环比_其中急诊入院人数占比环比%","sort":true,"key":"0-164","hide":true,"type":"normal","width":0},{"field":"id165","title":"其中门诊入院人数同比%","classItem":"同环比","name":"同环比_其中门诊入院人数同比%","sort":true,"key":"0-165","hide":true,"type":"normal","width":0},{"field":"id166","title":"其中门诊入院人数环比%","classItem":"同环比","name":"同环比_其中门诊入院人数环比%","sort":true,"key":"0-166","hide":true,"type":"normal","width":0},{"field":"id167","title":"其中门诊入院人数占比同比%","classItem":"同环比","name":"同环比_其中门诊入院人数占比同比%","sort":true,"key":"0-167","hide":true,"type":"normal","width":0},{"field":"id168","title":"其中门诊入院人数占比环比%","classItem":"同环比","name":"同环比_其中门诊入院人数占比环比%","sort":true,"key":"0-168","hide":true,"type":"normal","width":0},{"field":"id169","title":"门急诊收入同比%","classItem":"同环比","name":"同环比_门急诊收入同比%","sort":true,"key":"0-169","hide":true,"type":"normal","width":0},{"field":"id170","title":"门急诊收入环比%","classItem":"同环比","name":"同环比_门急诊收入环比%","sort":true,"key":"0-170","hide":true,"type":"normal","width":0},{"field":"id171","title":"其中医疗服务收入同比%","classItem":"同环比","name":"同环比_其中医疗服务收入同比%","sort":true,"key":"0-171","hide":true,"type":"normal","width":0},{"field":"id172","title":"其中医疗服务收入环比%","classItem":"同环比","name":"同环比_其中医疗服务收入环比%","sort":true,"key":"0-172","hide":true,"type":"normal","width":0},{"field":"id173","title":"其中医疗服务收入占比%","classItem":"同环比","name":"同环比_其中医疗服务收入占比%&其中医疗服务收入同比%","sort":true,"key":"0-173","hide":true,"type":"normal","width":0},{"field":"id174","title":"其中医疗服务收入占比%","classItem":"同环比","name":"同环比_其中医疗服务收入占比%&其中医疗服务收入环比%","sort":true,"key":"0-174","hide":true,"type":"normal","width":0},{"field":"id175","title":"门急诊收入(不含药品材料)同比%","classItem":"同环比","name":"同环比_门急诊收入(不含药品材料)同比%","sort":true,"key":"0-175","hide":true,"type":"normal","width":0},{"field":"id176","title":"门急诊收入(不含药品材料)环比%","classItem":"同环比","name":"同环比_门急诊收入(不含药品材料)环比%","sort":true,"key":"0-176","hide":true,"type":"normal","width":0},{"field":"id177","title":"门急诊收入(不含药品材料)比例%","classItem":"同环比","name":"同环比_门急诊收入(不含药品材料)比例%&门急诊收入(不含药品材料)&CY同比%","hide":true,"sort":true,"key":"0-177","type":"normal"},{"field":"id178","title":"门急诊收入(不含药品材料)比例%","classItem":"同环比","name":"同环比_门急诊收入(不含药品材料)比例%&门急诊收入(不含药品材料)环比%","sort":true,"key":"0-178","hide":true,"type":"normal","width":0},{"field":"id179","title":"门急诊次均费用同比%","classItem":"同环比","name":"同环比_门急诊次均费用同比%","sort":true,"key":"0-179","hide":true,"type":"normal","width":0},{"field":"id180","title":"门急诊次均费用环比%","classItem":"同环比","name":"同环比_门急诊次均费用环比%","sort":true,"key":"0-180","hide":true,"type":"normal","width":0},{"field":"id181","title":"门急诊次均费用(不含药品材料)同比%","classItem":"同环比","name":"同环比_门急诊次均费用(不含药品材料)同比%","sort":true,"key":"0-181","hide":true,"type":"normal","width":0},{"field":"id182","title":"门急诊次均费用(不含药品材料)环比%","classItem":"同环比","name":"同环比_门急诊次均费用(不含药品材料)环比%","sort":true,"key":"0-182","hide":true,"type":"normal","width":0},{"field":"id183","title":"门急诊次均费用(不含药品)同比%","classItem":"同环比","name":"同环比_门急诊次均费用(不含药品)同比%","sort":true,"key":"0-183","hide":true,"type":"normal","width":0},{"field":"id184","title":"门急诊次均费用(不含药品)环比%","classItem":"同环比","name":"同环比_门急诊次均费用(不含药品)环比%","sort":true,"key":"0-184","hide":true,"type":"normal","width":0},{"field":"id185","title":"门急诊次均费用(不含材料)同比%","classItem":"同环比","name":"同环比_门急诊次均费用(不含材料)同比%","sort":true,"key":"0-185","hide":true,"type":"normal","width":0},{"field":"id186","title":"门急诊次均费用(不含材料)环比%","classItem":"同环比","name":"同环比_门急诊次均费用(不含材料)环比%","sort":true,"key":"0-186","hide":true,"type":"normal","width":0},{"field":"id187","title":"药品收入同比%","classItem":"同环比","name":"同环比_药品收入同比%","sort":true,"key":"0-187","hide":true,"type":"normal","width":0},{"field":"id188","title":"药品收入环比%","classItem":"同环比","name":"同环比_药品收入环比%","sort":true,"key":"0-188","hide":true,"type":"normal","width":0},{"field":"id189","title":"门急诊药占比%","classItem":"同环比","name":"同环比_门急诊药占比%&门急诊次均药费同比%","sort":true,"key":"0-189","hide":true,"type":"normal","width":0},{"field":"id190","title":"门急诊药占比%","classItem":"同环比","name":"同环比_门急诊药占比%&门急诊次均药费环比%","sort":true,"key":"0-190","hide":true,"type":"normal","width":0},{"field":"id191","title":"门急诊药占比(不含中药饮片)%","classItem":"同环比","name":"同环比_门急诊药占比(不含中药饮片)%&门急诊次均药费(不含中药饮片)同比%","sort":true,"key":"0-191","hide":true,"type":"normal","width":0},{"field":"id192","title":"门急诊药占比(不含中药饮片)%","classItem":"同环比","name":"同环比_门急诊药占比(不含中药饮片)%&门急诊次均药费(不含中药饮片)环比%","sort":true,"key":"0-192","hide":true,"type":"normal","width":0},{"field":"id193","title":"门急诊次均药费同比%","classItem":"同环比","name":"同环比_门急诊次均药费同比%","sort":true,"key":"0-193","hide":true,"type":"normal","width":0},{"field":"id194","title":"门急诊次均药费环比%","classItem":"同环比","name":"同环比_门急诊次均药费环比%","sort":true,"key":"0-194","hide":true,"type":"normal","width":0},{"field":"id195","title":"门急诊次均药费(不含中药饮片)环比%","classItem":"同环比","name":"同环比_门急诊次均药费(不含中药饮片)环比%","sort":true,"key":"0-195","hide":true,"type":"normal","width":0},{"field":"id196","title":"门急诊次均药费(不含中药饮片)同比%","classItem":"同环比","name":"同环比_门急诊次均药费(不含中药饮片)同比%","sort":true,"key":"0-196","hide":true,"type":"normal","width":0},{"field":"id197","title":"卫生材料收入同比%","classItem":"同环比","name":"同环比_卫生材料收入同比%","sort":true,"key":"0-197","hide":true,"type":"normal","width":0},{"field":"id198","title":"卫生材料收入环比%","classItem":"同环比","name":"同环比_卫生材料收入环比%","sort":true,"key":"0-198","hide":true,"type":"normal","width":0},{"field":"id199","title":"其中高值材料收入同比%","classItem":"同环比","name":"同环比_其中高值材料收入同比%","sort":true,"key":"0-199","hide":true,"type":"normal","width":0},{"field":"id200","title":"其中高值材料收入环比%","classItem":"同环比","name":"同环比_其中高值材料收入环比%","sort":true,"key":"0-200","hide":true,"type":"normal","width":0},{"field":"id201","title":"门急诊卫生材料费占比","classItem":"同环比","name":"同环比_门急诊卫生材料费占比&门急诊次均卫生材料费同比%","sort":true,"key":"0-201","hide":true,"type":"normal","width":0},{"field":"id202","title":"门急诊卫生材料费占比","classItem":"同环比","name":"同环比_门急诊卫生材料费占比&门急诊次均卫生材料费环比%","sort":true,"key":"0-202","hide":true,"type":"normal","width":0},{"field":"id203","title":"门急诊卫生材料费占比(不含药品费)%","classItem":"同环比","name":"同环比_门急诊卫生材料费占比(不含药品费)%&门急诊收入(不含药品)&CY同比%","hide":true,"sort":true,"key":"0-203","type":"normal"},{"field":"id204","title":"门急诊卫生材料费占比(不含药品费)%","classItem":"同环比","name":"同环比_门急诊卫生材料费占比(不含药品费)%&门急诊收入(不含药品)&CY环比%","hide":true,"sort":true,"key":"0-204","type":"normal"},{"field":"id205","title":"门急诊次均卫生材料费同比%","classItem":"同环比","name":"同环比_门急诊次均卫生材料费同比%","sort":true,"key":"0-205","hide":true,"type":"normal","width":0},{"field":"id206","title":"门急诊次均卫生材料费环比%","classItem":"同环比","name":"同环比_门急诊次均卫生材料费环比%","sort":true,"key":"0-206","hide":true,"type":"normal","width":0},{"field":"id207","title":"医保人次同比%","classItem":"同环比","name":"同环比_医保人次同比%","sort":true,"key":"0-207","hide":true,"type":"normal","width":0},{"field":"id208","title":"医保人次环比%","classItem":"同环比","name":"同环比_医保人次环比%","sort":true,"key":"0-208","hide":true,"type":"normal","width":0},{"field":"id209","title":"医保人次占比同比%","classItem":"同环比","name":"同环比_医保人次占比同比%","sort":true,"key":"0-209","hide":true,"type":"normal","width":0},{"field":"id210","title":"医保人次占比环比%","classItem":"同环比","name":"同环比_医保人次占比环比%","sort":true,"key":"0-210","hide":true,"type":"normal","width":0},{"field":"id211","title":"医保门急诊收入同比%","classItem":"同环比","name":"同环比_医保门急诊收入同比%","sort":true,"key":"0-211","hide":true,"type":"normal","width":0},{"field":"id212","title":"医保门急诊收入环比%","classItem":"同环比","name":"同环比_医保门急诊收入环比%","sort":true,"key":"0-212","hide":true,"type":"normal","width":0},{"field":"id213","title":"医保门急诊收入占比同比%","classItem":"同环比","name":"同环比_医保门急诊收入占比同比%","sort":true,"key":"0-213","hide":true,"type":"normal","width":0},{"field":"id214","title":"医保门急诊收入占比环比%","classItem":"同环比","name":"同环比_医保门急诊收入占比环比%","sort":true,"key":"0-214","hide":true,"type":"normal","width":0},{"field":"id215","title":"其中医保药品收入同比%","classItem":"同环比","name":"同环比_其中医保药品收入同比%","sort":true,"key":"0-215","hide":true,"type":"normal","width":0},{"field":"id216","title":"其中医保药品收入环比%","classItem":"同环比","name":"同环比_其中医保药品收入环比%","sort":true,"key":"0-216","hide":true,"type":"normal","width":0},{"field":"id217","title":"医保药占比%","classItem":"同环比","name":"同环比_医保药占比%&医保次均药费同比%","sort":true,"key":"0-217","hide":true,"type":"normal","width":0},{"field":"id218","title":"医保药占比%","classItem":"同环比","name":"同环比_医保药占比%&医保次均药费环比%","sort":true,"key":"0-218","hide":true,"type":"normal","width":0},{"field":"id219","title":"其中医保药品收入(不含中药饮片)同比%","classItem":"同环比","name":"同环比_其中医保药品收入(不含中药饮片)同比%","sort":true,"key":"0-219","hide":true,"type":"normal","width":0},{"field":"id220","title":"其中医保药品收入(不含中药饮片)环比%","classItem":"同环比","name":"同环比_其中医保药品收入(不含中药饮片)环比%","sort":true,"key":"0-220","hide":true,"type":"normal","width":0},{"field":"id221","title":"医保药占比(不含中药饮片)%","classItem":"同环比","name":"同环比_医保药占比(不含中药饮片)%&医保次均药费(不含中药饮片)同比%","sort":true,"key":"0-221","hide":true,"type":"normal","width":0},{"field":"id222","title":"医保药占比(不含中药饮片)%","classItem":"同环比","name":"同环比_医保药占比(不含中药饮片)%&医保次均药费(不含中药饮片)环比%","sort":true,"key":"0-222","hide":true,"type":"normal","width":0},{"field":"id223","title":"其中医保卫生材料收入同比%","classItem":"同环比","name":"同环比_其中医保卫生材料收入同比%","sort":true,"key":"0-223","hide":true,"type":"normal","width":0},{"field":"id224","title":"其中医保卫生材料收入环比%","classItem":"同环比","name":"同环比_其中医保卫生材料收入环比%","sort":true,"key":"0-224","hide":true,"type":"normal","width":0},{"field":"id225","title":"医保卫生材料占比%","classItem":"同环比","name":"同环比_医保卫生材料占比%&医保次均卫生材料费同比%","sort":true,"key":"0-225","hide":true,"type":"normal","width":0},{"field":"id226","title":"医保卫生材料占比%","classItem":"同环比","name":"同环比_医保卫生材料占比%&医保次均卫生材料费环比%","sort":true,"key":"0-226","hide":true,"type":"normal","width":0},{"field":"id227","title":"医保次均费用同比%","classItem":"同环比","name":"同环比_医保次均费用同比%","sort":true,"key":"0-227","hide":true,"type":"normal","width":0},{"field":"id228","title":"医保次均费用环比%","classItem":"同环比","name":"同环比_医保次均费用环比%","sort":true,"key":"0-228","hide":true,"type":"normal","width":0},{"field":"id229","title":"医保次均药费同比%","classItem":"同环比","name":"同环比_医保次均药费同比%","sort":true,"key":"0-229","hide":true,"type":"normal","width":0},{"field":"id230","title":"医保次均药费环比%","classItem":"同环比","name":"同环比_医保次均药费环比%","sort":true,"key":"0-230","hide":true,"type":"normal","width":0},{"field":"id231","title":"医保次均药费(不含中药饮片)同比%","classItem":"同环比","name":"同环比_医保次均药费(不含中药饮片)同比%","sort":true,"key":"0-231","hide":true,"type":"normal","width":0},{"field":"id232","title":"医保次均药费(不含中药饮片)环比%","classItem":"同环比","name":"同环比_医保次均药费(不含中药饮片)环比%","sort":true,"key":"0-232","hide":true,"type":"normal","width":0},{"field":"id233","title":"医保次均卫生材料费同比%","classItem":"同环比","name":"同环比_医保次均卫生材料费同比%","sort":true,"key":"0-233","hide":true,"type":"normal","width":0},{"field":"id234","title":"医保次均卫生材料费环比%","classItem":"同环比","name":"同环比_医保次均卫生材料费环比%","sort":true,"key":"0-234","hide":true,"type":"normal","width":0},{"field":"id235","title":"其中外地医保同比%","classItem":"外地医保","name":"外地医保_其中外地医保同比%","sort":true,"key":"0-235","hide":false,"type":"normal","width":0},{"field":"id236","title":"其中外地医保环比%","classItem":"外地医保","name":"外地医保_其中外地医保环比%","sort":true,"key":"0-236","hide":false,"type":"normal","width":0},{"field":"id237","title":"其中外地医保占比同比%","classItem":"外地医保","name":"外地医保_其中外地医保占比同比%","sort":true,"key":"0-237","hide":false,"type":"normal","width":0},{"field":"id238","title":"其中外地医保占比环比%","classItem":"外地医保","name":"外地医保_其中外地医保占比环比%","sort":true,"key":"0-238","hide":false,"type":"normal","width":0},{"field":"id239","title":"其中外地医保收入同比%","classItem":"外地医保","name":"外地医保_其中外地医保收入同比%","sort":true,"key":"0-239","hide":false,"type":"normal","width":0},{"field":"id240","title":"其中外地医保收入环比%","classItem":"外地医保","name":"外地医保_其中外地医保收入环比%","sort":true,"key":"0-240","hide":false,"type":"normal","width":0},{"field":"id241","title":"其中外地医保收入占比同比%","classItem":"外地医保","name":"外地医保_其中外地医保收入占比同比%","sort":true,"key":"0-241","hide":false,"type":"normal","width":0},{"field":"id242","title":"其中外地医保收入占比环比%","classItem":"外地医保","name":"外地医保_其中外地医保收入占比环比%","sort":true,"key":"0-242","hide":false,"type":"normal","width":0},{"field":"id243","title":"其中外地医保药品收入同比%","classItem":"外地医保","name":"外地医保_其中外地医保药品收入同比%","sort":true,"key":"0-243","hide":false,"type":"normal","width":0},{"field":"id244","title":"其中外地医保药品收入环比%","classItem":"外地医保","name":"外地医保_其中外地医保药品收入环比%","sort":true,"key":"0-244","hide":false,"type":"normal","width":0},{"field":"id245","title":"其中外地医保材料收入同比%","classItem":"外地医保","name":"外地医保_其中外地医保材料收入同比%","sort":true,"key":"0-245","hide":false,"type":"normal","width":0},{"field":"id246","title":"其中外地医保材料收入环比%","classItem":"外地医保","name":"外地医保_其中外地医保材料收入环比%","sort":true,"key":"0-246","hide":false,"type":"normal","width":0},{"field":"id247","title":"其中外地医保次均费用同比%","classItem":"外地医保","name":"外地医保_其中外地医保次均费用同比%","sort":true,"key":"0-247","hide":false,"type":"normal","width":0},{"field":"id248","title":"其中外地医保次均费用环比%","classItem":"外地医保","name":"外地医保_其中外地医保次均费用环比%","sort":true,"key":"0-248","hide":false,"type":"normal","width":0},{"field":"id249","title":"特需人次同比%","classItem":"特需同环比","name":"特需同环比_特需人次同比%","sort":true,"key":"0-249","hide":false,"type":"normal","width":0},{"field":"id250","title":"特需人次环比%","classItem":"特需同环比","name":"特需同环比_特需人次环比%","sort":true,"key":"0-250","hide":false,"type":"normal","width":0},{"field":"id251","title":"特需人次占比同比%","classItem":"特需同环比","name":"特需同环比_特需人次占比同比%","sort":true,"key":"0-251","hide":false,"type":"normal","width":0},{"field":"id252","title":"特需人次占比环比%","classItem":"特需同环比","name":"特需同环比_特需人次占比环比%","sort":true,"key":"0-252","hide":false,"type":"normal","width":0},{"field":"id253","title":"特需门急诊收入同比%","classItem":"特需同环比","name":"特需同环比_特需门急诊收入同比%","sort":true,"key":"0-253","hide":false,"type":"normal","width":0},{"field":"id254","title":"特需门急诊收入环比%","classItem":"特需同环比","name":"特需同环比_特需门急诊收入环比%","sort":true,"key":"0-254","hide":false,"type":"normal","width":0},{"field":"id255","title":"特需门急诊收入占比同比%","classItem":"特需同环比","name":"特需同环比_特需门急诊收入占比同比%","sort":true,"key":"0-255","hide":false,"type":"normal","width":0},{"field":"id256","title":"特需门急诊收入占比环比%","classItem":"特需同环比","name":"特需同环比_特需门急诊收入占比环比%","sort":true,"key":"0-256","hide":false,"type":"normal","width":0},{"field":"id257","title":"其中特需药品收入同比%","classItem":"特需同环比","name":"特需同环比_其中特需药品收入同比%","sort":true,"key":"0-257","hide":false,"type":"normal","width":0},{"field":"id258","title":"其中特需药品收入环比%","classItem":"特需同环比","name":"特需同环比_其中特需药品收入环比%","sort":true,"key":"0-258","hide":false,"type":"normal","width":0},{"field":"id259","title":"其中特需材料收入同比%","classItem":"特需同环比","name":"特需同环比_其中特需材料收入同比%","sort":true,"key":"0-259","hide":false,"type":"normal","width":0},{"field":"id260","title":"其中特需材料收入环比%","classItem":"特需同环比","name":"特需同环比_其中特需材料收入环比%","sort":true,"key":"0-260","hide":false,"type":"normal","width":0},{"field":"id261","title":"特需药占比%","classItem":"特需同环比","name":"特需同环比_特需药占比%&特需次均药费同比%","sort":true,"key":"0-261","hide":false,"type":"normal","width":0},{"field":"id262","title":"特需药占比%","classItem":"特需同环比","name":"特需同环比_特需药占比%&特需次均药费环比%","sort":true,"key":"0-262","hide":false,"type":"normal","width":0},{"field":"id263","title":"特需药占比(不含中药饮片)%","classItem":"特需同环比","name":"特需同环比_特需药占比(不含中药饮片)%&特需次均药费(不含中草药)同比%","sort":true,"key":"0-263","hide":false,"type":"normal","width":0},{"field":"id264","title":"特需药占比(不含中药饮片)%","classItem":"特需同环比","name":"特需同环比_特需药占比(不含中药饮片)%&特需次均药费(不含中草药)环比%","sort":true,"key":"0-264","hide":false,"type":"normal","width":0},{"field":"id265","title":"特需卫生材料费占比%","classItem":"特需同环比","name":"特需同环比_特需卫生材料费占比%&特需次均卫生材料费同比%","sort":true,"key":"0-265","hide":false,"type":"normal","width":0},{"field":"id266","title":"特需卫生材料费占比%","classItem":"特需同环比","name":"特需同环比_特需卫生材料费占比%&特需次均卫生材料费环比%","sort":true,"key":"0-266","hide":false,"type":"normal","width":0},{"field":"id267","title":"特需次均费用同比","classItem":"特需同环比","name":"特需同环比_特需次均费用同比","sort":true,"key":"0-267","hide":false,"type":"normal","width":0},{"field":"id268","title":"特需次均费用环比%","classItem":"特需同环比","name":"特需同环比_特需次均费用环比%","sort":true,"key":"0-268","hide":false,"type":"normal","width":0},{"field":"id269","title":"特需次均药费(不含中草药)同比","classItem":"特需同环比","name":"特需同环比_特需次均药费(不含中草药)同比","sort":true,"key":"0-269","hide":false,"type":"normal","width":0},{"field":"id270","title":"特需次均药费(不含中草药)环比%","classItem":"特需同环比","name":"特需同环比_特需次均药费(不含中草药)环比%","sort":true,"key":"0-270","hide":false,"type":"normal","width":0},{"field":"id271","title":"特需次均卫生材料费同比","classItem":"特需同环比","name":"特需同环比_特需次均卫生材料费同比","sort":true,"key":"0-271","hide":false,"type":"normal","width":0},{"field":"id272","title":"特需次均卫生材料费环比%","classItem":"特需同环比","name":"特需同环比_特需次均卫生材料费环比%","sort":true,"key":"0-272","hide":false,"type":"normal","width":0},{"field":"id273","title":"西药费同比","classItem":"常规同环比","name":"常规同环比_西药费同比","sort":true,"key":"0-273","hide":false,"type":"normal","width":0},{"field":"id274","title":"西药费环比%","classItem":"常规同环比","name":"常规同环比_西药费环比%","sort":true,"key":"0-274","hide":false,"type":"normal","width":0},{"field":"id275","title":"中成药费同比","classItem":"常规同环比","name":"常规同环比_中成药费同比","sort":true,"key":"0-275","hide":false,"type":"normal","width":0},{"field":"id276","title":"中成药费环比%","classItem":"常规同环比","name":"常规同环比_中成药费环比%","sort":true,"key":"0-276","hide":false,"type":"normal","width":0},{"field":"id277","title":"中草药费同比","classItem":"常规同环比","name":"常规同环比_中草药费同比","sort":true,"key":"0-277","hide":false,"type":"normal","width":0},{"field":"id278","title":"中草药费环比%","classItem":"常规同环比","name":"常规同环比_中草药费环比%","sort":true,"key":"0-278","hide":false,"type":"normal","width":0},{"field":"id279","title":"常规检查费同比","classItem":"常规同环比","name":"常规同环比_常规检查费同比","sort":true,"key":"0-279","hide":false,"type":"normal","width":0},{"field":"id280","title":"常规检查费环比%","classItem":"常规同环比","name":"常规同环比_常规检查费环比%","sort":true,"key":"0-280","hide":false,"type":"normal","width":0},{"field":"id281","title":"CT同比","classItem":"常规同环比","name":"常规同环比_CT同比","sort":true,"key":"0-281","hide":false,"type":"normal","width":0},{"field":"id282","title":"CT环比%","classItem":"常规同环比","name":"常规同环比_CT环比%","sort":true,"key":"0-282","hide":false,"type":"normal","width":0},{"field":"id283","title":"磁共振同比","classItem":"常规同环比","name":"常规同环比_磁共振同比","sort":true,"key":"0-283","hide":false,"type":"normal","width":0},{"field":"id284","title":"磁共振环比%","classItem":"常规同环比","name":"常规同环比_磁共振环比%","sort":true,"key":"0-284","hide":false,"type":"normal","width":0},{"field":"id285","title":"放射线同比","classItem":"常规同环比","name":"常规同环比_放射线同比","sort":true,"key":"0-285","hide":false,"type":"normal","width":0},{"field":"id286","title":"放射线环比%","classItem":"常规同环比","name":"常规同环比_放射线环比%","sort":true,"key":"0-286","hide":false,"type":"normal","width":0},{"field":"id287","title":"化验费同比","classItem":"常规同环比","name":"常规同环比_化验费同比","sort":true,"key":"0-287","hide":false,"type":"normal","width":0},{"field":"id288","title":"化验费环比%","classItem":"常规同环比","name":"常规同环比_化验费环比%","sort":true,"key":"0-288","hide":false,"type":"normal","width":0},{"field":"id289","title":"病理同比","classItem":"常规同环比","name":"常规同环比_病理同比","sort":true,"key":"0-289","hide":false,"type":"normal","width":0},{"field":"id290","title":"病理环比%","classItem":"常规同环比","name":"常规同环比_病理环比%","sort":true,"key":"0-290","hide":false,"type":"normal","width":0},{"field":"id291","title":"治疗费同比","classItem":"常规同环比","name":"常规同环比_治疗费同比","sort":true,"key":"0-291","hide":false,"type":"normal","width":0},{"field":"id292","title":"治疗费环比%","classItem":"常规同环比","name":"常规同环比_治疗费环比%","sort":true,"key":"0-292","hide":false,"type":"normal","width":0},{"field":"id293","title":"血液透析同比","classItem":"常规同环比","name":"常规同环比_血液透析同比","sort":true,"key":"0-293","hide":false,"type":"normal","width":0},{"field":"id294","title":"血液透析环比%","classItem":"常规同环比","name":"常规同环比_血液透析环比%","sort":true,"key":"0-294","hide":false,"type":"normal","width":0},{"field":"id295","title":"输血费同比","classItem":"常规同环比","name":"常规同环比_输血费同比","sort":true,"key":"0-295","hide":false,"type":"normal","width":0},{"field":"id296","title":"输血费环比%","classItem":"常规同环比","name":"常规同环比_输血费环比%","sort":true,"key":"0-296","hide":false,"type":"normal","width":0},{"field":"id297","title":"输氧费同比","classItem":"常规同环比","name":"常规同环比_输氧费同比","sort":true,"key":"0-297","hide":false,"type":"normal","width":0},{"field":"id298","title":"输氧费环比%","classItem":"常规同环比","name":"常规同环比_输氧费环比%","sort":true,"key":"0-298","hide":false,"type":"normal","width":0},{"field":"id299","title":"高压氧费同比","classItem":"常规同环比","name":"常规同环比_高压氧费同比","sort":true,"key":"0-299","hide":false,"type":"normal","width":0},{"field":"id300","title":"高压氧费环比%","classItem":"常规同环比","name":"常规同环比_高压氧费环比%","sort":true,"key":"0-300","hide":false,"type":"normal","width":0},{"field":"id301","title":"手术费同比","classItem":"常规同环比","name":"常规同环比_手术费同比","sort":true,"key":"0-301","hide":false,"type":"normal","width":0},{"field":"id302","title":"手术费环比%","classItem":"常规同环比","name":"常规同环比_手术费环比%","sort":true,"key":"0-302","hide":false,"type":"normal","width":0},{"field":"id303","title":"床位费同比","classItem":"常规同环比","name":"常规同环比_床位费同比","sort":true,"key":"0-303","hide":false,"type":"normal","width":0},{"field":"id304","title":"床位费环比%","classItem":"常规同环比","name":"常规同环比_床位费环比%","sort":true,"key":"0-304","hide":false,"type":"normal","width":0},{"field":"id305","title":"诊疗费同比","classItem":"常规同环比","name":"常规同环比_诊疗费同比","sort":true,"key":"0-305","hide":false,"type":"normal","width":0},{"field":"id306","title":"诊疗费环比%","classItem":"常规同环比","name":"常规同环比_诊疗费环比%","sort":true,"key":"0-306","hide":false,"type":"normal","width":0},{"field":"id307","title":"护理费同比","classItem":"常规同环比","name":"常规同环比_护理费同比","sort":true,"key":"0-307","hide":false,"type":"normal","width":0},{"field":"id308","title":"护理费环比%","classItem":"常规同环比","name":"常规同环比_护理费环比%","sort":true,"key":"0-308","hide":false,"type":"normal","width":0},{"field":"id309","title":"特需费用同比","classItem":"常规同环比","name":"常规同环比_特需费用同比","sort":true,"key":"0-309","hide":false,"type":"normal","width":0},{"field":"id310","title":"特需费用环比%","classItem":"常规同环比","name":"常规同环比_特需费用环比%","sort":true,"key":"0-310","hide":false,"type":"normal","width":0},{"field":"id311","title":"其他费用同比","classItem":"常规同环比","name":"常规同环比_其他费用同比","sort":true,"key":"0-311","hide":false,"type":"normal","width":0},{"field":"id312","title":"其他费用环比%","classItem":"常规同环比","name":"常规同环比_其他费用环比%","sort":true,"key":"0-312","hide":false,"type":"normal","width":0}],
			"classType":["出诊","人次","开药人次","入院人数","收入","门急诊费用","医保","特需","费用","同环比","外地医保","特需同环比","常规同环比"],
			"where":[{"field":"id0","rel":"=","value":"合计","value1":"","color":"rgba(241, 6, 6, 1)","bgcolor":"rgba(95, 255, 0, 1)","trtd":"行"}],
			"basics":{
				//"format": "id32,id33,id34,id35,id36,id37,id38,id39,id41",
				"tdStyle":[{"name":"id0","value":"text-decoration: underline;color:blue;cursor:pointer;"}],
			},
		},
		}],//方案列表
	tableConfig = {},
	currentScheme = {
		'tableId':'',
		'name':'',
		'content' :{
			cols:[],//指标排序和显示隐藏
			classType :[],//指标分类,针对单表头
			where: [], //{}预警条件
			basics: {//基本设置basicsSettings
				//format : '', //千分位  'format,id0,id2' 
				tdStyle : [] // 单元格样式设置{name:id0,value: css} //name="tdStyle"
			}
		}
	},//当前方案
	defaultConfig = {
		setDate : !1, //设置默认参数使用 时间区间
		fiexd : !1, //{}letf , right ,width :200
		where :!1,//条件
		classType : [], //通过基础设置分类
	};
	setupTable = {
		render(e){
			//!e && layer.msg('参数不能为空!!');
			// tableConfig[e.id] = e;
			tableConfig = $.extend({}, defaultConfig, e);
			tableConfig.setDate && new data(tableConfig);
			tableConfig.url && new colsData(tableConfig);
			!tableConfig.id && (tableConfig.id = tableConfig.elem.substring(1));
			
			//加按钮, 加事件
			this.toolbar(tableConfig);
			
			//渲染前吧url去掉
			if(tableConfig.data){ delete tableConfig.url; }
			//console.log(tableConfig)
			return table.render(tableConfig)
		},
		//弹窗操作
		toolbar : function(config){
			config['defaultToolbar'] = [{ 
						    title: '设置' //标题'print',
						    ,layEvent: 'LAYTABLE_SET' //事件名，用于 toolbar 事件中使用
						    ,icon: 'layui-icon-set' //图标类名
						  },'exports'];
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
		var tableId = ''//(currentScheme['tableId'] ? currentScheme['tableId'] : (config['config']['elem']['selector'] + '_'+config['config']['id']));
		var schemeStrList = '';
			///layui.schemePost.query(tableId,function(res){
				//menuList = []//res['data'];
				schemeStrList = '<form class="layui-form">';
				menuList.forEach(function(item){
					schemeStrList += '<div class="layui-inline spk-menuList"><input type="radio" lay-filter="menuList" name="menuList" value="'+item['id']+'" title="'+item['name']+'"/><i class="layui-icon layui-icon-close meun-close layui-unselect layui-tab-close" style="vertical-align: text-top;"></i></div>'
				});
				schemeStrList += '</form>';
				that.loadScheme(schemeStrList);
			//});
	},
	reload: function(){
		var that = this;
		this.colsSortIndex();
		tableConfig.sortDone = function(){
			that.tableRanderRowWarning();//单元格条件设置
		}
		//获取显示隐藏列
		table.reload(tableConfig.id , tableConfig, true);// 重载
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
					if(currentScheme['id'] == spk_schemId){ 
						currentScheme = {
							'content': {'cols':[],'classType':[],'where':[],'basics':{format : '',tdStyle : [] } }
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
						'content' : (typeof checked_schem[0]['content'] == 'string' ?JSON.parse(checked_schem[0]['content']):checked_schem[0]['content'])//当前方案
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
						'content' : (typeof checked_schem[0]['content'] == 'string'? JSON.parse( checked_schem[0]['content']) : checked_schem[0]['content'] )//当前方案
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
				var tableId = (tableConfig['elem'].substring(1) + '_'+tableConfig['id']);
					currentScheme = {
						'id':'',
						'tableId':tableId,
						'name':'',
						'content': {'cols':[],'classType':[],'where':[],'basics':{	format : '', tdStyle : [] }}//创建新的方案去除变量数据
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
				that.colTemplet(tableConfig['id'] , item);
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
		 if(e.cols.length == 1 && Array.isArray(type) && type.length){
				cols.forEach(function(item) {
					type.forEach( (p,index)=>{
						colslist.push('<div class="layui-card"><div class="layui-card-header"><div class="layui-inline"><input type="checkbox" lay-filter="LAY_TABLE_TOOL_allList" lay-skin="primary" name="allList'+index+'" title="全选"></div><text style="vertical-align: bottom;">类型:</text><span style="vertical-align: bottom;" class="type">'+p+'</span></div><div class="layui-card-body">')
						item.filter(function(v){if(v['classItem']==p) return v; }).forEach(function(i){
							if(i.field){
								currentScheme['content']['cols'].push({ field: i.field, hide:(i.hide?i.hide:false) })
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
									currentScheme['content']['cols'].push({ field: i.field, hide:(i.hide?i.hide:false) })
									colslist.push('<div class="layui-inline fieldIndex" id="' + i.field + '"><input type="checkbox" name="' + i.field + '" data-key="' + i.key + '" data-parentkey="' + (i.parentKey || "") + '" lay-skin="primary" ' + (i.hide ? "": "checked") + ' title="' + (i.title || i.field) + '" lay-filter="LAY_TABLE_TOOL_COLS"></div>')
								}
							})
						})
				}
			return '<form class="layui-form" lay-filter="colsform"><div id="colsform" class="layui-form-item" style="margin:10px;">'+colslist.join('')+'</div></form>'
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
		//千分位回显{name: 'format', value: '关键字,关键字'}
		// if(currentScheme['content']['basics']['format'] != '' && currentScheme['content']['basics']['format'] != undefined && currentScheme['content']['basics']['format'] != null){
		// 	this.formatSelect(currentScheme['content']['basics']['format']);
		// }else{
		// 	this.formatSelect();
		// };
		// 单元格样式设置--回显
		if(currentScheme['content']['basics']['tdStyle'].length){
			var tdStyleObj = null;
			tdStyleObj = $('#basicsSettings').find('.tdStyleList');
			currentScheme['content']['basics']['tdStyle'].forEach(function(item, i){
				//tdStyleObj.find('.tdStyleSelect').eq(i).attr('data-value',item['name']);
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
			$(this).parents('.tdStyle').find('.tdStyleList .layui-inline:last').remove();
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
		console.log(tableConfig)
		
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
		//	currentScheme['content']['cols'] = oneCols;
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
	//全选反选
	allCheckbox(self){
		var checkbox = $(self).parents('.layui-card-body').find('.fieldIndex').find('[type="checkbox"]').length,
				checked =$(self).parents('.layui-card-body').find('.fieldIndex').find('[type="checkbox"]:checked').length;
		//只针对分类的表格
		if(checkbox == checked){
			$(self).parents('.layui-card').find('.layui-card-header').find('[type="checkbox"]').prop('checked',true);
		}else{
			$(self).parents('.layui-card').find('.layui-card-header').find('[type="checkbox"]').prop('checked',false);
		}
		form.render()
	},
	//全选-回显
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
		return ['<form class="layui-form layui-form-pane" lay-filter="basicsSettings"><div style="margin:10px;" id="basicsSettings">',
		'<!-- div class="format layui-card"><div class="layui-card-header">添加千分位列 </div>',
		'<div class="layui-card-body"><div class="layui-form-item formatList"><label class="layui-form-label">千分位</label><div name="format" id="format_xm_select" class="layui-input-block"></div></div></div></div-->',
		'<div class="tdStyle layui-card"><div class="layui-card-header">添加单元格样式 <button type="button" class="layui-btn layui-btn-xs" id="tdStyle_add">添加</button>&nbsp;<button type="button" id="tdStyle_del" class="layui-btn layui-btn-xs layui-btn-warm">删除</button></div><div class="layui-card-body">',
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
		var tdstyle = $('<div class="layui-inline" style="margin:10px;"><label class="layui-form-label">单元格样式</label><div class="layui-input-inline tdStyleSelect" data-value="'+(filed?filed:'')+'"></div><div class="layui-input-inline"><input type="text" name="tdStyle" value="text-decoration: underline;color:blue;" style="width:300px;" class="layui-input" placeholder="color:red;"/></div></div>');
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
					// //排序后dom处理
					// tableConfig.sortDone = function(){
					// 	that.tableRanderRowWarning();//单元格条件设置
					// }
					//获取显示隐藏列
					that.reload();// 重载
					
					menuList[0] = currentScheme
					if(sessionStorage.getItem('tipSave') == null || sessionStorage.getItem('tipSave') == 'false'){
						layer.open({
							title: '保存/修改当前设置',
							content: '<input type="text" id="schemeName" class="layui-input" placeholder="请设置方案名">',
							success: function(layero){
								currentScheme['name'] && $(layero).find('#schemeName').val(currentScheme['name']);
							},
							yes:function(i,layero){
								var tableId = (currentScheme['tableId'] ? currentScheme['tableId'] : (tableConfig['elem'].substring(1) + '_'+tableConfig['id']));
								
								// layui.schemePost.add({
								// 	'id': (currentScheme['id'] ? currentScheme['id'] : ''),
								// 	'tableId': tableId,
								// 	'name' : $(layero).find('#schemeName').val(),
								// 	'content' : JSON.stringify(currentScheme['content'])
								// },function(){
								// 	layer.closeAll();
								// })
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
		var tdstyleList = $(".tdStyle .tdStyleList"),
				tdstyleAttay = [];
		if(tdstyleList.find('.layui-inline').length){
			tdstyleList.find('.layui-inline').each(function(){
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
			return this.config;
	},
	colsData.prototype.ajax = function(){
		var loadingindex = null;
		this.setupTableData(allData['data']);
		return;
		$.ajax({
			type: 'get',
			// async : false,
			dataType:"jsonp",
			url : '/json/cyData.json',
			data : this.config.where ?  this.config.where : {},
			beforeSend : function(){
				// 显示加载中状态
				loadingindex = layer.load(2);
			},
			success : function(res){
				console.log(res)
				self.tableData(res);
			},
			error :function(xml ,josn){
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
		if(!this.config['data']){
			this.tableData(data); 
		}
	},
	colsData.prototype.tableData = function(data){
		var dataList = [];//表格数据
		data.forEach(function(item){
			var json = {};
			item.forEach(function(val,i){
					json['id'+i] = (!Number(val) ? val : ( val.split('')[0] == '0' ? val : parseFloat(val)));
			})
			dataList.push( json );
		});
		dataList.shift();//删除数据的第一行(默认为表头)
		this.config['data'] = dataList;
	},
	colsData.prototype.setcols = function(array){
		var cols = [], obj = this.config , classType = [];
		cols.push(array.map(function(val , i , all){
			if(classType.indexOf(val.split("_")[0]) == -1){
				classType.push(val.split("_")[0])
			}
			var cosrow = { field : 'id' + i , title : val.split("_")[1].split('&')[0],format:true , classItem :val.split("_")[0]  , name : val.split("_")[1] };
			//隐藏为0的列
				val.indexOf('CY') != -1 && (cosrow['hide'] = true);
				if(i >= 3){ cosrow['sort'] = true; }//除了第一列,其他都加排序
				//固定列
				if(obj['fiexd'] && obj['fiexd']['left'] >= i){ cosrow['fixed'] = 'left'; }
				if(obj['fiexd'] && obj['fiexd']['right'] >= (all.length - i)){ cosrow['fixed'] = 'right'; }
				if(obj['fiexd'] && parseFloat(obj['fiexd']['width'])){ cosrow['width'] = obj['fiexd']['width']; }
				
				
				var addEventItem = all.filter(function (v) { return v.split('_')[1].split('&')[1] && v.split('_')[1].split('&')[1] == val.split('_')[1] && val.split('_')[1] != v.split('_')[1]} );
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
	data = function(config){
		this.config = config;
		this.config.setDate && this.setDate();
		
		return this.config;
	},
	data.prototype.setDate = function(){
		if(this.config.setDate){ //需要传时间参数
			if(!this.config.where) this.config.where = {};
			var data = {  
					"CONDITION_year" : this.config.setDate.split('-')[0] , //年
					"CONDITION_month" : this.config.setDate.split('-')[1],// 月
					"CONDITION_sDate" : this.config.setDate.split('-')[0] +this.config.setDate.split('-')[1],//年月
					"CONDITION_eDate" : this.config.setDate.split(' - ')[1].split('-')[0] + this.config.setDate.split(' - ')[1].split('-')[1],//结束年月
					"CONDITION_startDate" : this.config.setDate.split(' - ')[0], //开始时间
					"CONDITION_endDate" : this.config.setDate.split(' - ')[1] //结束时间
				};
			for(t in data){
				this.config.where[t] = data[t];
			}
		};
	}
	
	//样式添加
	addStyle()
	function addStyle(){
		var style = document.createElement("style");
		var cssSetupTable = [ "#scheme_list{padding: 10px; box-sizing: border-box;}#layer_setTable{ background-color: #F3F3F3; }#colsform .layui-form-item .layui-inline{ width: 120px;}#colsform .layui-card-header .layui-inline {vertical-align: bottom;}",
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