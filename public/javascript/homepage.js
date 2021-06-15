// select all relavant elements up here

// homepage needs at least 3 fetches...

const defaultUrl = "http://localhost:3001";

// fetch function to post a new user to the database
async function createUser(avatar, username, url = defaultUrl) {
    const response = await fetch(`/api/users`, {
        method: "POST",
        body: JSON.stringify({
            username: username,
            avatarId: avatar,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    sessionStorage.setItem('user', JSON.stringify(data))
    return data;
}



// fetch function to create a new game in the database
async function createGame(rounds, roundTime, drawList, url = defaultUrl) {
    const response = await fetch(`/api/game`, {
        method: "POST",
        body: JSON.stringify({
            rounds, //this is a shortcut for `rounds: rounds`
            round_time: roundTime,
            draw_list: drawList,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}
// fetch function to add a user as player of a game
// this one should eventually redirect to '/play/:id' passing in the game id
// user will end up drawing in a room with the other players in the game
async function addUserToGame(game_id, user_id, url = defaultUrl) {
    const response = await fetch(`/api/player`, {
        method: "POST",
        body: JSON.stringify({
            game_id,
            user_id,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

async function getAllGameIds(url = defaultUrl) {
    const response = await fetch(`/api/game`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}


// need some button handling that considers the selected dropdown value

let gameId;
const dropdown = document.getElementById("gameOption");
let playFunction = async () => {
    const numRounds = document.getElementById(`numRound`).value;
    const roundTime = document.getElementById(`roundTime`).value;
    const drawList = document.getElementById(`drawList`).value;
    console.log(drawList);
    await createGame(numRounds, roundTime);
    window.location.href = `${defaultUrl}/play/${gameId}`;
};
// addEventListener(event, function);
dropdown.addEventListener("change", async (event) => {
    // create | join | random
    const selectedDropdown = event.target.value;
    if (selectedDropdown === "create") {
        // ask for rounds, round time, and draw list
        playFunction = async () => {
            const numRounds = document.getElementById(`numRound`).value;
            const roundTime = document.getElementById(`roundTime`).value;
            const drawList = document.getElementById(`drawList`).value.split(new RegExp(",\\s*"));
            await createGame(numRounds, roundTime, drawList);
            window.location.href = `${defaultUrl}/play/${gameId}`;
        };
        document.getElementById("playButton").textContent = "Create Game";

    } else if (selectedDropdown === "join") {
        // i think we need to grab a game by its id from the input
        playFunction = async () => {
            const gameId = document.getElementById(`gameNumber`).value;
            const usernameText = document.getElementById(`usernameInput`).value;
            const newUser = await createUser(0, usernameText);
            await addUserToGame(gameId, newUser.id);
            window.location.href = `${defaultUrl}/play/${gameId}`;
        }
        document.getElementById("playButton").textContent = "Play";

    } else if (selectedDropdown === "random") {
        // grab a random game id from server
        const gameIds = await getAllGameIds();
        const randomIndex = Math.floor(Math.random() * gameIds.length);
        gameId = gameIds[randomIndex];
        playFunction = async () => {
            const usernameText = document.getElementById(`usernameInput`).value;
            const newUser = await createUser(0, usernameText);
            await addUserToGame(gameId, newUser.id);
            window.location.href = `${defaultUrl}/play/${gameId}`;
        }
        document.getElementById("playButton").textContent = "Play";
    }
});

document.getElementById("playButton").onclick = async () => {
    playFunction();
}

// disable the play button while creating a game is selected

// have event listeners on the dropdown input??
// this could handle updating the modal displays 

/**
    TEST CODE
*/
