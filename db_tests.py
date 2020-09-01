import model
import crud
from server import app
import unittest

class DBTests(unittest.TestCase):
    def setUp(self):
        """run before every test"""
        self.client = app.test_client()
        app.config['TESTING'] = True
        # connect to test db
        model.connect_to_db(app, "postgresql:///testdb")
        # create tables and sample data
        # how to clear existing data
        model.db.drop_all()
        model.db.create_all()
        model.example_data()
    
    def example_data():
        """ Create some sample data."""
        user1 = User(email="sally@google.com", fname="Sally", lname="Smith", password="123")
        user2 = User(email="mike@google.com", fname="Mike", lname="Jones", password="123")
        ## create song pref
        s_songpref_1 = crud.create_song_pref('Ride wit Me', 1,'3Gf5nttwcX9aaSQXRWidEZ')
        s_songpref_1 = crud.create_song_pref('Lonely Boy', 1,'31hQmFcwAtlUeMp6iXW0u9')
        db.session.add_all([user1, user2])
        db.session.commit()
        

    def test_users(self):
        """makes sure there are users in DB."""
        assert crud.get_users() is not None

    def test_users_by_id(self):
        """makes sure it can correctly pull user ID."""
        assert crud.get_user_by_id(2) is not None

if __name__ == '__main__':
    # If called like a script, run our tests
    unittest.main()
  