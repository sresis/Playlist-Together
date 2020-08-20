from model import db, Playlist_Song, connect_to_db
import model
import api
from random import choice, randint, sample 
import pdb
import statistics

def create_playlist_song(song_id, playlist_id):
	"""Creates a playlist song and adds to DB."""

	playlist_song = Playlist_Song(song_id=song_id, playlist_id=playlist_id)
	db.session.add(playlist_song)
	db.session.commit()

	return playlist_song