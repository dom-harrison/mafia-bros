import React from 'react';

const SYMBOL = {
  "mafia": "♠️",
  "villager": "♣️",
  "policeman": "♦️",
  "doctor": "♥️",
};

const UserTile = ({ user = {}, index = 0, selected = false, handleUserClick, you = false, revoteCandidate, userVotes }) => {
  let { name, dead, role } = user;

  const symbol = role ? SYMBOL[role] : '';

    return (
      <div className={`user${selected ? ' selected' : ''}${you ? ' you' : ''}${revoteCandidate ? ' revote' : ''}${dead ? ' dead' : ''}`}  onClick={() => dead ? false : handleUserClick(name, index)}>
        <div className={`user-text${dead ? ' dead' : ''}`}>{name}</div>
        <div className={`card ${role ? 'known' : 'unknown'}${dead ? ' dead' : ''}`}>
          <div className='front'>
            <span>{'?'}</span>
          </div>
          <div className={`back ${role}`}>
            <span className="top">{symbol}</span>
            <span>{role}</span>
            <span className="bottom">{symbol}</span>
          </div>
        </div>
        <div className={`user-votes ${!userVotes ? ' hidden' : ''}`}>{userVotes}</div>
      </div>
    );
  };
  
  export default UserTile;