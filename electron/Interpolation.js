class Interpolation {
  static floatToBool(value) {
    return value > 0.0;
  }

  static interpolateErrorFlags(value) {
    if (value > 0.0) {
      return true
    }
    return value
  }

  static interpolateSolenoidErrors(value) {
    // value is binary where each "1" indicates an error for that solenoid
    // 0 represents no error in any of the sols

    function mapSolNumToName(num) {
      const names = [
        "LOX2Way: Arming valve for 150 psi",
        "Prop2Way: Ignitor",
        "LOX5Way: Main valve for LOX",
        "Prop5Way: main valve for prop"
      ]
      return names[num] || `Unknown (#${num + 1})`
    }

    let int = Math.round(value)

    if (int === 0) {
      return value
    }

    let errors = int.toString(2).split("").reverse().map(_char => (+_char === 1))
    return `Shorted sols: <br/>${errors.reduce((acc, cur, idx) => {
      if (cur) {
        acc += `${mapSolNumToName(idx)}, <br/>`
      }
      return acc
    }, "")}`
  }
}

module.exports = Interpolation;
