from model import db, Playlist_User, connect_to_db
import model
import api


def create_playlist_user(user_id, playlist_id):
	"""Creates a playlist song and adds to DB."""

	playlist_user = Playlist_User(user_id=user_id, playlist_id=playlist_id)
	db.session.add(playlist_user)
	db.session.commit()

	return playlist_user

def save_shared_playlist(user_1, user_2, song_list):
	"""stores a shared playlist. """

	# create instance of Playlist class
	new_playlist = playlist.create_playlist()

	# creates playlist user instances
	playlist_user.create_playlist_user(user_1, new_playlist.playlist_id)
	playlist_user.create_playlist_user(user_2, new_playlist.playlist_id)

	# adds playlist song with song ID and playlist ID as arguments
	for item in song_list:
		print(item)
		playlist_song.create_playlist_song(item, new_playlist.playlist_id)



	return new_playlist
