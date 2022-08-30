import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { EnvSchemaValidation } from './env.validation';
import { HttpLogMiddleware } from './middlewares/HttpLogMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvSchemaValidation,
      envFilePath: `.env.${process.env.STAGE}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const isProduction = config.get('STAGE') === 'prod';
        return {
          type: 'postgres',
          url: config.get('DATABASE_CONNECTION_URL'),
          autoLoadEntities: true,
          synchronize: !isProduction,
          ssl: isProduction,
        } as TypeOrmModuleOptions;
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLogMiddleware).forRoutes(AuthController);
  }
}
