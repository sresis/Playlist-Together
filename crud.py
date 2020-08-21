#import server
from model import (db, User, Playlist, Song_Pref, 
Artist_Pref, Song_Rec, Playlist_Song, Playlist_User, Song, connect_to_db)
import model
import api
from random import choice, randint, sample 
import pdb
import statistics
from DB import playlist_song, playlist, playlist_user

#import pdb; pdb.set_trace()
#model.connect_to_db(server.app)




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

def create_song_pref(song_title, user_id, song_uri):
	"""Creates a song preference for a user."""
	song_uri = api.get_song_id(song_title)

	song_pref = Song_Pref(song_title=song_title, user_id=user_id, song_uri=song_uri)

	db.session.add(song_pref)
	db.session.commit()

	return song_pref

def create_recommended_track(user_id, song_uri, song_title, song_id):
	"""Creates a recommended track for the user and adds it to the database."""
	# to implement

	rec_track = Song_Rec(user_id=user_id, song_uri=song_uri, song_title=song_title, song_id=song_id)

	db.session.add(rec_track)
	db.session.commit()

	return rec_track

def create_song(song_title, song_uri, tempo, valence, danceability, 
	energy, loudness, acousticness, speechiness, song_artist):
	"""Creates a Song and adds it to the database."""

	song = Song(song_title=song_title, song_uri=song_uri, tempo=tempo, valence=valence, 
		danceability=danceability, energy=energy, loudness=loudness, 
		acousticness=acousticness, speechiness=speechiness, song_artist=song_artist)

	db.session.add(song)
	db.session.commit()

	return song 

def get_song_id(uri):
	"""Returns the song ID for a given URI."""


	song = Song.query.filter(Song.song_uri == uri).first()
	return_value = song.song_id

	return return_value


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

def get_user_song_prefs(user_id):
	"""Gets all song prefs for a user."""

	return Song_Pref.query.filter(Song_Pref.user_id == user_id)

def get_user_song_recs(user_id):
	"""Gets all song recs for a user."""

	return Song_Rec.query.filter(Song_Rec.user_id == user_id)



