import Email from './Email';

jest.mock('@sendgrid/mail')
describe('Email', () => {

  afterAll(() => {
    jest.clearAllMocks();
  })
  it('should create an object', () => {
    const actual = new Email('some key', 'email@email.com')

    expect(actual).toBeDefined()
  });
});
