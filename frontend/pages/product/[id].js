import { useRouter } from 'next/router';
import SingleProduct from '../../components/SingleProduct';

export default function SingleProductPage() {
  const router = useRouter();
  const { id } = router.query;

  return <SingleProduct id={id} />;
}
