const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;



function App() {

	
	return (
	    <Router>
	      <div>
		  	<nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse">
                    <ul className ="navbar-nav">
						<li>
						<Link to="/">Home</Link>
						</li>
						<li>
						<Link to="/create-account">Create Account</Link>
						</li>
						<li>
						<Link to="/login">Login</Link>
						</li>

						<li>
						<Link to="/users">Users</Link>
						</li>
						<li>
						<Link to="/your-profile">View Your Profile</Link>
						</li>
						<li>
						<Link to="/add-song-pref">Add Song Pref</Link>
						</li>
						<li>
						<Link to="/add-artist-pref">Add Artist Pref</Link>
						</li>
						<li>
						<Link to="/view-similar-users">View Similar Users</Link>
						</li>
						<li>
						<Link to="/logout">Logout</Link>
						</li>
	          		</ul>
				</div>
	        </nav>

	        <Switch>
	          <Route path="/login" component={Login}>
	            <Login />
	          </Route>
	          <Route path="/create-account" component={CreateAccount}>
	            <CreateAccount />
	          </Route>
	          <Route path="/users" component={Users}>
	            <Users />
	          </Route>
			  <Route path="/get-recs" component={GetSongRecs}>
	            <GetSongRecs />
	          </Route>
			  <Route path="/your-profile">
	            <YourProfile />
	          </Route>
			  <Route path="/add-song-pref" component={AddSongPref}>
	            <AddSongPref />
	          </Route>
			  <Route path="/add-artist-pref" component={AddArtistPref}>
	            <AddArtistPref />
	          </Route>
			  <Route path="/logout">
	            <Logout />
				</Route>
			  <Route path="/view-similar-users">
	            <SimilarUsers />
				</Route>
			  <Route path="/user-detail/:user_id">
	            <UserDetail />
				</Route>
			
			
	          <Route path="/">
	            <Homepage />
	          </Route>
	        </Switch>
	      </div>
	    </Router>
  );
}

function Homepage() {
	return(
		<React.Fragment>
			<h2> Welcome to Combined Playlist Generator! </h2>
		</React.Fragment> 
		
	)
}

