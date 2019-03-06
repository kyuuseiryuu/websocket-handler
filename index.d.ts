
export declare interface Connection {
    key: string;
    [name: string]: any;
}
export declare interface BroadCastCallback {
    (connection: Connection): void
}
export declare interface EventCallback {
    (conn: Connection): void;
}
export interface Message {
    [key: string]: any;
}
export interface Events {
    create (connection: Connection): void;
    error (connection: Connection): void;
    close (connection: Connection): void;
    onJson (message: Message, connection: Connection): void;
    onMessage (message: string, connection: Connection): void,
    beforeJoin (connection: Connection): void,
    afterJoin (connection: Connection): void,
    beforeQuit (connection: Connection): void,
    afterQuit (connection: Connection): void,
}
export interface ActionCallback {
    (message: Message, from: Connection): boolean|void;
}
export interface ActionMap {
    [actionName: string]: ActionCallback;
}

export interface Handler {
    broadcast(callback: BroadCastCallback): void;
    getAllConnectionsKey(): string[];
    getAllConnectionsKey(): string[];
    setEventListener(eventName: string, callback: EventCallback): string[];
    get(connectionKey: string): Connection;
    listen(port: number, host: string, callback: Function): void;
    sendMessage(message: Message, connection: Connection): void;
    setAction(actionName: string, callback: ActionCallback): void;
    setActionMap(map: ActionMap): void;
}

export default Handler;

