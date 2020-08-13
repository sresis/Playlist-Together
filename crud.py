from model import db, User, Playlist, Song_Pref, connect_to_db


def create_user(email, fname, lname, password):
    """Create and return a new user."""

    user = User(email=email, fname=fname, lname=lname, password=password)

    db.session.add(user)
    db.session.commit()

    return user

def create_song_pref(song_title, user_id):
	"""Creates a song preference for a given user."""

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