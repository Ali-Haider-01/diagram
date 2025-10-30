import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '@diagram/shared';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  EmailDto,
  LogInDto,
  UserDto,
} from '@diagram/shared';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}


  async signUp(userDto: UserDto) {
    const hash = await bcrypt.hash(userDto.password, 10);
    // Use repository create
    return this.userRepository.create({
      name: userDto.name,
      phoneNumber: userDto.phoneNumber,
      email: userDto.email,
      password: hash,
    } as any);
  }

  async userProfile(payload) {
    const user = await this.userRepository.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(payload.userId),
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          phoneNumber: 1,
          email: 1,
        },
      },
    ]);
    if (!user || user.length === 0) {
      throw new NotFoundException('User not found');
    }
    return { user };
  }

  async generateOTP(emailDto: EmailDto) {
    const user = await this.userRepository.findOne({ email: emailDto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const otp = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
    const otpGenerateTime = Date.now();
    await this.userRepository.findOneAndUpdate(
      { email: emailDto.email },
      { $set: { otp, otpGenerateTime } },
    );
    return { message: 'OTP Generated' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({ email: forgotPasswordDto.email });
    if (!user?.otp) {
      throw new NotFoundException('OTP not found in this user');
    }
    if (forgotPasswordDto.otp !== user.otp) {
      throw new BadRequestException('OTP not match');
    }
    const ONE_MINUTE = 1 * 60 * 1000;
    const now = Date.now();
    if (!user.otpGenerateTime || now - user.otpGenerateTime > ONE_MINUTE) {
      throw new BadRequestException('OTP Expired');
    }
    const hashNewPassword = await bcrypt.hash(forgotPasswordDto.newPassword, 10);
    await this.userRepository.findOneAndUpdate(
      { email: forgotPasswordDto.email },
      { $set: { password: hashNewPassword }, $unset: { otp: 1, otpGenerateTime: 1 } },
    );
    return { message: 'New password generated successfully' };
  }

  async logIn(logInDto: LogInDto) {
    try {
      const user = await this.userRepository.findOne({ email: logInDto.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isMatch = await bcrypt.compare(logInDto.password, user?.password);
      if (!isMatch) {
        throw new UnauthorizedException('password is incorrect');
      }
      const access_token = this.jwtService.sign(
        { email: user.email, userId: user._id },
        { expiresIn: '15m' },
      );
      const refresh_token = this.jwtService.sign(
        { email: user.email, userId: user._id },
        { expiresIn: '7d' },
      );
      const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
      const hashedAccessToken = await bcrypt.hash(access_token, 10);
      await this.userRepository.findOneAndUpdate(
        { email: logInDto.email },
        { $set: { refreshToken: hashedRefreshToken, accessToken: hashedAccessToken } },
      );
      return { access_token, refresh_token };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new BadRequestException('Login failed due to server error');
    }
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    const hashNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.findOneAndUpdate(
      { email: email },
      { $set: { password: hashNewPassword } },
    );
    return { message: 'Password updated successfully' };
  }


  async logOut(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new NotFoundException();
    await this.userRepository.findOneAndUpdate(
      { email },
      { $unset: { refreshToken: 1, accessToken: 1 } },
    );
    return { message: 'Logged out successfully' };
  }
}
