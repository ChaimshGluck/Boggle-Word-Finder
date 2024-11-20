import BoardControllers from "./BoardControllers";
import BoggleBoard from "./BoggleGame";

function PlayBoggle() {

    return (
        <div>
            <h2>Play Boggle</h2>
            <h3>Find words on the board</h3>
            <p>Click on the letters to form a word</p>
            <p>Words must be at least 4 letters long</p>
            <BoardControllers />
            <BoggleBoard />
        </div>
    );
}

export default PlayBoggle;