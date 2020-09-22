"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session, jsonify,
				   redirect)
from model import connect_to_db, User, Song_Pref, Artist_Pref, Song
import crud ##comment out if you want to -i into crud.py
import api
from DB import user_details, playlist, playlist_user, playlist_song
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def root():
	"""view the homepage."""

	
	return render_template('root.html')
	#return render_template('index.html')
	#return render_template('homepage.html')


@app.route('/api/register', methods=['POST'])
def create_user():
	""" creates a new user."""
	user_data = request.get_json()
	fname = user_data['fname']
	lname = user_data['lname']
	email = user_data['email']
	password = user_data['password']
	
	# checks if email is already registered
	# if registered, tell them account is already registered
	user = crud.get_user_by_email(email)
	if user:
		return jsonify({'status': 'email already exists'})

	#if not registered, create a new instance of user
	else:
		crud.create_user(email, fname, lname, password)
		return jsonify({'status': 'created user'})


	
@app.route('/api/login', methods=['POST'])
def login():
	"""Enables user to log in."""

	user_data = request.get_json()
	email = user_data['email']
	password = user_data['password']

	# get the user based on the email
	user = crud.get_user_by_email(email)

	#adds user to session
	

	#checks if email is registered
	if not user:
		return jsonify({'status': 'email error'})

	#checks if password is correct
	elif user.password != password:
		return jsonify({'status': 'password error'})

	# if password/email combo is correct, return 'correct' status
	else:
		session['user'] = user.user_id
		return jsonify({'status': 'correct'})

@app.route('/api/check_login')
def check_login_status():

	"""checks if a user is logged in."""
	if session.get('user'):
		return jsonify({'logged_in': True})
	else:
		return jsonify({'logged_in': False})


@app.route('/api/users')
def get_users():
	"""View all users."""
	user_id = session['user']
	current_user = crud.get_user_by_id(user_id)
	# gets all users and jsonifies it

	users = crud.get_users()
	users_dict = []
	for user in users:
		#doesn't show current user
		if user != current_user:
			x = User.as_dict(user)
			users_dict.append(x)


	#users = crud.get_users()

	return jsonify(users_dict)


@app.route('/api/profile')
def show_user_prof():
	"""Lets logged in user view their profile."""

	# gets the user info and jsonifies it 
	user_id = session['user']
	user = crud.get_user_by_id(user_id)

	#jsonifies user info
	json_user = User.as_dict(user)

	# gets the user song prefs and jsonifies
	user_song_prefs = crud.get_user_song_prefs(user_id)
	# goes through all user song prefs and adds to list
	# song_list = []
	song_dict = []
	for song in user_song_prefs:
		x = Song_Pref.as_dict(song)
		song_dict.append(x)

	# gets the user artist prefs and jsonifies
	user_artist_prefs = crud.get_user_artist_prefs(user_id)
	# goes through all user artist prefs and adds to list
	# song_list = []
	artist_list = []
	for artist in user_artist_prefs:
		x = Artist_Pref.as_dict(artist)
		artist_list.append(x)

	combined_dict = {
	'user': json_user,
	'song_pref': song_dict,
	'artist_pref': artist_list
	}
	

	return jsonify(combined_dict)

@app.route('/api/user-detail/<user_id>', methods=['POST'])
def view_user(user_id):
	"""Returns the selected user's profile data."""

	user = crud.get_user_by_id(user_id)

	#jsonifies user info
	json_user = User.as_dict(user)

	# gets the user song prefs and jsonifies
	user_song_prefs = crud.get_user_song_prefs(user_id)
	# goes through all user song prefs and adds to list
	# song_list = []
	song_dict = []
	for song in user_song_prefs:
		x = Song_Pref.as_dict(song)
		song_dict.append(x)

	# gets the user artist prefs and jsonifies
	user_artist_prefs = crud.get_user_artist_prefs(user_id)
	# goes through all user artist prefs and adds to list
	# song_list = []
	artist_list = []
	for artist in user_artist_prefs:
		x = Artist_Pref.as_dict(artist)
		artist_list.append(x)

	session_user = session['user']
	## get the user id
	
	
	combined_dict = {
		'user': json_user,
		'song_pref': song_dict,
		'artist_pref': artist_list,
	}
	return jsonify(combined_dict)

