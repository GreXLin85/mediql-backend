import { ApolloError } from 'apollo-server-express';
import { Context } from '../../helpers/ContextBuilder';

export default {
    Mutation: {
        likePost: async (_: any, args: { postId: number, userId: number }, context: Context) => {
            const postLike = await context.prisma.postLike.create({
                data: {
                    postId: args.postId,
                    userId: args.userId
                }
            });
            return postLike;
        },
        unlikePost: async (_: any, args: { postId: number, userId: number }, context: Context) => {
            const postLike = await context.prisma.postLike.delete({
                where: {
                    postId_userId: {
                        postId: args.postId,
                        userId: args.userId
                    }
                }
            });
            return postLike;
        }
    },
    Query: {
        postLike: async (parent: any, args: { id: number }, context: Context) => {
            const postLike = await context.prisma.postLike.findUnique({
                where: {
                    id: args.id
                }
            });

            if (!postLike) {
                throw new ApolloError('PostLike not found', '404');
            }

            return postLike;
        },
        postLikes: async (parent: any, args: { skip: number, take: number }, context: Context) => {
            const postLikes = await context.prisma.postLike.findMany({
                skip: args.skip,
                take: args.take
            });

            return postLikes;
        }
    },
    PostLike: {
        user: async (parent: any, args: any, context: Context) => {
            const user = await context.prisma.postLike.findUnique({
                where: {
                    id: parent.userId
                }
            }).user();

            return user;
        },
        post: async (parent: any, args: any, context: Context) => {
            const post = await context.prisma.postLike.findUnique({
                where: {
                    id: parent.userId
                }
            }).post();

            return post;
        }
    },
};