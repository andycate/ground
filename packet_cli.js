const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

fletcher16 = (data) => {
  var a = 0, b = 0;
  for (var i = 0; i < data.length; i++) {
      a = (a + data[i]) % 255;
      b = (b + a) % 255;
  }
  return a | (b << 8);
}

const port = new SerialPort(process.argv[2], {
  baudRate: 57600,
  autoOpen: false
});

port.open(() => {
  const parser = new Readline();
  port.pipe(parser);
  parser.on('data', (data) => {
    console.log(data);
  });
  rl.on('line', line => {
    const checksum = fletcher16(Buffer.from(line, 'binary')).toString(16);
    port.write('{' + line + '|' + checksum + '}\n');
  })
});

