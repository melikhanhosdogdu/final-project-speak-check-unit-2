import { useEffect, useState } from "react";
import { GameState } from "./types/GameStates";
import IdleState from "./components/IdleState";
import CreateGameRoomState from "./components/CreateGameRoomState";
import LobbyState from "./components/LobbyState";
import RoomState from "./components/RoomState";

function GameRoomPage() {
  const [gameState, setGameState] = useState(GameState.IDLE);
  useEffect(() => {}, [gameState]);
  const showCurrntPage = () => {
    switch (gameState) {
      case GameState.IDLE:
        return <IdleState setGameState={setGameState} />;
      case GameState.CREATE_GAME_ROOM:
        return <CreateGameRoomState setGameState={setGameState} />;
      case GameState.LOBBY:
        return <LobbyState setGameState={setGameState} />;
      case GameState.ROOM:
        return <RoomState setGameState={setGameState} />;

      default:
        break;
    }
  };
  return (
    <>
      <h1>Game Room Page under construction</h1>
      {showCurrntPage()}
    </>
  );
}

export default GameRoomPage;