@app.route('/api/combined_playlist/<user_id>', methods=['POST'])
def view_combined_playlist(user_id):
	"""Returns the combined playlist."""

	user = crud.get_user_by_id(user_id)

	#jsonifies user info
	json_user = User.as_dict(user)

	session_user = session['user']
	## get the user id
	
	## gets the playlist name from form
	


	# gets attributes of user's recommended tracks
	shared_prefs = crud.get_shared_tracks(session_user, user_id)
	song_attributes = crud.get_song_attributes(session_user)
	stdev = crud.get_stdev(song_attributes)
	
	similar_songs = crud.get_all_similar_songs(session_user, user_id, 10)
	
	combined_dict = {
		'user': json_user,
		'playlist': similar_songs,
	}
	return jsonify(combined_dict)


@app.route('/api/saved-playlists')
def view_saved_playlists():
	"""Shows the user's saved playlists."""
	user_id = session['user']
	user_playlists = playlist_user.get_user_playlist(user_id)
	print(user_playlists)
	return jsonify({'playlists': user_playlists})


@app.route('/api/token')
def get_spotify_token():
	"""Gets secret token."""
	token = api.get_token()
	return jsonify({'token': token})

@app.route('/api/playlist-detail/<playlist_id>')
def view_playlist_details(playlist_id):
	"""Returns the playlist details."""
	# get playlist name
	playlist_name = playlist.get_playlist_name(playlist_id)
	#get songs in playlist
	song_ids = playlist_song.get_playlist_songs(playlist_id)
	songs_list = []
	for item in song_ids:
		song = crud.get_song(item)
		songs_list.append(song)

	#store in the dict
	song_dict = []
	for song in songs_list:
		x = Song.as_dict(song)
		song_dict.append(x)

	return jsonify({'songs': song_dict,
					'playlist_name': playlist_name})

@app.route('/api/similar-users')
def get_similar_user():
	"""Returns the users that are most similar to the session user."""

	# gets session user's info
	user_id = session['user']
	user = crud.get_user_by_id(user_id)
	

	# get stdev data for user
	session_user_attributes = crud.get_song_attributes(user_id)

	session_user_stdev = crud.get_stdev(session_user_attributes)
	print(session_user_stdev)
	# get all users
	all_users = crud.get_users()


	#stores min difference
	min_diff = [1000, '']
	# iterate through all users that are not the session user that have recs.
	for user_x in all_users:
		if user_x != user and user_x.user_id == 2:
			user_diff = (abs(user.user_valence - user_x.user_valence)/session_user_stdev['valence']) 
			+ (abs(user.user_speechiness - user_x.user_speechiness)/session_user_stdev['speechiness'])
			+ (abs(user.user_acousticness - user_x.user_acousticness)/session_user_stdev['acousticness'])
			+ (abs(user.user_energy - user_x.user_energy)/session_user_stdev['energy'])
			+ (abs(user.user_danceability - user_x.user_danceability)/session_user_stdev['danceability'])
			+ (abs(user.user_loudness - user_x.user_loudness)/session_user_stdev['loudness'])
			# if the difference is smaller, update the array with the difference and ID
			if user_diff < min_diff[0]:
				min_diff = [user_diff, user_x.email]
	
	similar_user_email = min_diff[1]
	similar_user = crud.get_user_by_email(similar_user_email)

	# adjust loudness for graph
	adj_user_loudness = abs(user.user_loudness)/10
	adj_similar_user_loudness = abs(similar_user.user_loudness)/10
	return jsonify({'similar_user': similar_user_email,
					'current_user_info': [user.user_valence, user.user_speechiness, 
					user.user_acousticness, user.user_energy, user.user_danceability, adj_user_loudness],
					'similar_user_info': [similar_user.user_valence, similar_user.user_speechiness, 
					similar_user.user_acousticness, similar_user.user_energy, 
					similar_user.user_danceability, adj_similar_user_loudness]}
					)

		
@app.route('/api/logout')

def logout():
	"""enables user to logout."""
	session.pop('user', None)
	session.pop('rating', None)
	session.pop('show_create_account', None)

	for key in session.keys():
		print(key)
		
	return jsonify({'message': 'you have logged out'})



@app.route('/api/shared_playlist/<user_email>', methods=['POST'])
def show_shared_songs(user_email):
	"""Show shared playlist for current user and selected user."""
	## how to feed in user id here
	## probably need to get and post
   
	session_user = session['user']
	## get the user id
	user = crud.get_user_by_email(user_email)
	user_id = user.user_id

	# gets attributes of user's recommended tracks

	shared_prefs = crud.get_shared_tracks(session_user, user_id)
	song_attributes = crud.get_song_attributes(session_user)
	stdev = crud.get_stdev(song_attributes)

	similar_songs = crud.get_all_similar_songs(session_user, user_id, 10)

	return jsonify({'shared songs': similar_songs})
