import { useRecoilState, useRecoilValue } from "recoil"
import { userAtom } from '../store/atoms/userAtom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function SignupPage() {

    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    function handleChange(event) {
        setUser(user => {
            return {
                ...user,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleSignUp(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/v1/user/signup',
            data: user
        })
            .then(res => {
                const { token } = res.data;
                localStorage.setItem('accessToken', token);
                navigate('/dashboard')
            })
            .catch(err => {
                alert("There is an error!!!");
                console.log(err);
            })
    }

    return <div className="max-w-md mx-auto mt-10 p-8 shadow-lg rounded-lg">
        <h1 className="my-4 font-sans text-3xl font-bold text-center">Sign Up</h1>
        <h2 className="mb-8 font-light text-center">Enter your information to create an account</h2>

        <div className="flex flex-col">
            <label className="font-medium text-lg mb-2" htmlFor="firstName">First Name</label>
            <input className="mb-6 border-2 border-grey-450 p-2 text-md rounded-md" id="firstName" name="firstName" type="text" value={user.firstName} onChange={handleChange} />

            <label className="font-medium text-lg mb-2" htmlFor="lastName">Last Name</label>
            <input className="mb-6 border-2 border-grey-450 p-2 text-md rounded-md" id="lastName" name="lastName" type="text" value={user.lastName} onChange={handleChange} />

            <label className="font-medium text-lg mb-2" htmlFor="email">Email</label>
            <input className="mb-6 border-2 border-grey-450 p-2 text-md rounded-md" id="email" name="username" type="email" value={user.username} onChange={handleChange} />

            <label className="font-medium text-lg mb-2" htmlFor="password">Password</label>
            <input className="mb-6 border-2 border-grey-450 p-2 text-md rounded-md" id="password" name="password" type="password" value={user.password} onChange={handleChange} />

            <button className="m-2 p-2 mx-auto bg-black rounded-lg text-white font-medium w-full min-h-8 text-center active:bg-gray-900" onClick={handleSignUp}>Sign Up</button>
        </div>
    </div>
}