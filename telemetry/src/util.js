import comms from "./api/Comms";

export function calcPressRoc(value) {
  
  const currentPressRocTime = window.performance.now();
  const delta_press_roc = (value - this.lastPressRocValue) * 1000.0 / (currentPressRocTime - this.lastPressRocTime);
  
  this.rocValues.unshift(delta_press_roc);
  if (this.rocValues.length > 30) {
    this.rocValues.pop();
  }
  this.lastPressRocTime = currentPressRocTime;
  this.lastPressRocValue = value;

  let sum = 0;
  for (let rocVal of this.rocValues) {
    sum += Number(rocVal);
  }
  return sum / this.rocValues.length;
}

export function buttonAction(action) {
  return () => {
    switch (action.type) {
      case "retract-full":
        comms.sendPacket(action.board, action.packet, action.number || -1, 0, 0);
        break;
      case "extend-full":
        comms.sendPacket(action.board, action.packet, action.number || -1, 1, 0);
        break;
      default:
        return;
    }
  }
}