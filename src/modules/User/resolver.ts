import { User } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';
import { ApolloError } from 'apollo-server-express';
import { Context } from '../../helpers/ContextBuilder';
import HashHelper from '../../helpers/HashHelper';

export default {
    Mutation: {
        createUser: async (_: any, args: { user: User }, context: Context) => {
            const user = await context.prisma.user.create({ data: args.user });
            return user;
        },
        updateUser: async (_: any, args: { id: number, user: User }, context: Context) => {
            const user = await context.prisma.user.update({
                where: { id: args.id },
                data: args.user
            });
            return user;
        },
        deleteUser: async (_: any, args: { id: number }, context: Context) => {
            const user = await context.prisma.user.delete({
                where: { id: args.id }
            });
            return user;
        },
        login: async (_: any, args: { email: string, password: string }, context: Context) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email }
            });
            if (!user) {
                throw new ApolloError('User not found');
            }
            if (await HashHelper.compare(args.password, user.password)) {
                throw new AuthenticationError('Wrong password');
            }
            return {
                token: context.jwt.sign(user.id),
                user: user
            };
        },
        signup: async (_: any, args: { user: User }, context: Context) => {
            const user = await context.prisma.user.create({ data: args.user });
            return {
                token: context.jwt.sign(user.id),
                user: user
            };
        }
    },
    Query: {
        user: async (parent: any, args: { id: number }, context: Context, info: any) => {
            let user = await context.prisma.user.findUnique({
                where: {
                    id: args.id
                }
            });

            if (!user) {
                throw new ApolloError('User not found', '404');
            }

            return user;
        },
        users: async (parent: any, args: { skip: number, take: number }, context: Context, info: any) => {
            let users = await context.prisma.user.findMany({
                skip: args.skip,
                take: args.take
            });

            return users;
        }
    },
    User: {
        posts: async (parent: User, args: any, context: Context, info: any) => {
            let userPosts = await context.prisma.user.findUnique({
                where: {
                    id: parent.id
                }
            }).posts();

            return userPosts;
        },
        likedPosts: async (parent: User, args: any, context: Context, info: any) => {
            let userLikedPosts = await context.prisma.user.findUnique({
                where: {
                    id: parent.id
                }
            }).likes();

            return userLikedPosts;
        }
    }
};