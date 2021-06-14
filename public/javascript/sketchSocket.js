const url = window.location.href.split('/')
const gameRoom = url[url.length - 1]
let scored // local to prevent rescoring
let drawStarted // local to hide start drawing button
let drawingPlayer // player set to draw true in db
let scoringPlayers // players set to draw false in db
let currentRound // lowest round_number for game in db
let leftToDraw // dynamic list, shortens as game goes on
let roundLength // from game obj
let currentUser = JSON.parse(sessionStorage.getItem('user')) || { "session_id": "hehe" }

// grab relevant elements here...
const drawWordEl = document.getElementById('draw-word')
const drawerAvatarEl = document.getElementById('drawer-avatar')
const drawerUsernameEl = document.getElementById('drawer-username')
const scoringPlayersContainer = document.getElementById('scoring-players')
const scoreFormEl = document.getElementById('score-form')
const submitButtonEl = document.getElementById('submit-score')
const scoreSelectEl = document.getElementById('score')
const boardControlsEl = document.getElementById('drawing-controls-section')
const startRoundButtonEl = document.getElementById('start-draw-btn')

// async fetch to grab data from database
const gameData = async (gameId) => {
  // fetch for grabbing game data, includes player and round datas
  const dbGameData = await fetch(`/api/game/${gameId}`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())
  // map players to a new array
  players = dbGameData.users.map((player) => {
    const playerData = {
      username: player.username,
      id: player.id,
      score: player.game_users.score,
      drawing: player.game_users.drawing,
      session_id: player.session_id,
      game_id: dbGameData.id
    }
    return playerData
  })
  // update drawingPlayer and scoringPlayers with current list from players
  drawingPlayers = players.filter((player) => player.drawing === true)
  drawingPlayer = drawingPlayers.shift() // returns first entry from list
  scoringPlayers = players
    .filter((player) => player.drawing === false)
    .sort((a, b) => (a.id < b.id ? -1 : 1))
  // set round length
  roundLength = dbGameData.round_time
  // update round data, sorted by round number, filter for uncompleted rnds
  currentRound = dbGameData.game_rounds
    .sort((a, b) => (a.round_number < b.round_number ? -1 : 1))
    .filter((r) => r.complete === false)
    .shift()
  leftToDraw = currentRound.left_to_draw.drawers
}

// interval timer for data fetching continuously
const gameDataUpdater = () => {
  setInterval(async () => {
    // keeps local variables updated with db
    await gameData(gameRoom)
    pageRender()
  },1000) // runs every 1000 milliseconds
}
gameDataUpdater()

const playerDrawTimer = () => {
  // timer to allow each user to draw consecutively
  // initiates on drawer's client after they press start draw button
  const timer = setTimeout(async () => {
    // after the timer ends, update the drawer to draw false
    // and update the next player to draw true
    drawStarted = false
    // turn drawing off for drawing player
    const drawOff = await drawingUpdateDB(drawingPlayer.id, 0)
    // update round's left_to_draw list
    const shiftDrawList = await roundUpdateDB(gameRoom, currentRound.round_number, 0, 1)
    // refresh the list in local variables
    await gameData(gameRoom)
    // check if leftToDraw has any left
    if (leftToDraw[0] === undefined) {
      // end round if there aren't any drawers left
      const roundEnd = await roundUpdateDB(gameRoom, currentRound.round_number, 1, 0)
      const startRoundDrawer = await drawingUpdateDB(scoringPlayers[0].id, 1)
    } else {
      // turn drawing on for the next player
      const drawOn = await drawingUpdateDB(leftToDraw[0], 1)
    }
    drawStarted = false // sets value in previous drawers client
    cv.background(255, 255, 255)
    // describe then emit board-erasing datum to all players from drawer client
    const datum = { x: 300, y: 300, px: 300, py: 300, color: 'FFF', strokeWidth: 9001 }
    socket.emit('mouse', datum)
  }, roundLength * 333) // makes it 1/3rd time for dev purposes
}

// update page elements
const pageRender = () => {
  // update drawing player 
  if (drawingPlayer) {
    drawerUsernameEl.innerHTML = drawingPlayer.username
  }
  // scoring players list update
  const scoringPlayerCards = scoringPlayers.map((player) => {
    return (
`<div id="scoring-player" class="m-2 flex flex-grow ring-2 items-center text-xl rounded-sm">
  <div id='scorer-avatar' class='avatar m-2 w-8 h-8 bg-blue-300'></div>
  <div id='scorer-username' class="flex-grow text-center text-xl self-center">
    ${player.username}
  </div>
  |
  <div id='scorer-score' class="flex-grow text-center text-xl self-center">
    ${player.score}
  </div>
</div>`
    )
  }).join("") // join removes commas, returns string
  // update the HTML to show scoring players
  scoringPlayersContainer.innerHTML = scoringPlayerCards

  // draw word element update
  if (currentRound !== undefined) {
    drawWordEl.textContent = currentRound.phrase
  } else {
    drawWordEl.textContent = 'no more rounds!!'
  }

  // hide/unhide the vote form, board controls and start round button for drawing/scoring players
  if (currentUser && drawingPlayer) {
    if (currentUser.session_id === drawingPlayer.session_id) {
      // current user is drawing player...
      // hide score form, show controls and start round button
      scoreFormEl.classList.add('hidden')
      boardControlsEl.classList.remove('hidden')
      if (!drawStarted) {
        startRoundButtonEl.classList.remove('hidden')
      }
    } else {
      // current user is not drawing player...
      // show score form, hide board controls and round button
      scoreFormEl.classList.remove('hidden')
      boardControlsEl.classList.add('hidden')
      startRoundButtonEl.classList.add('hidden')
    }
  }
}

