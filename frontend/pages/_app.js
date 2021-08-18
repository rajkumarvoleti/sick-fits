/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import Page from '../components/Page';

export default function MyApp({ Component, pageProps }) {
  return (
    <Page>
      <Component {...pageProps} />
    </Page>
  );
}
