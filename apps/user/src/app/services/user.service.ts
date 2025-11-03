import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  buildDateRangeFilter,
  errorResponse,
  GetUserDto,
  ResponseMessage,
  successResponse,
  toMongoObjectId,
  UserRepository,
} from '@diagram/shared';
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

function getUserLookup() {
  return [
    {
      $project: {
        _id: 1,
        name: 1,
        age: 1,
        email: 1,
        address: 1,
        phoneNumber: 1,
        status: 1,
      },
    },
  ];
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async getAllUser(getUserDto: GetUserDto): Promise<any> {
    const {email,status, search, offset, limit, startDate, endDate, meta, } = getUserDto;
    const filterQuery = {};

    if (search) {
      filterQuery['name'] = { $regex: search, $options: 'i' };
    }

    const createdAtRange = buildDateRangeFilter(
      startDate ? new Date(startDate) : undefined, 
      endDate ? new Date(endDate) : undefined
    );
    if (createdAtRange) filterQuery['createdAt'] = createdAtRange;
    if (email) {
      filterQuery['email'] = email;
    }
    if (status) {
      filterQuery['status'] = status;
    }

    try {
      const users = await this.userRepository.paginate({
        offset,
        limit,
        filterQuery,
        pipelines: getUserLookup(),
        all: !meta,
      });
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, users);
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }


  async signUp(userDto: UserDto) {
    const hash = await bcrypt.hash(userDto.password, 10);

    try {
      const user = await this.userRepository.create({
        ...userDto,
        password: hash,
      });
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, user);
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }

  async userProfile(payload) {
    const mongoId = toMongoObjectId({ value: payload.id, key: 'id' });
    if (!mongoId) {
      throw new BadRequestException('Invalid User ID format');
    }
    const pipeline = [{ $match: { _id: mongoId } }, ...getUserLookup()];
    try {
      const [res] = await this.userRepository.aggregate(pipeline);
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, res);
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }

  async generateOTP(emailDto: EmailDto) {
    const user = await this.userRepository.findOne({ email: emailDto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const otp = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    const otpGenerateTime = Date.now();
    await this.userRepository.findOneAndUpdate(
      { email: emailDto.email },
      { $set: { otp, otpGenerateTime } }
    );
    return successResponse(
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
      'OTP Generated'
    );
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      email: forgotPasswordDto.email,
    });
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
    const hashNewPassword = await bcrypt.hash(
      forgotPasswordDto.newPassword,
      10
    );
    await this.userRepository.findOneAndUpdate(
      { email: forgotPasswordDto.email },
      {
        $set: { password: hashNewPassword },
        $unset: { otp: 1, otpGenerateTime: 1 },
      }
    );
    return successResponse(
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
      'New password generated successfully'
    );
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
      if (user.status === 'INACTIVE') {
        throw new UnauthorizedException('User is InActive');
      }
      const access_token = this.jwtService.sign(
        { email: user.email, userId: user._id },
        { expiresIn: '15m' }
      );
      const refresh_token = this.jwtService.sign(
        { email: user.email, userId: user._id },
        { expiresIn: '7d' }
      );
      const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
      const hashedAccessToken = await bcrypt.hash(access_token, 10);
      await this.userRepository.findOneAndUpdate(
        { email: logInDto.email },
        {
          $set: {
            refreshToken: hashedRefreshToken,
            accessToken: hashedAccessToken,
          },
        }
      );
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, {
        access_token,
        refresh_token,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Login failed due to server error');
    }
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match'
      );
    }
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user?.password
    );
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    const hashNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10
    );
    await this.userRepository.findOneAndUpdate(
      { email: email },
      { $set: { password: hashNewPassword } }
    );
    return successResponse(
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
      'Password updated successfully'
    );
  }

  async logOut(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new NotFoundException();
    await this.userRepository.findOneAndUpdate(
      { email },
      { $unset: { refreshToken: 1, accessToken: 1 } }
    );
    return successResponse(
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
      'Logged out successfully'
    );
  }
}
