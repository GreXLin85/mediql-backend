import { Context } from '../../helpers/ContextBuilder';

interface PostCreateInput {
    title: string;
    content: string;
    authorId: number;
    published: boolean;
}
interface PostUpdateInput extends PostCreateInput {
    viewCount: number;
}

export default {
    Mutation: {
        createPost: async (_: any, args: { post: PostCreateInput }, context: Context) => {
            const { post } = args;
            const newPost = await context.prisma.post.create({
                data: {
                    title: post.title,
                    content: post.content,
                    published: post.published,
                    authorId: post.authorId,
                },
            });
            return newPost;
        },
        updatePost: async (_: any, args: { id: number; post: Partial<PostUpdateInput> }, context: Context) => {
            const { id, post } = args;
            const updatedPost = await context.prisma.post.update({
                where: { id },
                data: post,
            });
            return updatedPost;
        },
        deletePost: async (_: any, args: { id: number }, context: Context) => {
            const { id } = args;
            const deletedPost = await context.prisma.post.delete({
                where: { id },
            });
            return deletedPost;
        },
    },
    Query: {
        posts: async (_: any, args: { skip: number; take: number }, context: Context) => {
            const { skip, take } = args;
            const posts = await context.prisma.post.findMany({
                skip,
                take,
            });
            return posts;
        },
        post: async (_: any, args: { id: number }, context: Context) => {
            const { id } = args;
            const post = await context.prisma.post.findUnique({
                where: { id },
            });
            return post;
        }
    },
    Post: {
        likeCount: async (parent: any, args: any, context: Context) => {
            // Count of posts likes
            const likes = await context.prisma.post.findUnique({
                select: {
                    _count: {
                        select: { likes: true },
                    },
                },
                where: { id: parent.id },
            })
            
            return likes?._count.likes;
        },
        likedBy: async (parent: any, args: any, context: Context) => {
            // Users who liked the post
            const likedBy = await context.prisma.post.findUnique({
                where: {
                    id: parent.id
                }
            }).likes();

            return likedBy;
        },

    },
};