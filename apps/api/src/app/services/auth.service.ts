import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import DB from '../db';
import { CreateUserDto } from '@whosaidtrue/middleware';
import { HttpException } from '@whosaidtrue/app-interfaces';
import { DataStoredInToken, TokenData } from '@whosaidtrue/api-interfaces';
import { User } from '@whosaidtrue/data';
import { isEmpty } from '../utils/util';

class AuthService {
  public users = DB.Users;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      accountType: 0,
      activated: false,
      activationCode: '',
      dob: undefined,
      firstName: '',
      ipAddress: '',
      lastName: '',
      screenName: '',
      status: '',
      ...userData,
      password: hashedPassword,
    });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ token: TokenData; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });

    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password is incorrect");

    // sanitize
    findUser.password = '******';

    const token = this.createToken(findUser);
    return { token, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = process.env.JWT_SECRET
    const expiresIn: number = 60 * 60;
    // TODO: include refresh token
    return { expiresIn, jwt: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.jwt}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
