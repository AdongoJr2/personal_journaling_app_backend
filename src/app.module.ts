import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiResponseModule } from './core/modules/api-response/api-response.module';
import { SharedModule } from './shared/shared.module';
import { LoggerModule } from './core/modules/logger/logger.module';
import { RefreshTokensModule } from './features/refresh-tokens/refresh-tokens.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          configService.get('NODE_ENV') === 'development'
            ? 'dist/features/**/entities/*.entity.js'
            : 'dist/features/**/entities/*.entity.js',
        ],
        migrations: [
          configService.get('NODE_ENV') === 'development'
            ? 'dist/migrations/*.js'
            : 'dist/migrations/*.js',
        ],
        migrationsTableName: 'typeorm_migrations',
        logging: ['query', 'info', 'error', 'log'],
      }),
    }),
    ApiResponseModule,
    SharedModule,
    LoggerModule,
    RefreshTokensModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
