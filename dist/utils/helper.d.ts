declare class Helper {
    getSignedUrlAWS(fileName: any, signedUrlExpireSeconds?: number): Promise<string>;
    deleteObjectAWS(fileName: any): Promise<void>;
    generateHash(): Promise<string>;
    generateOTP(): Promise<number>;
    sendSMS(to: string, message: string): Promise<void>;
    sendEmail(to: string, subject: string, content: any): Promise<void>;
    mailStaticTemplates(type: string, userData: any): Promise<void>;
    getTimeStops(minutes: number, start: string, end: string): Promise<any[]>;
    userObj(findUser: any): Promise<any>;
}
declare const _default: Helper;
export default _default;
export declare const createRandomBytes: () => Promise<unknown>;
export declare function encodeSecretToken(randomBytes: any, paymentId: any): string;
export declare function decodeSecretToken(secretToken: any): {
    randomBytes: string;
    paymentId: string;
};
export declare function getISOWeek(date: Date): number;
