import React, { useState, useEffect } from 'react';
import UserTile from "./UserTile";


const Room = ({ userName = '', room = {}, roomUsers = [], handleLeaveRoom, handleStartGame, handleAction }) => {
  const { roomName, dayCount, nightTime, aliveCount, message, votes, revote, gameOver } = room;
  const eventStamp = `${dayCount}${nightTime}${revote.count}`;

  const [selectedUser, setSelectedUser] = useState(undefined);
  const [userMessage, setUserMessage] = useState('');
  const [user, setUser] = useState({});
  const [recentClick, setRecentClick] = useState(false);

  useEffect(() => {
    const userIndex = roomUsers.findIndex(us => us.userName === userName);
    setUser(u => (
      {
      ...u,
      ...roomUsers[userIndex],
    }));
    if (roomUsers && roomUsers.length < 4 && dayCount === 0) { 
      setUserMessage(`${4 - roomUsers.length} more players needed...`)
    } else {
      setUserMessage('');
    }
  }, [roomUsers, userName, dayCount])
  
  useEffect(() => {
    if (user.previousEvent === eventStamp) {
      setSelectedUser(user.previousTarget);
    } else {
      setSelectedUser(undefined);
    }
  }, [user, eventStamp]);

  const handleUserClick = (target) => {
    if (!recentClick &&
      dayCount > 0 && 
      !gameOver &&
      !user.dead &&
      (user.role !== 'villager' || !nightTime) &&
      (revote.users.length === 0 || revote.users.includes(target)) &&
      !selectedUser) {
      if (nightTime && user.previousSaved && user.previousSaved === target) {
        setUserMessage('Can\'t save the same person two nights in row!')
      } else {
      handleAction(target, user.role);
      }
      setRecentClick(true);
      setTimeout(() => setRecentClick(false), 2000);
    }
  }

  const gameReady = roomUsers && roomUsers.length > 3;
  const gamePosition = dayCount > 0 ? `${nightTime ? 'Night' : 'Day'} ${dayCount}` : '';
  const voteCount = votes ? Object.values(votes).reduce((a, b) => a + b, 0) : 0;
  const voteTracker = nightTime || dayCount === 0 ? undefined : `[${voteCount}/${aliveCount}]`;

  const title = () => {
    if (gameOver) { return 'Game over!' }
    else if (gamePosition) { return gamePosition }
    else { return `Welcome to ${roomName}` };
  }

  const instruction = () => {
    if (dayCount > 0 && user.dead) {
      return 'You are dead!';
    } else if (nightTime) {
      if (selectedUser) { return 'Go to sleep'};
      switch (user.role) {
        case 'mafia':
          return 'Choose who you want to kill';
        case 'doctor':
          return 'Choose who you want to save';
        case 'policeman':
        return 'Choose who you want to investigate';
        default:
          return 'Go to sleep';
      }
    } else {
      if (selectedUser) { return ''};
      return 'Vote for who you want to lynch';
    }
  }

  const userTiles = (roomUsers || []).map((u, index) => 
    <UserTile 
      user={u} 
      index={index} 
      selected={selectedUser === u.userName} 
      handleUserClick={handleUserClick}
      you={user && user.userName === u.userName}
      key={u.userName} 
      revoteCandidate={revote && revote.users.some(us => us === u.userName)}
      userVotes={votes[u.userName]}
      opening={dayCount === 0}
    />
  );

  return (
    <div className={`room section ${nightTime ? 'night' : 'day'}`}>
    {roomUsers.length > 0 &&
      <div>
      <div className="title">{title()}</div>
        {dayCount > 0 && !gameOver? <div className="instruction">{`${instruction()} ${voteTracker ? voteTracker : ''}`}</div> : undefined}
        <div className="users">{userTiles}</div>
        <div className="user-message">{userMessage || message}</div>
        {dayCount === 0 && user.host && 
          <button 
            className={`button primary ${gameReady ? '' : 'deactivated'}`} 
            onClick={gameReady ? handleStartGame : undefined}>Start game
          </button>
        }
        <button className={`button ${gamePosition && !gameOver ? 'secondary' : 'primary'}`} onClick={handleLeaveRoom}>Leave village</button>
      </div>
      }
    </div>
  );
};

export default Room;