import { useUser } from './User';
import SignIn from './SigIn';

export default function ({ children }) {
  const user = useUser();
  if (!user) return <SignIn />;
  return children;
}
