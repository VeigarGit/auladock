import { Tarefas } from './entities/tarefas.entity';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';
import { TarefasRepository } from './tarefas.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tarefas])],
  providers: [TarefasService, TarefasRepository],
  controllers: [TarefasController],
})
export class TarefasModule {}