## separate route to let them share it
## only one HTML template with Root component
# server routes would no longer render templates. they would all be returning JSON
# be processing this data in javascript

# be using react. fetch function to get things back from .jsx

@app.route('/api/save_playlist/<user_id>', methods=['POST'])
def save_shared_playlist(user_id):
	""" saves a shared playlist ."""
	#get session user and user
	#get the shared songs
	#add the shared songs to playlist db
	session_user = session['user']

	shared_prefs = crud.get_shared_tracks(session_user, user_id)
	song_attributes = crud.get_song_attributes(session_user)
	stdev = crud.get_stdev(song_attributes)

	## need to get the playlist name from form
	user_input = request.get_json()
	playlist_name = user_input['playlistName']
	
	similar_songs = crud.get_all_similar_songs(session_user, user_id, 10)
	## get song id for each item
	song_ids = []
	for item in similar_songs:
		song_id = crud.get_song_id(item[1])
		song_ids.append(song_id)

	playlist_1 = playlist_user.save_shared_playlist(session_user, user_id, song_ids, playlist_name)

	

	return jsonify({'status': 'saved'})


@app.route('/api/add_song_pref', methods=['POST'])
def add_song_pref_1():
	"""enables user to add a song preference."""

	user_id = session['user']

	# gets song URI from title in form
	user_data = request.get_json()
	song_title = user_data['songPref']
	song_uri = api.get_song_id(song_title)

	#make sure song pref for user is not already
	result = crud.create_song_pref(song_title, user_id, song_uri)

	if result == 'error':
		return jsonify({'status': 'error - already added'})
	else:
		
		return jsonify({'status': 'song pref added'})


@app.route('/api/add_artist_pref', methods=['POST'])
def add_artist_pref():
	"""enables user to add an artist preference."""

	user_id = session['user']

	# gets artist input from the form
	user_data = request.get_json()
	artist = user_data['artistPref']
	

	#adds artist pref to db
	result = crud.create_artist_pref(artist, user_id)
	if result == 'error':
		return jsonify({'status': 'error - already added'})
	else:
		
		return jsonify({'status': 'artist pref added'})
	
@app.route('/api/get_song_recs', methods=['POST'])
def get_song_recs():
	"""Gets song recommendations for user."""

	# # how to make this so it will update when user updates songs? automatic?
	user_id = session['user']
	user = crud.get_user_by_id(user_id)
	song_recs = crud.get_recommended_tracks(user_id)
	

	# #adds each recommended song to DB
	for song_uri in song_recs:
		#gets song title
		title = api.get_song_title(song_uri)
		

		# gets adio features for song
		audio_fx = api.get_audio_features(song_uri)
		tempo = audio_fx['tempo']
		valence = audio_fx['valence']
		danceability = audio_fx['danceability']
		energy = audio_fx['energy']
		loudness = audio_fx['loudness']
		acousticness = audio_fx['acousticness']
		speechiness = audio_fx['speechiness']

		# gets song artist
		artist = api.get_song_artist(song_uri)

		#creates instance of song in song db
		crud.create_song(title, song_uri, tempo, valence, danceability, 
			energy, loudness, acousticness, speechiness, artist)

		#gets song id
		song_id = crud.get_song_id(song_uri)

		#creates instance of rec track in rec track db 
		crud.create_recommended_track(user_id, song_uri, title, song_id)

	# gets all rec tracks for user	
	user_song_recs = crud.get_user_song_recs(user_id)

	## adds avg attribute values for user and commits to db
	user_1_attributes = crud.get_song_attributes(user_id)

	#gets the avg and stdev for user
	user_1_stdev = crud.get_stdev(user_1_attributes)
	user_1_avg = crud.get_average(user_1_attributes)


	# gets averages for each attribute and adds to db
	valence_avg = user_1_avg['valence']
	user_details.update_valence_value(user, valence_avg)


	speechiness_avg = user_1_avg['speechiness']
	user_details.update_speechiness_value(user, speechiness_avg)

	acousticness_avg = user_1_avg['acousticness']
	user_details.update_acousticness_value(user, acousticness_avg)

	danceability_avg = user_1_avg['danceability']
	user_details.update_danceability_value(user, danceability_avg)

	energy_avg = user_1_avg['energy']
	user_details.update_energy_value(user, energy_avg)

	loudness_avg = user_1_avg['loudness']
	user_details.update_loudness_value(user, loudness_avg)

	## could add a try. if it errors, return error. or do something more nuanced
	return jsonify({'status': 'success'})



if __name__ == '__main__':
	connect_to_db(app)
	app.run()
	#app.run(host='0.0.0.0'), debug=True)
