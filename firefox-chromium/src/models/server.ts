export interface IServer {
    key: string;
    name: string;
    host: string;
    port: number;
    secure: boolean;
    secret: string;
    path: string;
    capture: boolean;
    rpcParameters: any
}

export class Server {
    static new(key: string): IServer {
        const server = {} as IServer;
        server.key = key;
        server.name = "Localhost";
        server.secure = false;
        server.host = "localhost";
        server.port = 6800;
        server.path = "/jsonrpc";
        server.secret = "";
        server.capture = false;
        server.rpcParameters = {}
        return server;
    }

    static toJSON(server: IServer): string {
        return JSON.stringify(server);
    }

    static fromJSON(server: string): IServer {
        return JSON.parse(server);
    }
}
