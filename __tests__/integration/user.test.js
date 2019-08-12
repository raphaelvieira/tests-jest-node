import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('User', () => {
  /** execute before each tests */
  beforeEach(async () => {
    /** clear database before each test */
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });
    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('shoud be able to register', async () => {
    /** get user from faker */
    const user = await factory.attrs('User');

    const response = await request(app)
      .post(`/users`)
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should be not be able to register with duplicated email', async () => {
    /** get user from faker */
    const user = await factory.attrs('User');
    await request(app)
      .post(`/users`)
      .send(user);
    const response = await request(app)
      .post(`/users`)
      .send(user);
    expect(response.status).toBe(400);
  });
});
