import { useRouter } from 'next/dist/client/router';
import UpdateProduct from '../components/UpdateProduct';

export default function UpdatePage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <UpdateProduct id={id} />
    </div>
  );
}
