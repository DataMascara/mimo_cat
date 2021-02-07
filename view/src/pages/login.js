// login.js
// accessed at localhost:3000/login during developmetn

// Material UI components
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box'; 

import axios from 'axios';

// define styling configurations
const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	},
	bottom: {
    position: 'fixed',
    bottom: 0,
		alignContent: "flex-end",
		color: '#c6bfc7'
  },
	legal: {
		color: '#c6bfc7'
	}
});

// login.js

class login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			errors: [],
			loading: false
		};
	}
	// Recommended as per https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		if(nextProps.UI){
		if (nextProps.UI.errors) {
			this.setState({
				errors: nextProps.UI.errors
			});
		}}
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const userData = {
			email: this.state.email,
			password: this.state.password
		};
		axios
			.post('/login', userData)
			.then((response) => {
				localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
				this.setState({ 
					loading: false,
				});		
				this.props.history.push('/');
			})
			.catch((error) => {				
				this.setState({
					errors: error.response.data,
					loading: false
				});
			});
	};

	render() {
		const { classes } = this.props;
		const { errors, loading } = this.state;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<h1>Minimum Movement</h1>

					<Typography component="h1" variant="h5"></Typography>
					<Typography component="h1" variant="h5">Minimum Movement
						Please log in to continue
					</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							helperText={errors.email}
							error={errors.email ? true : false}
							onChange={this.handleChange}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							helperText={errors.password}
							error={errors.password ? true : false}
							onChange={this.handleChange}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={this.handleSubmit}
							disabled={loading || !this.state.email || !this.state.password}
						>
							Sign In
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container>
							<Grid item>
								<Link href="signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
						
						<Grid container>
							<Grid item>
								<Link href="about" variant="body2" className={classes.legal}>
									{"About this site"}
								</Link>
							</Grid>
						</Grid>
						{errors.general && (
							<Typography variant="body2" className={classes.customError}>
								{errors.general}
							</Typography>
						)}
					</form>
					<Box className={classes.bottom}>
					<Typography variant="body2" color="textSecondary" align="center">
							{' © '}{new Date().getFullYear()}{' '}
							<Link color="inherit" href="about">
								data mascara in collaboration with Maho Ogawa
							</Link>
							
						</Typography>
          </Box>
				</div>
				
			</Container>
		);
	}
}

export default withStyles(styles)(login);