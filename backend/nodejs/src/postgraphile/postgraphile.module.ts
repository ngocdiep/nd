import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import postgraphile from 'postgraphile';
import { ConfigService } from '../config.service';
import { ConfigModule } from '../config.module';
import { PoolConfig } from 'pg';
const UPLOAD_DIR_NAME = 'storage/files';

@Module({
    imports: [ConfigModule],
    providers: [],
    controllers: [
    ],
    exports: [],
})
export class PostgraphileModule implements NestModule {
    constructor(
        private configService: ConfigService,
    ) {

    }
    public configure(consumer: MiddlewareConsumer) {
        /* const dbUrl = 'postgres://' + this.configService.get('DATABASE_USER') + ':' + this.configService.get('DATABASE_PASSWORD')
            + '@' + this.configService.get('DATABASE_HOST') +
            ':' + this.configService.get('DATABASE_PORT') + '/' + this.configService.get('DATABASE_NAME'); */

        const p: PoolConfig = {
            user: 'nd_postgraphile',
            password: 'Abcd1234',
            database: 'nd',
            host: '/cloudsql/nd-app-241203:asia-southeast1:nd-app-db',
        };
        const dbUrl = 'postgresql://nd_postgraphile:Abcd1234@host/nd?socket=/cloudsql/nd-app-241203:asia-southeast1:nd-app-db';
        const PostGraphileUploadFieldPlugin = require('postgraphile-plugin-upload-field');
        consumer
            .apply(postgraphile(p, ['nd', 'nd_private'], {
                graphiql: true,
                graphiqlRoute: '/graphiql',
                enableCors: true,
                pgDefaultRole: 'nd_anonymous',
                jwtSecret: 'nd_keyboard_kitten',
                jwtPgTypeIdentifier: 'nd.jwt_token',
                extendedErrors: ['detail', 'code'],
                appendPlugins: [PostGraphileUploadFieldPlugin],
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
