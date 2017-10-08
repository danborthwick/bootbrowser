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
		selected: { id: 1, image: 'images/Shoe/http-_2F_2Fstatic.theiconic.com.au_2Fp_2Flipstik-9248-621344-1.jpg' },

		suggestions: [
			{ newRow: true,
				id: 2, image: 'images/shoe%202/http-_2F_2Fstatic.theiconic.com.au_2Fp_2Firo-9282-952115-1.jpg' },
			{ id: 3, image: 'images/shoe%203/http-_2F_2Fstatic.theiconic.com.au_2Fp_2Fskin-0979-311184-1.jpg' },
			{ newRow: true,
				id: 4, image: 'images/shoe%204/http-_2F_2Fstatic.theiconic.com.au_2Fp_2Fcoconuts-by-matisse-1058-546784-1.jpg' },
			{ id: 5, image: 'images/shoe%205/http-_2F_2Fstatic.theiconic.com.au_2Fp_2Fsol-sana-9277-333544-1.jpg' },
		]
	});
mainView.router.loadContent(html);