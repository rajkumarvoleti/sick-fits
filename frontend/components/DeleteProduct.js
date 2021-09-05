import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

export const DELETE_PRODUCT = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT, {
    variables: { id },
    update,
  });
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Are you sure?')) {
          // Delete it
          deleteProduct().catch((err) => alert(err.msg));
          alert('deleted');
        }
      }}
    >
      {children}
    </button>
  );
}
