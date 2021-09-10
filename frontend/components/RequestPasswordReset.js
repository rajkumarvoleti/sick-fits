import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import Form from './styles/Form';
import useForm from '../lib/useForm';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
      __typename
    }
  }
`;

const FIND_USER_QUERY = gql`
  query FIND_USER_QUERY($email: String!) {
    allUsers(where: { email: $email }) {
      name
    }
  }
`;

export default function RequestPasswordReset() {
  const [user, setUser] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });
  const [signup, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    { variables: inputs }
  );

  const { data: userData } = useQuery(FIND_USER_QUERY, { variables: inputs });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (userData.allUsers.length === 1) setUser(true);
    else setUser(false);
    const res = await signup().catch(console.error());
  }
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Request For a password Reset</h2>
      {user && <p>Success! Check your email for a link</p>}
      {!user && submitted && <p>There is no account with that email</p>}
      <fieldset disabled={loading} aria-busy={loading}>
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
        <button type="submit">Request</button>
      </fieldset>
    </Form>
  );
}
