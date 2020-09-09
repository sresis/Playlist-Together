const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const Autocomplete = React;
const {Button, Alert, Col, Row, Container, Collapse, Form, FormControl, Nav, Navbar, Spinner } = ReactBootstrap;

// instance of context
const LoginContext = React.createContext(null);

function App() {
	const [loggedIn, setLoggedIn] = React.useState(null);
	// check in server if there is a logged in user
	React.useEffect(() => {
	fetch('api/check_login')
		.then(res => res.json())
		.then(data => setLoggedIn(data.logged_in))
	}, [loggedIn]);


	// group navbar links into 1) viewable by logged in users only 2) viewable when not logged in
	const Navigation = {
		true: (<Nav>
			<Nav.Link as={Link} to="/view-similar-users">Similar User</Nav.Link>
			<Nav.Link as={Link} to="/your-profile">Your Profile</Nav.Link>
			

		</Nav>
		),
		false: (
			<Nav>
				<Nav.Link as={Link} to="/login">Log In</Nav.Link>
				<Nav.Link as={Link} to="/create-account">Create Account</Nav.Link>
			</Nav>
		)
	}




	
	return (
		<LoginContext.Provider value={{loggedIn, setLoggedIn}}>
			<Router>
				<div>
					<Navbar className="navigation">
						<Navbar.Brand>
							<img src={'static/img/logo.png'}
							width='150'

							className='d-inline-block align-top'
							id='site-logo' /> 
						</Navbar.Brand>
						<Nav>
							<li>
							<Link to="/">Home </Link>
							</li>
							<li>
							<Link to="/create-account">Create Account </Link>
							</li>
							<li>
							<Link to="/login">Login </Link>
							</li>
							{Navigation[loggedIn]}
							
						</Nav>
					</Navbar>
				</div>

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
				<Route path="/logout" component={Login}>
					<Logout />
				</Route>
				<Route path="/view-similar-users">
					<SimilarUsers />
					</Route>
				<Route path="/combined-playlist/:user_id">
					<CombinedPlaylist />
					</Route>
				<Route path="/user-detail/:user_id" component={UserDetail}>
					<UserDetail />
				</Route>
				<Route path="/playlist-detail/:playlist_id" component={PlaylistDetail}>
					<PlaylistDetail />
				</Route>
				<Route path="/view-saved-playlists" component={ViewSavedPlaylists}>
					<ViewSavedPlaylists />
				</Route>
				<Route path="/save-playlist/:user_id" component={SavePlaylist}>
					<SavePlaylist />
				</Route>
				<Route path="/">
					<Homepage />
				</Route>
				</Switch>
			</Router>

		</LoginContext.Provider>
	    
  )
}

function Homepage() {
	return(
		<Container fluid="md">
			<Row>
				<Col>
					<h2> Welcome to Play[list] Together! <span class="icon music"></span> </h2>				
				</Col>


			</Row>
					
				
		</Container> 
		
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
		<Form>
			<Form.Group controlID="formEmail">
				<Form.Label>Email</Form.Label>
				<Form.Control type="email" placeholder="Email"
								onChange= {e => setEmail(e.target.value)}
							 	value={email}/>
			</Form.Group>
			<Form.Group controlID="formPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password"
								onChange= {e => setPassword(e.target.value)}
								value={password}
								 />
			</Form.Group>
			<Button variant="primary" type="submit" onClick={loginUser}>Submit</Button>
		</Form>

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
						<li key={data[idx]['user_id']} id={data[idx]['user_id']}><span class="icon users"></span>
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
			<ul className="user-container">{users}</ul>

		</React.Fragment>
		) 
}
function CombinedPlaylist(props) {
	// pulls the user ID from the "route"
	const {user_id} = ReactRouterDOM.useParams();
	const[playlist, setPlaylist] = React.useState([]);
	const[fname, setFname] = React.useState([]);
	const[playlistSongs, setPlaylistSongs] = React.useState([]);
	
	const history = ReactRouterDOM.useHistory();
	
	React.useEffect(() => {
		fetch(`/api/combined_playlist/${user_id}`, {
			
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			const f_name = data.user.fname;
			const playlist = data.playlist;
	
			// array to store the songs in playlist
			const playlistItems = [];
			
			for (const item of playlist) {
				playlistItems.push(
					<div>
						<li key={item[1]}>{item[0]}</li>
						
						
 
							<iframe src= {`https://open.spotify.com/embed/track/${item[1]}`}
								
								width="300" height="50" frameBorder="0" allowtransparency="true" 
								allow="encrypted-media"></iframe>
							<div id="loading">
								<img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6d391369321565.5b7d0d570e829.gif"
								width="30"></img>
							</div>
						
					</div>
				);
			}
			setPlaylistSongs(playlistItems);
			setFname(f_name);
			console.log(f_name)
			
			})
		// reset to avoid infinite loop
	}, [props.user, props.playlist])

	return (
		<React.Fragment>
			<h3>Shared Playlist with {fname}:</h3>
			<div>{playlistSongs}</div>
			<button id="save-playlist" onClick={()=>{history.push(`/save-playlist/${user_id}`)}}>Save Playlist</button>
		</React.Fragment>
	)
}