function Logout() {

	React.useEffect(() => {
		fetch('/api/logout', {
			
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => response.json())
		.then(data => {
			// arrays to store the song/artists prefs in HTML
			console.log(data);
		});
		
	})
		
	 

	return <div>logout</div>
}

function CreateAccount(props) {

	// inputs for name, email, password
	const[fname, setFname] = React.useState("");
	const[lname, setLname] = React.useState("");
	const[email, setEmail] = React.useState("");
	const[password, setPassword] = React.useState("");


	// registers user
	const createUser = (evt) => {

		evt.preventDefault();
		const user = {"fname": fname, "lname": lname,
					"email": email, "password": password}
		fetch('/api/register', {
			method: 'POST',
			body: JSON.stringify(user),
			headers: {
				'Content-Type': 'application/json'
			},

		})
		.then(res => res.json())
		.then(data => {
			if(data.status === 'email already exists') {
				alert('This email is already registered.');
			} else {
				alert('Success! Account created');
			}
		})
	}
	
	// returns create account form
	return(
		<React.Fragment>
			<form id="create-account-form">
				<div>First Name: </div>
				<input type="text"
						name="fname"
						value = {fname}
						onChange={e => setFname(e.target.value)}>
				</input>
				<div>Last Name: </div>
				<input type="text"
						name="lname"
						value = {lname}
						onChange={e => setLname(e.target.value)}>
				</input>
				<div>Email: </div>
				<input type="text"
						name="email"
						value = {email}
						onChange={e => setEmail(e.target.value)}>
				</input>
				<div>Password: </div>
				<input type="text"
						name="password"
						value = {password}
						onChange={e => setPassword(e.target.value)}>
				</input>
				<div>
					<button id="register-button" onClick={createUser}>
						Create Account
					</button>
				</div>
			</form>
		</React.Fragment>
	)
}

function Login() {

	
	// tracks the user response for email/password

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	// tracks if user is logged in. Defaults to false.
	const [loggedIn, setLoggedIn] =React.useState(false);

	// verifies if login input is correct
	const loginUser = (evt) => {
		evt.preventDefault();

		// formats the user input so we can send it to server
		const user_input = {'email': email, 'password': password};

		// validates from server
		fetch('/api/login', {method: 'POST',
							body: JSON.stringify(user_input),
							credentials: 'include',
							headers: {
								'Content-Type': 'application/json'
							},
					})
		
		.then(res => res.json())
		.then(data => {
		        if (data.status === "correct") {

		            alert('correct!')
		            setLoggedIn(true);
		        } else if(data.status === "email error") {

		        	alert('Error: Email not registered');

		        } else {
		            alert('Error: Incorrect password');

		    	}
		});
		}
	// if login is successful, redirect them to ** users page**
	if (loggedIn === true) {
		return <Redirect to='/your-profile' />
	}

	// renders login form
	return (
		<form id="login-form">
			<label>Email:</label>
			<input type = "text" 
				name="email" 
				value = {email} 
				onChange={e => setEmail(e.target.value)} >		
			</input>
			<label>Password:</label>
			<input type="text"
					name="password"
					onChange= {e => setPassword(e.target.value)}
					value={password}>
			</input>
			
			<button id="login-button" onClick={loginUser}>Log In</button>

		</form>

		);
	}

function YourProfile(props) {
	// return their info
	const profile_info = {'user': props.user, 'song_pref': props.song_pref,
						'artist_pref': props.artist_pref}

	// stores the current user details (to be displayed in HTMl)
	const[favSongs, setFavSongs] = React.useState([]);
	const[favArtists, setFavArtists] = React.useState([]);
	const[fname, setFname] = React.useState([]);

	const createSongRecs = () => {
	

		fetch('/api/get_song_recs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
		})
	}
	// buildFaveSongs, buildFave artists as functions
	// can declare function in the component
	React.useEffect(() => {
		fetch('/api/profile', {
			
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => response.json())
		.then(data => {
			// arrays to store the song/artists prefs in HTML
			const fav_songs = []
			const fav_artists = []

			// get the song pref, name, and artist pref data
			const song_prefs = data.song_pref;
			const artist_prefs = data.artist_pref;
			const f_name = data.user.fname;

			// add each song pref and artist pref to a li
			for (const item of song_prefs) {
				fav_songs.push(
					<li key={item.song_pref_id}>{item.song_title}</li>
				);
			}
			for (const item of artist_prefs) {
				fav_artists.push(
					<li key={item.artist_pref_id}>{item.artist_name}</li>
				);
			}
			setFavSongs(fav_songs);
			setFavArtists(fav_artists);
			setFname(f_name);
		})
		// reset to avoid infinite loop
	}, [props.user, props.song_pref, props.artist_pref])

	return(
		<React.Fragment>
			<h2>{fname}'s Profile</h2>
			<h4>Favorite Songs</h4>
			<div>{favSongs}</div>
			<h4>Favorite Artists</h4>
			<div>{favArtists}</div>
			<button id="generate-song-recs" onClick={createSongRecs}>Get Song Recs</button>


		</React.Fragment>
		) 
}
function GetSongRecs() {

	

	console.log('test');
	return <h2>hi</h2>
}


function Users(props) {

	// formats the data 
	const user_details = {'email': props.email, 'user_id': props.user_id, 
	'fname': props.fname, 'lname': props.lname};

	// this will store the user details (displayed in HTML)
	const [users, setUsers] = React.useState([]);

	const history = ReactRouterDOM.useHistory();

	// get the user data from server
	React.useEffect(() => {
		fetch('/api/users', {
		
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => response.json())
		.then(data => {
			const users_info = []

			// adds list of links for each user. handle each click
			for (const idx in data) {
				//history.push(`/user-detail/${data[idx]['user_id']}`);
				users_info.push(
						<li key={data[idx]['user_id']} id={data[idx]['user_id']}>
							<Link onClick={()=>{history.push(`/user-detail/${data[idx]['user_id']}`)}}>{data[idx]['email']}</Link>
							</li>
					);
			}
			setUsers(users_info);
			
		})
		// reset to avoid infinite loop
	}, [props.email, props.user_id, props.fname, props.lname])

	return(
		<React.Fragment>
			<h3>All Users</h3>
			<div>{users}</div>

		</React.Fragment>
		) 
}

function UserDetail(props) {
	// pulls the user ID from the "route"
	const {user_id} = ReactRouterDOM.useParams();
	const profile_info = {'user': props.user, 'song_pref': props.song_pref,
						'artist_pref': props.artist_pref, 'playlist': props.playlist}

	// stores the current user details (to be displayed in HTMl)
	const[favSongs, setFavSongs] = React.useState([]);
	const[favArtists, setFavArtists] = React.useState([]);
	const[fname, setFname] = React.useState([]);
	const[playlist, setPlaylist] = React.useState([]);
	const[playlistSongs, setPlaylistSongs] = React.useState([]);
	
	
	const user = {"user_id": {user_id}}

	
	const showPlaylist = () => {

		// array to store the songs in playlist
		const playlistItems = [];
		playlistItems.push(
			<h3>Shared Playlist:</h3>
		);
		for (const item of playlist) {
			playlistItems.push(
				<div>
					<li key={item[1]}>{item[0]}</li>
					<iframe src= {`https://open.spotify.com/embed/track/${item[1]}`}
						width="300" height="50" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
				</div>
			);
		}
		setPlaylistSongs(playlistItems);
	}
	// call another function to do the loop
	React.useEffect(() => {
		fetch(`/api/user-detail/${user_id}`, {
			
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			// arrays to store the song/artists prefs in HTML
			const fav_songs = []
			const fav_artists = []

			// get the song pref, name, and artist pref data
			const song_prefs = data.song_pref;
			const artist_prefs = data.artist_pref;
			const f_name = data.user.fname;
			const playlist = data.playlist

			// add each song pref and artist pref to a li
			for (const item of song_prefs) {
				console.log(item.song_uri)
				fav_songs.push(
					<div>
						<li key={item.song_pref_id}>{item.song_title}</li>
						<iframe src= {`https://open.spotify.com/embed/track/${item.song_uri}`}
						width="300" height="50" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
					</div>
				);
			}
			for (const item of artist_prefs) {
				fav_artists.push(
					<li key={item.artist_pref_id}>{item.artist_name}</li>
				);
		}
		setFavSongs(fav_songs);
		setFavArtists(fav_artists);
		setFname(f_name);
		setPlaylist(playlist)
		
		
			
		})
		// reset to avoid infinite loop
	}, [props.user, props.song_pref, props.artist_pref, props.playlist])

	

	return(
		<React.Fragment>
			<h2>{fname}'s Profile</h2>
			<h4>Favorite Songs</h4>
			<div>{favSongs}</div>
			<h4>Favorite Artists</h4>
			<div>{favArtists}</div>
			<button id="make-playlist" onClick={showPlaylist}>Generate Shared Playlist with {fname}</button>
			<div>{playlistSongs}</div>
			
		</React.Fragment>
		) 
}

function SimilarUsers() {


	// get session user and pull the most similar
	const[similarUser, setSimilarUser] = React.useState([]);

	// variables to store current user attributes
	const[currentUserValence, setCurrentUserValence] = React.useState([]);
	const[currentUserSpeechiness, setCurrentUserSpeechiness] = React.useState([]);
	const[currentUserAcousticness, setCurrentUserAcousticness] = React.useState([]);
	const[currentUserEnergy, setCurrentUserEnergy] = React.useState([]);
	const[currentUserDanceability, setCurrentUserDanceability] = React.useState([]);
	const[currentUserLoudness, setCurrentUserLoudness] = React.useState([]);
	// variables to store similar user attributes
	const[similarUserValence, setSimilarUserValence] = React.useState([]);
	const[similarUserSpeechiness, setSimilarUserSpeechiness] = React.useState([]);
	const[similarUserAcousticness, setSimilarUserAcousticness] = React.useState([]);
	const[similarUserEnergy, setSimilarUserEnergy] = React.useState([]);
	const[similarUserDanceability, setSimilarUserDanceability] = React.useState([]);
	const[similarUserLoudness, setSimilarUserLoudness] = React.useState([]);
	React.useEffect(() => {

		fetch('/api/similar-users', {

			headers: {
				'Content-Type': 'application/json'
			},
		})
		
		.then(response => response.json())
		.then(data => {
			// set current user attributes
			setSimilarUser(data.similar_user);
			setCurrentUserValence(data.current_user_info[0]);
			setCurrentUserSpeechiness(data.current_user_info[1]);
			setCurrentUserAcousticness(data.current_user_info[2]);
			setCurrentUserEnergy(data.current_user_info[3]);
			setCurrentUserDanceability(data.current_user_info[4]);
			setCurrentUserLoudness(data.current_user_info[5]);

			// set similar user attributes
			setSimilarUserValence(data.similar_user_info[0]);
			setSimilarUserSpeechiness(data.similar_user_info[1]);
			setSimilarUserAcousticness(data.similar_user_info[2]);
			setSimilarUserEnergy(data.similar_user_info[3]);
			setSimilarUserDanceability(data.similar_user_info[4]);
			setSimilarUserLoudness(data.similar_user_info[5]);

			

		})
	})

	const makeGraph = () => {
		
	
		// add a graph comparing each of their songs for each attr?
		var ctx = document.getElementById('myChart').getContext('2d');
		var chart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'radar',
			
			
			// The data for our dataset
			data: {
				
				labels: ["Valence", "Speechiness", "Acousticness", "Energy", "Danceability", "Loudness"],
				datasets: [{
					label: "You",
					backgroundColor: "rgba(200,0,50,0.8)",
					data: [`${currentUserValence}`, `${currentUserSpeechiness}`, `${currentUserAcousticness}`,
					`${currentUserEnergy}`, `${currentUserDanceability}`, `${currentUserLoudness}`]
				}, {
					label: `${similarUser}`,
					backgroundColor: "rgba(0,50,200,0.8)",
					data: [`${similarUserValence}`, `${similarUserSpeechiness}`, `${similarUserAcousticness}`,
					`${similarUserEnergy}`, `${similarUserDanceability}`, `${similarUserLoudness}`]
				}]
			},
			
		
		
		});
	}
	return(
		<React.Fragment>
			<h3>Similar User:</h3>
			<li>{similarUser}</li>
			<button id="user-graph" onClick={makeGraph}>See Graph</button>
			<canvas id="myChart"></canvas>	
		</React.Fragment>
		
	)
}


