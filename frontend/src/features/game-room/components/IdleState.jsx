import { GameState } from "../types/GameStates";
function IdleState({ setGameState }) {
  return (
    <>
      <h1>Listening Game Idle</h1>
      <button onClick={() => setGameState(GameState.CREATE_GAME_ROOM)}>
        {" "}
        Next State
      </button>
    </>
  );
}

export default IdleState;