function SavePlaylist(props) {
	// get the songs and users in the playlist and pass it to server. then server commits it
	const {user_id} = ReactRouterDOM.useParams();
	
	React.useEffect(() => {
		fetch(`/api/save_playlist/${user_id}`, {
			
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
		
			// array to store the songs in playlist
			console.log(data)
			})
		// reset to avoid infinite loop
	})
	return <h1>Saved</h1>
}
function ViewSavedPlaylists(props){
	const[playlistList, setPlaylistList] = React.useState([]);
	const history = ReactRouterDOM.useHistory();

	React.useEffect(() => {
		fetch(`/api/saved-playlists`, {
			
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			const allPlaylists = []

			// adds list of links for each user. handle each click
			for (const item in data['playlists']) {
				
				console.log(data['playlists'][item]);
				//history.push(`/user-detail/${data[idx]['user_id']}`);
				allPlaylists.push(
						<li key={data['playlists'][item]}>
							<Link onClick={()=>{history.push(`/playlist-detail/${data['playlists'][item]}`)}}>{data['playlists'][item]}</Link>
						</li>
					);
			}
			
		setPlaylistList(allPlaylists);
		})
		// reset to avoid infinite loop
	}, [props.playlistList])
	return <h1>{playlistList}</h1>
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
	
	
	const user = {"user_id": {user_id}}
	const history = ReactRouterDOM.useHistory();
	
	
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
					<div>
						<li key={item.song_pref_id}>{item.song_title}</li>
						<iframe src= {`https://open.spotify.com/embed/track/${item.song_uri}`}
						width="300" height="60" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
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
			<button id="generate-playlist" onClick={()=>{history.push(`/combined-playlist/${user_id}`)}}>Generate Shared Playlist with {fname}</button>
		</React.Fragment>
		) 
}
function PlaylistDetail(props) {
	// pulls the user ID from the "route"
	const {playlist_id} = ReactRouterDOM.useParams();
	const[playlistSongs, setPlaylistSongs] = React.useState([]);
	const[songTitles, setSongTitles] = React.useState([]);


	// stores the current user details (to be displayed in HTMl)
	console.log(playlist_id);
	
	
	// call another function to do the loop
	React.useEffect(() => {
		fetch(`/api/playlist-detail/${playlist_id}`, {
			
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
		
			const songs = data.songs;
			console.log(songs);
	
			// array to store the songs in playlist
			const playlistItems = [];
			
			for (const item in songs) {
				console.log(data['songs'][item]['song_title']);
				
				playlistItems.push(
					<div>
						<li key={item}data-toggle="tooltip" 
						title={`Loudness: ${data['songs'][item]['song_loudness']}
								Danceability: ${data['songs'][item]['song_danceability']}
								Valence:${data['songs'][item]['song_valence']}
								Tempo:${data['songs'][item]['song_tempo']}
								Energy:${data['songs'][item]['song_energy']}
								Acousticness:${data['songs'][item]['song_acousticness']}
								`}
						>
									{data['songs'][item]['song_title']}</li>
						<iframe src= {`https://open.spotify.com/embed/track/${data['songs'][item]['song_uri']}`}
						width="300" height="60" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
					</div>
				);
			}
			setPlaylistSongs(playlistItems);
			
			})
		// reset to avoid infinite loop
	}, [props.playlistSongs])
	return(
		<React.Fragment>
			<div id="shared-playlist">{playlistSongs}</div>
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
			<li>{similarUser}<span class="icon similar-user"></span></li>
			<button id="user-graph" onClick={makeGraph}>See Graph</button>
			<div id="chart-div">
				<canvas id="myChart"></canvas>
			</div>	
		</React.Fragment>
		
	)
}


