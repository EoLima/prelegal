import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

const jwtSecret = process.env.JWT_SECRET ?? 'prelegal-dev-secret-change-in-production'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    })
  }

  async validate(payload: { sub: number; email: string }) {
    return { userId: payload.sub, email: payload.email }
  }
}
