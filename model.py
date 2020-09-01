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

    user_tempo = db.Column(db.Float())
    user_valence = db.Column(db.Float())
    user_speechiness = db.Column(db.Float())
    user_acousticness = db.Column(db.Float())
    user_danceability = db.Column(db.Float())
    user_energy = db.Column(db.Float())
    user_loudness = db.Column(db.Float())


    def as_dict(self):
        return {
        'user_id': self.user_id,
        'email': self.email,
        'fname': self.fname,
        'lname': self.lname

        }

    def __repr__(self):
        return f'<user_id={self.user_id} email={self.email} fname={self.fname}>'

class Playlist(db.Model):
    """A playlist."""

    __tablename__ = "playlists"
    playlist_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)

    def __repr__(self):
        return f'<playlist_id={self.playlist_id}>'

class Playlist_User(db.Model):
    """A playlist user."""

    __tablename__ = "playlist_user"
    playlist_user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)

    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.playlist_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))


    playlist = db.relationship('Playlist', backref='playlist_user')
    user = db.relationship('User', backref='playlist_user')

    def __repr__(self):
        return f'<playlist_user_id={self.playlist_user_id} user_id={self.user_id} playlist_id={self.playlist_id}>'

class Playlist_Song(db.Model):
    """A playlist song."""

    __tablename__ = "playlist_song"
    playlist_song_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.song_id'))
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.playlist_id'))


    song = db.relationship('Song', backref='playlist_song')
    playlist = db.relationship('Playlist', backref='playlist_song')

    def __repr__(self):
        return f'<playlist_song_id={self.playlist_song_id}>'

class Song(db.Model):
    """ A song."""

    __tablename__ = "songs"

    song_id = db.Column(db.Integer,
                    autoincrement=True,
                    primary_key=True)
    song_title = db.Column(db.String())
    song_uri = db.Column(db.String())
    tempo = db.Column(db.Float())
    valence = db.Column(db.Float())
    danceability = db.Column(db.Float())
    energy = db.Column(db.Float())
    loudness = db.Column(db.Float())
    acousticness = db.Column(db.Float())
    speechiness = db.Column(db.Float())
    song_artist = db.Column(db.String())
    
    def __repr__(self):
        return f'<song_id={self.song_id} song_title={self.song_title} song_artist ={self.song_artist} >'

class Song_Pref(db.Model):
    """A song preference."""
    # eventually remove song title/song URI??
    __tablename__ = 'song_prefs'

    song_pref_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    song_title = db.Column(db.String())
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    song_uri = db.Column(db.String())
    song_id = db.Column(db.Integer, db.ForeignKey('songs.song_id'))

    user = db.relationship('User', backref='song_prefs')
    song = db.relationship('Song', backref='song_prefs')

    def as_dict(self):
        return {
        'song_pref_id': self.song_pref_id,
        'song_title': self.song_title,
        'user_id': self.user_id,
        'song_uri': self.song_uri,
        'song_id': self.song_id

        }


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

    def as_dict(self):
        return {
        'artist_pref_id': self.artist_pref_id,
        'artist_name': self.artist_name,
        'artist_uri': self.artist_uri,

        }

    user = db.relationship('User', backref='artist_prefs')


    def __repr__(self):
        return f'<artist_pref_id={self.artist_pref_id} artist_name={self.artist_name}>'

class Song_Rec(db.Model):
    """A song rec."""

    __tablename__ = 'song_recs'

    song_rec_id = db.Column(db.Integer,
                    autoincrement=True,
                    primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    song_uri = db.Column(db.String())
    song_title = db.Column(db.String())
    song_id = db.Column(db.Integer, db.ForeignKey('songs.song_id'))

    user = db.relationship('User', backref='song_recs')
    song = db.relationship('Song', backref='song_recs')


    def __repr__(self):
        return f'<song_rec_id={self.song_rec_id} user_id={self.user_id} song_uri={self.song_uri}>'

def connect_to_db(flask_app, db_uri='postgresql:///playlist_combiner', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


def example_data():
    """ Create some sample data."""
    user1 = User(email="sample@google.com", fname="Sally", lname="Smith", password="123")
    db.session.add(user1)
    db.session.commit()

if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.


# if you have recommended songs already, 
#test out the endpoints
#storing recommended songs? storing song info?
# store song info that you will want?



    connect_to_db(app)



