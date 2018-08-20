
function createToken(l) {
  const min = 33,
    max = 126,
    out = [];
  while(l--) {
    out.push(String.fromCharCode(33 + Math.random()*(max - min))); 
  }
  return out.join('');
}

const Manager = {
  nextId: 1,
  matches: {}
};
Manager.createMatch = function () {
  const token = createToken(32),
    tokenB = createToken(32),
    tokenW = createToken(32),
    match = {
      main: token,
      w: tokenW,
      b: tokenB,
      id: Manager.nextId++
    };
  Manager.matches[match.main] = match;
  console.log('creating a match: ', match);
};
Manager.saveMatch = function (data) {
  console.log('saving match: ', data);
};
Manager.joinMatch = function (data) {
  console.log('saving match: ', data);
};
Manager.joinMatch = function (data) {
  console.log('saving match: ', data);
};