import expect from 'expect'
import request from 'supertest'
import { ObjectID } from 'mongodb'

import app from '../../server'
import ProductModel from './ProductModel'

const products = [
  { _id: new ObjectID(), name: 'Test product 1', description: 'A test product1 for route', price: 1000 },
  { _id: new ObjectID(), name: 'Test product 2', description: 'A test product2 for route', price: 2000 },
  { _id: new ObjectID(), name: 'Test product 3', description: 'A test product3 for route', price: 3000 },
]

beforeEach((done) => {
  ProductModel.remove({})
    .then(() => ProductModel.insertMany(products))
    .then(() => done())
})

describe('POST /api/products', () => {
  it('should create a new product', (done) => {
    const name = 'Test product'
    const description = 'A test product for route test'
    const price = 1000
    request(app)
      .post('/api/products')
      .send({ name, description, price })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(name)
        expect(res.body.description).toBe(description)
        expect(res.body.price).toBe(price)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        ProductModel.find({ name, description, price })
          .then((products) => {
            expect(products.length).toBe(1)
            expect(products[0].name).toBe(name)
            expect(products[0].description).toBe(description)
            expect(products[0].price).toBe(price)
            done()
          })
          .catch(err => done(err))
      })
  })
  it('should not create product with invalid body data', (done) => {
    request(app)
      .post('/api/products')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        ProductModel.find()
          .then((products) => {
            expect(products.length).toBe(3)
            done()
          })
          .catch(err => done(err))
      })
  })
})

describe('GET /api/products', () => {
  it('should get all products', (done) => {
    request(app)
      .get('/api/products')
      .expect(200)
      .expect((res) => {
        expect(res.body.products.length).toBe(3)
      })
      .end(done)
  })
})

describe('GET /api/products/:id', () => {
  it('should return product doc', (done) => {
    request(app)
      .get(`/api/products/${products[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.product.text).toBe(products[0].text)
      })
      .end(done)
  })
  it('should return 404 if product not found', (done) => {
    const hexId = new ObjectID().toHexString()
    request(app)
      .get(`/api/products/${hexId}`)
      .expect(404)
      .end(done)
  })
  it('should return 404 for non-object ids', (done) => {
    const id = '123abc'
    request(app)
      .get(`/api/products/${id}`)
      .expect(404)
      .end(done)
  })
})