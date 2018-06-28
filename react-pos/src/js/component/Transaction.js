import React, { Component } from "react";
import "../../App.css";
import Header from "./Header";
import CompleteTransactions from "./CompleteTransactions";
import axios from "axios";

const HOST = "http://localhost:3000";
const url = HOST + `/api/all`;

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = { transactions: [] };
    }
    componentWillMount() {
        axios.get(url).then(response => {
            this.setState({ transactions: response.data });
        });
    }
    render() {
        let { transactions } = this.state;

        let rendertransactions = () => {
            if (transactions.length === 0) {
                return <p>No Transactions found</p>;
            }
            return transactions.map(transaction => (
                <CompleteTransactions {...transaction} />
            ));
        };

        return (
            <div>
                <Header />
                <div class="text-center">
                    <span class="">Today's Sales</span>
                    <br />
                    <span class="text-success checkout-total-price">$<span />
                    </span>
                </div>

                <br />
                <br />

                <table class="table table-hover table-stripped">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Total</th>
                            <th>Products</th>
                            <th>Open</th>
                        </tr>
                    </thead>
                    <tbody>{rendertransactions()}</tbody>
                </table>
            </div>
        );
    }
}

export default Transactions;