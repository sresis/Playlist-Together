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

function Users(props) {
	// get info from server and make components out of it
    // get the info from the server
    // make componenets out of it 
    // render them 
    return<div>Hiiiii</div>



		


 function alertMessage() {
    alert('You just handled an event!');
  }

  return (
    <button onClick={alertMessage}>
      Click me
    </button>
  );
		

}
function Login(props){
	// look out for changes in the form. onChange function that is updating props to reflect current value
	// when ready to post, bundle it into a javascript object. send it as object , one of arguments
	return (
	<div>
		<p>
			Email:
			<input type="text" name="email"></input>
		</p>
		<p>
			Password:
			<input type="text" name="password"></input>
		</p>
		<p>
			<button name="login">Login</button>
		</p>
	</div>
	);
}




ReactDOM.render(<App />, document.getElementById('root'))