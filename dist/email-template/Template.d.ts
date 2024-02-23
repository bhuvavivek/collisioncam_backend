import { PaymentDetails, UsernamePassword } from "../interfaces/template.interface";
export declare const sendPayemntLinkTemplate: ({ amount, duration, paymentLink, userName, }: PaymentDetails) => string;
export declare const rejectedTemplete: () => string;
export declare const sendRenewLinkTemplate: ({ amount, duration, paymentLink, userName, }: PaymentDetails) => string;
export declare const sendIdPassword: ({ username, password }: UsernamePassword) => string;
export declare const renewSuccess: ({ username, password }: UsernamePassword) => string;
export declare const sendSubmitionSuccess: ({ username, }: {
    username: string;
}) => string;
export declare const subscriptionForm: ({ full_name, phone, companyName, website, industry, address, promotionMethod, comments, email, }: {
    full_name?: string;
    phone?: string;
    companyName?: string;
    website?: string;
    industry?: string;
    address?: string;
    promotionMethod?: string;
    comments?: string;
    email?: string;
}) => string;
export declare const partnerForm: ({ full_name, phone, address, comment, email, promotion, }: {
    full_name?: string;
    phone?: string;
    address?: string;
    promotion?: string;
    comment?: string;
    email?: string;
}) => string;
export declare const forgotpasswordTemplete: ({ url, }: {
    url?: string;
}) => string;
export declare const ApproveTemplete: ({ type, username, }: {
    type?: string;
    username: string;
}) => string;
export declare const rejectTemplete: ({ type, username, }: {
    type?: string;
    username: string;
}) => string;
export declare const requestForFreeApproved: ({ link, username, }: {
    link?: String;
    username: string;
}) => string;
