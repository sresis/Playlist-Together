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
        model.connect_to_db(app, "postgresql:///testdb", False)
        # create tables and sample data
        # how to clear existing data
        model.db.drop_all()
        model.db.create_all()
        model.example_data()
    
    
        

    def test_users(self):
        """makes sure there are users in DB."""
        self.assertNotEqual(crud.get_users(), None)

    def test_song_prefs(self):
        self.assertNotEqual(crud.get_all_song_prefs(), None)

    def tearDown(self):
        """tears down."""
        self.quit()


        ## add teardown

if __name__ == '__main__':
    # If called like a script, run our tests
    unittest.main(verbosity=2)
  