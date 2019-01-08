import { App } from 'containers';
import { NotFound } from 'components';
import Todos from './Todos';
import Other from './Other';

export default function createRoutes(store) {
  return [
    {
      path: '/',
      name: 'Home',
      component: App,
      indexRoute: { onEnter: (nextState, replace) => replace('/todos') },
      childRoutes: [
        Other(),
      ],
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
    },
  ];
}
