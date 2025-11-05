import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Inject,
  Query,
} from '@nestjs/common';
import {
  Auth,
  ChangePasswordDto,
  ChangePasswordRequestResponse,
  CreateUserRequestResponse,
  EmailDto,
  ForgotPasswordDto,
  ForgotPasswordRequestResponse,
  GenerateOTPRequestResponse,
  GetUserDto,
  GetUserProfileRequestResponse,
  GetUserRequestResponse,
  LogInDto,
  LogOutRequestResponse,
  LoginUserRequestResponse,
  MESSAGE_PATTERNS,
  SERVICES,
  UserDto,
} from '@diagram/shared';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const {
  SIGN_UP,
  LOG_IN,
  GENERATE_OTP,
  FORGOT_PASSWORD,
  GET_PROFILE,
  CHANGE_PASSWORD,
  LOG_OUT,
  GET_ALL_USER,
} = MESSAGE_PATTERNS.USER;

@ApiTags('user')
@Controller()
export class UserController {
  constructor(@Inject(SERVICES.USER) private readonly userClient: ClientRMQ) {}

  @Post('/sign-up')
  @ApiCreatedResponse({ type: CreateUserRequestResponse })
  async signUp(@Body() userDto: UserDto) {
    try {
      return await firstValueFrom(this.userClient.send(SIGN_UP, userDto));
    } catch (error) {
      console.error('Gateway signUp error:', error);
      throw error;
    }
  }

  @Post('/log-in')
  @ApiCreatedResponse({ type: LoginUserRequestResponse })
  async logIn(@Body() loginDto: LogInDto) {
    try {
      return await firstValueFrom(this.userClient.send(LOG_IN, loginDto));
    } catch (error) {
      console.error('Gateway login error:', error);
      throw error;
    }
  }

  @Post('/generate-otp')
  @ApiCreatedResponse({ type: GenerateOTPRequestResponse })
  async generateOTP(@Body() emailDto: EmailDto) {
    try {
      return await firstValueFrom(this.userClient.send(GENERATE_OTP, emailDto));
    } catch (error) {
      console.error('Gateway generateOTP error:', error);
      throw error;
    }
  }

  @Post('/forgot-password')
  @ApiCreatedResponse({ type: ForgotPasswordRequestResponse })
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    try {
      return await firstValueFrom(
        this.userClient.send(FORGOT_PASSWORD, forgotPassword)
      );
    } catch (error) {
      console.error('Gateway forgotPassword error:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Get('/get-profile')
  @ApiCreatedResponse({ type: GetUserProfileRequestResponse })
  async getProfile(@Request() req) {
    try {
      return await firstValueFrom(this.userClient.send(GET_PROFILE, req.user));
    } catch (error) {
      console.error('Gateway getProfile error:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Get('/get-all-user')
  @ApiCreatedResponse({ type: GetUserRequestResponse })
  async getAllUser(@Query() getUserDto: GetUserDto) {
    try {
      return await firstValueFrom(
        this.userClient.send(GET_ALL_USER, getUserDto)
      );
    } catch (error) {
      console.error('Gateway getAllUser error:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Patch('/change-password')
  @ApiCreatedResponse({ type: ChangePasswordRequestResponse })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    try {
      return await firstValueFrom(
        this.userClient.send(CHANGE_PASSWORD, {
          email: req.user.email,
          changePasswordDto,
        })
      );
    } catch (error) {
      console.error('Gateway changePassword error:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Patch('/logOut')
  @ApiCreatedResponse({ type: LogOutRequestResponse })
  async logOut(@Request() req) {
    try {
      return await firstValueFrom(
        this.userClient.send(LOG_OUT, req.user.email)
      );
    } catch (error) {
      console.error('Gateway logOut error:', error);
      throw error;
    }
  }
}
