import React from 'react'
import { useRecoilState, useRecoilValue } from "recoil"
import { signinAtom } from '../store/atoms/signinAtom'
import { useNavigate } from 'react-router-dom'
import axios, { isAxiosError } from 'axios'

export default function SigninPage() {

    const [user, setUser] = useRecoilState(signinAtom);
    const navigate = useNavigate();
    const [error, setError] = React.useState('');

    function handleChange(event) {
        setUser(user => {
            return {
                ...user,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleSignIn(event) {
        event.preventDefault();
        try {
            axios({
                method: 'post',
                url: 'http://localhost:3000/api/v1/user/signin',
                data: user
            })
                .then(res => {
                    const { token } = res.data;
                    localStorage.setItem('accessToken', token);
                    navigate('/dashboard')
                })
                .catch(err => {
                    isAxiosError(err) && setError(err.response.data.message);
                })
        }
        catch (err) {
            isAxiosError(err) && setError(err.response.data.message);
        }
    }

    return <div className="max-w-md mx-auto mt-10 p-8 shadow-lg rounded-lg">
        <h1 className="my-6 font-sans text-3xl font-bold text-center">Sign In</h1>

        <div className="flex flex-col">

            <label className="font-medium text-lg mb-2" htmlFor="email">Email</label>
            <input className="mb-6 border-2 border-grey-450 p-2 text-md rounded-md" id="email" name="username" type="email" value={user.username} onChange={handleChange} />

            <label className="font-medium text-lg mb-2" htmlFor="password">Password</label>
            <input className="mb-6 border-2 border-grey-450 p-2 text-md rounded-md" id="password" name="password" type="password" value={user.password} onChange={handleChange} />

            <button className="m-2 p-2 mx-auto bg-black rounded-lg text-white font-medium w-full min-h-8 text-center active:bg-gray-900" onClick={handleSignIn}>Sign in</button>
        </div>

        <p className="text-center mt-2 p-2 font-medium">Don't have an account? <button className="underline" onClick={() => navigate('/signup')}>Sign Up</button></p>

        {error && <div className='bg-red-300 m-2 p-2 text-red-900 border-2 border-red-900 text-sm text-center'>{error}</div>}
    </div>
}