// put fetch function to update user scores as the game is played
  // will run after scoring players press vote buttons
const scoreUpdateDB = async (user_id, score) => {
  const response = await fetch(`/api/player/${user_id}/score`, {
    method: 'PUT',
    body: JSON.stringify({ "score": score }),
    headers: { 'Content-Type': 'application/json'}
  })
  if (response.ok) {
    return response
  } else {
    console.log(response.statusText)
  }
}

// put fetch to update player drawing status takes id and boolean
const drawingUpdateDB = async (user_id, drawing) => {
  const response = await fetch(`/api/player/${user_id}/drawing`, {
    method: 'PUT',
    body: JSON.stringify({ "drawing": drawing }),
    headers: { 'Content-Type': 'application/json' }
  })
  if (response.ok) {
    return response
  } else {
    console.log(response.statusText)
  }
}

// put fetch to update game completion takes id and 2 booleans
const gameUpdateDB = async (game_id, complete, started) => {
  const response = await fetch(`/api/game/${game_id}/play`, {
    method: 'PUT',
    body: JSON.stringify({ "complete": complete, "started": started }),
    headers: { 'Content-Type': 'application/json' }
  })
  if (response.ok) {
    return response
  } else {
    console.log(response.statusText)
  }
}

// put fetch to update round completion, 2 ints and 2 booleans
const roundUpdateDB = async (game_id, round_number, complete, player_done) => {
  const response = await fetch(`/api/game/${game_id}/round/${round_number}`, {
    method: 'PUT',
    body: JSON.stringify({ "complete": complete, "player_done": player_done }),
    headers: { 'Content-Type': 'application/json' }
  })
  if (response.ok) {
    return response
  } else {
    console.log(response.statusText)
  }
}

// button handler for scoring on drawing player
submitButtonEl.addEventListener('click', (e) => {
  e.preventDefault()
  const { id } = drawingPlayer
  const score = scoreSelectEl.value.trim
  scored ? console.log('already scored!!') : scoreUpdateDB(id, score)
  scored = true
})

startRoundButtonEl.addEventListener('click', (e) => {
  e.preventDefault()
  playerDrawTimer()
  // hide the button
  startRoundButtonEl.classList.add('hidden')
  drawStarted = true
})

// all things related to the canvas, socket and drawing after this line
let socket
let color = '#111'
let strokeWidth = 4
let cv

function setup() {
  // Creating canvas
	cv = createCanvas(600, 600)
  let originParent = cv.parent()
  cv.parent('#drawing-board')
  originParent.remove()
	cv.background(255, 255, 255)
	// Start the socket connection
	socket = io.connect()

  socket.on('connect', () =>  {
    // server takes join message, adds client to room
    socket.emit('join', gameRoom)
  })
  
	// Callback function
	socket.on('draw', data => {
		stroke(data.color)
		strokeWeight(data.strokeWidth)
		line(data.x, data.y, data.px, data.py)
	})

	// Getting our buttons and the holder through the p5.js dom
	const color_picker = select('#pickcolor')
	const color_btn = select('#color-btn')

	const stroke_width_picker = select('#stroke-width-picker')
	const stroke_btn = select('#stroke-btn')

	// Adding a mousePressed listener to the button
	color_btn.mousePressed(() => {
		// Checking if the input is a valid hex color
		if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value())) {
			color = color_picker.value()
		} else {
			console.log('Enter a valid hex value')
		}
	})

	// Adding a mousePressed listener to the button
	stroke_btn.mousePressed(() => {
		const width = parseInt(stroke_width_picker.value())
		if (width > 0) strokeWidth = width
	})
}

function mouseDragged() {
	stroke(color)
	strokeWeight(strokeWidth)
  // check for a drawing player and current user
  if (currentUser && drawingPlayer){
    // authorize user to draw according to the session id of drawing player
    if (currentUser.session_id === drawingPlayer.session_id && drawStarted) {
      line(mouseX, mouseY, pmouseX, pmouseY)
      // Send the mouse coordinates
      sendmouse(mouseX, mouseY, pmouseX, pmouseY)
    }
  }
}

// Sending data to the socket
function sendmouse(x, y, pX, pY) {
	const data = {
		x: x,
		y: y,
		px: pX,
		py: pY,
		color: color,
		strokeWidth: strokeWidth,
	}
  socket.emit('mouse', data)
}

