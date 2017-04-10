import React from 'react';
import ReactDOM from 'react-dom';

import MainPortal from './MainPortal.js';
import { Router, Route, browserHistory, Link } from 'react-router';

class LogIn extends React.Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			loggedIn: '',
			screenActive: '',
			signedUp: '',
			signUpEmail: '',
			signUpPassword: '',
			passwordConfirm: ''
		}

		this.logIn = this.logIn.bind(this);
		this.enterPortal = this.enterPortal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signUp = this.signUp.bind(this);
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			console.log('user nigga');
			if (user) {
				this.setState({
					loggedIn: true
				})
			}
			else {
				this.setState({
					loggedIn: false
				})
			}
		})
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	logIn(e) {
		e.preventDefault();
		firebase.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then((userData) => {
				this.setState({
					loggedIn: true
				})
			})
			.catch(function(error) {
				alert(error)
			})
		
	}
	signUp(e) {
		if (this.state.signUpPassword === this.state.passwordConfirm) {
			firebase.auth()
				.createUserWithEmailAndPassword(this.state.signUpEmail, this.state.signUpPassword)
				.then((userData) => {
					console.log(userData)
				})
				.catch(function(error) {
					alert(error)
					console.log('error message')
				})
				this.setState({
					signedUp: true
				})
		}
		else {
			alert('sorry bruvvvvv')
		}
	}
	enterPortal() {
		this.loginPortal.classList.toggle('hide');
		this.setState({
			screenActive: false
		})
	}
	render() {
		let logInView = '';
		if (this.state.loggedIn == false || this.state.signedUp == false) {
			logInView = (
				<div className="loginPortal" ref={ref => this.loginPortal = ref}>
					<form onSubmit={this.logIn}>
						<label htmlFor="email">Email</label>
						<input type="email" placeholder="email" onChange={this.handleChange} name="email"/>
						<label htmlFor="password">Password</label>
						<input type="password" placeholder="password" onChange={this.handleChange} name="password"/>
							<button>Sign In</button>
					</form>
					<form onSubmit={this.signUp}>
						<label htmlFor="email">Email</label>
						<input type="email" placeholder="email" onChange={this.handleChange} name="signUpEmail"/>
						<label htmlFor="password">Password</label>
						<input type="password" placeholder="password" onChange={this.handleChange} name="signUpPassword"/>
						<label htmlFor="password">Confirm Password</label>
						<input type="password" placeholder="password" onChange={this.handleChange} name="passwordConfirm"/>
						<button>Sign Up nigga</button>
					</form>
				</div>
				)
		} 
		if (this.state.loggedIn == true || this.state.signedUp == true) {
			logInView = (
					<div className="loginPortal" ref={ref => this.loginPortal = ref}>
						<p>You're Logged In Already!</p>
						<Link to='/home'>Go to home</Link>
					</div>
				)
		}
		return (
			<div>{logInView}</div>
		)
	}
}

class App extends React.Component {
	constructor() {
		super();
	}
	render() {
		
		return (
			<div>
				{this.props.children || <LogIn />}
			</div>
				
		)
	}
}

ReactDOM.render(<Router history={browserHistory}>
	<Route path='/' component={App}>
		<Route path='/home' component={MainPortal} />
	</Route>
	</Router>, document.getElementById('app'));