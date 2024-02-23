/// <reference types="node" />
export declare function testConnection(): Promise<void>;
export declare function uploadFile(bucketName: string, fileName: string, fileContent: Buffer, contentType?: string): Promise<string>;
export declare function deleteFile(bucketName: string, fileName: string): Promise<void>;
export declare function uploadAndPushFile(folder: any, file: any, fileName: any, uniqueParameter: any): Promise<unknown>;
