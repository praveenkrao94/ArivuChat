import React, { useContext, useEffect, useState } from 'react'

import Avatar from './Avatar'
import Logo from './Logo'
import { UserContext } from '../UserContext'
import Glogo  from '../assets/noSel.gif'



function Chat() {

const [newMessageText,setNewMessageText] = useState('')

       
//step 1 to connected to ws 

const {username , id} = useContext(UserContext)  // to fidn the currect username

const [ws,setWs]= useState(null)  // set ws to state

const [onlinePeople , setOnlinePeople]= useState({})  //state to store the online id 

const [selectedUserId , setSelectedUserId]= useState(null)  // to store selected Id


// ----- start ws -----

useEffect(()=>{
 const ws = new WebSocket('ws://localhost:4040');  //connect to ws
    setWs(ws);
    ws.addEventListener('message' , handleMessage)
},[])

function showOnlinePeople(peopleArray){  //to find the unique people from online object
    const people = {};
    peopleArray.forEach(({userId,username})=> {
        people[userId] = username;  // this give only the userid and username of all active
    });
   setOnlinePeople(people)
                  
}
function handleMessage(e){                      //function to handle message 

const messageData = JSON.parse(e.data);   //data -  is messgae data object from the backend 
// console.log(messageData)
if('online' in messageData){            // online is the object name 
    showOnlinePeople(messageData.online)
}else{
    console.log({messageData});   // this receive the messgae from the back end as obj coz its send in obj
}

}

// --- end -----

const onlinePeopleExcluOurUser = {...onlinePeople}              // this delte our use from the object

    delete onlinePeopleExcluOurUser[id]

function sendMessage(e){     // submit hadnler
    e.preventDefault();
    console.log('sending..')
ws.send(JSON.stringify({
    
        recipient:selectedUserId,  //send from front-end along with the selected user id
        text:newMessageText,
    
})) ; 
setNewMessageText('')       // to empty inp field once sent                   
}


  return (
    <div className="flex h-screen">
        <div className="bg-white w-1/3 ">
          <Logo/>
         

            {/* apply other buttons here */}

                    {/* Dashboard */}


                    {/* <div className={'border border-gray-100 py-4 flex items-center gap-3 cursor-pointer ' }>
                    <span className='text-gray-800 flex gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>


                        Dashboard</span>
            </div> */}


                    {/* chat bot  */}

            {/* <div  className='border-b border-gray-100 py-5 pl-2 flex items-center gap-3 cursor-pointer'>
                    <span className='text-gray-800 flex gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>

                        Chat Bot</span>
            </div> */}
          
                    {/* chats */}


            {Object.keys(onlinePeopleExcluOurUser).map(userId => (
                <div key={userId} onClick={()=>setSelectedUserId(userId) } className={'border-b border-gray-100  flex items-center gap-3 cursor-pointer ' + (userId === selectedUserId ? 'bg-gray-200':" ")}>
                    {userId === selectedUserId && (
                        <div className='w-1 bg-blue-500 h-12 rounded-r-md'></div>
                    )}
                    <div className='flex gap-3 py-3 pl-4 items-center' >
                    <Avatar username ={onlinePeople[userId]} userId={userId}/>
                    <span className='text-gray-800'>{onlinePeople[userId]}</span>
                    </div>
                    
                </div>
            ))}

                    {/* setting */}

{/* <div  className='border-b border-gray-100 py-5 pl-2 flex items-center gap-3 cursor-pointer'>
                    <span className='text-gray-800 flex gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                        </svg>


                        Settings</span>
            </div> */}

        </div>

            {/* ---------------------text box from here-------------------------------  */}


        <div className=" flex flex-col bg-blue-400 w-2/3 p-2">

            <div className="flex-grow">
                {!selectedUserId && (

                   
                        <div className='flex h-full flex-grow items-center justify-center'>
                            <div className=''>
                            <img src={Glogo} alt="" />
                            <h2 className='text-white flex items-center justify-center '>&larr; Select the Chat to Display  </h2>
                            </div>
                            
                        </div>
                   
                )}
                </div>
                
{/* input box  */}
                {!!selectedUserId && (
                    <form className="flex gap-2" onSubmit={sendMessage}>
                <input type="text" placeholder='Type Your message here' value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} className='bg-white border p-2 flex-grow rounded-sm'/>

                

                <button className='bg-blue-500 p-2 text-white rounded-sm'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>

                </button>
            </form>
                )}
            
        </div>


    </div>
)
}

export default Chat