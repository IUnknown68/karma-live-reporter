import { expect, default as chai } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

describe('Server', () => {
  it('is ok', () => {
    expect(true).to.be.true;
  });
});
