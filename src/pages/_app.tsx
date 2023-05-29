import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import wrapper from '@/reducers';
import Layout from '@/components/Layout';

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Layout>
        <Component {...props.pageProps} />
      </Layout>
    </Provider>
  );
}
