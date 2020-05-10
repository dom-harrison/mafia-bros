import React from 'react';

const UserTile = ({ user }) =>{ 
    return (
      <div>
        <div>{user.name}</div>
        <div>{user.role}</div>
      </div>
    );
  };
  
  export default UserTile;