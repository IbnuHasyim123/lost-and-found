import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login-user.dto';
import { changePasswordDto } from './dto/change-password.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  create(
    @Body() createUserDto: CreateUserDto,
    @Body('numIdentity') numIdentity: string,
  ) {
    return this.userService.create(createUserDto, numIdentity);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe())
  login(@Body() logindto: loginDto) {
    return this.userService.login(logindto);
  }

  @Get('/info/:id')
  userInfo(@Param('id') id: string) {
    return this.userService.userInfo(id);
  }

  @Post('/update')
  @UsePipes(new ValidationPipe())
  updateProfile(@Body() updateDto: UpdateUserDto) {
    return this.userService.updateProfile(updateDto);
  }

  @Post('/changepassword')
  @UsePipes(new ValidationPipe())
  changePassword(@Body() changepassworddto: changePasswordDto) {
    return this.userService.changePassword(changepassworddto);
  }
}
