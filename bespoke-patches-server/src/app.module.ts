import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatchesService } from './patches/patches.service';
import {
  GqlModuleOptions,
  GraphQLModule,
  GraphQLSchemaHost,
} from '@nestjs/graphql';
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
import { HttpAdapterHost } from '@nestjs/core';
import { Application } from 'express';
import { OpenAPI, useSofa } from 'sofa-api';
import * as swaggerUi from 'swagger-ui-express';

const entities = [Patch, ActionToken];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'sqlite',
      database: `${process.env.STORAGE_DIR}/data.sq3`,
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
      exclude: ['/api*'],
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

  constructor(
    @Inject(GraphQLSchemaHost) private readonly schemaHost: GraphQLSchemaHost,
    @Inject(HttpAdapterHost) private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  onModuleInit(): void {
    if (!this.httpAdapterHost) {
      return;
    }

    const { httpAdapter } = this.httpAdapterHost;
    const app: Application = httpAdapter.getInstance();
    const { schema } = this.schemaHost;
    const openApi = OpenAPI({
      schema,
      info: {
        title: 'Bespoke Patches API',
        version: '0.0.1',
      },
    });

    // convert GraphQL API to REST using SOFA
    app.use(
      '/api',
      useSofa({
        schema,
        basePath: '/api',
        onRoute(info) {
          openApi.addRoute(info, {
            basePath: '/api',
          });
        },
      }),
    );

    const openApiDefinitions = openApi.get();
    console.log(openApiDefinitions);

    // remove upload related operations, SOFA does not support GRAPHQL uploads
    openApiDefinitions.paths['/api/moderate-patch'] = undefined;
    openApiDefinitions.paths['/api/upload-patch'] = undefined;
    openApiDefinitions.paths['/api/create-action-token'] = undefined;
    openApiDefinitions.paths['/api/enable-token'] = undefined;

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDefinitions));
  }
}
