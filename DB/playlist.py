from model import db, Playlist, connect_to_db
import api


def create_playlist():
	"""Creates a playlist and adds to DB."""

	playlist = Playlist()
	db.session.add(playlist)
	db.session.commit()

	return playlist

def sort_songs(songs_list):
	"""Sorts the songs based on 2nd item in list.""" 
	return(sorted(songs_list, key = lambda x: x[1])) 