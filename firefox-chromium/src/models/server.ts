export interface IServer {
    id: string;
    name: string;
    host: string;
    port: number;
    secure: boolean;
    secret: string;
    path: string;
}

export class Server {
    static new(id: string): IServer {
        const server = {} as IServer;
        server.id = id;
        server.name = "Localhost";
        server.secure = false;
        server.host = "localhost";
        server.port = 6800;
        server.path = "/jsonrpc";
        server.secret = "";
        return server;
    }

    static toJSON(server: IServer): string {
        return JSON.stringify(server);
    }

    static fromJSON(server: string): IServer {
        return JSON.parse(server);
    }
}
