require.config({
    baseUrl: 'http://localhost/myproject/Framework7-Contacts7-MVC-master',
    paths: {
        router: 'js/router',
        base: "js/ums.base",
        plugins: "js/ums.plugins"
    },
    shim: {
        // handlebars: {
        //     exports: "Handlebars"
        // }
    }
});
var $$ = Dom7;
define('app', ['router'], function(Router) {
    Router.init();
	var f7 = new Framework7({
		modalTitle: 'Contacts7',
		swipePanel: 'left',
        animateNavBackIcon: true
	});
    var mainView = f7.addView('.view-main', {
        dynamicNavbar: true
    });
	return {
		f7: f7,
		mainView: mainView,
		router: Router
	};
});