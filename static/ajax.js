"use strict";
// where to do the DB  commits that are dependent on something else
// how to remove and only show some items ... div class container

$('#view-users').on('click', () => {
	
	// hide the other sections
	$('#name').hide();
	$('#email').hide();
	$('#fav-songs').hide();
	$('#fav-artists').hide();

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

	// show name, email, fave songs, fave artists
	$.get('/api/profile', (response) => {
		console.log(response);
		$('#name').html(`Name: ${response.user.fname} ${response.user.lname}`);
		$('#name').show();
		$('#email').html(`Email: ${response.user.email}`);
		$('#email').show();
		// add all fave songs
		$('#fav-songs').html(`Fave Songs`);
		$('#fav-songs').show();
		for (const item of Object.values(response.song_pref)) {
			$('#fav-songs').append(`<ul>${item.song_title}</ul>`);
		}
		// add all fave artists
		$('#fav-artists').html(`Fave Artists`);
		$('#fav-artists').show();
		for (const item of Object.values(response.artist_pref)) {
			$('#fav-artists').append(`<ul>${item.artist_name}</ul>`);	
		}


	});

	// show user details
	
});

