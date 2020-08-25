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
	              <Link to="/create-account">Create Account</Link>
	            </li>
	            <li>
	              <Link to="/users">Users</Link>
	            </li>
	          </ul>
	        </nav>

	        <Switch>
	          <Route path="/login" component={Login}>
	            <Login />
	          </Route>
	          <Route path="/create-account">
	            <CreateAccount />
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

function CreateAccount(props) {

	console.log("test");
	return<h1>Create Account</h1>;
}


function Users(props) {

	// formats the data so we can send it to server
	const user_details = {'email': props.email, 'user_id': props.user_id, 
	'fname': props.fname, 'lname': props.lname};

	console.log("user prps", props);
	const [users, setUsers] = React.useState([]);
	React.useEffect(() => {
		fetch('/api/users', {
			method: 'POST',
			body: JSON.stringify(user_details),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => response.json())
		.then(data => {
			const users_array = []

			for (const idx in data) {
				users_array.push(
						<li key={data[idx]['user_id']} id={data[idx]['user_id']}>{data[idx]['email']}</li>
					);
			}
			setUsers(users_array);
			
		})

	}, [props.email, props.user_id, props.fname, props.lname])



	return(
		<React.Fragment>
			<div>{users}</div>

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
		return <Redirect to='/users' />
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



ReactDOM.render(<App />, document.getElementById('root'))