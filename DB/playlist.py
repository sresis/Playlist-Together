from model import db, Playlist, connect_to_db
import api


def create_playlist(playlist_name):
	"""Creates a playlist and adds to DB."""
	
	playlist = Playlist(playlist_name=playlist_name)
	db.session.add(playlist)
	db.session.commit()

	return playlist

def sort_songs(songs_list):
	"""Sorts the songs based on 2nd item in list.""" 
	return(sorted(songs_list, key = lambda x: x[1])) 

def get_playlist_name(playlist_id):
	"""Returns the playlist name for a given playlist ID."""
	playlist = Playlist.query.filter(Playlist.playlist_id == playlist_id).first()
	if playlist:
		return playlist.playlist_name
	else:
		return None