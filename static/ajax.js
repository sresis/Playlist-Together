"use strict";
// where to do the DB  commits that are dependent on something else
// how to remove and only show some items ... div class container

$('#view-users').on('click', () => {

	
	// hide the other sections
	$('#name').hide();
	$('#email').hide();
	$('#fav-songs').hide();
	$('#fav-artists').hide();
	$('#user-info-container').hide();
	$('#song-rec').html('');

	$.get('/api/users', (response) => {
		$('#users-container').html(`<h3>All Users</h3>`);

		// disable button 
		$('#view-users').attr('disabled', true);

		
		// show each user and a link to their profile
		const info_array = [];
		for (const item of Object.values(response)) {
			$('#users-container').append
			(`<li id='${item.email}'><a id='${item.user_id}'>${item.email}</li></a>`);
			// could set class and make event handler on the class

			// upon clicking link, show user name and email
			// called as a result of click on user id
			// put ID somewhere in HTML so you can access on 
			$('#' + item.user_id).on('click', () => {
				$('#users-container').hide();
				$('#user-info-container').show();
				$('user-info-container').html(`<h3>User Info</h3>`);

				// shows name, email, songs
				$('#user-name').html('Name: ' + item.fname + ' ' + item.lname);
				$('#user-email').html('Email: ' + item.email);
				// then show the user details
				// hide the rest of the items

				$('#view-users').attr('disabled', false);
			
				// how to make it not show it again
			});
		}
		// how to make sure that it doesn't keep adding to list if you click
		// have route take in user ID so you can get whatever user
		// make it ID on a button

		// show the users list
		$('#users-container').show();	

	});


});





$('#view-prof').on('click', () => {

	// clear existing info in here

	// hide the other sections
	$('#users-container').hide();
	$('#user-info-container').hide();
	$('#song-rec').html('');

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

	//show user details
	
});

// shows the shared playlist when you click on button.
// make user id accessable 
// make it the users id
// can post user ID as request.args.get (on the server side) 
// could template id into route /profile/<user_id>
// template in the user id . can template in values
// try to use event object
// define functions to call into for loop
$('#view-shared-playlist').on('click', () => {
	$('#login container').hide();
	$('#song-rec').html('');

	// gets the email to be passed in
	var user_info = $('#user-email').text();
	var user_email = user_info.substring(7, user_info.length);
	
	
	// some variable that refers to user id. pass in the variable
	$.post(`/api/shared_playlist/${user_email}`, (response) => {

		for (const item of response['shared songs']) {
		$('#song-rec').append(`<li>${item}</li>`);
		}

	});


});


$('#login').on('submit', (evt) => {
	evt.preventDefault();
	console.log('hiiiii');




	// clear existing info in here

	// hide the other sections


	// disable button 



	// show name, email, fave songs, fave artists
	$.get('/api/login', (response) => {
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
$('#logout').on('click', (evt) => {
	evt.preventDefault();
	
	console.log('hello');
});


