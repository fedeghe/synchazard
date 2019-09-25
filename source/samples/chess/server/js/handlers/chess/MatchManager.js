/**
 * 
 * @param {*} players array first white, second black
 */
function MatchManager(players) {
    this.players = players;
    this.fens = config.posdown;
    this.timings = {
        white: 0,
        black: 0
    }
    this.moves = [];
}
