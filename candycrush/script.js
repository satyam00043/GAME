document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const levelDisplay = document.getElementById('level');
    const pointsDisplay = document.getElementById('points');
    const movesDisplay = document.getElementById('moves');
    const messageDisplay = document.getElementById('message');
    const width = 8;
    const candyColors = [
        'candy-1',
        'candy-2',
        'candy-3',
        'candy-4',
        'candy-5'
    ];
    let board = [];
    let level = 1;
    let points = 0;
    let moves = 30;
    const pointsThreshold = 50;

    function createBoard() {
        board = [];
        gameBoard.innerHTML = '';
        for (let i = 0; i < width * width; i++) {
            const candy = document.createElement('div');
            candy.classList.add('tile');
            candy.classList.add(randomColor());
            candy.setAttribute('draggable', true);
            candy.setAttribute('id', i);
            gameBoard.appendChild(candy);
            board.push(candy);
        }
        addEventListeners();
    }

    function randomColor() {
        return candyColors[Math.floor(Math.random() * candyColors.length)];
    }

    createBoard();

    function addEventListeners() {
        board.forEach(tile => tile.addEventListener('dragstart', dragStart));
        board.forEach(tile => tile.addEventListener('dragend', dragEnd));
        board.forEach(tile => tile.addEventListener('dragover', dragOver));
        board.forEach(tile => tile.addEventListener('dragenter', dragEnter));
        board.forEach(tile => tile.addEventListener('dragleave', dragLeave));
        board.forEach(tile => tile.addEventListener('drop', dragDrop));
    }

    let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

    function dragStart() {
        colorBeingDragged = this.className.split(' ')[1];
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {}

    function dragDrop() {
        colorBeingReplaced = this.className.split(' ')[1];
        squareIdBeingReplaced = parseInt(this.id);
        this.className = `tile ${colorBeingDragged}`;
        board[squareIdBeingDragged].className = `tile ${colorBeingReplaced}`;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];

        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
            moves--;
            movesDisplay.textContent = moves;
            if (moves <= 0) {
                checkGameOver();
            }
        } else if (squareIdBeingReplaced && !validMove) {
            board[squareIdBeingReplaced].className = `tile ${colorBeingReplaced}`;
            board[squareIdBeingDragged].className = `tile ${colorBeingDragged}`;
        } else {
            board[squareIdBeingDragged].className = `tile ${colorBeingDragged}`;
        }
    }

    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = board[i].className.split(' ')[1];
            const isBlank = board[i].classList.contains('blank');

            if (rowOfThree.every(index => board[index].className.split(' ')[1] === decidedColor && !isBlank)) {
                rowOfThree.forEach(index => {
                    board[index].className = 'tile blank';
                });
                points += 3;
                pointsDisplay.textContent = points;
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = board[i].className.split(' ')[1];
            const isBlank = board[i].classList.contains('blank');

            if (columnOfThree.every(index => board[index].className.split(' ')[1] === decidedColor && !isBlank)) {
                columnOfThree.forEach(index => {
                    board[index].className = 'tile blank';
                });
                points += 3;
                pointsDisplay.textContent = points;
            }
        }
    }

    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = board[i].className.split(' ')[1];
            const isBlank = board[i].classList.contains('blank');

            if (rowOfFour.every(index => board[index].className.split(' ')[1] === decidedColor && !isBlank)) {
                rowOfFour.forEach(index => {
                    board[index].className = 'tile blank';
                });
                points += 4;
                pointsDisplay.textContent = points;
            }
        }
    }

    function checkColumnForFour() {
        for (let i = 0; i < 39; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = board[i].className.split(' ')[1];
            const isBlank = board[i].classList.contains('blank');

            if (columnOfFour.every(index => board[index].className.split(' ')[1] === decidedColor && !isBlank)) {
                columnOfFour.forEach(index => {
                    board[index].className = 'tile blank';
                });
                points += 4;
                pointsDisplay.textContent = points;
            }
        }
    }

    function moveDown() {
        for (let i = 0; i < 55; i++) {
            if (board[i + width].classList.contains('blank')) {
                board[i + width].className = board[i].className;
                board[i].className = 'tile blank';
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && board[i].classList.contains('blank')) {
                    board[i].className = `tile ${randomColor()}`;
                }
            }
        }
    }

    function checkLevelUp() {
        if (points >= level * pointsThreshold) {
            level++;
            points = 0;
            moves = 30;
            levelDisplay.textContent = level;
            pointsDisplay.textContent = points;
            movesDisplay.textContent = moves;
            messageDisplay.textContent = `Congratulations! You've reached Level ${level}`;
            createBoard();
        }
    }

    function checkGameOver() {
        if (points < level * pointsThreshold) {
            messageDisplay.textContent = 'Game Over! You did not reach the required points.';
            // Optionally, you can reset the game or offer a retry button here
        }
    }

    window.setInterval(function() {
        moveDown();
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        checkLevelUp();
    }, 100);
});
