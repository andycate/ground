function getPreprocessor(func, args) {
  switch (func) {
    case "linear":
      return (v) => v * args[0] + args[1];
    case "roc":
      let roc = function(v, ts) {
        let diff = v - roc.last;
        let timeDiff = ts - roc.lastTime;
        roc.last = v;
        roc.lastTime = ts;
        roc.history.push(diff);
        roc.times.push(timeDiff);
        if (roc.history.length > 10) {
          roc.history.shift();
          roc.times.shift();
        }
        let sum = 0;
        for (let i = 0; i < roc.history.length; i ++) {
          sum += roc.history[i] * 1000 / roc.times[i];
        }
        return sum / roc.history.length;
      }
      roc.last = 0;
      roc.lastTime = 0;
      roc.history = [];
      roc.times = [];
      return roc;
  }
}

module.exports = { getPreprocessor };