from model import db, Playlist, connect_to_db
import model
import api


def create_playlist():
	"""Creates a playlist and adds to DB."""

	playlist = Playlist()
	db.session.add(playlist)
	db.session.commit()

	return playlist