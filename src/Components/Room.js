import React, { useState, useEffect } from 'react';
import UserTile from "./UserTile";


const Room = ({ userName = '', room = {}, roomUsers = [], handleLeaveRoom, handleStartGame, handleAction }) => {
  const { name, dayCount, nightTime, aliveCount, message, votes, revote, gameOver } = room;

  const [actionCompleted, setActionCompleted] = useState(false);
  const [previousTarget, setPreviousTarget] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [userMessage, setUserMessage] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    const userIndex = roomUsers.findIndex(us => us.name === userName);
    const host = userIndex === 0;
    setUser(u => (
      {
      ...u,
      ...roomUsers[userIndex],
      host
    }));
    if (roomUsers && roomUsers.length < 4) { 
      setUserMessage(`Need ${4 - roomUsers.length} more players`)
    } else {
      setUserMessage('');
    }
  }, [roomUsers, userName])

  const revoteCount = revote ? revote.count : 0;
  useEffect(() => {
    setActionCompleted(false);
    setSelectedIndex(undefined);
  }, [nightTime, revoteCount])

  const handleUserClick = (target, index) => {
    if (dayCount > 0 && 
      !gameOver && 
      !actionCompleted && 
      !user.dead && 
      (user.role !== 'villager' || !nightTime) && 
      (revote.users.length === 0 || revote.users.includes(target))) {
      if (nightTime && user.role === 'doctor' && target === previousTarget) {
        setUserMessage('Can\'t save the same person two nights in row!')
      } else {
      handleAction(target, user.role);
      setActionCompleted(true);
      setSelectedIndex(index);
      }
      if (nightTime && user.role === 'doctor' ) {
        setPreviousTarget(target);
      }
    }
  }

  const gameReady = roomUsers && roomUsers.length > 3;
  const gamePostion = dayCount > 0 ? `${nightTime ? 'Night' : 'Day'} ${dayCount}` : '';
  const voteCount = votes ? Object.values(votes).reduce((a, b) => a + b, 0) : 0;
  const voteTracker = nightTime || dayCount === 0 ? undefined : `[${voteCount}/${aliveCount}]`;

  const instruction = () => {
    if (dayCount > 0 && user.dead) {
      return 'You are dead!';
    } else if (nightTime) {
      if (actionCompleted) { return 'Go to sleep'};
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
      if (actionCompleted) { return ''};
      return 'Vote for who you want to lynch';
    }
  }

  const userTiles = (roomUsers || []).map((u, index) => 
    <UserTile 
      user={u} 
      index={index} 
      selected={selectedIndex === index} 
      handleUserClick={handleUserClick}
      you={user && user.name === u.name}
      key={u.name} 
    />
  );

  return (
    <div className={`room section ${nightTime ? 'night' : 'day'}`}>
      <div className="title">{gamePostion ? gamePostion : `Welcome to ${name}`}</div>
      {dayCount > 0 && !gameOver? <div>{`${instruction()} ${voteTracker ? voteTracker : ''}`}</div> : undefined}
      <div className="users">{userTiles}</div>
      <div>{userMessage || message}</div>
      {dayCount === 0 && user.host && 
        <button 
          className={`primary-button ${gameReady ? '' : 'deactivated'}`} 
          onClick={gameReady ? handleStartGame : undefined}>Start game
        </button>
      }
      <button className="primary-button" onClick={handleLeaveRoom}>Leave village</button>
    </div>
  );
};

export default Room;