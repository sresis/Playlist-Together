from model import db, User, Playlist, Song_Pref, Artist_Pref, connect_to_db


def create_user(email, fname, lname, password):
    """Create and return a new user."""

    user = User(email=email, fname=fname, lname=lname, password=password)

    db.session.add(user)
    db.session.commit()

    return user

def create_artist_pref(artist_name, user_id):
	"""Creates an artist preference for a given user."""

	artist_pref = Artist_Pref(artist_name=artist_name, user_id=user_id)

	db.session.add(artist_pref)
	db.session.commit()

	return artist_pref

def create_song_pref(song_title, user_id):
	"""Creates a song preference for a user."""

	song_pref = Song_Pref(song_title=song_title, user_id=user_id)

	db.session.add(song_pref)
	db.session.commit()

	return song_pref


def get_users():
    """Return all users."""

    return User.query.all()

def get_user_by_id(user_id):
	"""returns a user based on their ID."""

	return User.query.get(user_id)

def get_user_by_email(email):
	"""Returns a user based on their email."""

	return User.query.filter(User.email == email).first()


def get_all_artist_prefs():
    """Return all artist prefs."""

    return Artist_Pref.query.all()

def return_users_artist_prefs(user_id):
	"""Returns all artist prefs for a user."""
	prefs = Artist_Pref.query.filter(Artist_Pref.user_id == user_id)
	prefs_list = []
	for item in prefs:
		prefs_list.append(item.artist_name)

	return prefs_list

def get_artist_uri(artist_name):
	"""Gets artist URI based on artist name."""

	return None