function AddSongPref(props) {
	// lets user add song pref to profile

	// input for song pref title
	const[songPref, setSongPref] = React.useState("");
	const[addedPref, setAddedPref] = React.useState(false);
	const user_input = {"songPref": songPref};

	const addSong = (evt) => {
		evt.preventDefault();

		fetch('/api/add_song_pref', {
			method: 'POST',
			body: JSON.stringify(user_input),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})

		.then(res => res.json())
		.then(data => {
			if(data.status === "song pref added") {
				alert('Song pref added!');
				setAddedPref(true);
				
			}
			else{
				alert('error');
			}
			
	});
	}

	if (setAddedPref === true) {
		return <Redirect to='/your-profile' />
	}
		// renders song pref form
	return (
		<form id="song_pref-form">
			<label>Song Title:</label>
			<input type = "text" 
				name="songPref" 
				value = {songPref} 
				onChange={e => setSongPref(e.target.value)} >		
			</input>
	
			<button id="song-pref-but" onClick={addSong}>Add Song Pref</button>

		</form>

		);

	
}
function AddArtistPref(props) {
	// lets user add artist pref to profile

	// input for artist pref title
	const[artistPref, setArtistPref] = React.useState("");
	const[addedPref, setAddedPref] = React.useState(false);

	// formats the user input
	const user_input = {"artistPref": artistPref};

	const addArtist = (evt) => {
		evt.preventDefault();

		fetch('/api/add_artist_pref', {
			method: 'POST',
			body: JSON.stringify(user_input),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			if(data.status === "artist pref added") {
				alert('Artist pref added!');
				setAddedPref(true);
				
			}
			else{
				alert('error');
			}
			
	});
	}

	if (setAddedPref === true) {
		return <Redirect to='/your-profile' />
	}
	// can replace line 472 to true with history.push(/your-profile)

		// renders song pref form
	return (
		<form id="artist-pref-form">
			<label>Artist Name:</label>
			<input type = "text" 
				name="artistPref" 
				value = {artistPref} 
				onChange={e => setArtistPref(e.target.value)} >		
			</input>
	
			<button id="artist-pref-but" onClick={addArtist}>Add Artist Pref</button>

		</form>

		);
}






ReactDOM.render(<App />, document.getElementById('root'))