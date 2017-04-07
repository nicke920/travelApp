import React from 'react';
import { ajax } from 'jquery';

const AddTripForm = (props) => {
	return (
		<div className="overlay" ref={props.reference}>
			<form className="addTripForm"  onSubmit={props.add} >
				<i className="fa fa-times-circle" aria-hidden="true" onClick={props.exit}></i>
				<label htmlFor="">Trip</label>
				<input type="text" name="tripName" onChange={props.handleChange} placeholder="Trip"/>
				<label htmlFor="">Budget</label>
				<input type="number" name="tripBudget" onChange={props.handleChange} placeholder="budget"/>
				<select name="tripCurrency" onChange={props.handleChange}>
					<option value="USD">USD</option>
					<option value="CAD">CAD</option>
				</select>
				<textarea name="tripNotes" value={props.thisValue} onChange={props.handleChange} cols="20" rows="2"></textarea>
				<button>Submit</button>
			</form>
		</div>
	)
}

const AddExpense = (props) => {
	return (
		<div className="overlay" ref={props.reference}>
			<form className="secondform" onSubmit={props.addExpense}>
				<i className="fa fa-times-circle" aria-hidden="true" onClick={props.exit}></i>
				<select value={props.getValue} name="expenseCurrency" onChange={props.handleChange}>
					<option defaultValue="USD" value="USD">USD</option>
					<option defaultValue="CAD" value="CAD">CAD</option>
				</select>
				<label htmlFor="expenseAmount">Amount</label>
				<input type="number" name="expenseAmount" placeholder="Amount" onChange={props.handleChange}/>
				<label htmlFor="expenseName">Name</label>
				<input type="text" name="expenseName" placeholder="Title" onChange={props.handleChange}/>
				<button>Submit it</button>
			</form>
		</div>
	)
}

const TheTrip = (props) => {

		return (
			<section className="uniqueTripContainer" ref={props.reference}>
				<button onClick={props.open}>Add an Expense</button>
				<div className="uniqueTripDetails">
					<h1>{props.uniqueName}</h1>
					<p>{props.uniqueBudget}</p>
					<p>{props.uniqueCurrency}</p>
					<p>{props.uniqueNotes}</p>
				</div>	
				{props.expenseArray.map((uniqueExpense) => {
					return (
						<div className="expenseList">
							<h3>{uniqueExpense.expenseName}</h3>
							<p>{uniqueExpense.expenseCurrency}</p>
							<p>{uniqueExpense.expenseAmount}</p>
						</div>
					)
				})}
			</section>
		)

}


