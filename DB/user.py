from model import db, Playlist_User, connect_to_db
import model
import api




def update_valence_value(user, attribute_val):
	""" updates attribute value."""

	user.user_valence = attribute_val
	db.session.commit()



def update_speechiness_value(user, attribute_val):
	""" updates attribute value."""

	user.user_speechiness = attribute_val
	db.session.commit()




def update_acousticness_value(user, attribute_val):
	""" updates attribute value."""

	user.user_acousticness = attribute_val
	db.session.commit()

def update_danceability_value(user, attribute_val):
	""" updates attribute value."""

	user.user_danceability = attribute_val
	db.session.commit()


def update_energy_value(user, attribute_val):
	""" updates attribute value."""

	user.user_energy = attribute_val
	db.session.commit()

def update_loudness_value(user, attribute_val):
	""" updates attribute value."""

	user.user_loudness = attribute_val
	db.session.commit()
 
