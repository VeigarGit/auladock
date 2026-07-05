import { BadRequestException, Injectable } from '@nestjs/common';
import { Tarefas } from './entities/tarefas.entity';
import { TarefasRepository } from './tarefas.repository';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { FindTarefaDto } from './dto/find-tarefa.dto';

@Injectable()
export class TarefasService {
  constructor(private readonly tarefasRepository: TarefasRepository) {}
  async create(tarefa: CreateTarefaDto) {
    if (!tarefa.titulo) {
      throw new BadRequestException('Título é obrigatório');
    }
    return this.tarefasRepository.create(tarefa);
  }

  async findAll(filters: FindTarefaDto) {
    return await this.tarefasRepository.findAll(filters);
  }

  async findById(id: number) {
    const tarefa = await this.tarefasRepository.findById(id);
    if (!tarefa) {
      throw new BadRequestException('Tarefa não encontrada');
    }
    return tarefa;
  }

  async update(id: number, dto: UpdateTarefaDto) {
    const tarefa = await this.tarefasRepository.findById(id);
    if (!tarefa) {
      throw new BadRequestException('Tarefa não encontrada');
    }
    return await this.tarefasRepository.update(id, dto);
  }

  async delete(id: number) {
    const tarefa = await this.tarefasRepository.findById(id);
    if (!tarefa) {
      throw new BadRequestException('Tarefa não encontrada');
    }
    return await this.tarefasRepository.delete(id);
  }
}
