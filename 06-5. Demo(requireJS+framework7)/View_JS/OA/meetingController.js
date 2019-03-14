define(["base","plugins"],function(base,plugins){
	function init(){
		var data = [
			{id: 1001, text: 'jquery'},
			{id: 1002, text: 'vue'},
			{id: 1003, text: 'angular'},
			{id: 1004, text: 'react'},
		];
		var _data = base.deepCopy(data);
		$('#selectBtn').selectPicker({
			id:'id',
			text:'text',
			data:_data
		});
	}
	return {
		init: init
	}
})