export default class MainPortal extends React.Component {
	constructor() {
		super();
		this.state = {
			//for trips screen
			tripsArray: [],
			tripName: '',
			tripBudget: '',
			tripCurrency: '',
			tripNotes: '',
			tripShow: '',

			theTripPortal: '',
			//used to show data when the trip is clicked through
			uniqueTripName: '',
			uniqueTripBudget: '',
			uniqueTripNotes: '',
			uniqueTripCurrency: '',
			expenseCurrency: '',
			expenseAmount: '',
			expenseName: '',
			unqiueExpenseArray: [],
			addExpenseShow: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.showTravelList = this.showTravelList.bind(this);
		this.addTrip = this.addTrip.bind(this);
		this.addExpense = this.addExpense.bind(this);
		this.exitForm = this.exitForm.bind(this);
		this.openAddExpense = this.openAddExpense.bind(this);
	}
	
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	showTravelList() {
		this.setState({
			tripShow: true
		})
		console.log('clicked')
	}
	exitForm() {
		this.setState({
			tripShow: false
		})
	}
	addTrip(e) {
		e.preventDefault();
		const tripDuplicate = this.state.tripsArray.slice();
		const tripDetails = {
			tripName: this.state.tripName,
			tripBudget: this.state.tripBudget,
			tripCurrency: this.state.tripCurrency,
			tripNotes: this.state.tripNotes
		}
		tripDuplicate.push(tripDetails);
		this.setState({
			tripsArray: tripDuplicate,
			tripName: '',
			tripBudget: '',
			tripCurrency: '',
			tripNotes: '',
			tripShow: false
		})
	}
	removeTripList(i) {
		console.log('whati', i)
		const tripDuplicate = this.state.tripsArray.slice();
		const indexToDelete = i;
		tripDuplicate.splice(i, 1);
		this.setState({
			tripsArray: tripDuplicate
		})
	}
	enterTripList(e) {
		console.log('clicked', e);
		//setting unique... means we pass what was enterd in the form to the other screen
		this.setState({
			uniqueTripName: e.tripName,
			uniqueTripBudget: e.tripBudget,
			uniqueTripNotes: e.tripNotes,
			uniqueTripCurrency: e.tripCurrency,
			theTripPortal: true
		})
	}
	
	addExpense(e) {
		e.preventDefault();
		console.log('yeee');
		const expenseDetails = {
			expenseName: this.state.expenseName,
			expenseAmount: this.state.expenseAmount,
			expenseCurrency: this.state.expenseCurrency
		}
		this.state.unqiueExpenseArray.push(expenseDetails);
		this.uniqueTripBudget = this.state.uniqueTripBudget - this.state.expenseAmount;
		this.setState({
			expenseCurrency: '',
			expenseAmount: '',
			expenseName: '',
			uniqueTripBudget: this.uniqueTripBudget,
			addExpenseShow: false
		})
		console.log(this.state.unqiueExpenseArray)
	}
	openAddExpense() {
		this.setState({
			addExpenseShow: true
		})
		console.log('clicked');
	}
	render() {
		//when user clicks add a trip... on click, it sets tripShow state to true, and when it's true, we show tripForm
		//ADD A TRIP FORM
		let tripForm = '';
		if (this.state.tripShow == true) {
			tripForm = (
				<AddTripForm appear={this.showTravelList} handleChange={this.handleChange} add={this.addTrip} thisValue={this.state.value} reference={ref => this.showTripForm = ref} exit={this.exitForm} />
			)
		}

		//ADD AN EXPENSE FORM
		let addExpenseForm = '';
		if (this.state.addExpenseShow == true) {
			addExpenseForm = (
				<AddExpense addExpense={this.addExpense} getValue={this.state.value} handleChange={this.handleChange} reference={ref => this.showTripForm = ref} exit={this.exitForm} />
			)
		}

		let theTripPortal = '';
		if (this.state.theTripPortal == true) {
			theTripPortal = (
					<TheTrip reference={ref => this.uniqueTrip = ref} open={this.openAddExpense} uniqueName={this.state.uniqueTripName} uniqueBudget={this.state.uniqueTripBudget} uniqueCurrnecy={this.state.uniqueTripCurrency} uniqueNotes={this.state.uniqueTripNotes} expenseArray={this.state.unqiueExpenseArray} />
				)
		}
		if (this.state.theTripPortal == false) {
			theTripPortal = (
				<section className="tripsSection wrapper" ref={ref => this.tripList = ref}>
					<article className="tripsContainer">
						<div className="tripsHeader">
							<h2>Trips</h2>
							<button className="btn" onClick={this.showTravelList}>Add a trip</button>
						</div>
							{this.state.tripsArray.map((trip, i) => {
								return (
									<div className="tripList">
										<div className="eachTrip">
											<h3>{trip.tripName}</h3>
											<p>{trip.tripCurrency}</p>
											<p>{trip.tripBudget}</p>
											<p className="notes">{trip.tripNotes}</p>
										</div>
										<div className="eachAction">
											<i className="fa fa-sign-in" aria-hidden="true" onClick={() => this.enterTripList(trip)}></i>
											<i className="fa fa-trash-o" aria-hidden="true" onClick={() => this.removeTripList(i)}></i>
										</div>
									</div>
								)
							})}
					</article>
				</section>
			)
		}

		return (
			<div>
				{tripForm}
				{addExpenseForm}
				<header className="heroImage">
					<nav className="wrapper">
						<h2 className="logo">TripPlanner</h2>
					</nav>
					<div className="headerBottom wrapper">
						<h3>{`Destination: ${this.state.uniqueTripName}`}</h3>
						<h3>{`Budget: ${this.state.uniqueTripBudget} ${this.state.uniqueTripCurrency}`}</h3>
					</div>
				</header>
				<div className="cta">Hello There! Welcome to the trip planner</div>

				{theTripPortal}
					
			</div>
				
		)
	}
}