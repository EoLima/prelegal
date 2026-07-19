import { Controller, Post, Body } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatRequestDto } from './dto/chat.dto'

@Controller('api')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('chat')
  async chat(@Body() dto: ChatRequestDto) {
    return this.chatService.chat(dto)
  }
}
