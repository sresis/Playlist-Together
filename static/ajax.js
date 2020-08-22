"use strict";
// where to do the DB  commits that are dependent on something else
// how to remove and only show some items ... div class container

$('#view-users').on('click', () => {
	$.get('/api/users', (response) => {

		// remove button 
		$('view-users').remove();
		

		const info_array = [];
		for (const item of Object.values(response)) {
			$('#users-container').append(`<li>${item.email}</li>`);
		}
		
		
	
		
	});


});