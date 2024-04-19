import { AutoMap } from '@automapper/classes';

export class PartialGuild {
  @AutoMap()
  id: string;
  @AutoMap()
  name: string;
  @AutoMap()
  icon: string;
  @AutoMap()
  owner: boolean;
  @AutoMap()
  permissions: number;
  @AutoMap()
  features: string[];
  @AutoMap()
  isActive: boolean;
}
