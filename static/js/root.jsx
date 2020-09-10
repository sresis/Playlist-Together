const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const Autocomplete = React;
const {Button, Alert, Col, Row, Card, CardColumns, Container, Collapse, Form, FormControl, Nav, Navbar, Spinner } = ReactBootstrap;

// instance of context
const LoginContext = React.createContext(null);
// handle showing component

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
		true: (<Nav className="after-login-links">
			<Link to="/">Home </Link>
			<Link to="/about">About </Link>
			<Link to="/view-similar-users">Similar User</Link>
			<Link to="/your-profile">Your Profile</Link>
			<Link to="/users">View Users</Link>
			<Link to="/view-saved-playlists">View Saved Playlists</Link>
			<Link to="/logout">Log Out</Link>
			

		</Nav>
		),
		false: (
			<Nav className="before-login-links">
				<Link to="/">Home </Link>
				<Link to="/about">About </Link>
				<Link to="/login">Log In</Link>
				<Link to="/create-account">Create Account</Link>
			</Nav>
		)
	}

	return (
		<LoginContext.Provider value={{loggedIn, setLoggedIn}}>
			<Router>
				<Navbar className="navigation" id="navbar-nav">
					<Navbar.Brand>
						<img src={'static/img/logo.png'}
						width='100'
						className='d-inline-block align-top'
						id='site-logo' /> 
					</Navbar.Brand>
					<Nav className="flex-column">	
						{Navigation[loggedIn]}
					</Nav>
				</Navbar>
				

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
				<Route path="/about" component={About}>
					<About />
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
	// updates the background for just this page
	document.body.style.background="url('/static/img/radio.png')";
	document.body.style.backgroundSize='cover';
	return(
		<Container fluid="md" id="homepage">
			<Row>
				<Col>
					<h2> Welcome to Play[list] Together! <span class="icon music"></span> </h2>				
				</Col>
				<Col>
					<Button id="create-account-but" classname="btn">
					Create a New Account
					</Button>
				</Col>  
			</Row>
		</Container> 
	)
}
function About() {
	return <h1>About</h1>
}

function Logout() {
	const {loggedIn, setLoggedIn} = React.useContext(LoginContext);
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
			setLoggedIn(false);
			console.log(loggedIn);
		})
		
	},[]);
		
	 

	return <Redirect to='/' />
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
		<Container fluid="md" id="create-account-form">
			<Form>
			<h4>Create an Account</h4>
			<Form.Group controlid="createFName">
				<Form.Label>First Name</Form.Label>
				<Form.Control type="text" placeholder="First Name"
								onChange= {e => setFname(e.target.value)}
							 	value={fname}/>
			</Form.Group>
			<Form.Group controlid="createLName">
				<Form.Label>Last Name</Form.Label>
				<Form.Control type="text" placeholder="Last Name"
								onChange= {e => setLname(e.target.value)}
								value={lname}
								 />
			</Form.Group>
			<Form.Group controlid="createEmail">
				<Form.Label>Email</Form.Label>
				<Form.Control type="email" placeholder="Email"
								onChange= {e => setEmail(e.target.value)}
								value={email}
								 />
			</Form.Group>
			<Form.Group controlid="createPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password"
								onChange= {e => setPassword(e.target.value)}
								value={password}
								 />
			</Form.Group>
			<Button classname="btn" variant="primary" type="submit" onClick={createUser}>Create Account</Button>
		</Form>
		</Container>
		
	
	)
}

function Login() {
	
	// tracks the user response for email/password

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	// tracks if user is logged in. Defaults to false.
	const {loggedIn, setLoggedIn} = React.useContext(LoginContext);

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
		<Container fluid="md" id="login-form">
			<h4>Log In</h4>
			<Form>
				<Form.Group controlid="formEmail">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" placeholder="Email"
									onChange= {e => setEmail(e.target.value)}
									value={email}/>
				</Form.Group>
				<Form.Group controlid="formPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password"
									onChange= {e => setPassword(e.target.value)}
									value={password}
									/>
				</Form.Group>
				<Button variant="primary" classname="btn" type="submit" onClick={loginUser}>Submit</Button>
			</Form>
		
		</Container>
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

	const history = ReactRouterDOM.useHistory();
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
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


		<Container fluid="md" id="your-prof-container">
			<h2>{fname}'s Profile<span class="icon music"></span></h2>
			<Row>
				<Col>
					<Button variant="primary" onClick={createSongRecs}>Get Song Recs</Button>
				</Col>				
			</Row>
			<Row>
				<Col>
					<h4>Favorite Songs<span class="icon cd"></span></h4>
					<Button variant="secondary" onClick={()=>{history.push(`/add-song-pref`)}}>Add Favorite Songs</Button>
					<div>{favSongs}</div>				
				</Col>
				<Col>
					<h4>Favorite Artists<span class="icon mic"></span></h4>
					<Button variant="secondary" onClick={()=>{history.push(`/add-artist-pref`)}}>Add Favorite Artists</Button>
					<div>{favArtists}</div>				
				</Col>
			</Row>
			
		</Container>

	) 
}

