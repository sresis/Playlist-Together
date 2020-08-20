from model import db, User, Playlist, Song_Pref, Artist_Pref, Song_Rec, Song, connect_to_db
import model
import api
from random import choice, randint, sample 
import pdb
import statistics

def create_playlist_song(playlist_song_id, song_id, playlist_id):
	"""Creates a playlist song and adds to DB."""

	playlist_song = Playlist_Song(playlist_song_id=playlist_song_id, 
		song_id=song_id, playlist_id=playlist_id)
	db.session.add(rec_track)
	db.session.commit()

	return playlist_song