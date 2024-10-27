import { BcryptjsHashProvider } from "../../bcryptjs-hash.provider";

describe('BCryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  });

  it('should return encrypted password', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    expect(hash).toBeDefined();
  });

  it('should return false on password and hash comparison', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    const result = await sut.comparehash('fake',hash)
    expect(result).toBeFalsy();
  });

  it('should return true on password and hash comparison', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    const result = await sut.comparehash('TestPassword123',hash)
    expect(result).toBeTruthy();
  });
});
