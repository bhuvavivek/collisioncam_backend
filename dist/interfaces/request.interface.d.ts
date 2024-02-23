export interface RequestInterface {
    _id: string;
    full_name: string;
    email: string;
    phone: string;
    footageName: string;
    footageId: string;
    reason: string;
    partneredLawFirms: string;
    documents: {
        url: string;
        publicKey: string;
    }[];
    createdAt: string;
    aboutUs: string;
}
