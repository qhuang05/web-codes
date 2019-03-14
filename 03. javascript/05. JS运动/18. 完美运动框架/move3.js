
//获取元素某个样式的值
function getStyle(obj,name){
	if(obj.currentStyle) {
		return obj.currentStyle[name];
	}
	else {
		return getComputedStyle(obj,false)[name];
	}
}


//通过className来查找元素
function getByClass(oParent,sClass){
	var oResult=[];
	var oEle=oParent.getElementsByTagName("*");
	for(var i=0; i<oEle.length; i++) {
		if(oEle[i].className==sClass) {
			oResult.push(oEle[i]);
		}
	}
	return oResult;
}

//startMove(oDiv,{'width':200,'height':200},fnEnd);
//使用json替换attr,iTarget来解决传统运动框架的问题,并且对于json中的值必须每个值都到达目标点时才清掉定时器，定义一个变量bStop来判断：
//function startMove(obj,attr,iTarget,fnEnd)
function startMove(obj,json,fnEnd){
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var bStop=true;				//假设：所有的值都已经到了
		for(var attr in json){
			var cur=0;
			if(attr=='opacity') {
				//cur=parseFloat(getStyle(obj,attr))*100;			//由于计算机无法真正存储一个小数值，所以要取整
				cur=Math.round(parseFloat(getStyle(obj,attr))*100);
			}
			else {
				cur=parseInt(getStyle(obj,attr));	
			}
			var speed=(json[attr]-cur)/8;			
			speed=speed>0?Math.ceil(speed):Math.floor(speed);

			if(cur!=json[attr]) {
				bStop=false;
			}

			if(attr=='opacity') {
				obj.style.filter="alpha(opacity="+(cur+speed)+")";
				obj.style.opacity=(cur+speed)/100;
			}
			else {
				//oDiv.style.width=cur+speed+'px';
				//oDiv.style["width"]=cur+speed+'px';
				obj.style[attr]=cur+speed+'px';
			}
		}

		if(bStop) {
			clearInterval(obj.timer);
			if(fnEnd) fnEnd();
		}	
	},30);
}
