"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server
import api

from DB import user

os.system('dropdb playlist_combiner')
os.system('createdb playlist_combiner')

model.connect_to_db(server.app)
model.db.create_all()
## encrpyt the passwords you are storing
first_names = ['Mike', 'Melanie', 'Adam', 'Eve', 'Jenny', 'Jason', 'Mitch', 'Yolanda', 'Avery', 'Pat', 'Meg', 'Luke']
last_names = ['Roberts', 'Lee', 'Garcia', 'Smith', 'Jones', 'Yee', 'Washington', 'Williams', 'Lopez', 'Kirk', 'Henry']
passwords = ['123']

artists = ['Lil Wayne', 'Lizzo', 'Fleetwood Mac', 'Adele', 
		'Kanye West', 'Avicii', 'Eminem', 'Selena Gomez', 'Justin Bieber', 
		'The Killers', 'Coldplay', 'Future', 'Tyga', 'The Rolling Stones',
		'Rihanna', 'Tim McGraw', 'Kane Brown', 'Carrie Underwood', 
		'Taylor Swift', 'Spice Girls', 'Metallica', 'Kendrick Lamar',
		'Green Day', 'Alesso', '50 Cent', 'Justin Timberlake']

songs = ['Miracle Mile', 'A Milli', 'Hollaback Girl', 'Get Low', 'Night Moves', 'Paint It, Black',
		'Hey There Delilah', 'Eye of the Tiger', 'Red Red Wine', '1985', 'Badd', 'Skinny Love', 
		'Whatever You Like', 'No Diggity', 'Budapest', 'Babel', 'Location', 'Grillz', 'Country Sh*t',
		'Trap Queen', 'Watermelon Sugar', 'Savage Love', 'Something I Need' ]
# make  random users
for n in range(1):
	fname = choice(first_names)
	first_names.remove(fname)
	lname = choice(last_names)
	email = f'{fname}_{lname}@gmail.com'
	password = choice(passwords)
	user = crud.create_user(email, fname, lname, password)

	# adds artist preferences for each user
	existing_list = []
	for n in range(5):
		random_artist = choice(artists)
		if random_artist not in existing_list:
			crud.create_artist_pref(random_artist, user.user_id)
			existing_list.append(random_artist)

	# adds song preferences for each user. also adds song to the DB so don't need to keep querying
	existing_songs = []
	for n in range(4):
		random_song = choice(songs)
		
		print(random_song)
		if random_song not in existing_songs:
			uri = api.get_song_id(random_song)
			artist = api.get_song_id(random_song)
			audio_fx = api.get_audio_features(uri)
			tempo = audio_fx['tempo']
			valence = audio_fx['valence']
			danceability = audio_fx['danceability']
			energy = audio_fx['energy']
			loudness = audio_fx['loudness']
			acousticness = audio_fx['acousticness']
			speechiness = audio_fx['speechiness']
			crud.create_song(random_song, uri, tempo, valence, danceability, 
				energy, loudness, acousticness, speechiness, artist)
			song_id = crud.get_song_id(uri)
			crud.create_song_pref(random_song, user.user_id, song_id)
			existing_songs.append(random_song)

	# adds song recs for each user
	#gets recommended songs for user
	song_recs = crud.get_recommended_tracks(user.user_id)
	
	#adds each recommended song to DB. also adds it to Song DB. 
	for song in song_recs:
		#gets song title
		title = api.get_song_title(song)
		artist = api.get_song_artist(song)
		

		#gets all audio features for song
		audio_features = api.get_audio_features(song)
		tempo = audio_features['tempo']
		valence = audio_features['valence']
		danceability = audio_features['danceability']
		energy = audio_features['energy']
		loudness = audio_features['loudness']
		acousticness = audio_features['acousticness']
		speechiness = audio_features['speechiness']
		crud.create_song(title, song, tempo, valence, 
			danceability, energy, loudness, acousticness, 
			speechiness, artist)
		# get song ID and use to create recommended track
		song_id = crud.get_song_id(song)
		crud.create_recommended_track(user.user_id, song, title, song_id)

	# assign valence, danceable, etc values to the user
	# pulls attributes for each of the user's songs
	user_1_attributes = crud.get_song_attributes(user.user_id)

	#gets the avg and stdev for user
	user_1_avg = crud.get_average(user_1_attributes)
	user_1_stdev = crud.get_stdev(user_1_attributes)


	# gets averages for each attribute and adds to db
	valence_avg = user_1_avg['valence']
	user.update_valence_value(user, valence_avg)


	user_speechiness = user_1_avg['speechiness']
	user.update_speechiness_value(user, speechiness_avg)

	user_acousticness = user_1_avg['acousticness']
	user.update_acousticness_value(use, acousticness_avg)

	user_danceability = user_1_avg['danceability']
	user.update_danceability_value(user, danceability_avg)

	user_energy = user_1_avg['energy']
	user.update_energy_value(user, energy_avg)

	user_loudness = user_1_avg['loudness']
	user.update_loudness_value(user, loudness_avg)
	

	





