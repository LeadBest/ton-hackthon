/** @format */

import { useDispatch, useSelector } from 'react-redux';
import { globalActions } from '@/store/default.slice';
import { Dialog, Snackbar } from '@/uiComponents';
import { getGlobal } from '@/store/states';
import { useNavigate } from 'react-router-dom';

const AppPlugins: React.FC = () => {
	const globalStore = useSelector(getGlobal);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<>
			<Dialog
				{...globalStore.dialog}
				dialogBorder={true}
				actionFullWidth={true}
				actionColumn={true}
				actionColumnReverse={false}
				buttonSize={'large'}
				onClose={() => {
					if (typeof globalStore.dialog.closeHandle === 'function') {
						globalStore.dialog.closeHandle(dispatch, navigate);
					} else {
						dispatch(globalActions.toogleDialog({ visible: false }));
					}
				}}
				onConfirm={() => {
					if (typeof globalStore.dialog.confirmHandle === 'function') {
						globalStore.dialog.confirmHandle(dispatch, navigate);
					} else {
						dispatch(globalActions.toogleDialog({ visible: false }));
					}
				}}
				onCancel={() => {
					if (typeof globalStore.dialog.cancelHandle === 'function') {
						globalStore.dialog.cancelHandle(dispatch, navigate);
					} else {
						dispatch(globalActions.toogleDialog({ visible: false }));
					}
				}}
			/>
			<Snackbar
				{...globalStore.snackbar}
				onlyUseDefaultBackground={false}
				defaultAnchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				defaultAutoHideDuration={3000}
				contentColor="#fff"
				onClose={() => {
					/* if(typeof global.snackbar.closeHandle === 'function') {
            global.snackbar.closeHandle(dispatch, navigate)
          } else {
            dispatch(globalActions.snackbarRequest({visible: false}))
          } */
				}}
			/>
		</>
	);
};

export default AppPlugins;
