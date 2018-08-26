$$../../isomorph/token.js$$

const createMatchToken = () => {
    const t1 = createToken(64),
        t2 = createToken(64),
        t3 = createToken(64),
        t4 = createToken(64),
        id = 3 * Manager.nextId++;
    return { 
        token: {
            white: {
                srv: t1,
                cli: t2
            },
            black: {
                srv: t3,
                cli: t4
            }
        },
        matchId: mix([t1, t2, t3, t4], id),
        created: +new Date
    };
};

const Manager = {
    nextId: +new Date,
    matches: {}
};

Manager.createMatch = function () {
    const m = createMatchToken();
    Manager.matches[m.matchId] = m;
    return {
        matchId: m.matchId,
        token: m.token.white,
        created: m.created,
    };
};
Manager.saveMatch = function (data) {
    console.log('saving match: ', data);
};
Manager.joinMatch = function (data) {
    console.log('saving match: ', data);
};