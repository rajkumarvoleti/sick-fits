import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const [successError, setError] = useState(undefined);
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });
  // console.log(data);

  async function handleSubmit(e) {
    e.preventDefault();
    if (inputs.password.length < 8) {
      setError({ message: 'Password is too weak' });
      return;
    }
    setError(
      data?.redeemUserPasswordResetToken?.code
        ? data?.redeemUserPasswordResetToken
        : undefined
    );
    if (data?.redeemUserPasswordResetToken === null) setError(undefined);
    try {
      const res = await reset().catch(console.error());
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! You can Now signin</p>
        )}
        <DisplayError error={error || successError} />
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
}

// {
//   itemId: '6137513285708f00522ec25c',
//   identity: 'raj@gmail.com',
//   token: 'tZ9mqy1qcf7FhhReN6pP'
// }
