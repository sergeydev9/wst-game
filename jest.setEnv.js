jest.mock('@paypal/checkout-server-sdk')
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = "my secret"
process.env.SG_API_KEY = "SG.FAKE-KEY"