import { IsArray, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class ChatMessageDto {
  @IsString()
  role: 'system' | 'assistant' | 'user'

  @IsString()
  content: string
}

export class ChatRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[]
}
