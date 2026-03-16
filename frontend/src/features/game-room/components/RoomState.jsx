import { GameState } from "../types/GameStates";
function RoomState({ setGameState }) {
  return (
    <>
      <h1>Room Name</h1>
      <button onClick={() => setGameState(GameState.IDLE)}>
        {" "}
        Back to Start
      </button>
    </>
  );
}

export default RoomState;
