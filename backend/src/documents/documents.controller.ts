import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'

@Controller('api/documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private service: DocumentsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const docs = await this.service.findAll(req.user.userId)
    return docs.map((d) => ({
      id: d.id,
      title: d.title,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }))
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const doc = await this.service.findOne(+id, req.user.userId)
    return {
      id: doc.id,
      title: doc.title,
      formData: JSON.parse(doc.formData),
      extraFields: doc.extraFields ? JSON.parse(doc.extraFields) : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  @Post()
  async create(@Body() body: { title: string; formData: unknown; extraFields?: unknown }, @Req() req: any) {
    const doc = await this.service.create(req.user.userId, body.title, body.formData, body.extraFields)
    return { id: doc.id, title: doc.title, createdAt: doc.createdAt }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.service.remove(+id, req.user.userId)
    return { success: true }
  }
}
