import React from 'react';
import ReactDOM from 'react-dom';

import MainPortal from './MainPortal.js';
import { Router, Route, browserHistory, Link } from 'react-router';

class LogIn extends React.Component {
	constructor() {
		super();
		this.state = {
			loggedIn: '',
			screenActive: ''
		}

		this.logIn = this.logIn.bind(this);
		this.enterPortal = this.enterPortal.bind(this);
	}
	logIn() {
		this.setState({
			loggedIn: true
		})
		
	}
	enterPortal() {
		this.loginPortal.classList.toggle('hide');
		this.setState({
			screenActive: false
		})
	}
	render() {
		let logInView = '';
		if (this.state.loggedIn == false) {
			logInView = (
				<div className="loginPortal" ref={ref => this.loginPortal = ref}>
					<form>
						<label htmlFor="email">Email</label>
						<input type="email" placeholder="email"/>
						<label htmlFor="password">Password</label>
						<input type="password" placeholder="password"/>
					</form>
					<button onClick={this.logIn}>Sign In</button>
				</div>
				)
		} else {
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