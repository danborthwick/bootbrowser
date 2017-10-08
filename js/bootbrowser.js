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

var correlations = readCorrelations();
var catalogue = readCatalogue();

var initSteps = 0;
function initStep() {
	// initSteps++;
	// if (initSteps == 2) {
	// 	setTimeout(10, function() {
	// 		showSearch(0);
	// 	});
	// }
}

		setTimeout(function() {
			showSearch(0);
		}, 1000);

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

myApp.onPageInit('search', function (page) {
	console.log('Seatch init');
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
	});

	initStep();

	return catalogue;
}

function showSearch(selectedId) {
	var context = {
		selected: catalogue[selectedId],
		suggestions: getSuggestions(selectedId)
	};

	for (var i=0; i < context.suggestions.length; i++) {
		context.suggestions[i].newRow = (i % 2) == 0
	}
	var html = compiledSearchTemplate(context);
	mainView.router.loadContent(html);
}

function suggestionClicked(card) {
	var selectedId = $$(card).attr('data-id');
	console.log("Clicked: " + selectedId);
	showSearch(selectedId);
}

function readCorrelations() {
	var correlations = [];

	$$.get('js/correlation.csv', {}, function(data) {
		var lines = data.split(/\r\n|\n/);
		for (var lineId = 1; lineId < lines.length; lineId++) {
			var entries = lines[lineId].split(',').slice(1);	
			correlations.push(entries);
		}
	});

	initStep();

	return correlations;
}

function getSuggestions(selectedId) {
	var suggestions = correlations[selectedId].map(function(correlation, id) {
		return { correlation: correlation, id: id };
	}).sort(function(lhs, rhs) {
		return (lhs.correlation < rhs.correlation) ? 1 : ((lhs.correlation == rhs.correlation) ? 0 : -1);
	}).slice(1, 5).map(function(entry) {
		return catalogue[entry.id];
	});
	return suggestions;
}
