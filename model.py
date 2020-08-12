""" Models for combined playlists app."""

from flask_sqlalchemy import SQLAlchemy

import datetime

db = SQLAlchemy()

class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    email = db.Column(db.String(50), unique=True)
    fname = db.Column(db.String(50))
    lname = db.Column(db.String(50))
    password = db.Column(db.String(50))

    def __repr__(self):
        return f'<User user_id={self.user_id} email={self.email}>'

class Playlist(db.Model):
	"""A playlist."""

	__tablename__ = "playlists"
	playlist_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
	user_1_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
	user_2_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

	def __repr__(self):
		return f'<Playlist playlist_id={self.playlist_id}>'

class Song_Pref(db.Model):
	"""A song preference."""

	__tablename__ = 'song_prefs'

	song_pref_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
	song_title = db.Column(db.String())
	user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

	def __repr__(self):
		return f'<Song Pref ID song_pref_id={self.song_pref_id} Title song_title={self.song_title}>'



