import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
registerServiceWorker();

// const initialState = {}
// const history = createHistory()
// const store = configureStore(initialState, history)

// export default function Application () {
//   return (
//     <Provider store={store}>
//       <MuiThemeProvider muiTheme={theme}>
//         <ConnectedRouter history={history}>
//           <AppRouter store={store} />
//         </ConnectedRouter>
//       </MuiThemeProvider>
//     </Provider>
//   )
// }