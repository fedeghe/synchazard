
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
  const match = {
      w: createToken(32),
      b: createToken(32),
      id: Manager.nextId++
    };
  Manager.matches[match.w] = match;
  Manager.matches[match.b] = match;
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