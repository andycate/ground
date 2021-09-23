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

    function mapSolNumToName(num){
      // TODO: map the number to a string
      return `#${num + 1}`
    }

    let int = Math.round(value)

    if (int === 0) {
      return value
    }

    let errors = int.toString(2).split("").reverse().map(_char => (+_char === 1))
    const str = `Shorted sols: ${errors.reduce((acc, cur, idx) => {
      if (cur) {
        acc += `${mapSolNumToName(idx)}, `
      }
      return acc
    }, "")}`
    return str.substring(0, str.length - 2)
  }
}

module.exports = Interpolation;
