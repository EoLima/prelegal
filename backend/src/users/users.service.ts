import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string, name: string): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email } })
    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const user = this.usersRepository.create({ email, password: hashed, name })
    return this.usersRepository.save(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }
}
