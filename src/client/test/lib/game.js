import { expect } from 'chai';
import sinon from 'sinon';
import Game from '../../js/lib/game';
import Action from '../../../enum/action';
let sandbox;

describe('Test Game', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('getCorrespondingCell should handle edge case(0, 0)', () => {
    const spy = sandbox.spy();
    const game = new Game(10, {
      write: spy
    }, {
      addEventListener() {}
    }, {
      patterns: {
        addEventListener() {}
      }
    });
    game.getCorrespondingCell(0, 0);
    expect(spy.args[0][0].data.x).to.be.eql(0);
    expect(spy.args[0][0].data.y).to.be.eql(0);
  });
  it('addPattern should send a ADD_PATTERN event', () => {
    const spy = sandbox.spy();
    const game = new Game(10, {
      write: spy
    }, {
      addEventListener() {}
    }, {
      patterns: {
        addEventListener() {}
      }
    });
    game.addPattern({
      target: {
        id: 'test'
      }
    });
    expect(spy.args[0][0].action).to.be.eql(Action.ADD_PATTERN);
  });
});
