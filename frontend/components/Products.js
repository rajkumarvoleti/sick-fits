import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Product from './Product';
import { perPage } from '../config';

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($skip: Int = 0, $first: Int) {
    allProducts(first: $first, skip: $skip) {
      id
      name
      description
      price
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 50px;
`;

export default function Products({ page }) {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      skip: (page - 1) * perPage,
      first: perPage,
    },
  });
  if (loading) return <p>loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  return (
    <div>
      <ProductList>
        {data?.allProducts?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ProductList>
    </div>
  );
}
