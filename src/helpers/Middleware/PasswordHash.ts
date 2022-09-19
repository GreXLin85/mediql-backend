import { Prisma, User } from "@prisma/client";
import HashHelper from "../HashHelper";

export default async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    // Manipulate params here
    if (params.model === 'User') {
        switch (params.action) {
            case "create":
                params.args.data.password = await HashHelper.hash(params.args.data.password);
                break;
            case 'createMany':
                params.args.data.forEach(async (user: User) => {
                    user.password = await HashHelper.hash(user.password);
                });
                break;
            case "update":
            case 'updateMany':
                if (params.args.data.password) {
                    params.args.data.password = await HashHelper.hash(params.args.data.password);
                }
                break;
            case 'findUnique':
            case 'findFirst':
                console.log(params);
                
                if (params.args.where.password) {
                    params.args.where.password = await HashHelper.hash(params.args.where.password);
                }
                break;
        }
    }

    const result = await next(params)
    
    return result
}