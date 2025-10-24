import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TriagemModule } from './triagem/triagem.module';

@Module({
  imports: [
    // 1. Carrega as variáveis de ambiente do .env
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis disponíveis globalmente
      envFilePath: '.env', // Aponta para o arquivo .env
    }),

    // 2. Configura a conexão com o banco de dados (TypeORM)P
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Precisa do ConfigModule para funcionar
      inject: [ConfigService],  // Injeta o serviço de configuração
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // Encontra automaticamente arquivos .entity.ts (que criaremos depois)
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // ATENÇÃO: 'synchronize: true' NUNCA deve ser usado em produção.
        // Ele cria/altera tabelas automaticamente com base nas entities.
        // Ótimo para desenvolvimento, perigoso para produção.
        synchronize: true,
      }),
    }),

    AuthModule,

    UserModule,

    TriagemModule,
    
    // (Módulos que vamos criar no próximo passo serão adicionados aqui)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}