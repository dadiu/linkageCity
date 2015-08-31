/**
 * @url     https://github.com/dadiu/linkageCity
 * @data    2015.08.06
 * @author  wuhaijing
 * @mail    1004609378@qq.com
 * @version V1.0.0
 */
/********************* 传参说明 *********************/
/**
 * 以下均为必填参数
 * cityName : string		//城市名		默认'浙江省|杭州市|滨江区'
 * cityCode : string		//城市代码	默认'12|965|971'
 *
 * 以下均为可选参数
 * p : string			//方法传参			默认空
 * closeBoo ：boolean	//是否出现关闭按钮 	默认false
 * call ：function		//回调方法			默认null
 */
/******************** 开始 ********************/
(function($){
	$.fn.linkageCity = function(options){

		var defaults = {
			cityName : '浙江省|杭州市|滨江区',
			cityCode : '12|965|971',
			p : '',
			closeBoo : false,
			callback : null
		},

		options = $.extend(defaults, options),

		objs = {
			'bar' : $('<div>').addClass('m_linkage'),
			'txt' : $('<span>').addClass('linkage_txt'),
			'th' : $('<ul>').addClass('linkage_th'),
			'ct' : $('<div>').addClass('linkage_content'),
			'tb' : $('<div>').addClass('linkage_tb'),
			'province' : $('<ul>').addClass('linkage_province').attr('data-link', '0'),
			'city' : $('<ul>').addClass('linkage_city').attr('data-link', '1'),
			'area' : $('<ul>').addClass('linkage_area').attr('data-link', '2'),
			'close' : $('<a href=\"javascript:;\">').addClass('ic_linkageCity_close')
		},

		domName = this,

		dfunc = {

			init : function(){

				var _t = this;

				_t.M.getHtml();
				_t.C.even();
			},

			//model
			M : {

				getHtml : function(){

					var _t = this,
						cnArr = options.cityName.split('|'),
						ccArr = options.cityCode.split('|'),
						th = _t.getTh(cnArr,ccArr),
						province = _t.getTb(districtData),
						city = _t.getTb(districtData[ccArr[0]].cell),
						area = _t.getTb(districtData[ccArr[0]].cell[ccArr[1]].cell);
						
					//组合默认txt
					objs.txt.html(th[0]).attr('data-code',options.cityCode);

					//组合默认title
					objs.th.html(th[1]);

					//组合默认tb
					objs.tb.append(objs.province.html(province));
					objs.tb.append(objs.city.html(city));
					objs.tb.append(objs.area.html(area));

					//组合全部省市
					if(options.closeBoo == true){
						objs.ct.append(objs.close);
					};
					objs.ct.append(objs.th);
					objs.ct.append(objs.tb);

					//组合省市
					objs.bar.append(objs.txt);	
					objs.bar.append(objs.ct);	

					//放入html
					domName.append(objs.bar);

				},

				//默认txt + title
				getTh : function(cnArr,ccArr){	

					var len = cnArr.length,
						i = 0,
						txtHtml = '', titleHtml = '',
						arr = [];

					for( ; i < len; i++){
						txtHtml += cnArr[i] + '&nbsp;';
						titleHtml += '<li data-code=\"' + ccArr[i] + '\" data-link=\"' + i + '\">' + cnArr[i] + '</li>';
					};

					arr = [txtHtml,titleHtml];
					return arr;
				},

				getTb : function(list){
					
					var html = '';

					$.each(list, function(i, key){
						html += '<li data-code=\"' + i + '\">' + key.name + '</li>'
					});

					return html;
				}
			},

			//controller
			C : {

				cityList : {"province":{}, "city":{}, "area":{}},

				even : function(){

					var _t = this;
					
					//鼠标进入 出现ct
					objs.txt.mouseenter(function(){
						objs.txt.css({"border-bottom-color":"#fff"});

						//默认点开选择第一个
						objs.th.find('li:eq(0)').addClass('crt').siblings().removeClass('crt');
						objs.province.css('display','block').siblings().hide();

						objs.ct.show();

						return false;
					});


					//点击title选择省市
					objs.th.find('li').click(function(){
						$(this).addClass('crt').siblings().removeClass('crt');

						var linkName = $(this).attr('data-link');
						objs.tb.find('ul[data-link=\"' + linkName + '\"]').show().siblings().hide();

						return false;
					});


					//close
					objs.close.click(function(){
						objs.ct.hide();
						objs.txt.css({'border-bottom-color':'#ccc'});

						return false;
					});

					objs.province.delegate('li', 'click', function(){
						_t.cityChange('0',$(this));

						return false;
					});

					objs.city.delegate('li', 'click', function(){
						_t.cityChange('1',$(this));

						return false;
					});

					objs.area.delegate('li', 'click', function(){
						_t.cityChange('2',$(this));

						return false;
					});

					$("body").click(function(){
						objs.txt.css({'border-bottom-color':'#ccc'});
						objs.ct.hide();
					});

				},

				cityChange : function(status, dom){	

					var _t = this,
						name = dom.html(),
						code = dom.attr('data-code');

					objs.th.find('li[data-link=\"' + status + '\"]').html(name).attr('data-code',code);

					//province
					if(status == '0'){
						_t.cityList.province.code = code;
						_t.cityList.province.name = name;

						var province = districtData[_t.cityList.province.code].cell;

						_t.cityJudge(status, province, 'city');

					};

					//city
					if(status == '1'){

						_t.cityList.city.code = code;
						_t.cityList.city.name = name;

						var area = districtData[_t.cityList.province.code].cell[code].cell;
						
						_t.cityJudge(status, area, 'area');

					};

					//area
					if(status == '2'){
						_t.cityList.area.code = code;
						_t.cityList.area.name = name;

						_t.cityHide();
						return false;
					};

					$(objs.th).find('li[data-link=\"' + status + '\"]').next()
						.html('请选择').attr('data-code','')
						.addClass('crt').siblings().removeClass('crt');
					
					$(objs.tb).find('ul[data-link=\"' + status + '\"]').next().show().siblings().hide();

				},

				cityJudge : function(status, cellBoo, name){	//cellBoo列表是否存在 name = province/city/area

					var _t = this;

					if(cellBoo){

						objs.th.find('li[data-link=\"' + status + '\"]').next().show();
						objs[name].html(dfunc.M.getTb(cellBoo));

					} else{

						_t.cityList[name] = {};

						objs.th.find('li[data-link=\"' + status + '\"]').next().hide();
						_t.cityHide();
						return false;
					};

				},

				cityHide : function(){

					var _t = this,name = '', code = '';


					$.each(_t.cityList,function(i,k){
						if(k.name){
							code += k.code + '|';
							name += k.name + '&nbsp;';
						};						
					});

					code = code.slice(0,code.length-1);

					objs.txt.html(name).attr('data-code',code).css({'border-bottom-color':'#ccc'});
					objs.ct.hide();
					if(options.callback){
						options.callback();	
					};
				}

			}
		};

		dfunc.init(options,objs);

	};

})(jQuery);