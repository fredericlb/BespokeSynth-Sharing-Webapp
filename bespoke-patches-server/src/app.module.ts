import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatchesService } from './patches/patches.service';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PatchesResolver } from './patches/patches.resolver';
import { Patch } from './patches/patch.model';
import { ActionTokenResolver } from './action-token/action-token.resolver';
import { ActionTokenService } from './action-token/action-token.service';
import { MailModule } from './mail/mail.module';
import { ActionToken } from './action-token/action-token.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
import { ApolloLogPlugin } from 'apollo-log';
import { ServeStaticModule } from '@nestjs/serve-static';

const entities = [Patch, ActionToken];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'sqlite',
      database: '../storage/data.sq3',
      entities,
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'graphql-ws': true,
      },
      resolvers: { Upload: GraphQLUpload },
      plugins: [
        () =>
          ApolloLogPlugin({
            events: { willSendResponse: false },
            timestamp: true,
            mutate: (data) => {
              return {
                query: data.query,
                variables: data.variables,
                context: null,
              };
            },
          }),
      ],
    } as GqlModuleOptions),
    TypeOrmModule.forFeature(entities),
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/client'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PatchesService,
    PatchesResolver,
    ActionTokenResolver,
    ActionTokenService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        graphqlUploadExpress({ maxFileSize: 80 * 1024 * 1024, maxFiles: 20 }),
      )
      .forRoutes('graphql');
  }
}
