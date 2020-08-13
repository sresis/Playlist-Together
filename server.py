"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session,
                   redirect)
from model import connect_to_db
import crud

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def homepage():
	"""view the homepage."""

	
	return render_template('homepage.html')


@app.route('/users')
def all_users():
    """View all users."""

    users = crud.get_users()

    return render_template('all_users.html', users=users)

@app.route('/users', methods=['POST'])
def register_user():
	"""Creates a new user."""

	# gets the email, password, fname and lastname for user
	email = request.form.get('email')
	fname = request.form.get('fname')
	lname = request.form.get('lname')
	password = request.form.get('password')


	# checks if email is already registered
	# if registered, tell them account is already registered
	user = crud.get_user_by_email(email)
	if user:
		flash('This email is already registered. Please try again.')
	#if not registered, create a new instance of user
	else:
	
		crud.create_user(email, fname, lname, password)
		flash('Success! You can now log in.')

	#redirects back to homepage
	return redirect('/')


@app.route('/login', methods=['POST'])
def login_user():
	## right now it only lets you log in with existing
	#session['show_login'] == True
	# gets email and password from form
	email = request.form['email']
	password = request.form['password']
	# gets user info based on email
	user = crud.get_user_by_email(email)
	session['user'] = []
	# checks if pasword in db matches form pasword
	if user.password == password:
		#adds user to session
		session['user'] = user.user_id
		flash('you are logged in!')
		return redirect('/')

	else:
		flash('incorrect login.')
		return redirect('/')


@app.route('/users/<user_id>')
def show_user(user_id):
    """Show details on a particular user."""

    user = crud.get_user_by_id(user_id)

    return render_template('user_details.html', user=user)



if __name__ == '__main__':
	connect_to_db(app)
	app.run(host='0.0.0.0', debug=True)
