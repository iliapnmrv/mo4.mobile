import {useDispatch} from 'react-redux';
import {bindActionCreators} from '@reduxjs/toolkit';
import {inventoryActions} from 'redux/inventory/inventory.slice';
import {docsActions} from 'redux/docs/docs.slice';
import {scanActions} from 'redux/slices/scan.slice';
import {settingsActions} from 'redux/slices/settings.slice';

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
