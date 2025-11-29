enum difficulty { EASY, MEDIUM, HARD };

type level = {
    dist: number,
    dif: difficulty
};

const levels: Array<level> = [
    { dist: 20, dif: difficulty.EASY },
    { dist: 40, dif: difficulty.EASY },
    { dist: 60, dif: difficulty.EASY },
    { dist: 40, dif: difficulty.MEDIUM },
    { dist: 80, dif: difficulty.MEDIUM },
    { dist: 120, dif: difficulty.MEDIUM },
    { dist: 50, dif: difficulty.HARD },
    { dist: 100, dif: difficulty.HARD },
    { dist: 200, dif: difficulty.HARD }
]

let selectedLevel: level;
let chosenLevel: number = 0;
let shownLevel: number = 0;
let startSignal: boolean = false;

const brightness: number = 120
const obrightness: number = brightness - 30;
const rollSpeed: number = 60
const cframe: number = 100

let player: game.LedSprite = game.createSprite(2, 4);
player.set(LedSpriteProperty.Brightness, brightness);

let stop: boolean = false;
let inMenu: boolean = true;
let inLevel: boolean = false;
let inGameOver: boolean = false;

let difSpeed: number;
let difChance: number;
let difRest: number;

input.onButtonPressed(Button.A, function () {
    if (inMenu) {
        if (shownLevel > 0) {
            shownLevel -= 1
        }
    } else if (inLevel) {
        player.move(-1)
    }
})

input.onButtonPressed(Button.B, function () {
    if (inMenu) {
        if (shownLevel < levels.length - 1) {
            shownLevel += 1
        }
    } else if (inLevel) {
        player.move(1)
    }
})

input.onButtonPressed(Button.AB, function () {
    if (inMenu || inGameOver) {
        startSignal = true
    }
})

function menu(): number {
    inMenu = true
    player.set(LedSpriteProperty.Brightness, 0)
    if (!startSignal) {
        menuLoop: while (true) {
            basic.showNumber(shownLevel + 1, 50)
            basic.pause(50)
            if (startSignal) {
                break menuLoop;
            }
        }
    }
    return shownLevel
}

function gameover(level: level) {
    inLevel = false
    stop = true
    startSignal = false
    control.inBackground(function () {
        //music.playMelody("A4 E3 C3 A3 - A2 - A2", 260)
    })
    for (let i: number = 4; i >= 0; i -= 1) {
        player.set(LedSpriteProperty.Brightness, i * 4 * (brightness / 4))
        basic.pause(cframe)
        player.set(LedSpriteProperty.Brightness, 0)
        basic.pause(cframe)
    }
    basic.pause(2 * cframe)
    basic.showString("GAME OVER!", rollSpeed)
    inGameOver = true
}

function spawn(level: level, index: number) {
    player.set(LedSpriteProperty.Brightness, brightness);
    if (level.dif === difficulty.EASY) {
        difChance = 5
        difSpeed = 9
        difRest = 500
    } else if (level.dif === difficulty.MEDIUM) {
        difChance = 4
        difSpeed = 8
        difRest = 300
    } else if (level.dif === difficulty.HARD) {
        difChance = 3
        difSpeed = 7
        difRest = 200
    }
    levelLoop: for (let x = 0; x < 5; x += 1) {
        if (inGameOver) {
            break levelLoop;
        }
        basic.pause(difRest / 10)
        if (Math.randomRange(0, difChance - 1) == 1) {
            let o = game.createSprite(x, 0)
            o.set(LedSpriteProperty.Brightness, obrightness)
            control.inBackground(function () {
                for (let oi: number = 0; oi < 5; oi += 1) {
                    basic.pause(difRest)
                    if (stop) {
                        o.delete()
                    }
                    if (player.isTouching(o) && inLevel) {
                        gameover(level)
                    }
                    o.change(LedSpriteProperty.Y, 1)
                    if (oi === 4) {
                        o.delete()
                    }
                }
            })
        }
        basic.pause(((level.dist - index) / difSpeed) + (difRest))
    }
}

function play(level: level) {
    inLevel = true
    playLoop: for (let i: number = 0; i < level.dist; i += 1) {
        spawn(level, i)
        if (stop) {
            break playLoop;
        }
        if (i === level.dist - 1) {
            basic.pause(2500)
            basic.showString("YOU WON!", rollSpeed * 1.2)
        }
    }
    stop = true
    startSignal = false
}

// basic.showString('HOT AIR BALOON GAME', rollSpeed / 1.25)
while (true) {
    chosenLevel = menu()
    if (startSignal) {
        inMenu = false
        stop = false
        inGameOver = false
        player.set(LedSpriteProperty.X, 2)
        player.set(LedSpriteProperty.Brightness, brightness)
        inLevel = true
        selectedLevel = levels[chosenLevel]
        play(selectedLevel)
    }
}
