import {
  IsString,
  IsIn,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsIn(['YOUTUBE', 'IMAGE'])
  type: 'YOUTUBE' | 'IMAGE';

  @ValidateIf((o) => o.type === 'YOUTUBE')
  @IsNotEmpty({ message: 'externalId is required when type is YOUTUBE' })
  @IsString()
  externalId?: string;

  @ValidateIf((o) => o.type === 'IMAGE')
  @IsNotEmpty({ message: 'url is required when type is IMAGE' })
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}

export class GetMediaQueryDto {
  @IsOptional()
  @IsIn(['YOUTUBE', 'IMAGE'])
  type?: 'YOUTUBE' | 'IMAGE';
}
