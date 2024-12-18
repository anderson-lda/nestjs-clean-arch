import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigService } from './env-config.service';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'node:path';

@Module({
  imports: [ConfigModule],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule extends ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return super.forRoot({ //super é sobrescrita
      ...options, //as outras props continuam as mesmas, apenas envFilePath foi personalizado
      envFilePath: [
        join(__dirname,`../../../../.env.${process.env.NODE_ENV}`),
      ]
    })
  }
}
