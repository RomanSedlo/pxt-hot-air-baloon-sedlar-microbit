enum difficulty {EASY, MEDIUM, HARD}

type level = {
    order: number,
    dist: number,
    dif: difficulty
}

const level1: level = { order: 1, dist: 20, dif: difficulty.EASY };
const level2: level = { order: 2, dist: 50, dif: difficulty.EASY };
const level3: level = { order: 3, dist: 100, dif: difficulty.EASY };
const level4: level = { order: 1, dist: 20, dif: difficulty.MEDIUM };
const level5: level = { order: 2, dist: 50, dif: difficulty.MEDIUM };
const level6: level = { order: 3, dist: 100, dif: difficulty.MEDIUM };
const level7: level = { order: 1, dist: 20, dif: difficulty.HARD };
const level8: level = { order: 2, dist: 50, dif: difficulty.HARD };
const level9: level = { order: 3, dist: 100, dif: difficulty.HARD };

let player: game.LedSprite = game.createSprite(2, 4)

input.onButtonPressed(Button.A, function(){
    player.move(-1)
})

input.onButtonPressed(Button.B, function () {
    player.move(1)
})

function spawn(level:level,index:number) {
    if(level.dif === difficulty.EASY) {
        for (let x = 0; x < 5; x += 1) {
            basic.pause((level.dist - index) * 9)
            let chance = 6 - level.order
            if (Math.randomRange(0, chance - 1) == 1) {
                let o = game.createSprite(x, 0)
                control.inBackground(function(){
                    for (let oi: number = 0; oi < 5; oi += 1) {
                        basic.pause(500)
                        o.change(LedSpriteProperty.Y, 1)
                        if (oi === 4) {
                            o.delete()
                        }
                    }
                })
            }
            basic.pause(200)
        }
    } else if (level.dif === difficulty.MEDIUM) {
        for (let x = 0; x < 5; x += 1) {
            basic.pause((level.dist - index) * 8)
            let chance = 5 - level.order
            if (Math.randomRange(0, chance - 1) == 1) {
                let o = game.createSprite(x, 0)
                control.inBackground(function(){
                    for (let oi: number = 0; oi < 5; oi += 1) {
                        basic.pause(300)
                        o.change(LedSpriteProperty.Y, 1)
                        if (oi === 4) {
                            o.delete()
                        }
                    }
                })
            }
            basic.pause(200)
        }
    } else if (level.dif === difficulty.HARD) {
        for (let x = 0; x < 5; x += 1) {
            basic.pause((level.dist - index) * 7)
            let chance = 4 - level.order
            if (Math.randomRange(0, chance - 1) == 1) {
                let o = game.createSprite(x, 0)
                control.inBackground(function(){
                    for (let oi: number = 0; oi < 5; oi += 1) {
                        basic.pause(200)
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
}

function play(level: level) {
    for (let i: number = 0; i < level.dist; i += 1) {
        spawn(level, i)
    }
}

play(level1)