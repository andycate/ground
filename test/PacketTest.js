const assert = require('assert');

const Packet = require('../electron/Packet');

describe('Packet', () => {
  describe('#parsePacket()', () => {
    it('should correctly parse basic packet', () => {
      const packet = Packet.parsePacket('{1,2.00|e71e}');
      assert.ok(packet, `parsePacket returned null`);
      assert.strictEqual(packet.id, 1, `packet id doesn't match expected`);
      assert.strictEqual(packet.length, 1, `packet length doesn't match expected`);
      assert.strictEqual(packet.values[0], 2.00, `packet values don't match expected`);
    });
    it('should correctly parse packet with newlines', () => {
      const packet = Packet.parsePacket('{1,2.00|e71e}\n');
      assert.ok(packet, `parsePacket returned null`);
      assert.strictEqual(packet.id, 1, `packet id doesn't match expected`);
      assert.strictEqual(packet.length, 1, `packet length doesn't match expected`);
      assert.strictEqual(packet.values[0], 2.00, `packet values don't match expected`);
    });
    it('should correctly parse packet with newlines and carriage returns', () => {
      const packet = Packet.parsePacket('{1,2.00|e71e}\r\n');
      assert.ok(packet, `parsePacket returned null`);
      assert.strictEqual(packet.id, 1, `packet id doesn't match expected`);
      assert.strictEqual(packet.length, 1, `packet length doesn't match expected`);
      assert.strictEqual(packet.values[0], 2.00, `packet values don't match expected`);
    });
    it('should correctly parse packet with spaces at the front', () => {
      const packet = Packet.parsePacket('   {1,2.00|e71e}  ');
      assert.ok(packet, `parsePacket returned null`);
      assert.strictEqual(packet.id, 1, `packet id doesn't match expected`);
      assert.strictEqual(packet.length, 1, `packet length doesn't match expected`);
      assert.strictEqual(packet.values[0], 2.00, `packet values don't match expected`);
    });
    it('should fail to parse packet with incorrect checksum', () => {
      const packet = Packet.parsePacket('{1,3.00|e71e}');
      assert.ok(!packet, `parsePacket returned something`);
    });
    it('should fail to parse packet with incorrect checksum delimiter', () => {
      const packet = Packet.parsePacket('{1,3.00e71e}');
      assert.ok(!packet, `parsePacket returned something`);
    });
  });

  describe('#stringify()', () => {
    it('should correctly stringify packet', () => {
      const packet = new Packet(1, [2.00]);
      const pktString = packet.stringify();
      assert.strictEqual(pktString, '{1,2.00|e71e}', `packet string generated is incorrectly formatted`);
    });
  });
});
