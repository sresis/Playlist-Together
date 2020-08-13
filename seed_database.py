"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

os.system('dropdb playlist_combiner')
os.system('createdb playlist_combiner')

model.connect_to_db(server.app)
model.db.create_all()

first_names = ['Mike', 'Melanie', 'Adam', 'Eve', 'Jenny', 'Jason', 'Mitch', 'Yolanda', 'Avery', 'Pat', 'Meg', 'Luke']
last_names = ['Roberts', 'Lee', 'Garcia', 'Smith', 'Jones', 'Yee', 'Washington', 'Williams', 'Lopez', 'Kirk', 'Henry']
passwords = ['testing123', 'cantguessit12', 'random321']

# make  random users
for n in range(5):
	fname = choice(first_names)
	first_names.remove(fname)
	lname = choice(last_names)
	email = f'{fname}_{lname}@gmail.com'
	password = choice(passwords)
	crud.create_user(email, fname, lname,password)

artists = ['Lil Wayne', 'Lizzo', 'Fleetwood Mac', 'Adele', 
		'Kanye West', 'Avicii', 'Eminem', 'Selena Gomez', 'Justin Bieber', 
		'The Killers', 'Coldplay', 'Future', 'Tyga', 'The Rolling Stones',
		'Rihanna', 'Tim McGraw', 'Kane Brown', 'Carrie Underwood', 
		'Taylor Swift', 'Spice Girls', 'Metallica', 'Kendrick Lamar']