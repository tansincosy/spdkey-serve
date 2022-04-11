import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterParam {
  @IsString()
  @MinLength(2, {
    message: '用户名太短',
  })
  @MaxLength(50, {
    message: '用户名太长',
  })
  @IsNotEmpty()
  readonly username: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @MinLength(10, {
    message: '密码太短, 请输入8-16之间',
  })
  @MaxLength(50, {
    message: '密码太长, 请输入8-16之间',
  })
  @IsNotEmpty()
  password: string;
}

export class CheckCode {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @MinLength(2, {
    message: '用户名太短',
  })
  @MaxLength(50, {
    message: '用户名太长',
  })
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly emailCode: string;
}

export class ModifyParam {
  @IsString()
  @MinLength(10, {
    message: '密码太短, 请输入8-16之间',
  })
  @MaxLength(50, {
    message: '密码太长, 请输入8-16之间',
  })
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
