/** @format */

import { Provider } from 'react-redux';
import store from '@/store';

interface Props {
	children?: React.ReactNode;
}

const ReduxProvider = (props: Props) => {
	const { children } = props;
	return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
