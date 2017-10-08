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

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

myApp.onPageInit('search', function (page) {
});

var html = compiledSearchTemplate({
		selected: { id: 1 },
		suggestions: [
			{ id: 2},
			{ id: 3},
			{ id: 4},
			{ id: 5},
		]
	});
mainView.router.loadContent(html);