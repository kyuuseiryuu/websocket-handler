
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
    (connection: Connection): boolean;
}
export interface ActionMap {
    [actionName: string]: ActionCallback;
}

declare namespace handler {
    function broadcast(callback: BroadCastCallback): void;
    function getAllConnectionsKey(): string[];
    function getAllConnectionsKey(): string[];
    function setEventListener(eventName: string, callback: EventCallback): string[];
    function get(connectionKey: string): Connection;
    function listen(port: number, host: string, callback: Function): void;
    function sendMessage(message: Message, connection: Connection): void;
    function setAction(actionName: string, callback: ActionCallback): void;
    function setActionMap(map: ActionMap): void;
}

export = handler;
