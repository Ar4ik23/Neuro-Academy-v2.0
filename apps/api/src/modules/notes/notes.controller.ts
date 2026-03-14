import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNoteDto, NoteDto } from '@neuro-academy/types';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll(@Req() req: any, @Query('lessonId') lessonId?: string): Promise<NoteDto[]> {
    return this.notesService.findAllByUser(req.user.id, lessonId);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateNoteDto): Promise<NoteDto> {
    return this.notesService.create(req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: any, @Param('id') id: string): Promise<void> {
    return this.notesService.remove(req.user.id, id);
  }
}
