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
			passwordConfirm: '',
			formLogInShow: true
		}

		this.logIn = this.logIn.bind(this);
		this.enterPortal = this.enterPortal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signUp = this.signUp.bind(this);
		this.showLogInForm = this.showLogInForm.bind(this);
		this.showSignUpForm = this.showSignUpForm.bind(this);
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					loggedIn: true
				})
			console.log('user nigga');
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
	signOut(e) {
		e.preventDefault();
		firebase.auth()
			.signOut();
		console.log('user just signed out');
		if (this.state.loggedIn !== null) {
			this.setState({
				loggedIn: false
			})
		}
		if (this.state.signedUp !== null) {
			this.setState({
				signedUp: false
			})
		}
	}
	enterPortal() {
		this.loginPortal.classList.toggle('hide');
		this.setState({
			screenActive: false
		})
	}
	showLogInForm() {
		this.signUpButton.classList.remove('activeButton');
		this.logInButton.classList.add('activeButton');
		this.setState({
			formLogInShow: true
		})
	}
	showSignUpForm() {
		this.signUpButton.classList.add('activeButton');
		this.logInButton.classList.remove('activeButton');
		this.setState({
			formLogInShow: false
		})
		
	}
	render() {

		let formToShow = '';
		if (this.state.formLogInShow === true) {
			formToShow = (
			<form className="userLogInForm" onSubmit={this.logIn}>
				<h2>Log In to your account</h2>
				<label htmlFor="email">Email</label>
				<input type="email" onChange={this.handleChange} name="email"/>
				<label htmlFor="password">Password</label>
				<input type="password" onChange={this.handleChange} name="password"/>
				<button>Log In</button>
			</form>
			)
		}
		if (this.state.formLogInShow === false) {
			formToShow= (
			<form className="userSignUpForm" onSubmit={this.signUp}>
				<h2>Sign Up today!</h2>
				<label htmlFor="email">Email</label>
				<input type="email" onChange={this.handleChange} name="signUpEmail"/>
				<label htmlFor="password">Password</label>
				<input type="password" onChange={this.handleChange} name="signUpPassword"/>
				<label htmlFor="password">Confirm Password</label>
				<input type="password" onChange={this.handleChange} name="passwordConfirm"/>
				<button>Sign Up</button>
			</form>
			)
		}



		let logInView = '';
		if (this.state.loggedIn == false || this.state.signedUp == false) {
			logInView = (
				<section className="homePage">
					<div className="loginPortal" ref={ref => this.loginPortal = ref}>
						<div>
							<div className="loginType">
								<button onClick={this.showLogInForm} className="activeButton" ref={ref => this.logInButton = ref}>Log In</button>
								<button onClick={this.showSignUpForm} ref={ref => this.signUpButton = ref}>Sign Up</button>
							</div>

							{formToShow}
						</div>
					</div>
					<section className="homeImage">
						
					</section>
				</section>
				)
		} 
		if (this.state.loggedIn == true || this.state.signedUp == true) {
			logInView = (
				<section className="homePage">
					<div className="loginPortal" ref={ref => this.loginPortal = ref}>
						<div className="alreadyLoggedIn">
							<h2>Status: Logged In</h2>
							<button><Link to='/home'>Enter Portal</Link></button>
							<button onClick={this.signOut}>Sign out</button>
						</div>
					</div>
					<section className="homeImage">
						
					</section>
				</section>
					
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
				
				<div className="socialMedia">
					<div className="wrapper">
						<a href="https://twitter.com/nickevansmedia" target="_blank"><i  className="fa fa-twitter" aria-hidden="true"></i></a>
						<a href="https://github.com/nicke920/react-sportsApp" target="_blank"><i  className="fa fa-github" aria-hidden="true"></i></a>
						<a href="https://www.facebook.com/nicklevanscom/" target="_blank"><i  className="fa fa-facebook" aria-hidden="true"></i></a>
						<a href="https://www.instagram.com/nicke920/" target="_blank"><i  className="fa fa-instagram" aria-hidden="true"></i></a>
					</div>
				</div>
				<nav>
					<div className="wrapper">
						<h2 className="logo">
							<Link to='/'>Trip Planner</Link>
						</h2>
						
						<div className="accountsContainer">
							<div className="accounts">
								<Link to='/'>My Account</Link>
							</div>
						</div>
					</div>
				</nav>
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