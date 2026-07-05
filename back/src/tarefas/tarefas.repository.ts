import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tarefas } from './entities/tarefas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { FindTarefaDto } from './dto/find-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';

@Injectable()
export class TarefasRepository {
  constructor(
    @InjectRepository(Tarefas)
    private readonly repo: Repository<Tarefas>,
  ) {}
  async create(tarefa: CreateTarefaDto): Promise<Tarefas> {
    const tarefas = this.repo.create(tarefa);
    return this.repo.save(tarefas);
  }

  async findAll(filters: FindTarefaDto): Promise<Tarefas[]> {
    const query = this.repo.createQueryBuilder('tarefa');
    const rawStatus = (filters as { status?: boolean | string }).status;
    const status =
      rawStatus === 'true' ? true : rawStatus === 'false' ? false : rawStatus;

    if (filters.titulo) {
      query.andWhere('tarefa.titulo ILIKE :titulo', {
        titulo: `%${filters.titulo}%`,
      });
    }
    if (status !== undefined) {
      query.andWhere('tarefa.status = :status', { status });
    }
    if (filters.createdAt) {
      query.andWhere('tarefa.createdAt >= :createdAt', {
        createdAt: filters.createdAt,
      });
    }
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    query.skip((page - 1) * limit).take(limit);
    return query.getMany();
  }

  async findById(id: number): Promise<Tarefas | null> {
    return await this.repo.findOne({
      where: { id },
    });
  }

  async update(id: number, dto: UpdateTarefaDto): Promise<Tarefas> {
    const tarefa = await this.findById(id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }
    Object.assign(tarefa, dto);
    return this.repo.save(tarefa);
  }

  async delete(id: number): Promise<void> {
    const tarefa = await this.findById(id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }
    await this.repo.remove(tarefa);
  }
}
