import React, { useState, useContext } from 'react';
import './style.css'
import axios from 'axios';
import { UserContext } from '../UserContext';



function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isloginorRegister ,setIsLoginOrRegister] = useState('register')

  const{setUsername:setLoggedInUsername,setId} = useContext(UserContext);


  async function handleSubmit(e) {
    e.preventDefault();
    const url = isloginorRegister === 'register' ? '/register' : '/login'
    const { data } = await axios.post(url, { username, password });

   setLoggedInUsername(username);
   setId(data.id);
    
   
  }

  return (
    <div className="bg-blue-900 h-screen">
        <div className="login-box">
            <h2 className='text-2xl'>
                {isloginorRegister === 'register' ? 'Register' : 'Login'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="user-box">
                    <input type="text" value={username} onChange={(ev) => setUsername(ev.target.value)} />
                    <label>Username</label>
                </div>
                <div className="user-box">
                    <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
                    <label>Password</label>
                </div>
                <div className='flex items-center justify-center -mt-6'>
                    <button className="btnCls">
                        {isloginorRegister === 'register' ? 'register' : 'login'}
                    </button>
                </div>

                <div className='text-center pt-5 text-white'>

                    {isloginorRegister === 'register' && (
                        <div>
                            Already a member?
                            <button onClick={() => setIsLoginOrRegister('login')} href="">  Login Here</button>
                        </div>
                    )}
                    {isloginorRegister === 'login' && (
                        <div>
                            Dont Have an account ?
                            <button onClick={() => setIsLoginOrRegister('register')} href="">Register</button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    </div>
);
}

export default Register;
