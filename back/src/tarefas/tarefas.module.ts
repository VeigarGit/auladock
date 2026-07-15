import { Tarefas } from './entities/tarefas.entity';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';
import { TarefasRepository } from './tarefas.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tarefas]), AuthModule],
  providers: [TarefasService, TarefasRepository],
  controllers: [TarefasController],
})
export class TarefasModule {}
