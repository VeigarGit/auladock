import { CreateTarefaDto } from './create-tarefa.dto';

export class ReturnTarefaDto {
  tarefa?: CreateTarefaDto;
  message?: string;
}
