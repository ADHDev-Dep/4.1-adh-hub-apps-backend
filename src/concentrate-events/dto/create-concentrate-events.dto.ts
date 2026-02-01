import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class ConcentrateEventDto {
  @IsString()
  concentrate: string;

  @IsDateString()
  event_date: string;

  @IsNumber()
  quantity: number;
}

export class CreateConcentrateEventsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConcentrateEventDto)
  events: ConcentrateEventDto[];
}
