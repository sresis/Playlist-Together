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
# make an if name = main



def create_user(email, fname, lname, password):
    """Create and return a new user."""

    user = User(email=email, fname=fname, lname=lname, password=password)

    db.session.add(user)
    db.session.commit()

    return user

def create_artist_pref(artist_name, user_id):
	"""Creates an artist preference for a given user."""

	artist_uri = api.get_artist_id(artist_name)
	# make sure no duplicate artists
	artist_pref = Artist_Pref(artist_name=artist_name, user_id=user_id, artist_uri=artist_uri)
	if get_artist_pref_id(artist_uri, user_id):
		return 'error'
	else:
		db.session.add(artist_pref)
		db.session.commit()
		return artist_pref

def create_song_pref(song_title, user_id, song_uri):
	"""Creates a song preference for a user."""
	song_uri = api.get_song_id(song_title)

	# make sure song pref is not already added for this user
	if song_title in return_users_track_prefs(user_id):
		return 'error'

	else: 

		song_pref = Song_Pref(song_title=song_title, user_id=user_id, song_uri=song_uri)
		db.session.add(song_pref)
		db.session.commit()
		return song_pref

def create_recommended_track(user_id, song_uri, song_title, song_id):
	"""Creates a recommended track for the user and adds it to the database."""
	# to implement


	# makes sure it isn't in there

	rec_track = Song_Rec(user_id=user_id, song_uri=song_uri, song_title=song_title, song_id=song_id)
	if get_song_rec_id(song_uri, user_id) == None:
		db.session.add(rec_track)
		db.session.commit()
		return rec_track
	else:
		return None

def create_song(song_title, song_uri, tempo, valence, danceability, 
	energy, loudness, acousticness, speechiness, song_artist):
	"""Creates a Song and adds it to the database."""

	song = Song(song_title=song_title, song_uri=song_uri, tempo=tempo, valence=valence, 
		danceability=danceability, energy=energy, loudness=loudness, 
		acousticness=acousticness, speechiness=speechiness, song_artist=song_artist)

	# makes sure the song isn't already in the db
	if get_song_id(song_uri) == None:

		db.session.add(song)
		db.session.commit()

		return song 
	else:
		return song

def get_song_id(uri):
	"""Returns the song ID for a given URI."""


	song = Song.query.filter(Song.song_uri == uri).first()
	if song:
		return song.song_id
	else:
		return None

def get_song_title(song_id):
	"""Returns the song title for a given song id."""


	song = Song.query.filter(Song.song_id == song_id).first()
	if song:
		return song.song_title
	else:
		return None

def get_song(song_id):
	"""Returns the song for a given song id."""


	song = Song.query.filter(Song.song_id == song_id).first()
	if song:
		return song
	else:
		return None

def get_song_rec_id(uri, user_id):
	"""Returns the song rec ID for a given URI and user ID."""


	song = Song_Rec.query.filter(Song_Rec.song_uri==uri, 
		Song_Rec.user_id==user_id).first()
	

	if song:
		return song.song_rec_id

	else:
		return None

def get_artist_pref_id(artist_uri, user_id):
	"""Returns the artist rec pref for a given URI and user ID."""


	artist = Artist_Pref.query.filter(Artist_Pref.artist_uri==artist_uri, 
		Artist_Pref.user_id==user_id).first()
	

	if artist:
		return artist.artist_pref_id

	else:
		return None


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

def get_user_artist_prefs(user_id):
	"""Gets all song prefs for a user."""

	return Artist_Pref.query.filter(Artist_Pref.user_id == user_id)

def get_user_song_recs(user_id):
	"""Gets all song recs for a user."""

	return Song_Rec.query.filter(Song_Rec.user_id == user_id)

def user_has_song_recs(user_id):
	"""Gets all song recs for a user."""

	has_recs = Song_Rec.query.filter(Song_Rec.user_id == user_id).first()
	if has_recs:
		return True
	else:
		return False

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
	i = 0
	# run this 2 times
	rec_list = []
	while i < 2:

		#reset each loop
		track_ids_list = []
		artist_ids_list = []
		artist_list = []
		track_list = []
		# number of songs and artists to be included as seeds
		num_songs = choice([2, 3])
		num_artists = 5 - num_songs

		# chooses random songs and artists to be used in the Spotify API query
		user_artists = return_users_artist_prefs(user_id)
		user_tracks = return_users_track_prefs(user_id)
		artist_list = sample(user_artists, num_artists)
		track_list = sample(user_tracks, num_songs)
		recommended_tracks = []


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
		for item in recommended_tracks:
			rec_list.append(item)
		i += 1
	print(rec_list)


	


	# returns songs in ID format
	return rec_list




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

	## could do a join here
	# gets recommended songs for each user
	user_1_songs = Song_Rec.query.filter(Song_Rec.user_id == user_1)
	user_2_songs = Song_Rec.query.filter(Song_Rec.user_id == user_2)
	# take inner join or 2 sets
	#use song id as comparator 
	# checks if there are any songs in common
	shared_songs = []
	for item1 in user_1_songs:
		for item2 in user_2_songs:
			if item1.song_id == item2.song_id:
				shared_songs.append([(item1.song_title), (item1.song_uri)])
					# add to playlist songs db

	return shared_songs

