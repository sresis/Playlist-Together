from model import db, User, Playlist, Song_Pref, Artist_Pref, connect_to_db
import api
from random import choice, randint, sample 



def create_user(email, fname, lname, password):
    """Create and return a new user."""

    user = User(email=email, fname=fname, lname=lname, password=password)

    db.session.add(user)
    db.session.commit()

    return user

def create_artist_pref(artist_name, user_id):
	"""Creates an artist preference for a given user."""

	artist_uri = api.get_artist_id(artist_name)

	artist_pref = Artist_Pref(artist_name=artist_name, user_id=user_id, artist_uri=artist_uri)

	db.session.add(artist_pref)
	db.session.commit()

	return artist_pref

def create_song_pref(song_title, user_id):
	"""Creates a song preference for a user."""
	song_uri = api.get_song_id(song_title)

	song_pref = Song_Pref(song_title=song_title, user_id=user_id, song_uri=song_uri)

	db.session.add(song_pref)
	db.session.commit()

	return song_pref



def get_users():
    """Return all users."""

    return User.query.all()

def get_user_by_id(user_id):
	"""returns a user based on their ID."""

	return User.query.get(user_id)

def get_user_by_email(email):
	"""Returns a user based on their email."""

	return User.query.filter(User.email == email).first()


def get_all_artist_prefs():
    """Return all artist prefs."""

    return Artist_Pref.query.all()

def get_all_song_prefs():
    """Return all song prefs."""

    return Song_Pref.query.all()

def return_users_artist_prefs(user_id):
	"""Returns all artist prefs for a user in a list format."""
	prefs = Artist_Pref.query.filter(Artist_Pref.user_id == user_id)
	prefs_list = []
	for item in prefs:
		prefs_list.append(item.artist_name)

	return prefs_list

def return_users_track_prefs(user_id):
	"""Returns all track prefs for a user in a list format."""
	prefs = Song_Pref.query.filter(Song_Pref.user_id == user_id)
	prefs_list = []
	for item in prefs:
		prefs_list.append(item.song_title)

	return prefs_list	

def get_recommended_tracks(user_id):
	"""Gets recommended tracks for a user given Spotify's ability to generate based on 
	up to 5 seeds."""

	# number of songs and artists to be included as seeds
	num_songs = choice([2, 3])
	num_artists = 5 - num_songs

	# chooses random songs and artists to be used in the Spotify API query
	user_artists = return_users_artist_prefs(user_id)
	user_tracks = return_users_track_prefs(user_id)
	artist_list = sample(user_artists, num_artists)
	track_list = sample(user_tracks, num_songs)


	# get IDs for each track in track list
	track_ids_list = []
	for track in track_list:
		track_id = api.get_song_id(track)
		track_ids_list.append(track_id)

	# gets ID for each artist in artist list
	artist_ids_list = []
	for artist in artist_list:
		artist_id = api.get_artist_id(artist)
		artist_ids_list.append(artist_id)

	recommended_tracks = api.get_recs_based_on_seed(track_ids_list, artist_ids_list)

	# returns songs in ID format
	return recommended_tracks

def get_shared_tracks(user_1, user_2):
	"""Returns shared recommended tracks for 2 users."""

	# gets recommended songs for each user
	user_1_songs = get_recommended_tracks(user_1)
	user_2_songs = get_recommended_tracks(user_2)

	# checks if there are any songs in common
	shared_songs = []
	for item1 in user_1_songs:
		for item2 in user_2_songs:
			if item1 == item2 and item1 not in shared_songs:
				name = api.get_song_title(item1)
				shared_songs.append(name)

	return shared_songs






