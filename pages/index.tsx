import { CreatePostForm } from '../components/CreatePostForm';
import { Post } from '../components/Post';
import { SignupForm } from '../components/SignupForm';
import { useMe } from '../utils/hooks';

export type PaletteMode = 'light' | 'dark';

export default function Page() {
  const { me } = useMe();
  if (!me) return null;

  // const toggleDarkTheme = () => {

  return (
    <>
      {!me.username ? <SignupForm /> : null}
      <CreatePostForm />
      <Post />
    </>
  );
}
