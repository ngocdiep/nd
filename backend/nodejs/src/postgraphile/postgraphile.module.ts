import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PoolConfig } from 'pg';
import postgraphile from 'postgraphile';
const UPLOAD_DIR_NAME = 'storage/files';

@Module({
    imports: [],
    providers: [],
    controllers: [
    ],
    exports: [],
})
export class PostgraphileModule implements NestModule {
    constructor(
    ) { }
    public configure(consumer: MiddlewareConsumer) {
        const poolConfig: PoolConfig = {
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
        };
        const PostGraphileUploadFieldPlugin = require('postgraphile-plugin-upload-field');
        const ConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');

        consumer
            .apply(postgraphile(poolConfig, ['nd', 'nd_private'], {
                graphiql: true,
                graphiqlRoute: '/graphiql',
                enableCors: true,
                pgDefaultRole: 'nd_anonymous',
                jwtSecret: 'nd_keyboard_kitten',
                jwtPgTypeIdentifier: 'nd.jwt_token',
                extendedErrors: ['detail', 'code'],
                disableQueryLog: false,
                appendPlugins: [PostGraphileUploadFieldPlugin, ConnectionFilterPlugin],
                graphileBuildOptions: {
                    uploadFieldDefinitions: [
                        {
                            match: (info: any) => {
                                return info.column === 'avatar_url';
                            },
                            resolve: this.resolveUpload,
                        },
                    ],
                },
            })).forRoutes({ path: 'graphiql', method: RequestMethod.GET }, { path: 'graphql', method: RequestMethod.POST });
    }

    private async resolveUpload(upload: any) {
        const { filename, createReadStream } = upload;
        const stream = createReadStream();

        const timestamp = new Date().toISOString().replace(/\D/g, '');
        const id = `${timestamp}_${filename}`;
        const filepath = path.join(UPLOAD_DIR_NAME, id);
        const fsPath = path.join(process.cwd(), filepath);
        const rs = await new Promise<{ id: string, filepath: string }>((resolve, reject) =>
            stream
                .on('error', (error: any) => {
                    if (stream.truncated) {
                        // Delete the truncated file
                        fs.unlinkSync(fsPath);
                    }
                    reject(error);
                })
                .on('end', () => resolve({ id, filepath }))
                .pipe(fs.createWriteStream(fsPath)),
        );

        // Save file to the local filesystem
        // const { filepath } = await this.saveLocal(stream, filename);
        // Return metadata to save it to Postgres
        return rs.filepath;
    }
}
