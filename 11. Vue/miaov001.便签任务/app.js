let store = {
	save(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	fetch(key) {
		return JSON.parse(localStorage.getItem(key)) || [];
	}
};
var filter = {
	all(list) {
		return list;
	},
	finished(list) {
		return list.filter(function(value) {
			return value.isChecked
		});
	},
	unfinished(list) {
		return list.filter(function(value) {
			return !value.isChecked
		});
	}
};

function watchHashChange() {
	var hash = window.location.hash.slice(1);
	app.tabLink = hash;
}