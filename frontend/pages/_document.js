import Document, { Html, Head, NextScript, Main } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-CA">
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
