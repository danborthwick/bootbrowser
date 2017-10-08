var myApp = new Framework7();
 
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
 
var searchTemplate = $$('#search-template').html();
var compiledSearchTemplate = Template7.compile(searchTemplate);
 
// Now we may render our compiled template by passing required context
var context = {
    firstName: 'John',
    lastName: 'Doe'
};

var catalogue = readCatalogue();

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

myApp.onPageInit('search', function (page) {
});

function readCatalogue() {
	var catalogue = {};

	$$.getJSON("js/images.json", function (images) {
		var pattern = /shoe (\d+)\/(.+\.jpg)/i;
		images.forEach(function(image) {
			var matches = image.match(pattern);
			var id = matches[1];
			var path = matches[0];

			var entry = catalogue[id] || { id: id, images: [] };
			entry.images.push(path);
			entry.mainImage = path;
			catalogue[id] = entry;
		});
		showSearch(0);
	});

	return catalogue;
}

function showSearch(selectedId) {
	var context = {
		selected: catalogue[selectedId],

		suggestions: [ 
			catalogue[1],
			catalogue[2],
			catalogue[3],
			catalogue[4],
		]
	};

	for (var i=0; i < context.suggestions.length; i++) {
		context.suggestions[i].newRow = (i % 2) == 0
	}
	var html = compiledSearchTemplate(context);
	mainView.router.loadContent(html);
}
