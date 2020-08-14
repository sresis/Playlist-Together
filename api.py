import requests
import os

CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']

AUTH_URL = 'https://accounts.spotify.com/api/token'

# POST
auth_response = requests.post(AUTH_URL, {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
})

# convert the response to JSON
auth_response_data = auth_response.json()

# save the access token. "golden ticket" to accessing API
access_token = auth_response_data['access_token']


#GET request needs access token in header
headers = {
    'Authorization': 'Bearer {token}'.format(token=access_token)
}

# base URL of all Spotify API endpoints
BASE_URL = 'https://api.spotify.com/v1/'

def get_audio_features(track):
	"""gets features for a track from the Spotify API"""
	result = requests.get(BASE_URL + 'audio-features/' + track, headers=headers)
	return result.json()


def get_audio_analysis(track):
	"""gets audio analysis for a track from Spotify API"""
	result = requests.get(BASE_URL + 'audio-analysis/' + track, headers=headers)
	return result.json()

def get_several_tracks_audio_features(tracks):
	"""gets the audio fesatures for several tracks."""
	lookup_url = BASE_URL + 'audio-features?ids='
	#adds each track to lookup URL
	for track in tracks:
		print(track)
		lookup_url = lookup_url + track +'%2C'
	#removes last '%'
	lookup_url = lookup_url[:-3]
	print(lookup_url)
	result = requests.get(lookup_url, headers=headers)
	return result.json()

def make_url(items):
	"""puts item in a format where they can be looked up. used for tracks or artists"""
	lookup_url = ''
	for item in items:
		lookup_url += item +'%2C'
	#removes last '%'
	lookup_url = lookup_url[:-3]
	return lookup_url

def get_recs_based_on_seed(tracks, artists):

	tracks_piece = make_url(tracks)
	artists_piece = make_url(artists)

	string = BASE_URL + 'recommendations?seed_artists=' + artists_piece +'&seed_tracks=' + tracks_piece

	result = requests.get(string, headers=headers)

	result = result.json()

	#returns track ID
	tracks_list = []
	for item in result['tracks']:
		tracks_list.append(item['id'])
	return tracks_list

#get_recs_based_on_seed(['0e4os6wHr1jbFn4yPtSEOe', '2RKY4G4RwRQufxBUv6ect3', '786h4kDeZiX5nYvOwA3wtE', '7utRJ4BeYx85khzP3lKoBX'],['4dpARuHxo51G3z768sgnrY','1HY2Jd0NmPuamShAr6KMms', '6PAt558ZEZl0DmdXlnjMgD'])
#get_recs_based_on_seed(['7utRJ4BeYx85khzP3lKoBX', '786h4kDeZiX5nYvOwA3wtE'],['4dpARuHxo51G3z768sgnrY','1HY2Jd0NmPuamShAr6KMms', '6PAt558ZEZl0DmdXlnjMgD'])
#get_recs_based_on_seed(['7nBnxipTxl27eJa9ltaikO', '1rfofaqEpACxVEHIZBJe6W'], ['3q7HBObVc0L8jNeTe5Gofh', '7dGJo4pcD2V6oG8kP0tJRR', '2QsynagSdAqZj3U9HgDzjD']) ## dad's
#get_recs_based_on_seed([''])

def get_artist_id(artist_name):
	"""gets the artist's ID based on artist name"""

	# replaces spaces in name with relevant symbols 
	updated_name = artist_name.replace(" ", "%20")
	lookup_string = BASE_URL + 'search?q=' + updated_name + '&type=artist&limit=1'
	result = requests.get(lookup_string, headers=headers)
	result = result.json()
	artist_id = result['artists']['items'][0]['id']
	
	return artist_id

def get_song_id(song_title):
	"""Gets the song ID based on song title."""

	# replacces spaces in name with relevant symbols
	updated_name = song_title.replace(" ", "%20")
	lookup_string = BASE_URL + 'search?q=' + updated_name + '&type=track&limit=1'
	result = requests.get(lookup_string, headers=headers)
	result = result.json()
	song_id = result['tracks']['items'][0]['id']
	
	return song_id

def get_song_title(song_id):
	"""Returns the song title for a song ID."""

	lookup_string = BASE_URL + 'tracks/' + song_id
	result = requests.get(lookup_string, headers=headers)
	result = result.json()

	title = result['name']
		
	return title

def get_song_artist(song_id):
	"""Returns the song artist(s) for a song ID. """

	lookup_string = BASE_URL + 'tracks/' + song_id
	result = requests.get(lookup_string, headers=headers)
	result = result.json()

	artist_names = []
	for item in result['artists']:
		artist_names.append(item['name'])
	text = (' and ').join(artist_names)
		
	return text




