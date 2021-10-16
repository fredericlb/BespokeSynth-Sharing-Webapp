import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatchesService } from './patches/patches.service';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PatchesResolver } from './patches/patches.resolver';
import { Patch } from './patches/patch.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'sqlite',
      database: '../storage/data.sq3',
      entities: [Patch],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    } as GqlModuleOptions),
    TypeOrmModule.forFeature([Patch]),
  ],
  controllers: [AppController],
  providers: [AppService, PatchesService, PatchesResolver],
})
export class AppModule {}
