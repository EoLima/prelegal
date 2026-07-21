import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Document } from './document.entity'

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private repo: Repository<Document>,
  ) {}

  async create(userId: number, title: string, formData: unknown, extraFields?: unknown): Promise<Document> {
    const doc = this.repo.create({
      user: { id: userId } as any,
      title,
      formData: JSON.stringify(formData),
      extraFields: extraFields ? JSON.stringify(extraFields) : undefined,
    })
    return this.repo.save(doc)
  }

  async findAll(userId: number): Promise<Document[]> {
    return this.repo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    })
  }

  async findOne(id: number, userId: number): Promise<Document> {
    const doc = await this.repo.findOne({ where: { id, userId } })
    if (!doc) throw new NotFoundException('Document not found')
    return doc
  }

  async remove(id: number, userId: number): Promise<void> {
    const doc = await this.findOne(id, userId)
    await this.repo.remove(doc)
  }
}
