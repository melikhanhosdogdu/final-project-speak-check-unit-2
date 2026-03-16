import { GameState } from "../types/GameStates";
function CreateGameRoomState({ setGameState }) {
  return (
    <>
      <h1>Create Game State</h1>
      <button onClick={() => setGameState(GameState.LOBBY)}> Next State</button>
    </>
  );
}

export default CreateGameRoomState;
