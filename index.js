export class Game {

    static createBoard({ rows = 3, cols = 3 } = {}) {
        const length = (rows * cols);

        const createBitList = (_, index) => {
            return 1 << index + 1
        };

        return Array.from({ length })
                    .map(createBitList);
    }

    static pack(state) {
        const result = new Int8Array([...state]);

        return result;
    }

    static chunkArray(arr, chunkSize) {
        const results = [];

        while (arr.length) {
            results.push(arr.splice(0, chunkSize));
        }

        return results;
    }

    constructor(rows = 3, cols = 3) {
        this.size = { rows, cols };
        this.board = Game.createBoard(this.size);
        this.state = [0, 0];
    }

    move(player, position) {
        this.state[player] = (
            this.state[player] | this.board[position]
        );

        return Game.pack(this.state);
    }

    playerHasPosition(player, position) {
       const hasPosition = (this.state[player] & this.board[position]) > 0;

       return hasPosition;
    }


    print() {
        const { rows, cols } = this.size;
        const length = rows * cols;

        return Game.chunkArray(Array
            .from({ length })
            .map((_, i) => (
                this.getPositionValue(i)
            )), rows);
    }

    getPositionValue(position) {
        if (this.playerHasPosition(1, position)) {
            return 'X';
        } else if (this.playerHasPosition(0, position)) {
            return 'O';
        }
        return '-';
    }
}


