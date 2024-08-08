import { getMapperToken } from '@timonmasberg/automapper-nestjs';
import { Inject } from '@nestjs/common';

export function InjectMapper(name?: string) {
  return Inject(getMapperToken(name));
}
