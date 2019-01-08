BOILERPLATE
===============

## Running the site locally

This assumes you have a virtual environment and nodejs setup already.
In order to get a virtual env setup, here is a good [article](http://docs.python-guide.org/en/latest/dev/virtualenvs/)

Steps to get setup:
1. [Install Yarn](https://yarnpkg.com/lang/en/docs/install/)
2. [Install Redux Devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) - This will be incredibly helpful for learning and following the actions, and state changes.
3. Run yarn install from the top-level directory to bring in required node modules:
```bash
yarn install
```
4. Build the javascript:
```bash
npm run build:dev
```
5. Run the aa ui/proxy server: see [boiler_plate/server/README.md](server/README.md)

As you develop, please notice that hot loading is running. This gives you the ability to update styles and javascript in realtime.

The site should now be active at <http://localhost:8000>

INSTRUCTIONS
=============

# Architecture

#### If you are new to react/redux

You may want to check out these articles to learn a bit more:

1. https://facebook.github.io/react/tutorial/tutorial.html 
2. https://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html

Read through the redux saga docs: https://github.com/redux-saga/redux-saga

Next, play around with any type of boilerplate - or play around with our own...
 
You should feel comfortable looking through things and playing.

Ours: https://github.com/6si/react-redux-gourmet-starterkit (recommended)

Other suggested boilerplates (no need to go through these, but always interesting):

 - https://github.com/facebookincubator/create-react-app
 - https://github.com/react-boilerplate/react-boilerplate
 - https://github.com/kriasoft/react-starter-kit
 - https://github.com/erikras/react-redux-universal-hot-example
 
 #### Architectural Elements

Have a general understanding of modularizing things and DUCKS architecture:
https://github.com/erikras/ducks-modular-redux

Have an understanding of fractal architecture:
https://github.com/davezuko/react-redux-starter-kit/wiki/Fractal-Project-Structure

Composition vs. Inheritance... React DOES NOT support inheritance. Read this article and check out this code:
https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e

https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/HOCS/LoadComponent/index.js 
(Our own HOC component)

#### ROUTES:
Each route should have a components folder, containers folder, modules file (reducers, actions), sagas file, and its own index file for defining the route.

Sub-Routes will not load until the required data in the parent route has been loaded.  This is a progressive loading architecture and works very well as an application scales.  In the hierarchy of routes and sub-routes, the sub-route will not load until its parent has loaded.  Since many of the parents are wrapped in a state-component, this means an error state or loading state hijacks and stops the rendering of its children.  As a result, the child route does not load until the parent route is ready.  Once a new sub-route is ready, the component is loaded asynchronously via the getComponent command as shown here: 
https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/routes/Todos/index.js#L13. 
Once it loads, the reducer and saga will be injected and available to the store.  The load component HOC is what then will call the load command from the modules.js folder to initiate the api calls for the route.

This injection makes code-splitting possible.  Via codes-plitting, we are able to achieve small JS files, and they are loaded on demand.

#### REDUCERS AND SAGAS:
https://github.com/redux-saga/redux-saga

Each sub-route injects its reducer and sagas. The key in the store is never nested, the store is always flat.

Reducers and sagas that are shared across the application belong at the TOP LEVEL in the modules folder.

Reducers and sagas that are shared across a route are at the ROUTE level for sub-routes to share.

#### COMPONENTS:
React does not support inheritance. HOCs are the way to go. See example above.  

Each component has its own CSS file.

Do not try and add a ton of render functions in a single component.  Usually put a render function into a new component, otherwise things get crazy.  Trust me - this has been the cause of a LOT of headaches .  SMALL, SIMPLE components with one render are optimal.

Try to always use functional pure components. Stay away from class components.  Use the class component if you absolutely need to - but usually a HOC can take care of it instead.  Functional components forces you to write good code.

Re-usable components and containers belong at the top level of the application.

#### CSS:

Try to avoid nesting. This compiles into a lot of code.  Keep things FLAT.  Use variables for colors and font sizes.  Import it as shown in this example:
https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/components/GenericCard/GenericCard.module.scss#L1

Variables are stored here:
https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/styles/_base.scss

For flexbox and responsive design - try and stick to using react-flexbox-grid.  Our example app is using this everywhere and importing Row, and Col components.  Documentation is here: 
https://roylee0704.github.io/react-flexbox-grid/

Need icons?? Font awesome is included in this bundle.  Just add the appropriate class, ie. 'fa fa-shower'

#### SUB REDUCERS:

Try not to just build one massive reducer. Remember, a reducer can be composed of sub-reducers.  For example, a page may have its page reducer.  Additionally, if you are building a todo app, it should have a TODO sub-reducer and even possibly a TODO list sub-reducer.

See sub-reducer example here:
https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/routes/Todos/routes/Manage/modules.js#L17 (todoReducer is a sub-reducer of the ManageReducer).

When deciding if a sub reducer is appropriate for your app, a good indicator is how nested your store is. If highly nested, this is a good use case for a sub-reducer. You can pass nested areas of your store to sub-reducers which make it much easier to "unpack" the store object.

#### SELECTORS:
Selectors provide a "filter" level between your store and your component. Selectors serve to both "grab" a portion of the store that is pertinent to a component as well as any reorganization of the store.

Keep your store AS PURE AS POSSIBLE. It's your source of truth.  Don't muddle it, don't dirty it up.  If you need to filter, search, or organize, PLEASE use reselect.  

Duplication does not belong in the store. If you need to - you can also use normalizr: https://github.com/paularmstrong/normalizr

#### ASYNC LOGIC:

Async logic should exist ONLY in sagas.  We should have no async logic in any other location in the application.  IF you're adding async logic to something and it is not in a saga - you're doing things wrong.

#### PLAY WITH OUR NEW ARCHITECTURE:

https://github.com/6si/react-redux-gourmet-starterkit
Pull this down ^^^ and follow the readme.

#### GET TO KNOW OUR COMPONENT LIBRARY:

https://ant.design/
It's fun  I promise.

#### TIME TRAVEL AND REDUX DEVTOOLS:

Donwload the redux devtools chrome extension. This is an important tool and allows you to see each action dispatched, and the structure of your state.  It also allows you to rewind time or bring yourself back to a specific state change.

#### LINTING

You should run npm run lint in our boilerplate/example application.  For production react code, we do not accept unlinted code.  The lint command will fail if you are not linting properly.

#### Lodash

Lodash is javascript utility library. If you need to perform any sort of sorting or manipulation of objects and array, chances are lodash has it and will make your life much easier. Lodash also provides all their functions in curried, data-last form!  This is a curried example: 
https://github.com/6si/ntropy/blob/develop/aa/src/modules/segments/selectors.js#L183
Please use curried and not the chain function.  If you use chain, it imports the entire lodash library, which will be non-performant.

### EXPLANATION OF OUR EXAMPLE APP:

The example app has tried to put an example for how our architecture works.  Here are things to understand:

#### Src/Modules

These are reducers/sagas that are shared across the entire application.  You will see the user saga and global saga make server calls.  Unless these succeed, the application will not load and its children component will not show up.  Once these are finished loading, the children will get passed through:

https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/containers/App/App.js#L35 - this is responsible for the hijacking.  It will render a load component vs. children while the global calls are being made.

#### Src/Components

These are components that are re-usable across the entire application.  This example app includes many of these components and example usage.  A lot of these components are wrapping the antd library.

#### Src/Components/Text

Text that is displayed to the user should always be wrapped by our text component.  We use this because it is standardized and accepts color arguments, size arguments, and weight arguments.

#### Src/HOCS
The example app displays the usage of HOCs.  Please play and understand how the example app uses them.  You can find their use here and here:

https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/routes/Todos/containers/Todos.js#L62-L66

https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/routes/Todos/routes/Manage/containers/TodoView.js#L31

https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/routes/Todos/routes/Manage/containers/TodoView.js#L187-L192

Run the app locally, play around and understand.  You'll see there are a lot of buttons for you to play with the functionality of these HOCs (pagination, stateComponent all include loading, zero-state and errors)

#### Redux Form, Src/utils/validators, validation, and forms

You'll see the input in the example application automatically has errors on it and validation.  This is a perfect example of how you build a form or input system that has validation.  See our pre-built list of validators:
https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/utils/validators.js#L43

See its use in action here with the Field component wrapped by a Form.  You'll notice the view is wrapped in the Redux-Form HOC:

https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/routes/Todos/routes/Manage/containers/TodoView.js#L92-L107

Understand the use of decorators.forceError - 
https://github.com/6si/react-redux-gourmet-starterkit/blob/master/src/routes/Todos/routes/Manage/containers/TodoView.js#L106 - this shows the error immediately vs. waiting for a submit attempt or an unfocus action on the input.

#### Understand Progressive Loading:

Please understand via the application that you pulled down. The reload top level with error button. Notice that its children will never get called, loaded (nor its children's api calls from the sagas) until after the top level is loaded successfully.  This is all in place for you to understand fractal architecture and the mechanism of progressive loading.

#### Understand Proxy Server:

We are proxying to ourselves in this example app, but typically you will proxy to an internal API.  

https://github.com/6si/react-redux-gourmet-starterkit/tree/master/server/proxy - please understand the organization decorator.  This allows us to authenticate users before they access an internal service.  This way our internal services never have to worry about authentication. The internal service knows its requests are coming from the correct organization.

You'll see the proxy kicks in for our todos and bad request api call.  The api call comes in via api/todos and then gets forwarded to api/v1/todos → 
https://github.com/6si/react-redux-gourmet-starterkit/blob/master/server/proxy/urls.py#L8-L9  - In the real world you would never proxy to your own server, but this is just to demonstrate.
