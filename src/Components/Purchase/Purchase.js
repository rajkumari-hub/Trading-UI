import React, { Component } from 'react'
import './Purchase.css'
import axios from 'axios'
import url from '../../config.json'
import Axios from 'axios';
import SweetAlert from 'sweetalert-react';
export class Purchase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialState: {
                stockList: [{
                    name: 'Hero',
                    unitPrice: '1100',
                    stockExchange: 'NSE'
                }],
                quantity:'',
                unitPrice:'',
                totalPriceObtained: false,
                totalPrice:'',
                stockId: '',
                stockName:'',
                updatedPrice: ''

            },
            allStocksList: [],
            quantity: '',
            stockId: '',
            stockName: '',
            unitPrice: '100',
            totalPrice: '',
            totalPriceObtained: false,
            quantityError: '',
            confirmed: false,
            updatedPrice:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this);
        this.onStockChange = this.onStockChange.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleOrder = this.handleOrder.bind(this);
        this.handleOrderCancel = this.handleOrderCancel.bind(this);

    }
    handleChange(e) {
        this.setState({ [e.target.id]: e.target.value }, () => {
            // localStorage.setItem("data",this.state.emailId)
        });

    }
    componentDidMount() {
        axios.get(`${url.url}/getAllStocks`)
            .then(res => {
                console.log("res inside component did mount get all stocks", res)
                if (res.status === 200 && res.data.status === "SUCCESS") {
                    console.log("inside success")
                    this.setState({
                        allStocksList: res.data.data
                    }, () => {
                        console.log("all stock after set state", this.state.allStocksList)
                    });
                } else {

                }
            })
    }
    handleConfirm(e){
        e.preventDefault()
        let stock={
            stockId: this.state.stockId,
            quantity: this.state.quantity
        }
        axios.post(`${url.url}/updatedPrice`,stock )
                .then(res => {
                    console.log("res inside handle confirm", res)
                    if (res.status === 200 && res.data.status === "SUCCESS") {
                        console.log("inside success")
                        this.setState({
                            updatedPrice: res.data.totalPrice,
                            confirmed: true
                        }, () => {
                            console.log("updated price", this.state.updatedPrice)
                        });
                    } else {
    
                    }
                }).catch(err => {
                    
                })
    }
    handleOrderCancel(e){
        e.preventDefault()
        let userId=localStorage.getItem('userId')
        let stock={
            stockId: this.state.stockId,
            quantity: this.state.quantity,
            userId: userId,
            price: this.state.updatedPrice,
            status: "CANCEL",
            unitPrice: this.state.unitPrice
        }
        axios.post(`${url.url}/order`,stock )
                .then(res => {
                    console.log("res inside handle confirm", res)
                    if (res.status === 200 && res.data.status === "SUCCESS") {
                        console.log("inside success")
                        this.setState({
                            orderId: res.data.orderId
                        }, () => {
                            console.log("orderid", this.state.orderId)
                        });
                        alert(`Order submitted successfully. Order Id: ${this.state.orderId}`)
                        this.props.history.push('/home')
                    } else {
    
                    }
                }).catch(err => {
                    
                })
    }
    handleOrder(e){
        e.preventDefault()
        let userId=localStorage.getItem('userId')
        let stock={
            stockId: this.state.stockId,
            quantity: this.state.quantity,
            userId: userId,
            price: this.state.updatedPrice,
            status: "SUCCESS",
            unitPrice: this.state.unitPrice
        }
        axios.post(`${url.url}/order`,stock )
                .then(res => {
                    console.log("res inside handle confirm", res)
                    if (res.status === 200 && res.data.status === "SUCCESS") {
                        console.log("inside success")
                        this.setState({
                            orderId: res.data.orderId
                        }, () => {
                            console.log("orderid", this.state.orderId)
                        });
                        alert("Order submission cancelled")
                        this.props.history.push('/home')
                    } else {
    
                    }
                }).catch(err => {
                    
                })

    }
    handleSubmit(e) {
        e.preventDefault()
        this.validate().then((res) => {
            console.log("res", res)
            const { stockId, unitPrice, quantity } = this.state
            let userId = localStorage.getItem('userId')
            const stock = {
                stockId: stockId,
                quantity: parseInt(quantity),
                unitPrice: unitPrice
            };
            console.log("validation response", res)
            if (res) {
                this.getData(stock).then((response) => {
                    console.log("response of purchase", response)
                    if (response.status === 200 && response.data.status === "SUCCESS") {
                        console.log("response of purchase", response)
                        this.setState({
                            totalPriceObtained: true,
                            totalPrice: response.data.totalPrice
                        })
                    } else {
                        alert(`Sorry we do not find any movies available on this date`);
                    }
                })
            }
        });

    }
 
    onStockChange(e) {
        this.setState({
            stockId: this.state.allStocksList[e.target.value - 1].stockId,
            stockName: this.state.allStocksList[e.target.value - 1].stockName,
            unitPrice: this.state.allStocksList[e.target.value - 1].unitPrice
        }, () => {
            console.log("After stock change", this.state.stockId, this.state.stockName)
        })

    }
    handleCancel(e) {
        e.preventDefault();
        this.setState(() => this.initialState)
        document.getElementById("purchaseform").reset();
        console.log("state after reset", this.state)
    }
    getData(stock) {
        return new Promise((resolve, reject) => {
            axios.post(`${url.url}/totalPrice`, stock)
                .then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
        });
    }
    validate() {
        return new Promise((resolve, reject) => {
            console.log("Inside validate")
            let isValid = true;
            const errors = {
                quantityError: ''
            }
            var UserDate = this.state.date
            var ToDate = new Date();

            // if (this.state.date && new Date(UserDate).getTime() >= ToDate.getTime()) {
            //     console.log("Date is valid")
            // } else {
            //     isValid = false;
            //     errors.dateError = "Please select valid date either today or future date"
            // }
            var pattern = new RegExp('^\\d*$');
            if (pattern.test(this.state.quantity )) {

            } else {
                isValid=false;
                errors.quantityError="Quantity should be a number greater than 0"
            }
            if(this.state.stockName===''){
                isValid=false;
                errors.stockNameError="Please select a stock from the list and enter quantity"
            } 
            this.setState({
                ...this.state,
                ...errors
            })
            return resolve(true)
        })

    }
    render() {

        let stockList = this.state.allStocksList.map((item, i) => {
            console.log("item", item)
            return (
                <option key={i} value={item.stockId}>{item.stockName}</option>
            )
        }, this);
        console.log("stock list inside render", stockList)
        return (
            <div>
                {/* <header >
                    <h2> Buy Stocks</h2>
                </header> */}
                <form id="purchaseform" className="purchaseform">
                    <div className="form-group">
                    <span className="pull-right text-danger " ><small>{this.state.stockNameError}</small></span>
                        <div className="form-group col-xs-3">
                            <label htmlFor="stockName" style={{ "font-weight": "bold" }}>Select the stock</label>
                            <select
                                className="form-control"
                                id="stockName"
                                onChange={this.onStockChange}
                            >
                                <option>select</option>
                                {stockList}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <span className="pull-right text-danger " ><small>{this.state.quantityError}</small></span>
                        <label htmlFor="quantity" style={{ "font-weight": "bold" }}>Enter the quantity</label>
                        <input
                            type="quantity"
                            id="quantity"
                            onChange={this.handleChange}
                            value={this.state.quantity}
                            className="form-control"
                            placeholder="Enter the quantity" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="unitPrice" style={{ "font-weight": "bold" }}>Unit Price for selected stock</label>
                        <input
                            type="unitPrice"
                            id="unitPrice"
                            value={this.state.unitPrice}
                            className="form-control"
                            readOnly />

                        <h7 >***Brokerage fee is 10%</h7>
                    </div>
                    <span>
                        <button id="submit" type="submit" className="but" onClick={this.handleSubmit}>Buy</button>
                    </span>
                    <span>&nbsp;&nbsp;
                <button id="submitcancel" type="submit" className="but" onClick={this.handleCancel}>Cancel</button>
                    </span>

                </form>
                <br></br>
                {
                    this.state.totalPriceObtained ?
                        (<div>
                            <span>
                                <h5>Total Price in INR: {this.state.totalPrice}</h5>
                                    <button id="submitconfirm" type="submit" className="but" onClick={this.handleConfirm}>Confirm</button>
                                    <button id="submitcancel" type="submit" className="but" onClick={this.handleCancel}>Cancel</button>

                            </span>
                        </div>
                        ) :
                        (<div></div>)
                }
                <br></br>
                {
                    this.state.confirmed ?
                        (<div>
                            <span>
                                <h5>Total Price in INR: {this.state.totalPrice} &nbsp; &nbsp; Updated Price in INR: {this.state.updatedPrice} </h5>
                                <button id="submitorder" type="submit" className="butgreen" onClick={this.handleOrder }>Confirm</button>
                                <button id="submitcancel" type="submit" className="but" onClick={this.handleOrderCancel}>Cancel</button>
                            </span>
                        </div>
                        ) :
                        (<div></div>)
                }
            </div>
        )
    }
}

export default Purchase
