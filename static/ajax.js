"use strict";
// where to do the DB  commits that are dependent on something else
// how to remove and only show some items ... div class container

$('#view-users').on('click', () => {
	
	// hide the other sections
	$('#name').hide();
	$('#email').hide();

	$.get('/api/users', (response) => {

		// disable button 
		$('#view-users').attr('disabled', true);

		
		// show each user and a link to their profile
		const info_array = [];
		for (const item of Object.values(response)) {
			$('#users-container').append
			(`<li><a id='${item.user_id}' href='/users/${item.user_id}'>${item.email}</li></a>`);
		}
		// how to make sure that it doesn't keep adding to list if you click

		// show the users list
		$('#users-container').show();		
	});


});

$('#view-prof').on('click', () => {

	// clear existing info in here

	// hide the other sections
	$('#users-container').hide();

	// disable button 
	$('#view-prof').attr('disabled', true);

	// show name, email, songs
	$.get('api/profile', (response) => {
		$('#name').html(`Name: ${response.fname} ${response.lname}`);
		$('#name').show();
		$('#email').html(`Email: ${response.email}`);
		$('#email').show();


	});

	// show user details
	
});

