import { LinearProgress } from '@material-ui/core';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
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
  const id = Number(params.id);
  const matchedPost = await prisma.post.findUnique({
    where: {
      id: id
    },
    include: {
      author: {
        select: {
          username: true,
          id: true
        }
      },
      likes: {
        select: {
          id: true,
          author: {
            select: {
              username: true,
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
              username: true,
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

const Detail = ({ post }) => {
  return post ? <PostDetail pst={post} id={post.id} /> : <LinearProgress />;
};

export default Detail;
