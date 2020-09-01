import crud
import api
import unittest

class MyAppUnitTestCase(unittest.TestCase):

    def test_get_artist_id(self):
        assert api.get_artist_id('50 Cent') == '3q7HBObVc0L8jNeTe5Gofh'
        assert api.get_artist_id('Nelly') == '2gBjLmx6zQnFGQJCAQpRgw'


if __name__ == '__main__':
    # If called like a script, run our tests
    unittest.main()