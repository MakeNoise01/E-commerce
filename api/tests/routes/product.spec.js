/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Product, conn } = require('../../src/db.js');

const agent = session(app);
const product = {
  name: 'producto',
};
const producto = {
  name: 'producto2',
};

describe('PRODUCT routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Product.sync({ force: true })
    .then(() => Product.create(producto))
    .then(() => Product.create(product)));
  describe('GET /products', () => {
    it('should get 200', () => 
      agent.get('/products/').expect(200)
    );
    it('sirve el producto en GET /products/:id', () => {
      return agent
          .get(`/products/2`)
          .expect(200)
          .then(res => {
              expect(res.body.id).to.be.equal(2)
          });
  });
  it('sirve el producto en GET /products/:id', () => {
    return agent
        .get(`/products/1`)
        .expect(200)
        .then(res => {
            expect(res.body.id).to.be.equal(1)
        });
});
  });
});