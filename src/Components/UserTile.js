import React from 'react';

const SYMBOL = {
  "mafia": "♠️",
  "villager": "♣️",
  "policeman": "♦️",
  "doctor": "♥️",
};

const UserTile = ({ user = {}, index = 0, selected = false, handleUserClick, you = false }) => {
  const { name, dead, role } = user;

  const symbol = role ? SYMBOL[role] : '';

    return (
      <div className={`user${selected ? ' selected' : ''}${you ? ' you' : ''}`}  onClick={() => dead ? false : handleUserClick(name, index)}>
        <div className="user-text">{name}</div>
        <div className={`card ${role ? role : 'unknown'}${dead ? ' dead' : ''}`}>
          <span className="top">{symbol}</span>
          <span>{role || '?'}</span>
          <span className="bottom">{symbol}</span>
        </div>
        <div className="user-text">{dead ? 'Dead' : 'Alive'}</div>
      </div>
    );
  };
  
  export default UserTile;