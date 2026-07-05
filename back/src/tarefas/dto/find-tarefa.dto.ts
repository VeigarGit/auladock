import { BaseQueryParametersDto } from '../../common/dto/base-query-parameters.dto';

export class FindTarefaDto extends BaseQueryParametersDto {
  status?: boolean;
  createdAt?: Date;
  titulo?: string;
}
