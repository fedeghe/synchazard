maltaF('../../isomorph/token.js')

const createMatchToken = () => {
    // eslint-disable-next-line no-undef
    const t1 = createToken(64),
        // eslint-disable-next-line no-undef
        t2 = createToken(64),
        // eslint-disable-next-line no-undef
        t3 = createToken(64),
        // eslint-disable-next-line no-undef
        t4 = createToken(64),
        // eslint-disable-next-line no-use-before-define
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
        // eslint-disable-next-line no-undef
        matchId: mix([t1, t2, t3, t4], id),
        created: +new Date
    };
},

 Manager = {
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
        expires: m.created + 3.6E6,
        // eslint-disable-next-line no-undef
        link: `maltaV('WEBSERVER.HOST')/${toQs({ join: m.matchId, tw: m.token.white.cli, tb: m.token.black.cli })}`
    };
};
Manager.saveMatch = function (data) {
    console.log('saving match: ', data);
};
Manager.joinMatch = function (data) {
    console.log('saving match: ', data);
};