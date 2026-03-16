import { GameState } from "../types/GameStates";
function LobbyState({ setGameState }) {
  return (
    <>
      <h1>Lobby</h1>
      <button onClick={() => setGameState(GameState.ROOM)}> Next State</button>
    </>
  );
}

export default LobbyState;
