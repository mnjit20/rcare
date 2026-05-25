import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoringModule } from './scoring/scoring.module';
import { GithubModule } from './github/github.module';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [ScoringModule, GithubModule, RepositoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
