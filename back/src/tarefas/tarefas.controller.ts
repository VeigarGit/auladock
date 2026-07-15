import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TarefasService } from './tarefas.service';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { FindTarefaDto } from './dto/find-tarefa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tarefas')
@UseGuards(JwtAuthGuard)
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Post()
  async create(@Body() createTarefaDto: CreateTarefaDto) {
    return this.tarefasService.create(createTarefaDto);
  }

  @Get()
  async findAll(@Query() filters: FindTarefaDto) {
    return this.tarefasService.findAll(filters);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.tarefasService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTarefaDto: UpdateTarefaDto,
  ) {
    return this.tarefasService.update(id, updateTarefaDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.tarefasService.delete(id);
  }
}
