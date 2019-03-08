
export declare interface Connection {
    key: string;
    [name: string]: any;
}
export declare interface BroadCastCallback {
    (connection: Connection): void
}

export interface Message {
    [key: string]: any;
}

export interface LifeCycleEventCallBack {
    (conn: Connection, allConnectionKeys: string[]):  void;
}

export interface MessageEventCallBack {
    (message: Message | any, connection: Connection):  void;
}

export interface ActionCallback {
    (message: Message | any, from: Connection): boolean|void;
}

export interface ActionMap {
    [actionName: string]: ActionCallback;
}

export enum Event {
    CREATE = 'create',
    ERROR = 'error',
    CLOSE = 'close',
    ON_JSON = 'onJson',
    ON_MESSAGE ='onMessage',
    BEFORE_JOIN = 'beforeJoin',
    AFTER_JOIN = 'afterJoin',
    BEFORE_QUIT = 'beforeQuit',
    AFTER_QUIT = 'afterQuit',
}

export interface Handler {
    broadcast(callback: BroadCastCallback): void;
    getAllConnectionsKey(): string[];
    getAllConnectionsKey(): string[];
    setEventListener(eventName: Event | string, callback: LifeCycleEventCallBack | MessageEventCallBack): string[];
    get(connectionKey: string): Connection;
    listen(port: number, host: string, callback: Function): void;
    sendMessage(message: Message, connection: Connection): void;
    setAction(actionName: string, callback: ActionCallback): void;
    setActionMap(map: ActionMap, actionKey?: string): void;
}

declare const handler: Handler;

export default handler;

