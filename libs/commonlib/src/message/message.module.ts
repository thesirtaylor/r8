// messaging.module.ts
import { Global, Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    // ConfigModule,
    // ClientsModule.registerAsync([
    //   {
    //     name: 'DATA_STREAM',
    //     useFactory: async (config: ConfigService) => ({
    //       transport: Transport.REDIS,
    //       options: {
    //         host: config.get<string>('REDIS_HOST'),
    //         port: config.get<number>('REDIS_PORT'),
    //       },
    //     }),
    //     inject: [ConfigService],
    //   },
    // ]),
    ClientsModule.register([
      {
        name: 'DATA_STREAM',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MessagingModule {}
