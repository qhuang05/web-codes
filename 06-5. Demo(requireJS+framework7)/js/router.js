define(["base", "plugins"],function(base, plugins) {
	/**
	 * Init router, that handle page events
	 */
    function init() {
		$$(document).on('pageBeforeInit', function (e) {
			var page = e.detail.page; 
			var path = page.container.dataset.folder ? page.container.dataset.folder : '';
			load(path, page.name, page.query);
		});
    }

	/**
	 * Load (or reload) controller from js code (another controller) - call it's init function
	 * @param controllerName
	 * @param query
	 */
	function load(path, controllerName, query) {
		require(['View_JS/' + path + '/' + controllerName + 'Controller.js'], function(controller) {
			controller.init();
		});
	}

	return {
        init: init,
		load: load
    };
});