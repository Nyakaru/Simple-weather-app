//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);
  describe('/GET weather', () => {
      it('it should weather details', (done) => {
        chai.request(server)
            .get('/location/Nairobi')
            .end((err, res) => {
                  res.text.should.be.a('string')
            done();
          });
      }).timeout(5000);
  });
