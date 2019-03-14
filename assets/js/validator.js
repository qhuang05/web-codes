/**
 * Created by QiuHuang on 2017/11/17.
 */
 (function($){
 	$.fn.formValidate = function(opt){
 		opt = $.extend({
 			language: 'zh'
 		}, opt);

 		var validator = {
 			language: opt.language,
 			messages: {
 				'zh':{
 					'NotEmpty': '字段不能为空！',
 					'Interger': '必须为整数！',
 					'IntergerRange': '范围错误！',
 					'Number': '必须为数字！',
 					'NumberRange': '范围错误！',
 					'EnglishStr': '必须为英文字符串！',
 					'ChineseStr': '必须为中文字符串！',
 					'IncludeChinese': '必须包含中文字符！',
 					'StrLengthRange': '范围错误！',
 					'Date': '必须为YYYY-MM-DD的日期格式',
 					'DateTime': '必须为YYYY-MM-DD hh:mm:ss的日期格式',
 					'Email': '邮箱格式错误！',
 					'Telephone': '必须为电话号码！',
 					'Mobile': '必须为手机号码！',
 					'Postcode': '必须为6位数邮编！',
 					'IDCard': '身份证格式错误！',
 					'URL': '必须为网址格式！'
 				},
 				'en':{
 					'NotEmpty': 'Cannot be Empty!',
 					'Interger': 'Must be Interger!',
 					'IntergerRange:': 'Out of Interger Range!',
 					'Number': 'Must be Number!',
 					'NumberRange':'Out of Number Range!',
 					'EnglishStr': 'Must be English Character!',
 					'ChineseStr': 'Must be Chinese Character!',
 					'IncludeChinese': 'Must include Chinese Character!',
 					'StrLengthRange': 'Out of String Range!',
 					'Date': 'Date Format YYYY-MM-DD Error!',
 					'DateTime': 'Date Format YYYY-MM-DD hh:mm:ss Error!',
 					'Email': 'Email Format Error!',
 					'Telephone': 'Must be Telephone!',
 					'Mobile': 'Must be Mobile!',
 					'Postcode': 'postCode Format Error!',
 					'IDCard': 'IDCard Format Error!',
 					'URL': 'URL Format Error!'
 				}
 			},
 			showErrorMsg: function(obj, errorMsg){
 				var $pObj = $(obj).closest('.form-content');
 				$pObj.append('<div class="error-msg">'+ errorMsg +'</div>');
 			},
 			removeErrorMsg: function(obj){
 				$(obj).closest('.form-content').find('.error-msg').remove();
 			},
			// 验证是否为空
			isEmpty: function(objValue){
				if(objValue == ''){
					return true;
				}
				return false;
			},
			//验证是否为整数(包括正整数和负整数)
			isInteger: function(objValue){
				var reg = /^[-+]?\d+$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证整数范围
			isIntegerRange: function(objValue, min, max){
				var reg = /^[-+]?\d+$/g,
					_objValue = parseInt(objValue),
					_min = parseInt(min),
					_max = parseInt(max);
				if(reg.test(objValue)){
					if(_objValue>=_min && _objValue<=_max){
						return true;
					} else{
						return false;
					}
				}
				return false;
			},
			// 验证是否为数字(包括整数和小数，包含正负数)
			isNumber: function(objValue){
				var reg = /^[-+]?\d+(\.\d+)?$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证数字范围
			isNumberRange: function(objValue, min, max){
				var reg = /^[-+]?\d+(\.\d+)?$/g,
					_objValue = parseFloat(objValue),
					_min = parseFloat(min),
					_max = parseFloat(max);
				if(reg.test(objValue)){
					if(_objValue>=_min && _objValue<=_max){
						return true;
					} else{
						return false;
					}
				}
				return false;
			},
			// 验证是否为英文字符串
			isEnglishStr: function(objValue){
				var reg = /^[a-z,A-Z]+$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证是否为中文字符串
			isChineseStr: function(objValue){
				var reg = /^[\u0391-\uFFE5]+$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证是否字符串是否包含中文
			isIncludeChinese: function(objValue){
				var reg = /^[^\u4e00-\u9fa5]+$/;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证字符串长度范围
			isStrLengthRange: function(objValue, min, max){
				var length = objValue.length;
				if(length>=min && length<=max){
					return true;
				}
				return false;
			},
			// 验证是否为日期格式(YYYY-MM-DD)
			isDate: function(objValue){
				var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证是否为日期格式(YYYY-MM-DD hh:mm:ss)		
			isDateTime: function(objValue){
				var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证是否为邮箱格式
			isEmail: function(objValue){
				var reg = /^\w{3,}@\w+(\.\w+)+$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证是否为电话号码
			isTelephone: function(objValue){
				var reg = /^(\d{3,4}\-)?[1-9]\d{6,7}$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证是否为手机号码
			isMobile: function(objValue){
				var reg = /^(\+\d{2,3}\-)?\d{11}$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证是否为邮编(6位)
			isPostcode: function(objValue){
				var reg = /^\d{6}$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;	
			},
			// 验证是否是身份证
			isIDCard: function(objValue){
				var reg = /^\d{15}(\d{2}[A-Za-z0-9;])?$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			},
			// 验证是否为网址
			isURL: function(objValue){
				var reg = /^http:\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/g;
				if(reg.test(objValue)){
					return true;
				}
				return false;
			}
		};

		var form = this,
		validateFlag = true;
		$(form).find('.error-msg').remove();
		$(form).find('[required="yes"]').each(function(){
			var checkexpression = $(this).attr('checkexpression'),
				errorMsg = $(this).attr('errormsg');
			if(errorMsg == undefined || errorMsg == ''){
				errorMsg = validator.messages[opt.language][checkexpression];
			}
			var objValue = $(this).val().trim();
			switch(checkexpression){
				// 不为空			
				case 'NotEmpty':
					if(validator.isEmpty(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 整数(包含正整数和负整数)
				case 'Interger':
					if(!validator.isInteger(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 整数范围
				case 'IntergerRange':
					var min = $(this).attr('min'),
						max = $(this).attr('max');
					if(!validator.isIntegerRange(objValue, min, max)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 数字(包括整数和小数，包含正负数)
				case 'Number':
					if(!validator.isNumber(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 数字范围
				case 'NumberRange':
					var min = $(this).attr('min'),
						max = $(this).attr('max');
					if(!validator.isNumberRange(objValue, min, max)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 英文字符串
				case 'EnglishStr':
					if(!validator.isEnglishStr(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 中文字符串
				case 'ChineseStr':
					if(!validator.isChineseStr(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 字符串包含中文
				case 'IncludeChinese':
					if(!validator.isIntegerRange(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				case 'StrLengthRange':
					var min = $(this).attr('min'),
						max = $(this).attr('max');
					if(!validator.isStrLengthRange(objValue, min, max)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 日期格式(YYYY-MM-DD)
				case 'Date':
					if(!validator.isDate(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 日期格式(YYYY-MM-DD hh:mm:ss)
				case 'DateTime':
					if(!validator.isDateTime(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 邮箱格式	
				case 'Email':
					if(!validator.isEmail(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 电话号码
				case 'Telephone':
					if(!validator.isTelephone(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 手机号码
				case 'Mobile':
					if(!validator.isMobile(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;	
				// 邮编(6位)			
				case 'Postcode':
					if(!validator.isPostcode(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 身份证
				case 'IDCard':
					if(!validator.isIDCard(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;
				// 网址
				case 'URL':
					if(!validator.isURL(objValue)){
						validator.showErrorMsg(this, errorMsg);
						validateFlag = false;
						return false;
					}
					break;						
			}
		});
		return validateFlag;
	}
})(jQuery);