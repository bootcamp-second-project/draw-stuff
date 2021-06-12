// select all relavant elements up here

// homepage needs at least 3 fetches...

const defaultUrl = "http://localhost:3001";

// fetch function to post a new user to the database
async function createUser(avatar, username, url = defaultUrl) {
    const response = await fetch(`${url}/api/users`, {
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
    return data;
}



// fetch function to create a new game in the database
async function createGame(rounds, roundTime, url = defaultUrl) {
    const response = await fetch(`${url}/api/game`, {
        method: "POST",
        body: JSON.stringify({
            rounds, //this is a shortcut for `rounds: rounds`
            round_time: roundTime,
            draw_list: "",
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
    const response = await fetch(`${url}/api/player`, {
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


// need some button handling that considers the selected dropdown value
// disable the play button while creating a game is selected

// have event listeners on the dropdown input??
// this could handle updating the modal displays 

/**
    TEST CODE
*/

createUser(1, "hello");
