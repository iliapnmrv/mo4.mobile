import {useDispatch} from 'react-redux';
import {bindActionCreators} from '@reduxjs/toolkit';
import {inventoryActions} from 'store/inventory/inventory.slice';
import {docsActions} from 'store/docs/docs.slice';
import {scanActions} from 'store/slices/scan.slice';
import {settingsActions} from 'store/slices/settings.slice';

const actions = {
  ...inventoryActions,
  ...docsActions,
  ...scanActions,
  ...settingsActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
