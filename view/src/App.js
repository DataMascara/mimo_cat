import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#ce93d8',
			main: '#ba68c8',
			dark: '#9c27b0',
			contrastText: '#FFFFFF'
		}
	}
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
          <div>
            <Switch>
                <Route exact path="/" component={home}/>
                <Route exact path="/login" component={login}/>
                <Route exact path="/signup" component={signup}/>
            </Switch>
          </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