function GetSongRecs() {

	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";

	console.log('test');
	return <h2>hi</h2>
}


function Users(props) {

	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
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
				users_info.push(
					
					<Card style={{ width: '18rem' }}>
						<Card.Body>
						<Card.Title>
							<span class="icon users"></span>
							{data[idx]['email']}
							</Card.Title>
						<Card.Text>
							Insert some info...
						</Card.Text>
						<Button variant="primary" 
						onClick={()=>{history.push(`/user-detail/${data[idx]['user_id']}`)}}>View Profile</Button>
						</Card.Body>
					</Card>
				
					
					);
			}
			setUsers(users_info);
			
		})
		// reset to avoid infinite loop
	}, [props.email, props.user_id, props.fname, props.lname])

	return(
		<React.Fragment>
			<h3>All Users</h3>
			<CardColumns>{users}</CardColumns>

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

	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	
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

		<Container fluid="md" id="shared-playlist-container">
			<h2>Shared Playlist with {fname}<span class="icon music"></span></h2>
			<Row>
				<Col>
					<Button id="save-playlist" onClick={()=>{history.push(`/save-playlist/${user_id}`)}}>Save Playlist</Button>
				</Col>
			</Row>
			<Row>
				<Col id="playlist-songs-col">
					{playlistSongs}
				</Col>
			</Row>
		</Container>
		
	)
}

function SavePlaylist(props) {
	// get the songs and users in the playlist and pass it to server. then server commits it
	const {user_id} = ReactRouterDOM.useParams();
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
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
	return <Redirect to='/users' />
}
function ViewSavedPlaylists(props){
	const[playlistList, setPlaylistList] = React.useState([]);
	const history = ReactRouterDOM.useHistory();
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
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
	return(
		<Container fluid="md" id="saved-playlist-container">
			<h2>Saved Playlists</h2>
			<Row>
				<Col>
					{playlistList}
				</Col>
			</Row>
		</Container>
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
	
	
	const user = {"user_id": {user_id}}
	const history = ReactRouterDOM.useHistory();
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	
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

		<Container fluid="md" id="user-detail-container">
			<h2>{fname}'s Profile<span class="icon music"></span></h2>
			<Row>
				<Col>
					<Button id="generate-playlist" onClick={()=>{history.push(`/combined-playlist/${user_id}`)}}>Generate Shared Playlist with {fname}</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<h4>Favorite Songs<span class="icon cd"></span></h4>
					<div>{favSongs}</div>				
				</Col>
				<Col id="profile-artists" className="align-top">
					<h4>Favorite Artists<span class="icon mic"></span></h4>
					<div>{favArtists}</div>				
				</Col>
			</Row>
			
		</Container>

		) 
}
function PlaylistDetail(props) {
	// pulls the user ID from the "route"
	const {playlist_id} = ReactRouterDOM.useParams();
	const[playlistSongs, setPlaylistSongs] = React.useState([]);
	const[songTitles, setSongTitles] = React.useState([]);


	// stores the current user details (to be displayed in HTMl)
	console.log(playlist_id);
	
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
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

		<Container fluid="md" id="playlist-details-container">
			<h2>Shared Playlist</h2>
			<Row>
				<Col id="saved-playlist-col">
					{playlistSongs}
				</Col>
			</Row>
		</Container>
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
	
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";

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
	// stores the style
	const chartStyle = {height: '60%'};
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
		<Container fluid="md" id="similar-container">
			<Row>
				<Col>
					<h3>Similar User:</h3>
					<li>{similarUser}<span class="icon similar-user"></span></li>
				<Button id="user-graph" onClick={makeGraph}>See Graph</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					
					<canvas id="myChart" style={chartStyle} ></canvas>
					
				</Col>
			</Row>
	
		</Container>
		
	)
}


function AddSongPref(props) {
	// lets user add song pref to profile

	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
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
		<Container fluid="md" id="song-pref-form">
			<Form>
				<Form.Group controlid="song-input-form">
					<Form.Label>Song Title:</Form.Label>
					<Form.Control type="text"
									id="song-input" 
									onChange= {e => setSongPref(autocompleteInfo)}/>
				</Form.Group>
				<Button variant="primary" onClick={addSong}>Add Song Preference</Button>
			</Form>
		</Container>
		);
}


function AddArtistPref(props) {
	// lets user add artist pref to profile

	// updates background
	document.body.style.background="url('static/img/moroccan-flower.png')";

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

		<Container fluid="md" id="artist-pref-form">
			<Form>
				<Form.Group controlid="artist-input-form">
					<Form.Label>Artist Name:</Form.Label>
					<Form.Control type="text"
									id="artist-input" 
									onChange= {e => setArtistPref(autocompleteInfo)}/>
				</Form.Group>
				<Button variant="primary" onClick={addArtist}>Add Artist Preference</Button>
			</Form>
		</Container>

		);
}


ReactDOM.render(<App />, document.getElementById('root'))