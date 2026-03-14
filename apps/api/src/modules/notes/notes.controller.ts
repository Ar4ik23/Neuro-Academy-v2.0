import { Controller, Get, Post, Delete, Param, Body, Req } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('lesson/:lessonId')
  findByLesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    const userId = req.user.sub;
    return this.notesService.findByLesson(userId, lessonId);
  }

  @Post()
  create(@Req() req: any, @Body() data: { lessonId: string; text: string; highlightedText?: string }) {
    const userId = req.user.sub;
    return this.notesService.create(userId, data);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.notesService.delete(userId, id);
  }
}
