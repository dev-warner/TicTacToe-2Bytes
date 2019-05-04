import test from 'ava';
import { Game } from './index';

test('should create bitwise number for each player', t => {
    const game = new Game();

    t.deepEqual(game.state, [0, 0]);
});

test('should create a point in memory for each board position', t => {
    t.deepEqual(Game.createBoard(), [
        2,
        4,
        8,
        16,
        32,
        64,
        128,
        256,
        512
    ]);
});

test('should beable to pass state and pack it into two bytes', t => {
    const { length, BYTES_PER_ELEMENT } = Game.pack([ 0, 0 ]);
    const totalSize = (length * BYTES_PER_ELEMENT);

    t.is(totalSize, 2);
});

test('should beable to add to the bitwise number and check if its set', t => {
    const game = new Game();

    t.falsy(game.playerHasPosition(0, 0));

    /* player 0 places in position
        O - -
        - - -
        - - -
    */
    game.move(0, 0);

    t.truthy(game.playerHasPosition(0, 0));

    t.falsy(game.playerHasPosition(1, 2));

    /* player 1 places in position:
        O - X
        - - -
        - - -
    */
    game.move(1, 2);

    t.truthy(game.playerHasPosition(1, 2));

});

test('should beable to translate the bytes into something understandable', t => {
    const game = new Game();

    t.deepEqual(game.print(), [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ]);

    game.move(0, 0);

    t.deepEqual(game.print(), [
        ['O', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ]);

    game.move(1, 2);

    t.deepEqual(game.print(), [
        ['O', '-', 'X'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ]);

    game.move(0, 8);

    t.deepEqual(game.print(), [
        ['O', '-', 'X'],
        ['-', '-', '-'],
        ['-', '-', 'O']
    ]);

    game.move(1, 4);

    t.deepEqual(game.print(), [
        ['O', '-', 'X'],
        ['-', 'X', '-'],
        ['-', '-', 'O']
    ]);

    game.move(0, 6);

    t.deepEqual(game.print(), [
        ['O', '-', 'X'],
        ['-', 'X', '-'],
        ['O', '-', 'O']
    ]);

    game.move(1, 3);

    t.deepEqual(game.print(), [
        ['O', '-', 'X'],
        ['X', 'X', '-'],
        ['O', '-', 'O']
    ]);
});


test('we can increase the board size to 30 before we have conflicts', t => {
    const size = 30;
    const game = new Game(size, size);

    for (let i = 0; i < size; i++) {
        const player1 = Math.random() > 0.5;

        game.move(player1 ? 0 : 1, i);

        t.is(game.playerHasPosition(1, i), !player1)
        t.is(game.playerHasPosition(0, i), player1)
    }

    const { length, BYTES_PER_ELEMENT } = Game.pack(game.state);
    const totalSize = (length * BYTES_PER_ELEMENT);

    t.is(totalSize, 2)
})
