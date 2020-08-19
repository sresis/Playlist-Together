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
	          <Route path="/login">
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

function Homepage() {
	return <div> Welcome to my site </div>;
}

function Users() {
	return <div>Users**</div>;
		

}
function Login(props){
	return (
	<div>
		<p>
			First Name:
			<input type="text" name="fname"></input>
		</p>
		<p>
			Last Name:
			<input type="text" name="lname"></input>
		</p>
		<p>
			Email:
			<input type="text" name="email"></input>
		</p>
		<p>
			Password:
			<input type="text" name="password"></input>
		</p>
		<p>
			<button>Login</button>
		</p>
	</div>
	);
}

ReactDOM.render(<App />, document.getElementById('root'))