game();

function game() {
    // Инициализация переменных

    let bombCounter = 0;
    let enemyCounter = 0;
    let button = 0;
    let buttons = [];
    let enemies = [];
    let users = [];
    let userTank = new tank('tank', enemies);
    let score = 0;
    let bombs = 10;
    let bariers = [];
    bariers.push(userTank);
    users.push(userTank);

    for (let j = 0; j < $('.block').length; j++ ) {
        let name = $($('.block')[j]).attr('class').split(' ')[0]
        let newBlock = new block(`${name}`);
        bariers.push(newBlock);
    }


    for (let i = 0; i <4; i++) {
        createEnemi(i);
        enemyCounter++;
    }

    function createEnemi(index) {
        let newEnemy = new tank(`enemy-tank${index}`, users);
        let randomTimeShoot = parseInt(Math.random()*2800 + 400)
        enemies.push(newEnemy);
        newEnemy.createElement();
        bariers.unshift(newEnemy);
        newEnemy.clearIntervalMove = setInterval(function () {
            newEnemy.move()
        }, 30)

        newEnemy.clearIntervalShoot = setInterval(function () {
            newEnemy.shoot()
        }, randomTimeShoot)
    }

    setInterval(function () {
        enemies.forEach(function (item, index, array) {
            array[index].event = parseInt(Math.random()*4) + 37;
        })
    }, 1500)

// Объект Блок

function block(blockName) {
    this.className = blockName;
}


// Объект танк

    function tank(tankId, enemies) {
        this.direction = 'top';
        this.event = parseInt(Math.random()*4) + 37;
        this.className = tankId
        this.enemies = enemies;
        this.clearIntervalMove;
        this.clearIntervalShoot;

        this.createElement = function () {
            let htmlString = '<div class="enemy-tank">\n' +
                '        <div class="nos"></div>\n' +
                '        <div class="telo"></div>\n' +
                '    </div>'
            $('.container').prepend(htmlString)
            $($('.enemy-tank')[0]).addClass(this.className)
            let randomTop = parseInt(Math.random()*20)*30;
            let randomLeft = parseInt(Math.random()*20)*30;
            $(`.${this.className}`).css({'top' : `${randomTop}px`, 'left' : `${randomLeft}px`})
        }

        this.move = function () {

            let top = $(`.${this.className}`).position().top;
            let left = $(`.${this.className}`).position().left;
            let right = parseInt($('.container').css('width')) - parseInt($(`.${this.className}`).css('width'))-5;
            let bottom = parseInt($('.container').css('height')) - parseInt($(`.${this.className}`).css('height'))-5;
            let rotate;
            let bariers = isBarier(this.className, this.event);

            if (this.event == 37 && left >= 5 && bariers.indexOf('left') == -1) {
                left -=5;
                rotate = -90;
                this.direction = 'left';
            }

            if (this.event == 38 && top >= 5 && bariers.indexOf('top') == -1) {
                top -=5;
                rotate = 0;
                this.direction = 'top';
            }

            if (this.event == 39 && left <= right && bariers.indexOf('right') == -1) {
                left +=5;
                rotate = 90;
                this.direction = 'right';
            }

            if (this.event == 40 && top <= bottom && bariers.indexOf('bottom') == -1) {
                top +=5;
                rotate = 180;
                this.direction = 'bottom';
            }

            $(`.${this.className}`).css('transform', `rotate(${rotate}deg)`)
            $(`.${this.className}`).animate({'top' : `${top}px`, 'left' : `${left}px`}, 10)

        }

        this.shoot = function () {
            let bomba = new bomb(bombCounter, `.${this.className}`, this.direction, this.enemies)
            bomba.moveBomb();
            bombCounter++;
        }
    }

// Объект Снаряд

    function bomb(bombId, className, direction, enemies) {
        let top = $(className).position().top;
        let left = $(className).position().left;
        let leftBomb;
        let topBomb;
        let str = '<div class="'+ `bomba${bombId}` + '"></div>'

        switch (true) {
            case direction == 'top':
                leftBomb = left + 10;
                topBomb = top;
                break
            case direction == 'left':
                topBomb = top + 10;
                leftBomb = left;
                break
            case direction == 'right':
                leftBomb = left + 20;
                topBomb = top + 10;
                break
            case direction == 'bottom':
                topBomb = top + 20;
                leftBomb =left + 10
                break

        }

        $('.container').prepend(str)
        $(`.bomba${bombId}`).css({'top' : `${topBomb}px`, 'left' : `${leftBomb}px`})
        $(`.bomba${bombId}`).addClass('bomba')

        this.moveBomb = function () {
            let leftBomb;
            let topBomb;
            if (direction == 'top') {
                let moving = setInterval(function () {
                    let pos = parseInt($(`.bomba${bombId}`).css('top')) - 5;
                    if (pos < 0 || isHit(`.bomba${bombId}`, enemies)) {
                        clearInterval(moving)
                        $(`.bomba${bombId}`).remove()
                    }
                    $(`.bomba${bombId}`).css('top', `${pos}px`)
                }, 10)

            }

            if (direction == 'bottom') {
                let moving = setInterval(function () {
                    let pos = parseInt($(`.bomba${bombId}`).css('top')) + 5;
                    if (pos > parseInt($('.container').css('height')) || isHit(`.bomba${bombId}`, enemies)) {
                        clearInterval(moving)
                        $(`.bomba${bombId}`).remove()
                    }
                    $(`.bomba${bombId}`).css('top', `${pos}px`)
                }, 10)
            }

            if (direction == 'left') {
                let moving = setInterval(function () {
                    let pos = parseInt($(`.bomba${bombId}`).css('left')) - 5;
                    if (pos < 0 || isHit(`.bomba${bombId}`, enemies)) {
                        clearInterval(moving)
                        $(`.bomba${bombId}`).remove()
                    }
                    $(`.bomba${bombId}`).css('left', `${pos}px`)
                }, 10)
            }

            if (direction == 'right') {
                let moving = setInterval(function () {
                    let pos = parseInt($(`.bomba${bombId}`).css('left')) + 5;
                    if (pos > parseInt($('.container').css('width')) || isHit(`.bomba${bombId}`, enemies)) {
                        clearInterval(moving)
                        $(`.bomba${bombId}`).remove()
                    }
                    $(`.bomba${bombId}`).css('left', `${pos}px`)
                }, 10)
            }
        }
    }

// Обработчик событий при нажатии и отпускании клавиш
    $(document).keyup(function (event) {
        if (event.keyCode == 32 && bombs > 0) {
            let bomba = new bomb(bombCounter, '.tank', userTank.direction, enemies)
            bombs--;
            $('.bombs').text('Bombs' + ' ' + `${bombs}`)
            bomba.moveBomb();
            bombCounter++;
        } else {
            clearInterval(buttons[event.keyCode])
            button = 0;
        }

    })

// Обработчик событий при нажатии клавиш
    $(document).keydown(function (event) {
        if (button != event.keyCode && event.keyCode != 32) {
            for (let i = 0; i < buttons.length; i++) {
                clearInterval(buttons[i])
            }
            button = event.keyCode;
            buttons[event.keyCode] = setInterval(function () {
                userTank.event = event.keyCode;
                userTank.move();
            }, 30)
        }
    })

    //Метод определения попадания снаряда
    function isHit(bomb, enemiTanks) {
        let topBomb = parseInt($(bomb).css('top'));
        let leftBomb = parseInt($(bomb).css('left'));
        let rightBomb = parseInt($(bomb).css('right'));
        let bottomBomb = parseInt($(bomb).css('bottom'));

        for (let j = 0; j < enemiTanks.length; j++) {
            let className = enemiTanks[j].className;
            let itemTop = parseInt($(`.${className}`).css('top'));
            let itemLeft = parseInt($(`.${className}`).css('left'));
            let itemRight = parseInt($(`.${className}`).css('right'));
            let itemBottom = parseInt($(`.${className}`).css('bottom'));

            if (topBomb+10 > itemTop && bottomBomb+10 > itemBottom && leftBomb+10 > itemLeft && rightBomb+10 > itemRight) {
                $(`.${className}`).remove();
                if (className == 'tank') {

                    $('.game-over').addClass('the-end');
                }
                clearInterval(enemiTanks[j].clearIntervalMove);
                clearInterval(enemiTanks[j].clearIntervalShoot);
                enemies.splice(j, 1);
                bariers.splice(j, 1);
                $(bomb).remove()
                enemyCounter++;
                score ++;
                bombs +=2;
                $('.score').text('Killed' + ' ' + `${score}`)
                $('.bombs').text('Bombs' + ' ' + `${bombs}`)
                setTimeout(createEnemi, 1000, enemyCounter)
                return true;
            }
        }

        for (let i = 5; i < bariers.length; i++) {
            let className = bariers[i].className;
            let itemTop = parseInt($(`.${className}`).css('top'));
            let itemLeft = parseInt($(`.${className}`).css('left'));
            let itemRight = parseInt($(`.${className}`).css('right'));
            let itemBottom = parseInt($(`.${className}`).css('bottom'));

            if (topBomb+10 > itemTop && bottomBomb+10 > itemBottom && leftBomb+10 > itemLeft && rightBomb+10 > itemRight) {
                return true;
            }
        }

        return false;
    }

    function isBarier(object) {
        let top = parseInt($(`.${object}`).css('top'));
        let left = parseInt($(`.${object}`).css('left'));
        let right = parseInt($(`.${object}`).css('right'));
        let bottom = parseInt($(`.${object}`).css('bottom'));
        let res = [];

        for (let i = 0; i < bariers.length; i++) {
            let className = bariers[i].className;
            if (object != className) {
                let itemTop = parseInt($(`.${className}`).css('top'));
                let itemLeft = parseInt($(`.${className}`).css('left'));
                let itemRight = parseInt($(`.${className}`).css('right'));
                let itemBottom = parseInt($(`.${className}`).css('bottom'));

                if (top+30 > itemTop && bottom+30 > itemBottom && left+35 > itemLeft && right+35 > itemRight) {
                    res.push(left > itemLeft ? 'left' : 'right')
                }

                if (top+35 > itemTop && right+30 > itemRight && left+30 > itemLeft && bottom+35 > itemBottom) {
                    res.push(top > itemTop ? 'top' : 'bottom')
                }

                }
            }

        return res;
    }
}

$('.restart-btn').click(function () {
    location.reload()
})