function AddSongPref(props) {
	// lets user add song pref to profile

	// input for song pref title
	const[songPref, setSongPref] = React.useState("");
	const[addedPref, setAddedPref] = React.useState(false);
	var autocompleteInfo = '';

	const[token, setToken] = React.useState("");
	// get the token from server
	fetch('/api/token', {
	
		headers: {
			'Content-Type': 'application/json'
		},

	})
	.then(res => res.json())
	.then(data => {
		const token_info = data.token;
		setToken(token_info);
	})

	$(document).ready(function() {
		$("#song-input").autocomplete({
			
			source: function(request, response) {
				$.ajax({
					type: "GET",
					url: "https://api.spotify.com/v1/search",
					dataType: "json",
					headers: {
						'Authorization' : 'Bearer ' + token,
					},
					data: {
						type: "track",
						limit: 3,
						contentType: "application/json; charset=utf-8",
						format: "json",
						q: request.term
					},
					success: function(data) {
						response($.map(data.tracks.items, function(item) {
							console.log(item);
							return {
								label: item.name,
								value: item.name,
								id: item.id
							}
						}));
					}
				});
			},
			minLength: 3,
			select: function(event, ui) {
				$("#song-input").val(ui.item.value);
				autocompleteInfo = ui.item.value;
				setSongPref(autocompleteInfo);
			},
		});
		
		});
	
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


		// renders song pref form
	return (
		<form id="song_pref-form">
			
			<label>Song Title:</label>
			<input type = "text" 
				name="songPref"
				id="song-input" 
				onChange ={e => setSongPref(autocompleteInfo)} >		
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
	const[token, setToken] = React.useState("");
	// get the token from server

	var autocompleteInfo = '';
	fetch('/api/token', {
	
		headers: {
			'Content-Type': 'application/json'
		},

	})
	.then(res => res.json())
	.then(data => {
		const token_info = data.token;
		setToken(token_info);
	})
	// how to pass the autocomplete value into when we submit

	$("#artist-input").autocomplete({
		
		source: function(request, response) {
			$.ajax({
				type: "GET",
				url: "https://api.spotify.com/v1/search",
				dataType: "json",
				headers: {
					'Authorization' : 'Bearer ' + token,
				},
				data: {
					type: "artist",
					limit: 3,
					contentType: "application/json; charset=utf-8",
					format: "json",
					q: request.term
				},
				success: function(data) {
					response($.map(data.artists.items, function(item) {
						return {
							label: item.name,
							value: item.name,
							id: item.id
							
						}
						
					}));
				}
			});
		},
		
		minLength: 2,
		select: function(evt, ui) {
			// updates artist input field
			$("#artist-input").val(ui.item.value);
			autocompleteInfo = ui.item.value;
			console.log('xxx');
			setArtistPref(autocompleteInfo);
			
		},
		
	});

	
	// formats the user input
	const user_input = {"artistPref": artistPref};
	console.log(user_input);
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
			console.log(data);
			if(data.status === "artist pref added") {
				alert('Artist pref added!');
				setAddedPref(true);
				
			}
			else{
				alert('error');
			}
			
	});
	}


	// can replace line 472 to true with history.push(/your-profile)

		// renders song pref form
	return (
		<form id="artist-pref-form">
			<label>Artist Name:</label>
			<input type = "text" 
				name="artistPref"
				id = "artist-input" 
				onChange ={e => setArtistPref(autocompleteInfo)} >		
			</input>
	
			<button id="artist-pref-but" onClick={addArtist}>Add Artist Pref</button>

		</form>

		);
}


ReactDOM.render(<App />, document.getElementById('root'))