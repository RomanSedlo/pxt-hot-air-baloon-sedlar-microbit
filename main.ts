enum difficulty {EASY, MEDIUM, HARD};

type level = {
    order: number,
    dist: number,
    dif: difficulty
};

const level1: level = { order: 1, dist: 20, dif: difficulty.EASY };
const level2: level = { order: 2, dist: 40, dif: difficulty.EASY };
const level3: level = { order: 3, dist: 60, dif: difficulty.EASY };
const level4: level = { order: 1, dist: 30, dif: difficulty.MEDIUM };
const level5: level = { order: 2, dist: 50, dif: difficulty.MEDIUM };
const level6: level = { order: 3, dist: 100, dif: difficulty.MEDIUM };
const level7: level = { order: 1, dist: 40, dif: difficulty.HARD };
const level8: level = { order: 2, dist: 60, dif: difficulty.HARD };
const level9: level = { order: 3, dist: 120, dif: difficulty.HARD };

let chosenLevel: level;

let brightness: number = 120
let obrightness: number = brightness - 30;
let rollSpeed: number = 60
let cframe: number = 100

let player: game.LedSprite = game.createSprite(2, 4);
player.set(LedSpriteProperty.Brightness, brightness);

let stop: boolean = false;
let inMenus: boolean = true;
let inLevel: boolean = false;
let inGameOver: boolean = false;

let difSpeed: number;
let difChance: number;
let difRest: number;

input.onButtonPressed(Button.A, function(){
    if (inLevel) {
        player.move(-1)
    } 

})

input.onButtonPressed(Button.B, function () {
    if (inLevel) {
        player.move(1)
    } else if (inGameOver) {
        stop = false
        inGameOver = false
        
        player.set(LedSpriteProperty.X, 2)
        
        inLevel = true
        control.inBackground(function(){
            play(chosenLevel)
        })
    }
})

function gameover(level:level) {
    inLevel = false
    stop = true
    control.inBackground(function(){
       //music.playMelody("A4 E3 C3 A3 - A2 - A2", 260)
    })
    for(let i: number = 4; i >= 0; i -= 1) {
        player.set(LedSpriteProperty.Brightness, i*4 * (brightness/4))
        basic.pause(cframe)
        player.set(LedSpriteProperty.Brightness, 0)
        basic.pause(cframe)
    }
    basic.pause(2 * cframe)
    basic.showString("GAME OVER!", rollSpeed)
    inGameOver = true
}

function spawn(level:level,index:number) {
    player.set(LedSpriteProperty.Brightness, brightness);
    if(level.dif === difficulty.EASY) {
        difChance = 6
        difSpeed = 9
        difRest = 500
    } else if (level.dif === difficulty.MEDIUM) {
        difChance = 5
        difSpeed = 8
        difRest = 300
    } else if (level.dif === difficulty.HARD) {
        difChance = 4
        difSpeed = 7
        difRest = 200
    }
    for (let x = 0; x < 5; x += 1) {
        if (stop === true) {
            break;
        }
        basic.pause((level.dist - index) * difSpeed)
        let chance = difChance - level.order
        if (Math.randomRange(0, chance - 1) == 1) {
            let o = game.createSprite(x, 0)
            o.set(LedSpriteProperty.Brightness, obrightness)
            control.inBackground(function () {
                for (let oi: number = 0; oi < 5; oi += 1) {
                    basic.pause(difRest)
                    if(stop) {
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
        basic.pause(200)
    }
}

function play(level: level) {
    inLevel = true
    for (let i: number = 0; i < level.dist; i += 1) {
        spawn(level, i)
        if (stop) {
            break;
        }
    }
    basic.pause(2400)
    basic.showString("YOU WON!", rollSpeed*1.2)
    stop = true
}

chosenLevel = level1
play(chosenLevel)