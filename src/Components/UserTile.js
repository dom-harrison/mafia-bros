import React from 'react';

const UserTile = ({ user = {}, index = 0, selected = false, handleUserClick }) => {
  const { name, dead, role } = user;
    return (
      <div className={`user ${selected ? 'selected' : ''}`}  onClick={() => dead ? false : handleUserClick(name, index)}>
        <div>{name}</div>
        <div>{dead ? 'Dead' : 'Alive'}</div>
        <div>{role}</div>
      </div>
    );
  };
  
  export default UserTile;