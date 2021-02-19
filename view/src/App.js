import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import home from './pages/home';
import about from './pages/about';
import login from './pages/login';
import signup from './pages/signup';

const theme = createMuiTheme({
	palette: {
    background: {
      default: '#fbf9f9'
    },
		primary: {
			light: '#ce93d8',
			main: '#ba68c8',
			dark: '#9c27b0',
			contrastText: '#FFFFFF'
    },
    text: {
      primary: '#495057',
      secondary: '#c6bfc7'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
          <div>
            <Switch>
                <Route path="/" component={home} />
                <Route exact path="/about" component={about}/>
                <Route exact path="/login" component={login}/>
                <Route exact path="/signup" component={signup}/>
            </Switch>
          </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
