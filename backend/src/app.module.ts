import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // não precisa importar em todo módulo
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
