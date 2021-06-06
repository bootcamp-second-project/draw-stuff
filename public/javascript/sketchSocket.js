let socket
let color = '#000'
let strokeWidth = 4
let cv




function setup() {
  // Creating canvas
	cv = createCanvas(600, 400)
  let originParent = cv.parent();
  cv.parent('#drawing-board');
  originParent.remove();
	cv.background(255, 255, 255)
	// Start the socket connection
	socket = io.connect()

  // grab the id of the room 
  let url = window.location.href.split('/');
  let room = url[url.length - 1];
  socket.on('connect', () =>  {
    // server takes join message, adds client to room
    socket.emit('join', room)
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
	const color_holder = select('#color-holder')

	const stroke_width_picker = select('#stroke-width-picker')
	const stroke_btn = select('#stroke-btn')

	// Adding a mousePressed listener to the button
	color_btn.mousePressed(() => {
		// Checking if the input is a valid hex color
		if (/(^[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value())) {
			color = color_picker.value()
      color = "#" + color;
			color_holder.style('background-color', color)
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
	// Draw
	stroke(color)
	strokeWeight(strokeWidth)
	line(mouseX, mouseY, pmouseX, pmouseY)

	// Send the mouse coordinates
	sendmouse(mouseX, mouseY, pmouseX, pmouseY)
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
  // check user against currently drawing user by session id before broadcasting??
	socket.emit('mouse', data)
}

