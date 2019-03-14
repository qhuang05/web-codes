
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
	return oResult;
	}
}


//在任意值运动框架基础上多加了一个fnEnd参数：
function startMove(obj,attr,iTarget,fnEnd){
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var cur=0;
		if(attr=='opacity') {
			//cur=parseFloat(getStyle(obj,attr))*100;			//由于计算机无法真正存储一个小数值，所以要取整
			cur=Math.round(parseFloat(getStyle(obj,attr))*100);
		}
		else {
			cur=parseInt(getStyle(obj,attr));	
		}
		var speed=(iTarget-cur)/8;			
		speed=speed>0?Math.ceil(speed):Math.floor(speed);		
		if(cur==iTarget) {
			clearInterval(obj.timer);
			if(fnEnd) fnEnd();			//如果参数中有fnEnd，执行它
		}
		else {
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
	},30);
}
