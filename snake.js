/*global
Node
*/
(function () {
    'use strict';
    var board = document.getElementsByClassName('board')[0],
        Start = document.getElementsByClassName('start')[0],
        Stop = document.getElementsByClassName('stop')[0];

    Node.prototype.empty = function () {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
    };

    Array.prototype.draw = function () {
        for (var i = 0; i < this.length; i++) {
            for (var j = 0; j < this[0].length; j++) {
                if (this[j][i] === 1) {
                    draw(i, j, 'fruit');
                } else if (this[j][i] === 2) {
                    draw(i, j, 'snake');
                }
            }
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function draw(x, y, type) {
        //console.log('drawing: '+type);
        var drawDiv = document.createElement('div');
        drawDiv.classList.add(type);
        drawDiv.style.top = x * 30 + 'px';
        drawDiv.style.left = y * 30 + 'px';
        board.appendChild(drawDiv);
        drawDiv = null;
    }

    var Game = (function () {
        var _score = 0,
            _direction = 'right',
            _map = [],
            _timer;

        function _mapCreate() {
            _map = new Array(20);
            for (var i = 0; i < _map.length; i++) {
                _map[i] = new Array(20);
            }
        }

        var _fruit = {}
        _fruit.name = 'fruit',
            _fruit.positionX = 0,
            _fruit.positionY = 0,
            _fruit.place = function () {
                this.positionX = getRandomInt(0, 19);
                this.positionY = getRandomInt(0, 19);

                while (_map[this.positionX][this.positionY] === 2) {
                    this.positionX = getRandomInt(0, 19);
                    this.positionY = getRandomInt(0, 19);
                }

                _map[this.positionX][this.positionY] = 1;
            }

        var _snake = new Array(3);
        _snake.name = 'snake';
        _snake.positionX = 0;
        _snake.positionY = 0;
        _snake.place = function () {
            this.positionX = getRandomInt(0, 19);
            this.positionY = getRandomInt(0, 19);

            while ((this.positionX - this.length) < 0) {
                this.positionX = getRandomInt(0, 19);
            }

            for (var i = 0; i < this.length; i++) {
                this[i] = {
                    x: this.positionX - i,
                    y: this.positionY
                };
                _map[_snake.positionX - i][_snake.positionY] = 2;
            }
        };

        function _gameOver(message) {

            _end();
            var text = document.createTextNode('Game Over. ' + message);
            var span = document.createElement('span');
            span.appendChild(text);
            board.appendChild(span);
            //console.log('GAME OVER!');
        }

        function _showScore() {
            var _scoreBoard = document.getElementsByClassName('score')[0];
            _scoreBoard.innerText = 'Score: ' + _score;
        }

        function _run() {
            for (var i = _snake.length - 1; i >= 0; i--) {
                if (i === 0) {
                    switch (_direction) {
                        case 'left':
                            _snake[0] = {
                                x: _snake[0].x - 1,
                                y: _snake[0].y
                            }
                            break;
                        case 'up':
                            _snake[0] = {
                                x: _snake[0].x,
                                y: _snake[0].y - 1
                            }
                            break;
                        case 'right':
                            _snake[0] = {
                                x: _snake[0].x + 1,
                                y: _snake[0].y
                            }
                            break;
                        case 'down':
                            _snake[0] = {
                                x: _snake[0].x,
                                y: _snake[0].y + 1
                            }
                            break;
                    }
                    //console.log(_snake);
                    if (_snake[0].x < 0 || _snake[0].x > 19 || _snake[0].y < 0 || _snake[0].y > 19) {
                        _gameOver('Snake went out of map!');
                        //console.log('snake went out of map!  Click "Enter" to start.');
                        return;
                    }
                    if (_map[_snake[0].x][_snake[0].y] === 1) {
                        _score += 10;
                        _fruit.place();
                        _snake.push({
                            x: _snake[_snake.length - 1].x,
                            y: _snake[_snake.length - 1].y
                        });
                        _map[_snake[_snake.length - 1].x][_snake[_snake.length - 1].y] = 2;
                    } else if (_map[_snake[0].x][_snake[0].y] === 2) {
                        _gameOver('Snake eaten own tail! Click "Enter" to start.');
                        //console.log('snake eaten own tail!');
                        return;
                    }
                    _map[_snake[0].x][_snake[0].y] = 2;
                } else {
                    if (i === (_snake.length - 1)) {
                        _map[_snake[i].x][_snake[i].y] = null;
                    }
                    _snake[i] = {
                        x: _snake[i - 1].x,
                        y: _snake[i - 1].y
                    };
                    _map[_snake[i].x][_snake[i].y] = 2;
                }
            }

            board.empty();
            _map.draw();
            _showScore();
            //_timer = window.setInterval(_run, 500);
        }

        function _start() {
            _snake.length = 3;
            _direction = 'right';
            //console.log('Game started!');
            _mapCreate();
            //console.log('Map created!');
            _snake.place();
            //console.log(_snake);
            _fruit.place();
            _map.draw();
            _timer = window.setInterval(_run, 500);
        }

        function _end() {
            board.empty();
            //window.clearTimeout(_timer);
            window.clearInterval(_timer);
            _mapCreate();
            _score = 0;
            _direction = 'right';
        }

        function _directionChange(param) {
            if (param == 'up') {
                if (_direction == 'down') {
                    return;
                } else {
                    _direction = param;
                }
            }
            if (param == 'down') {
                if (_direction == 'up') {
                    return;
                } else {
                    _direction = param;
                }
            }
            if (param == 'left') {
                if (_direction == 'right') {
                    return;
                } else {
                    _direction = param;
                }
            }
            if (param == 'right') {
                if (_direction == 'left') {
                    return;
                } else {
                    _direction = param;
                }
            }
        }

        return {
            start: _start,
            end: _end,
            run: _run,
            direction: _directionChange
        }
    }());

    var Keyboard = function () {
        window.addEventListener("keydown", function (event) { //from MDN
            if (event.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }

            switch (event.key) {
                case "ArrowDown":
                    Game.direction('down');
                    break;
                case "ArrowUp":
                    Game.direction('up');
                    break;
                case "ArrowLeft":
                    Game.direction('left');
                    break;
                case "ArrowRight":
                    Game.direction('right');
                    break;
                case "Enter":
                    Game.end();
                    Game.start();
                    break;
                case "Escape":
                    Game.end();
                    break;
                default:
                    return; // Quit when this doesn't handle the key event.
            }

            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
        }, true);
    };

    Keyboard();

    Start.addEventListener('click', function () {
        Game.end();
        Game.start();
    }, false);
    Stop.addEventListener('click', function () {
        Game.end();
    }, false);

})();