def get_all_song_recs():
    """Return all song recs."""

    return Song_Rec.query.all()



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
## make a db folder and have subfolders for each table. User.py for user functions etc
def get_recommended_tracks(user_id):
	"""Makes recommended tracks for a user given Spotify's ability to generate based on 
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




def get_recommended_songs(user_id):
	"""Returns all recommended songs for a user."""

	return Song_Rec.query.filter(Song_Rec.user_id == user_id)

def get_song_attributes(user_id):
	"""Averages the values of a particular song attribute across all recommended songs for a user."""

	q = db.session.query(Song_Rec, Song).join(Song).filter(Song_Rec.user_id == user_id).all()

	#create dictionary to store values for each attribute
	all_attributes = {
	'tempo': [],
	'valence': [],
	'danceability': [],
	'energy': [],
	'loudness': [],
	'acousticness': [],
	'speechiness': []
	}
	for item in q:

		# add attribute to each song to a list stored in key-value pair

		all_attributes['tempo'].append(item[1].tempo)
		all_attributes['valence'].append(item[1].valence)
		all_attributes['danceability'].append(item[1].danceability)
		all_attributes['energy'].append(item[1].energy)
		all_attributes['loudness'].append(item[1].loudness)
		all_attributes['acousticness'].append(item[1].acousticness)
		all_attributes['speechiness'].append(item[1].speechiness)


	return all_attributes
def get_average(attribute_dict):
	"""returns the average for each value."""


	averages = {
	'tempo': 0,
	'valence': 0,
	'danceability': 0,
	'energy': 0,
	'loudness': 0,
	'acousticness': 0,
	'speechiness': 0

	}
	# get the mean and add it to the dict
	for item in attribute_dict:
		averages['tempo'] = statistics.mean(attribute_dict['tempo'])
		averages['valence'] = statistics.mean(attribute_dict['valence'])
		averages['danceability'] = statistics.mean(attribute_dict['danceability'])
		averages['energy'] = statistics.mean(attribute_dict['energy'])
		averages['loudness'] = statistics.mean(attribute_dict['loudness'])
		averages['acousticness'] = statistics.mean(attribute_dict['acousticness'])
		averages['speechiness'] = statistics.mean(attribute_dict['speechiness'])


	return averages

def get_stdev(attribute_dict):
	"""returns the average for each value."""


	stdev = {
	'tempo': 0,
	'valence': 0,
	'danceability': 0,
	'energy': 0,
	'loudness': 0,
	'acousticness': 0,
	'speechiness': 0

	}
	# get the stdev and add it to the dict
	for item in attribute_dict:
		stdev['tempo'] = statistics.stdev(attribute_dict['tempo'])
		stdev['valence'] = statistics.stdev(attribute_dict['valence'])
		stdev['danceability'] = statistics.stdev(attribute_dict['danceability'])
		stdev['energy'] = statistics.stdev(attribute_dict['energy'])
		stdev['loudness'] = statistics.stdev(attribute_dict['loudness'])
		stdev['acousticness'] = statistics.stdev(attribute_dict['acousticness'])
		stdev['speechiness'] = statistics.stdev(attribute_dict['speechiness'])


	return stdev



def get_shared_tracks(user_1, user_2):
	"""Returns shared recommended tracks for 2 users."""

	# gets recommended songs for each user
	user_1_songs = Song_Rec.query.filter(Song_Rec.user_id == user_1)
	user_2_songs = Song_Rec.query.filter(Song_Rec.user_id == user_2)

	# checks if there are any songs in common
	shared_songs = []
	for item1 in user_1_songs:
		for item2 in user_2_songs:
			if item1 == item2 and item1 not in shared_songs:
				name = api.get_song_title(item1)
				shared_songs.append(name)
					# add to playlist songs db

	return shared_songs

def get_similar_songs(user_1, user_2, song_count_max):
	"""Gets similar songs from user_2 based on user_1 averages."""



	# pulls attributes for each of the user's songs
	user_1_attributes = get_song_attributes(user_1)

	#gets the avg and stdev for user
	user_1_avg = get_average(user_1_attributes)
	user_1_stdev = get_stdev(user_1_attributes)

	#stores similar songs in a list
	similar_songs = []

	# gets averages for each attribute
	user_1_tempo = user_1_avg['tempo']
	user_1_valence = user_1_avg['valence']
	user_1_speechiness = user_1_avg['speechiness']
	user_1_acousticness = user_1_avg['acousticness']
	user_1_danceability = user_1_avg['danceability']
	user_1_energy = user_1_avg['energy']
	user_1_loudness = user_1_avg['loudness']


	# gets stdev for each attribute
	user_1_tempo_sd = user_1_stdev['tempo']
	user_1_valence_sd = user_1_stdev['valence']
	user_1_speechiness_sd = user_1_stdev['speechiness']
	user_1_acousticness_sd = user_1_stdev['acousticness']
	user_1_danceability_sd = user_1_stdev['danceability']
	user_1_energy_sd = user_1_stdev['energy']
	user_1_loudness_sd = user_1_stdev['loudness']



	#joins the Song and Song_Rec table for user 2
	q = db.session.query(Song_Rec, Song).join(Song).filter(Song_Rec.user_id == user_2).all()

	## list to store the songs and similarity rating. this will then be sorted
	all_song_similarities = []

	for item in q:

		# if valence is within range
		valence_z = abs((item[1].valence - user_1_valence) / user_1_valence_sd)
		speechiness_z = abs((item[1].speechiness - user_1_speechiness) / user_1_speechiness_sd)
		acousticness_z = abs((item[1].acousticness - user_1_acousticness) / user_1_acousticness_sd)
		danceability_z = abs((item[1].danceability - user_1_danceability) / user_1_danceability_sd)
		energy_z = abs((item[1].energy - user_1_energy) / user_1_energy_sd)
		loudness_z = abs((item[1].loudness - user_1_loudness) / user_1_loudness_sd)

		# calculates the average of the z-scores to give a "similarity score"
		similarity_score = statistics.mean([valence_z, speechiness_z, 
			acousticness_z, danceability_z, energy_z, loudness_z])


		song_similarity = [item[1].song_title, similarity_score, item[1].song_id]
		all_song_similarities.append(song_similarity)

	sorted_list = playlist.sort_songs(all_song_similarities)

	#list to store matching songs up to max song count
	matching_songs = []
	i = 0
	while i < song_count_max:
		matching_songs.append(sorted_list[i])
		i += 1

	return matching_songs

def get_all_similar_songs(user_1, user_2, target_songs):
	"""Runs the get similar songs both ways to return all shared and similar songs for both users."""
	
	list_1 = get_similar_songs(user_1, user_2, target_songs)
	list_2 = get_similar_songs(user_2, user_1, target_songs)
	list_3 = get_shared_tracks(user_1, user_2)


	shared_list = []
	for item in list_1:
		shared_list.append(item)

	for item in list_2:
		shared_list.append(item)
	for item in list_3:
		shared_list.append(item)

	# create instance of Playlist class
	new_playlist = playlist.create_playlist()

	# creates playlist user instances
	playlist_user.create_playlist_user(user_1, new_playlist.playlist_id)
	playlist_user.create_playlist_user(user_2, new_playlist.playlist_id)

	#adds shared songs to playlist
	song_titles = []
	for item in shared_list:

		# adds playlist song with song ID and playlist ID as arguments
		playlist_song.creat_playlist_song(item[2], new_playlist.playlist_id)
		song_titles.append(item[0])


	return song_titles






