import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import postgraphile from 'postgraphile';

const PostGraphileUploadFieldPlugin = require('postgraphile-plugin-upload-field');
const UPLOAD_DIR_NAME = 'storage/files';

@Module({
    imports: [],
    providers: [],
    controllers: [
    ],
    exports: [],
})
export class PostgraphileModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(postgraphile('postgres://nd_postgraphile:Abcd1234@db:5432/nd', ['nd', 'nd_private'], {
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
                                console.log('info.column: ', info.column);
                                return info.column === 'avatar_url';
                            },
                            resolve: this.resolveUpload
                        },
                    ],
                },
            })).forRoutes({ path: 'graphiql', method: RequestMethod.GET }, { path: 'graphql', method: RequestMethod.POST });
    }

    private async resolveUpload(upload: any) {
        console.log('upload: ', upload);

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
        console.log('filepath: ' + rs.filepath);

        return rs.filepath;
    }
}
