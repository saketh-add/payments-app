import { useEffect } from "react"
import axios from 'axios'

export default function PaymentModal({ userID }) {

    const [amount, setAmount] = React.useState();

    function fundTransfer() {
        axios({
            method: "post",
            url: "",
            headers: {
                Authorization: token
            }
        })
            .then(() => {
                console.log("Transfer Successful")
            })
            .catch(err => console.log(err));
    }

    return <div>
        <div>
            <h1>Send Money</h1>
            <h2>To {firstName} {lastName}</h2>
            <label htmlFor="amount">Amount</label>
            <input id="amount" value={amount}></input>
            <button onClick={fundTransfer}>Initiate Transfer</button>
        </div>
    </div>
}