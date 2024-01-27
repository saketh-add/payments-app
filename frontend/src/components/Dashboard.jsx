import React, { useEffect } from "react"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { balanceAtom } from "../store/atoms/balanceAtom";


export default function Dashboard() {

    const [user, setUser] = React.useState({
        firstName: "",
        lastName: ""
    })

    const [balance, setBalance] = useRecoilState(balanceAtom);

    const [users, setUsers] = React.useState([]);

    const [filter, setFilter] = React.useState("");

    const navigate = useNavigate();


    const getDetails = async () => {
        const accessToken = localStorage.getItem('accessToken');
        axios({
            method: 'get',
            url: 'http://localhost:3000/api/v1/user/details',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setUser(res.data);
            })
            .catch(err =>
                console.log(err))

        axios({
            method: 'get',
            url: 'http://localhost:3000/api/v1/account/balance',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setBalance(res.data.balance);
            })
            .catch(err =>
                console.log(err))

        axios({
            method: 'get',
            url: 'http://localhost:3000/api/v1/user/bulk',
            query: {
                filter: filter
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setUsers(res.data.users);
            })
            .catch(err =>
                console.log(err))
    }


    useEffect(() => {
        getDetails()
    }, [])

    async function handleSearch() {
        const accessToken = localStorage.getItem('accessToken');
        axios({
            method: 'get',
            url: `http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setUsers(res.data.users);
            })
            .catch(err =>
                console.log(err))
    }

    function handleChange(event) {
        setFilter(event.target.value);
    }

    function handleLogout() {
        localStorage.removeItem('accessToken');
        navigate('/signin');
    }

    function closeModal() {
        setModalIsOpen(false)
    }

    function fundTransfer() {
        closeModal();
    }

    function Modal({ person, isOpen, closeModal }) {

        const [amount, setAmount] = React.useState(0);
        const [balance, setBalance] = useRecoilState(balanceAtom);

        function handleAmountInput(event) {
            setAmount(event.target.value)
        }

        function fundTransfer() {

            const accessToken = localStorage.getItem('accessToken');
            const transferData = {
                to: person._id,
                amount: amount
            }

            console.log(transferData)
            axios({
                method: "post",
                url: "http://localhost:3000/api/v1/account/transfer",
                data: transferData,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
                .then(() => {
                    setBalance(balance => balance - amount);
                    closeModal()
                })
                .catch(err => console.log(err));
        }

        return isOpen && <>
            <div className="fixed w-full h-full top-0 left-0 bg-gray-700 opacity-50" onClick={closeModal}>
            </div>

            <div className="fixed sm:left-1/3 sm:right-1/3 left-10 top-1/4 lg:h-3/5 lg:w-1/3 bg-white m-auto border-black border-2 opacity-100 flex flex-col opacity-100 p-8">
                <h1 className="mx-2 xl:mb-4 p-2 sm:text-4xl font-bold text-center">Send Money</h1>
                <h2 className="mx-2 my-4 sm:text-2xl font-bold">To {person.firstName} {person.lastName}</h2>
                <label className="mt-2 mx-2 mt-4 mb-2 sm:text-lg font-medium" htmlFor="amount">Amount</label>
                <input className="mb-4 mx-2 p-2 rounded border-gray-300 border-2" id="amount" type="text" value={amount} onChange={handleAmountInput}></input>
                <button className="mx-2 my-4 p-2 bg-black rounded-lg text-white" onClick={fundTransfer}>Initiate Transfer</button>
            </div>
        </>
    }

    function UserCard({ person }) {

        const [modalIsOpen, setModalIsOpen] = React.useState(false);

        function openModal() {
            setModalIsOpen(true)
        }

        function closeModal() {
            setModalIsOpen(false)
        }

        return <div className="mx-2 flex justify-between items-center hover:border-black hover:border-2" key={person.userId}>
            <h3 className="m-2 p-2 sm:text-lg font-medium">{person.firstName} {person.lastName}</h3>
            <button className="bg-black text-white m-2 p-2 rounded-lg" onClick={openModal}>Send Money</button>
            <Modal isOpen={modalIsOpen} person={person} closeModal={closeModal} />
        </div>
    }

    return <div>
        <div className="flex flex-row justify-between mb-2 items-center bg-black">
            <div className="m-2 p-2">
                <h1 className="sm:text-4xl font-bold text-white">Payments App</h1>
            </div>
            <div className="flex items-center m-2 p-2">
                <h2 className="sm:text-xl m-2 font-medium text-white">Hello, {user.firstName}</h2>
                <button className="bg-white m-2 p-2 text-black rounded-md sm:text-sm text-center active:bg-gray-700" onClick={handleLogout}>Log out</button>
            </div>
        </div>
        <h2 className="m-2 p-2 sm:text-2xl">Your Balance <span className="font-bold">${balance}</span></h2>
        <div className="flex flex-col">
            <h1 className="m-2 p-2 sm:text-2xl font-bold">Users</h1>
            <div className="flex">
                <input className="m-2 p-2 border-2 border-gray-300 w-full sm:min-w-40 rounded-lg" type="text" placeholder="Search Users" value={filter} onChange={handleChange} />
                <button className="m-2 p-2 bg-black rounded-lg text-white font-medium w-60 text-center active:bg-gray-900" onClick={handleSearch}>Search</button>
            </div>
            <div className="flex flex-col">
                {
                    users.map(person => <UserCard key={person._id} person={person} />)
                }
            </div>
        </div>
    </div >
}