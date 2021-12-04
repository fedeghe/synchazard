/**
 * 
 * @param {*} players array first white, second black
 */
// eslint-disable-next-line no-unused-vars
function MatchManager(players) {
    this.players = players;
    // eslint-disable-next-line no-undef
    this.fens = config.posdown;
    this.timings = {
        white: 0,
        black: 0
    }
    this.moves = [];
}
