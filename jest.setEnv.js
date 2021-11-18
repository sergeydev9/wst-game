jest.mock('@paypal/checkout-server-sdk');
jest.mock('ioredis')

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = "my secret";
process.env.SG_API_KEY = "SG.FAKE-KEY";
process.env.DOMAIN = "www.whosaidtrue.com";
process.env.EMAIL_RECIPIENT = 'test@test.com';
process.env.FOR_SCHOOLS_DOMAIN = "www.whosaidtrueforschools.com";