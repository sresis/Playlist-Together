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
        return f'<user_id={self.user_id} email={self.email} fname={self.fname}>'

class Playlist(db.Model):
    """A playlist."""

    __tablename__ = "playlists"
    playlist_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    user_1_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    # make middle table
    user = db.relationship('User', backref='playlists')

    def __repr__(self):
        return f'<playlist_id={self.playlist_id}>'

class Song_Pref(db.Model):
    """A song preference."""

    __tablename__ = 'song_prefs'

    song_pref_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    song_title = db.Column(db.String())
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    song_uri = db.Column(db.String())

    user = db.relationship('User', backref='song_prefs')


    def __repr__(self):
        return f'<song_pref_id={self.song_pref_id} song_title={self.song_title}>'

class Artist_Pref(db.Model):
    """An artist preference."""

    __tablename__ = 'artist_prefs'

    artist_pref_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    artist_name = db.Column(db.String())
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    artist_uri = db.Column(db.String())

    user = db.relationship('User', backref='artist_prefs')


    def __repr__(self):
        return f'<artist_pref_id={self.artist_pref_id} artist_name={self.artist_name}>'



def connect_to_db(flask_app, db_uri='postgresql:///playlist_combiner', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.




    connect_to_db(app)



