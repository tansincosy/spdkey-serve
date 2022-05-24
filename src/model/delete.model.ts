import { ArrayNotEmpty, IsArray } from 'class-validator';

/**
 * 删除接口字段模型
 */

export class BatchDelDTO {
  @IsArray()
  @ArrayNotEmpty()
  ids: string[];
}
