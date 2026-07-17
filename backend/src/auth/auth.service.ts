import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.usersService.create(dto.email, dto.password, dto.name)
    return this.tokenResponse(user.id, user.email, user.name)
  }

  async signin(dto: SigninDto) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.tokenResponse(user.id, user.email, user.name)
  }

  private tokenResponse(id: number, email: string, name: string) {
    const token = this.jwtService.sign({ sub: id, email })
    return { token, user: { id, email, name } }
  }
}
