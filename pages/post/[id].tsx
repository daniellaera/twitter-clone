import { LinearProgress } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { PostDetail } from '../../components/PostDetail';
import prisma from '../../lib/prisma';

// pages/post/[id].tsx

// export const getStaticPaths: GetStaticPaths = async () => {
//   // Fetch existing posts from the database
//   const posts = await prisma.post.findMany();

//   // Get the paths we want to pre-render based on posts
//   const paths = posts.map(post => ({
//     params: { id: String(post.id) }
//   }));

//   return {
//     paths,
//     // If an ID is requested that isn't defined here, fallback will incrementally generate the page
//     fallback: true
//   };
// };

// This also gets called at build time
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const id = Number(params.id);
//   const matchedPost = await prisma.post.findUnique({
//     where: {
//       id: id
//     },
//     include: {
//       author: {
//         select: {
//           username: true,
//           id: true
//         }
//       },
//       likes: {
//         select: {
//           id: true,
//           author: {
//             select: {
//               username: true,
//               id: true
//             }
//           }
//         }
//       },
//       comments: {
//         select: {
//           text: true,
//           id: true,
//           author: {
//             select: {
//               username: true,
//               id: true
//             }
//           }
//         }
//       }
//     }
//   });
//   return {
//     props: { post: matchedPost },
//     revalidate: 1
//   };
// };

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = Number(params?.id);
  const matchedPost = await prisma.post.findUnique({
    where: {
      id: id
    },
    include: {
      author: {
        select: {
          email: true,
          id: true
        }
      },
      likes: {
        select: {
          id: true,
          author: {
            select: {
              email: true,
              id: true
            }
          }
        }
      },
      comments: {
        select: {
          text: true,
          id: true,
          author: {
            select: {
              email: true,
              id: true
            }
          }
        }
      }
    }
  });
  return {
    props: { post: matchedPost }
  };
};

interface CommentProps {
  id: number;
  createdAt: Date;
  text: string;
  postId: number;
  post: PostProps;
  authorId: number;
  author: AuthorProps;
  length: any;
  map: any;
}

interface LikeProps {
  id: number;
  createdAt: Date;
  postId: number;
  post: PostProps;
  authorId: number;
  author: AuthorProps;
  length: any;
}

interface AuthorProps {
  id: number;
  createdAt: Date;
  email: string;
  password: string;
  imageUrl: string;
}

interface PostProps {
  id: number;
  createdAt: Date;
  text: string;
  authorId: number;
  author: AuthorProps;
  comments: CommentProps;
  likes: LikeProps;
}

interface PostIdProps {
  post: PostProps;
}

const Detail = ({ post }: PostIdProps) => {
  return post ? <PostDetail pst={post} id={post.id} authorId={post.authorId} /> : <LinearProgress />;
};

export default Detail;
