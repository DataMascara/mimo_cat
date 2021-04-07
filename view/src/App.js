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
      default: '#ffffff'
    },
		primary: {
			light: '#FDF899',
			main: '#E6DD37',
			dark: '#C3BD55',
    },
    secondary: {
      main: '#BE556D',
    },
    text: {
      primary: '#000000',
      secondary: '#434242',   
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
                <Route exact path="/about" component={about}/>
                <Route exact path="/login" component={login}/>
                <Route exact path="/signup" component={signup}/>
                <Route path="/" component={home} />
            </Switch>
          </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
