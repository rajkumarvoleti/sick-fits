import { useRouter } from 'next/dist/client/router';
import RequestPasswordReset from '../components/RequestPasswordReset';
import Reset from '../components/Reset';

export default function ResetPage() {
  const router = useRouter();
  const token = router?.query?.token;
  if (!token) {
    return (
      <div>
        <p>Sorry you must supply a token</p>
        <RequestPasswordReset />
      </div>
    );
  }
  return (
    <div>
      <Reset token={token} />
    </div>
  );
}
