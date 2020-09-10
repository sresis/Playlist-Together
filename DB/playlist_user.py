from model import db, Playlist_User, connect_to_db
import api
from DB import playlist, playlist_song


def create_playlist_user(user_id, playlist_id):
	"""Creates a playlist user and adds to DB."""

	playlist_user = Playlist_User(user_id=user_id, playlist_id=playlist_id)
	db.session.add(playlist_user)
	db.session.commit()

	return playlist_user

def save_shared_playlist(user_1, user_2, song_list, playlist_name):
	"""stores a shared playlist. """

	# create instance of Playlist class
	new_playlist = playlist.create_playlist(playlist_name)

	# creates playlist user instances
	create_playlist_user(user_1, new_playlist.playlist_id)
	create_playlist_user(user_2, new_playlist.playlist_id)

	# adds playlist song with song ID and playlist ID as arguments
	for item in song_list:
		print(item)
		playlist_song.create_playlist_song(item, new_playlist.playlist_id)

	return new_playlist

def get_user_playlist(user_id):
	"""returns all playlists ids for a user."""
	playlist_user = Playlist_User.query.filter(Playlist_User.user_id == user_id)
	# stores playlist ids
	playlist_ids = []
	for item in playlist_user:
		playlist_ids.append(item.playlist_id)

	return playlist_ids
	