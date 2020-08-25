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
	        <nav>
	          <ul>
	            <li>
	              <Link to="/">Home</Link>
	            </li>
	            <li>
	              <Link to="/login">Login</Link>
	            </li>
	            <li>
	              <Link to="/users">Users</Link>
	            </li>
	          </ul>
	        </nav>

	        {/* A <Switch> looks through its children <Route>s and
	            renders the first one that matches the current URL. */}
	        <Switch>
	          <Route path="/login" component={Login}>
	            <Login />
	          </Route>
	          <Route path="/users">
	            <Users />
	          </Route>
	          <Route path="/">
	            <Homepage />
	          </Route>
	        </Switch>
	      </div>
	    </Router>
  );
}
function PostListItem(props) {
  return <li>{props.email}</li>
}
function Homepage() {
	return <div> Welcome to my site </div>;
}

function Users() {
	// get info from server and make components out of it
    // get the info from the server
    // make componenets out of it 
    // render them 

    const [users, setUsers] = React.useState([])

    React.useEffect(() => {
    fetch('/api/users', (result) => {
    	setUsers(result);
    });
}, [])





		



		

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
		        if (data === "correct") {

		            alert('correct!');
		        } else {
		            alert('Email/Password combination is incorrect.');
		    }
		});
		}
		// renders login form
	return (
		<form id="login-form">
			<label>Email:</label>
			<input type = "text" name="email" value = {email} onChange={e => setEmail(e.target.value)} ></input>
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



ReactDOM.render(<App />, document.getElementById('root'))