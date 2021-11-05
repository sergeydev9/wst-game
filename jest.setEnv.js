jest.mock('@paypal/checkout-server-sdk');
jest.mock('ioredis')

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = "my secret"
process.env.SG_API_KEY = "SG.FAKE-KEY"