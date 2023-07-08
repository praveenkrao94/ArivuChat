import React from 'react'

function Avatar({userId , username}) {

    // have unique color for uniue user with the userId

    const colors = ['bg-blue-200' , 'bg-blue-200' ,'bg-red-200' ,'bg-yellow-200' ,'bg-purple-200' ,'bg-green-200' , 'bg-teal-200' ]

    const userIdBase10 = parseInt(userId , 16)    //conversion to have it 0,4,0
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex]

  return (
    <div className={"w-9 h-9 rounded-full flex items-center " + color}> 
    {/* this is to get this first lette from username and display */}
        <div className="text-center w-full opacity-60 uppercase">
        {username[0]} 
        </div>  
         {/* end  */}
    </div>
  );
}

export default Avatar