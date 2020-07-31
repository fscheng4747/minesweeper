// all html are read before loading js
document.addEventListener('DOMContentLoaded', () => {
  // looking for class name grid
  const grid = document.querySelector('.grid')
  const flagsLeft = document.querySelector('#flags-left')
  const result = document.querySelector('#result')
  let width = 10
  // how many bombs to have
  let bombAmount = 20
  let flags = 0
  let squares = []
  let isGameOver = false

  /**
   * create Board
   * including:
   *  create each small square
   * click on each square
   * algorithm
  */
  function createBoard() {
    flagsLeft.innerHTML = bombAmount

    //get shuffled game array with random bombs
    // bomb array
    const bombsArray = Array(bombAmount).fill('bomb');
    // safe array
    const emptyArray = Array(width*width - bombAmount).fill('valid');
    // concatenation (gameArray = boobs + empty)
    const gameArray = emptyArray.concat(bombsArray);
    // shuffle gameArray
    const shuffledArray = gameArray.sort(() => Math.random() -0.5);

    // 
    for(let i = 0; i < width*width; i++) {
      // each small square
      const square = document.createElement('div');
      // each square has unique ID in <div>
      square.setAttribute('id', i);
      // add class name in each <div>
      square.classList.add(shuffledArray[i]);
      // append squares to the board
      grid.appendChild(square);
      squares.push(square);

      //click each square
      square.addEventListener('click', function(e) {
        click(square);
      })

      //cntrl and left click
      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
    }

    // check number of boobs surrounding safe squares
    for (let i = 0; i < squares.length; i++) {
      // total = bombs surrounding the safe quare!
      let total = 0;
      /*
      Left and right edges should be defined, 
      in order to avoid checking totally opposite side!
      !!! should be care when width changes, condition should also be changed
      */
      const isLeftEdge = (i % width === 0);
      const isRightEdge = (i % width === width -1);

      // count how many boombs nearby (has bug!)
      if (squares[i].classList.contains('valid')) {
        // check left side of the safe square (not index 0, not on left edge)
        if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++; 
        // check top-right side of the safe square (not on right edge and index > 9)
        if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
        if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
        if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
        if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
        if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
        if (i < 89 && squares[i +width].classList.contains('bomb')) total ++;
        // set number of bombs surrounding the safe square in <div>
        squares[i].setAttribute('data', total);
      }
    }
  }
  createBoard();
  // ---------- from here outside creatBroad() ------------

  //add Flag with right click
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = ' 🚩'
        flags ++
        flagsLeft.innerHTML = bombAmount- flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags --
        flagsLeft.innerHTML = bombAmount- flags
      }
    }
  }

  //click on square actions
  function click(square) {
    // get current ID of the square for checkSquare()
    let currentId = square.id

    // if game is over, can't click anymore
    if (isGameOver) return;
    // if square is clicked, can't click anymore
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;

    // if click boob the game is over
    if (square.classList.contains('bomb')) {
      gameOver(square);
    } else {
      let total = square.getAttribute('data');
      if (total !=0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }

  /**
   * check neighboring squares once square is clicked
   * @param {*} square 
   * @param {int} currentId 
   */
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1].id
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId -width)].id
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) +width].id
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

  //game over
  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!'
    isGameOver = true

    //show ALL the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
  let matches = 0

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches ++
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
      }
    }
  }
});