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

var binaryCorrelations = loadCSV('js/binary-correlation.csv', true);
var fullCorrelations = loadCSV('js/full-correlation.csv', true);
var annotated = loadCSV('js/annotated.csv', false);
var catalogue = readCatalogue();

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

	return catalogue;
}

var currentSelection = 0;

function showSearch(selectedId) {
	currentSelection = selectedId;

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

function getSuggestions(selectedId) {
	var scored = annotated.map(function(entry, id) {
		var score = totalScore(selectedId, id);
		return { id: id, score: score };
	}).sort(function(lhs, rhs) {		
		return (lhs.score < rhs.score) ? 1 : ((lhs.score == rhs.score) ? 0 : -1);
	})

	var suggestions = scored.slice(1, 5).map(function(entry) {
		return catalogue[entry.id];
	});
	return suggestions;
}

function totalScore(selectedId, candidateId) {
	var score = 0
	if ($$('#full-correlation')[0].checked) {
		score += correlationScore(fullCorrelations, selectedId, candidateId);
	}
	if ($$('#binary-correlation')[0].checked) {
		score += correlationScore(binaryCorrelations, selectedId, candidateId);
	}
	for (var i=0; i < 5; i++) {
		if ($$('#manual' + i)[0].checked) {
			score += manualScore(i, selectedId, candidateId);
		}
	}
	return score;
}

function correlationScore(correlations, selectedId, candidateId) {
	return Math.pow(correlations[selectedId][candidateId] * 10, 2);
}

function manualScore(columnId, selectedId, candidateId) {
	var diff = annotated[selectedId][columnId] - annotated[candidateId][columnId];
	return Math.pow(10 - Math.abs(diff), 2);
}

function loadCSV(url, skipLine) {
	var table = [];
	var firstLine = skipLine ? 1 : 0;

	$$.get(url, {}, function(data) {
		var lines = data.split(/\r\n|\n/);
		for (var lineId = firstLine; lineId < lines.length; lineId++) {
			var entries = lines[lineId].split(',').slice(1).map(function(s) { return Number(s); });	
			table.push(entries);
		}
	});

	return table;
}

$$('.panel-left').on('panel:close', function () {
    showSearch(currentSelection);
});