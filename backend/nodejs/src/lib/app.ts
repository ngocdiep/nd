import * as bodyParser from "body-parser";
import express from "express";
import { Routes } from "./routes/crmRoutes";
import path from 'path';
import postgraphile from 'postgraphile';
import fs from 'fs';
const { graphqlUploadExpress } = require('graphql-upload');
const PostGraphileUploadFieldPlugin = require("postgraphile-plugin-upload-field");

const UPLOAD_DIR_NAME = "uploads";

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // Serve uploads as static resources
        this.app.use(`/${UPLOAD_DIR_NAME}`, express.static(path.resolve(UPLOAD_DIR_NAME)));
        // Attach multipart request handling middleware
        this.app.use(graphqlUploadExpress());

        this.app.use(
            postgraphile("postgres://nd_postgraphile:Abcd1234@localhost:5433/nd", ["nd", "nd_private"], {
                graphiql: true,
                enableCors: true,
                pgDefaultRole: 'nd_anonymous',
                jwtSecret: 'nd_keyboard_kitten',
                jwtPgTypeIdentifier: 'nd.jwt_token',
                extendedErrors: ['detail', 'code'],
                appendPlugins: [PostGraphileUploadFieldPlugin],
                graphileBuildOptions: {
                    uploadFieldDefinitions: [
                        {
                            match: (column: any) => {
                                column === "avatar_url"
                            },
                            resolve: this.resolveUpload
                        }
                    ]
                }
            })
        );
    }


    private async resolveUpload(upload: any) {
        const { filename, createReadStream } = upload;
        const stream = createReadStream();
        // Save file to the local filesystem
        const { filepath } = await this.saveLocal(stream, filename);
        // Return metadata to save it to Postgres
        return filepath;
    }

    private saveLocal(stream: any, filename: any) {
        const timestamp = new Date().toISOString().replace(/\D/g, "");
        const id = `${timestamp}_${filename}`;
        const filepath = path.join(UPLOAD_DIR_NAME, id);
        const fsPath = path.join(process.cwd(), filepath);
        return new Promise<{id: string, filepath: string}>((resolve, reject) =>
            stream
                .on("error", (error: any) => {
                    if (stream.truncated)
                        // Delete the truncated file
                        fs.unlinkSync(fsPath);
                    reject(error);
                })
                .on("end", () => resolve({ id, filepath }))
                .pipe(fs.createWriteStream(fsPath))
        );

    }
}

export default new App().app;