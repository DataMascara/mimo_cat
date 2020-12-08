import React, { Component } from 'react';
import axios from 'axios';

import Account from '../components/account';
import Media from '../components/media';
import Movement from '../components/movement';
import Routine from '../components/routine';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import QueueIcon from '@material-ui/icons/Queue';
import PermMediaIcon from '@material-ui/icons/PermMedia';

import { authMiddleWare } from '../util/auth'

axios.defaults.baseURL = 'https://us-east4-mimo-cat-f82c7.cloudfunctions.net/api';

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
});

class home extends Component {
	state = {
    render: false,
    page: 'Media'
	};

	loadAccountPage = (event) => {
		this.setState({ render: false, page: 'Profile' });
	};

	loadMediaPage = (event) => {
		this.setState({ render: true, page: 'Media' });
  };
  
  loadMovementPage = (event) => {
		this.setState({ render: false, page: 'Movement' });
  };

  loadRoutinePage = (event) => {
		this.setState({ render: false, page: 'Routine' });
	};

	logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		this.props.history.push('/login');
	};

	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			profilePicture: '',
			uiLoading: true,
			imageLoading: false
		};
	}

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/user')
			.then((response) => {
				console.log(response.data);
				this.setState({
					firstName: response.data.userCredentials.firstName,
					lastName: response.data.userCredentials.lastName,
					email: response.data.userCredentials.email,
					phoneNumber: response.data.userCredentials.phoneNumber,
					country: response.data.userCredentials.country,
					username: response.data.userCredentials.username,
					uiLoading: false,
					profilePicture: response.data.userCredentials.imageUrl
				});
			})
			.catch((error) => {
        console.log(error);
				if(error.response.status === 403) {
					this.props.history.push('/login')
				}
				console.log(error);
				this.setState({ errorMsg: 'Error in retrieving the data' });
			});
	};

	render() {
		const { classes } = this.props;		

		if (this.state.uiLoading === true) {
			return (
				<div className={classes.root}>
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</div>
			);
		} else {
			return (
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" noWrap>
								Minimal Movement Catalog
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<Divider />
						<center>
							<Avatar src={this.state.profilePicture} className={classes.avatar} />
							<p>
								{' '}
								{this.state.firstName} {this.state.lastName}
							</p>
						</center>
						<Divider />
            <List component="nav"
              aria-labelledby="nested-list-subheader" 
              subheader={
                <ListSubheader component="div" id="nested-list-subheader" >
                  Routine Builder
                </ListSubheader>
              }>
              <ListItem button key="Routines" onClick={this.loadRoutinePage}>
								<ListItemIcon>
									{' '}
									<AccessibilityNewIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Routines" />
							</ListItem>
              <ListItem button key="Movements" onClick={this.loadMovementPage} component="nav">
								<ListItemIcon>
									{' '}
									<QueueIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Movements" />
							</ListItem>
							<ListItem button key="Media" onClick={this.loadMediaPage} component="nav">
								<ListItemIcon>
									{' '}
									<PermMediaIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Media" />
							</ListItem>
              </List>

              <Divider />

              <List component="nav"
              aria-labelledby="nested-list-subheader2"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader2">
                  Account
                </ListSubheader>
              }>
							<ListItem button key="Profile" onClick={this.loadAccountPage} component="nav">
								<ListItemIcon>
									{' '}
									<AccountBoxIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Profile" />
							</ListItem>

							<ListItem button key="Logout" onClick={this.logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
					</Drawer>

          <div>
            { (this.state.page === 'Profile') ? <Account /> 
            : (this.state.page === 'Routine') ? <Routine />
            : (this.state.page === 'Movement') ? <Movement /> 
            : < Media /> }
          </div>
				</div>
			);
		}
	}
}
// condition ? exprIfTrue : exprIfFalse
// condition1 ? value1
//          : condition2 ? value2
//          : condition3 ? value3
//          : value4;

export default withStyles(styles)(home);