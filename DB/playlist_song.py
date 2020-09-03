from model import db, Playlist_Song, connect_to_db
import api



def create_playlist_song(song_id, playlist_id):
	"""Creates a playlist song and adds to DB."""

	playlist_song = Playlist_Song(song_id=song_id, playlist_id=playlist_id)
	db.session.add(playlist_song)
	db.session.commit()

	return playlist_song

def get_playlist_songs(playlist_id):
	"""returns all songs in playlist."""
	songs = Playlist_Song.query.filter(Playlist_Song.playlist_id == playlist_id)
	songs_list = []
	for item in songs:
		song_id = item.song_id
		songs_list.append(song_id)
	return songs_list