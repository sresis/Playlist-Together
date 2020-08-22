"use strict";
// where to do the DB  commits that are dependent on something else
// how to remove and only show some items ... div class container

$('#view-users').on('click', () => {
	$.get('/api/users', (response) => {

		// disable button 
		$("#view-users").attr("disabled", true);
		
		// show each user and a link to their profile
		const info_array = [];
		for (const item of Object.values(response)) {
			$('#users-container').append
			(`<li><a href="/users/${item.user_id}">${item.email}</li></a>`);
		}
		
		
	});


});