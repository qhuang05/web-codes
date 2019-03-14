var now=0;
var timer=null;

$(document).ready(function(){
	function picSwitch(){
		$('#demo .ul1 li').eq(now).parent().children().hide();
		$('#demo .ul1 li').eq(now).show();	
		$('#demo .ul2 li').parent().children().removeClass('selected');
		$('#demo .ul2 li').eq(now).addClass('selected');
	}

	$('#demo .ul2 li').click(function(){
		now=$(this).index();
		picSwitch();
	});

	$('#demo .lbtn').click(function(){
		now--;
		if(now<0) now=5;
		picSwitch();
	});

	$('#demo .rbtn').click(function(){
		now++;
		if(now>5) now=0;
		picSwitch();
	});	

	function autoPlay(){
		$('#demo .rbtn').trigger('click');
		//timer=setTimeout(autoPlay,3000);
	}	
	//autoPlay();
	timer=setInterval(autoPlay,3000);
});