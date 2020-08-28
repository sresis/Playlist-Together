"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session, jsonify,
				   redirect)
from model import connect_to_db, User, Song_Pref, Artist_Pref
import crud ##comment out if you want to -i into crud.py
import api
from DB import user_details

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

# @app.route('api/create_prof', methods=['POST'])
# def create_profile():
# 	"""returns the results from create profile form."""



@app.route('/users')
def all_users():
	"""View all users."""

	users = crud.get_users()


	return render_template('all_users.html', users=users)

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

@app.route('/users', methods=['POST'])
def register_user():
	"""Creates a new user."""

	# gets the email, password, fname and lastname for user
	email = request.form.get('email')
	fname = request.form.get('fname')
	lname = request.form.get('lname')
	password = request.form.get('password')


	# checks if email is already registered
	# if registered, tell them account is already registered
	user = crud.get_user_by_email(email)
	if user:
		flash('This email is already registered. Please try again.')
	#if not registered, create a new instance of user
	else:
	
		crud.create_user(email, fname, lname, password)
		flash('Success! You can now log in.')

	#redirects back to homepage
	return redirect('/')
	
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

@app.route('/api/users')
def get_users():
	"""View all users."""

	# gets all users and jsonifies it

	users = crud.get_users()
	users_dict = []
	for user in users:
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
	


	# gets attributes of user's recommended tracks
	shared_prefs = crud.get_shared_tracks(session_user, user_id)
	song_attributes = crud.get_song_attributes(session_user)
	averages = crud.get_average(song_attributes)
	stdev = crud.get_stdev(song_attributes)
	
	similar_songs = crud.get_all_similar_songs(session_user, user_id, 10)
	
	combined_dict = {
		'user': json_user,
		'song_pref': song_dict,
		'artist_pref': artist_list,
		'playlist': similar_songs
	}
	return jsonify(combined_dict)

		
@app.route('/api/logout')

def logout():
	"""enables user to logout."""
	if 'user_id' in session:
		session.pop('username', None)
		alert('you have logged out!')
	return jsonify({'message': 'you have logged out'})

@app.route('/profile', methods=['POST'])
def login_user():
	## right now it only lets you log in with existing
	#session['show_login'] == True
	# gets email and password from form
	email = request.form['email']
	password = request.form['password']

	##

	# gets user info based on email
	user = crud.get_user_by_email(email)
	session['user'] = []
	# checks if pasword in db matches form pasword
	if user.password == password:
		#adds user to session
		session['user'] = user.user_id
		flash('you are logged in!')
		artist_prefs = crud.get_user_artist_prefs(user.user_id)
		song_prefs = crud.get_user_song_prefs(user.user_id)
		x = user.as_dict
		return render_template('user_profile.html', user=user, artist_prefs=artist_prefs,
			song_prefs=song_prefs, x=x)
			## here you would pass in a  jsnonified dict. all the info for this user. make dict with that in it
			# parse json string. use info from that to build out components
			#maybe do request.__.get
	else:
		flash('incorrect login.')
		return redirect('/')

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

	averages = crud.get_average(song_attributes)
	stdev = crud.get_stdev(song_attributes)

	similar_songs = crud.get_all_similar_songs(session_user, user_id, 10)

	return jsonify({'shared songs': similar_songs})
## separate route to let them share it
## only one HTML template with Root component
# server routes would no longer render templates. they would all be returning JSON
# be processing this data in javascript

# be using react. fetch function to get things back from .jsx
@app.route('/users/<user_id>')
def show_user(user_id):
	"""Show details on a particular user."""

	user = crud.get_user_by_id(user_id)
	artist_prefs = crud.get_user_artist_prefs(user_id)
	song_prefs = crud.get_user_song_prefs(user_id)
	rec_tracks = crud.get_recommended_tracks(user_id)

	rec_names = []
	for track in rec_tracks:
		text_format = api.get_song_title(track)
		rec_names.append(text_format)

	session_user = session['user']
	x = crud.get_user_by_id(session_user)
	fname = x.fname

	# gets attributes of user's recommended tracks

	shared_prefs = crud.get_shared_tracks(user_id, session['user'])
	song_attributes = crud.get_song_attributes(user_id)

	averages = crud.get_average(song_attributes)
	stdev = crud.get_stdev(song_attributes)

	similar_songs = crud.get_all_similar_songs(session['user'], user_id, 10)
		# sQLAlchemy objects is not JSON serializable
		#potentially JSON.dumps?
		#maybe look for a library

		# start with one route to turn into JSOn and modify on the front end

## dict of dictorionaries that I am
	return render_template('user_details.html', user=user, artist_prefs=artist_prefs, song_prefs=song_prefs,
		rec_names=rec_names, shared_prefs=shared_prefs,
		song_attributes=song_attributes, averages=averages, stdev=stdev, 
		similar_songs=similar_songs, fname=fname)

@app.route('/profile/add_prefs')
def show_prefs_form():
	"""Shows form for user to input their preferences."""

	# ## next: how to add this to the table
	user_id = session['user']
	user = crud.get_user_by_id(user_id)

	return render_template('add_prefs.html')

@app.route('/api/add_song_pref', methods=['POST'])
def add_song_pref_1():
	"""enables user to add a song preference."""

	user_id = session['user']

	# gets song URI from title in form
	user_data = request.get_json()
	song_title = user_data['songPref']
	song_uri = api.get_song_id(song_title)

	#adds song pref to db
	song_pref = crud.create_song_pref(song_title, user_id, song_uri)

	return jsonify({'status': 'song pref added'})

@app.route('/api/add_artist_pref', methods=['POST'])
def add_artist_pref():
	"""enables user to add an artist preference."""

	user_id = session['user']

	# gets artist input from the form
	user_data = request.get_json()
	artist = user_data['artistPref']
	

	#adds artist pref to db
	artist_pref = crud.create_artist_pref(artist, user_id)

	return jsonify({'status': 'artist pref added'})

@app.route('/profile/add_prefs', methods=['POST'])
def add_users_prefs():
	"""enables users to add their preferences."""

	#gets artist and songs from input form
	artist = request.form.get('artist')
	song_title = request.form.get('song')

	# Adds song and artist prefs to the User
	user_id = session['user']
	user = crud.get_user_by_id(user_id)
	if artist:
		artist_pref = crud.create_artist_pref(artist, user_id)
	if song_title:
		#gets song id
		song_uri = api.get_song_id(song_title)
		song_pref = crud.create_song_pref(song_title, user_id, song_uri)
	artist_prefs = crud.get_all_artist_prefs()
	song_prefs = crud.get_all_song_prefs()
	song_recs = crud.get_all_song_recs()


	return render_template('updated_profile.html', artist_prefs=artist_prefs, 
		song_prefs=song_prefs, user=user, song_recs=song_recs)



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
	user_1_avg = crud.get_average(user_1_attributes)
	user_1_stdev = crud.get_stdev(user_1_attributes)


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
	app.run(host='0.0.0.0', debug=True)
