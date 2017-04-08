const expect = require('chai').expect;
const Player = require('../../model/player');

describe('Test Model Player', () => {
  it('getColor should return color', () => {
    const player = new Player(543, 'test', {});
    expect(player.getColor()).to.be.eql(543);
  });
  it('getIdentifier should return identifier', () => {
    const player = new Player(543, 'test', {});
    expect(player.getIdentifier()).to.be.eql('test');
  });
  it('getSocket should return socket', () => {
    const player = new Player(543, 'test', {});
    expect(player.getSocket()).to.be.eql({});
  });
});
