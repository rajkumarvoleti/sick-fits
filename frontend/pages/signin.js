import styled from 'styled-components';
import RequestPasswordReset from '../components/RequestPasswordReset';
import SignIn from '../components/SigIn';
import SignUp from '../components/SignUp';

const GridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
`;

export default function SignInPage() {
  return (
    <GridStyles>
      <SignIn />
      <SignUp />
      <RequestPasswordReset />
    </GridStyles>
  );
}
