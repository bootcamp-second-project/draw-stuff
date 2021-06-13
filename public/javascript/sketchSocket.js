const url = window.location.href.split('/')
const gameRoom = url[url.length - 1]
let drawingPlayer
let scoringPlayers
let gameRounds
let currentUser = JSON.parse(sessionStorage.getItem('user'))
console.log(currentUser)

// grab relevant elements here...
const drawWordEl = document.getElementById('draw-word')
const drawerAvatarEl = document.getElementById('drawer-avatar')
const drawerUsernameEl = document.getElementById('drawer-username')
const scoringPlayersEl = document.getElementById('scoring-players')

// sessionStorage.setItem('sid', `${session_id}`)
const gameData = async (gameId) => {
  // fetch for grabbing game data, includes player and round datas
  const dbGameData = await fetch(`/api/game/${gameId}`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())
  // map players to a new array
  players = dbGameData.users.map((player) => {
    const playerObj = {
      id: player.id,
      score: player.game_users.score,
      drawing: player.game_users.drawing,
      session_id: player.session_id,
    }
    return playerObj
  })
  // update round data
  gameRounds = dbGameData.game_rounds
  // sort gameRounds by round_number

  // update drawingPlayer and scoringPlayers with current list
  drawingPlayer = players.filter((player) => player.drawing === true)
  scoringPlayers = players.filter((player) => player.drawing === false)
}


// timers to allow each user to draw consecutively...?
  // timer for drawing would have to initiate on drawer's client
    // after they press start draw button?? could be helpful!!
    // this would only show up on the drawing player's client!
  // after the timer ends, update the drawer to draw false
  // and update the next player to draw true

// timer to run gameData keeps local variables updated with db
var dataUpdateTimer = setInterval(() => {
  gameData(gameRoom)
  pageRender();
},1000); // runs every 1000 milliseconds


// update page elements
const pageRender = () => {
  // update drawing player 

  // scoring players list update
  let scoringPlayerCards = scoringPlayers.map((player) => {
    return (
`<div id="scoring-player" class="m-2 flex flex-grow ring-2 items-center text-xl rounded-sm">
  <div id='scorer-avatar' class='avatar m-2 w-8 h-8 bg-blue-300'></div>
  <div id='scorer-username' class="flex-grow text-center text-xl self-center">${player.username}</div>
  |
  <div id='scorer-score' class="flex-grow text-center text-xl self-center">100</div>
</div>`
    )
  })
  console.log('Scoring players' + scoringPlayerCards)
  // draw word element
}

// post fetch to update user scores as the game is played
  // will run after scoring players press vote buttons
  // hide the vote buttons for drawing player!!

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
  // authorize user to draw according to the session id of drawing player
  if (currentUser.session_id === drawingPlayer[0].session_id) {
	  line(mouseX, mouseY, pmouseX, pmouseY)
    // Send the mouse coordinates
    sendmouse(mouseX, mouseY, pmouseX, pmouseY)
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

