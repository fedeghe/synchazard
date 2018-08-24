$$../../isomorph/token.js$$

const createMatchToken = () => {
    const t1 = createToken(64),
        t2 = createToken(64),
        id = 3 * Manager.nextId++;
    return { 
        token: {
            white: {
                srv: t1,
                cli: null
            },
            black: {
                srv: t2,
                cli: null
            }
        },
        id: id,
        matchId: mix(t1, t2, id)
    };
};

const Manager = {
    nextId: +new Date,
    matches: {}
};

Manager.createMatch = function () {
    const match = {
        id: createMatchToken(),
        created: +new Date
    };
    Manager.matches[match.id.token.matchId] = match;
    console.log('creating a match: ');
    console.log(JSON.stringify(match));
};
Manager.saveMatch = function (data) {
    console.log('saving match: ', data);
};
Manager.joinMatch = function (data) {
    console.log('saving match: ', data);
};