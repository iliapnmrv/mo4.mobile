import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Docs from 'pages/docs/Docs';
import PageHeader from 'components/PageHeader/PageHeader';
import DocsEdit from 'pages/docs/DocsEdit';

export type DocsParamList = {
  Docs: undefined;
  DocsEdit: {id: number; title: string};
};

const DocsStack = () => {
  const DocsNav = createStackNavigator<DocsParamList>();
  return (
    <DocsNav.Navigator initialRouteName="Docs">
      <DocsNav.Screen
        name="Docs"
        component={Docs}
        options={{
          title: 'Документооборот',
          // header: props => <PageHeader {...props} />,
          header: props => <></>,
        }}
      />
      <DocsNav.Screen
        name="DocsEdit"
        component={DocsEdit}
        options={({route}) => ({
          title: route.params.title,
          header: props => <PageHeader {...props} />,
        })}
      />
    </DocsNav.Navigator>
  );
};

export default DocsStack;
