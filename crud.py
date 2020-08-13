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