def get_similar_songs(user_1, user_2, song_count_max):
	"""Gets similar songs from user_2 based on user_1 averages."""

	## make it so it doesn't sort everything
	# pulls attributes for each of the user's songs
	user_1_attributes = get_song_attributes(user_1)

	user_1_stdev = get_stdev(user_1_attributes)

	#stores similar songs in a list

	user_1x = get_user_by_id(user_1)

	# gets averages for each attribute
	user_1_tempo = user_1x.user_tempo
	user_1_valence = user_1x.user_valence
	user_1_speechiness = user_1x.user_speechiness
	user_1_acousticness = user_1x.user_acousticness
	user_1_danceability = user_1x.user_danceability
	user_1_energy = user_1x.user_energy
	user_1_loudness = user_1x.user_loudness


	# gets stdev for each attribute
	user_1_tempo_sd = user_1_stdev['tempo']
	user_1_valence_sd = user_1_stdev['valence']
	user_1_speechiness_sd = user_1_stdev['speechiness']
	user_1_acousticness_sd = user_1_stdev['acousticness']
	user_1_danceability_sd = user_1_stdev['danceability']
	user_1_energy_sd = user_1_stdev['energy']
	user_1_loudness_sd = user_1_stdev['loudness']
	## could denormalize these potentially?
	# would have to recalculate when they add a new song


	#joins the Song and Song_Rec table for user 2
	q = db.session.query(Song_Rec, Song).join(Song).filter(Song_Rec.user_id == user_2).all()

	## list to store the songs and similarity rating. this will then be sorted
	all_song_similarities = []

	for item in q:

		# calculate z-score for each attribute
		valence_z = abs((item[1].valence - user_1_valence) / user_1_valence_sd)
		speechiness_z = abs((item[1].speechiness - user_1_speechiness) / user_1_speechiness_sd)
		acousticness_z = abs((item[1].acousticness - user_1_acousticness) / user_1_acousticness_sd)
		danceability_z = abs((item[1].danceability - user_1_danceability) / user_1_danceability_sd)
		energy_z = abs((item[1].energy - user_1_energy) / user_1_energy_sd)
		loudness_z = abs((item[1].loudness - user_1_loudness) / user_1_loudness_sd)

		# calculates the average of the z-scores to give a "similarity score"
		similarity_score = statistics.mean([valence_z, speechiness_z, 
			acousticness_z, danceability_z, energy_z, loudness_z])


		song_similarity = [item[1].song_title, similarity_score, item[1].song_uri]
		all_song_similarities.append(song_similarity)

	sorted_list = playlist.sort_songs(all_song_similarities)

	#list to store matching songs up to max song count
	matching_songs = []
	i = 0
	while i < song_count_max:
		if sorted_list[i] not in matching_songs:
			print(sorted_list[i])
			matching_songs.append(sorted_list[i])
			i += 1
		else:
			song_count_max += 1
			i += 1

	return matching_songs

def get_all_similar_songs(user_1, user_2, target_songs):
	"""Runs the get similar songs both ways to return all shared and similar songs for both users."""
	
	list_1 = get_similar_songs(user_1, user_2, target_songs)
	list_2 = get_similar_songs(user_2, user_1, target_songs)
	list_3 = get_shared_tracks(user_1, user_2)

	# make sure shared songs are showing up!!
	song_uris = []
	shared_list = []
	for item in list_1:
		shared_list.append([(item[0]), (item[2])])

	for item in list_2:
		if item not in list_3 and item not in list_1:
			shared_list.append([(item[0]), (item[2])])
	for item in list_3:
		if item not in list_1 and item not in list_2:
			shared_list.append([(item[0]), (item[1])])

	#adds shared songs to playlist

	for item in shared_list:
		
		song_uris.append(item)

	# return the song_ids and then do something with the total
	return shared_list



