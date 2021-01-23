import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Account from '../components/account';
import Media from '../components/media';
import Movement from '../components/movement';
import Routine from '../components/routine';
import BatchEdit1 from '../components/grid';

import { Box, Button, Link, Grid, Container } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
import GitHubIcon from '@material-ui/icons/GitHub';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu'; 

import { authMiddleWare } from '../util/auth'
import { COLUMN_FILTER_BUTTON_CLICK } from '@material-ui/data-grid';

axios.defaults.baseURL = 'https://us-east4-mimo-cat-f82c7.cloudfunctions.net/api';



const styles = (theme) => ({
	content:{
		marginTop: 140,
	},
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar,
	appBar: {
		background: '#FFFFFF',
		color: theme.palette.primary.main
	},
	toolbar: {
    // justifyContent: 'space-between',
    justifyContent: 'flex-start',
	},
	left: {
		color: theme.palette.primary.main
  },
	right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
	rightLink: {
    fontSize: 14,
		// color: theme.palette.common.white, 
		marginLeft: theme.spacing(2),
		whiteSpace: 'normal',
		fontWeight: 700
	},
	horizontalList: {
		display: 'inline-block',
	}
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

class home extends Component {
	state = {
		render: false,
		page: 'Media',
		value: 0,
		anchorEl: null,
		openUserMenu: Boolean(this.anchorEl)
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

  loadBatchEditPage = (event) => {
		this.setState({ render: false, page: 'BatchEdit1' });
	};

	logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		this.props.history.push('/login');
	};

	handleMenu = (event) => {
		this.setState({  
			  anchorEl: event.currentTarget
			, openUserMenu: true });
	};
	handleClose = () => {
		this.setState({  anchorEl: null });
  };
	

	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			username: '',
			profilePicture: '',
			uiLoading: true,
			imageLoading: false
		};
	}

  // Recommended as per https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/user')
			.then((response) => {
				// console.log(response.data);
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
						<Toolbar className={classes.toolbar}> 
							<div className={classes.left} />
								<Link
									variant="h6"
									underline="none"
									color="textPrimary"
									className={classes.title}
									href="/"
								>
									{'Minimum Movement'}
								</Link>
								<div className={classes.right}> 
							
								</div>
									{/* onClick={() => {}} */}
								<div className={classes.right}> 
									<IconButton  aria-label="source code" 
									 target="_blank" href="http://github.com/DataMascara/mimo_cat"
									 >
										<GitHubIcon />
									</IconButton>
									<Button
										color="default" 
										className={classes.rightLink} 
										aria-controls="menu-appbar"
										aria-haspopup="true"
										onClick={this.handleMenu}
										// onClick={this.loadAccountPage}
										startIcon={<Avatar src={this.state.profilePicture}  />}
									>
										<Box color="text.primary" >
											<Typography variant="body1" gutterBottom>
												{this.state.firstName}{' '}{this.state.lastName}
											</Typography>
											<Typography variant="caption" >{this.state.username}</Typography> 
										</Box>
										
									</Button>
									
								</div>
						</Toolbar>
						<Divider />
						<Tabs value={this.state.value} 
						onChange={this.handleChange} 
						centered 
						indicatorColor="secondary"
						aria-label="tabs">
							<Tab label="Routines" onClick={this.loadRoutinePage} {...a11yProps(0)}  />
							<Tab label="Movements" onClick={this.loadMovementPage} {...a11yProps(1)} />
							<Tab label="Media"  onClick={this.loadMediaPage} {...a11yProps(2)} />
							<Tab label="Files"  onClick={this.loadBatchEditPage} {...a11yProps(3)} />
						</Tabs>
					</AppBar>
					
					<TabPanel value={this.state.value} index={0}>
						< Routine /> 
					</TabPanel>
					<TabPanel value={this.state.value} index={1}>
					<Movement /> 
					</TabPanel>
					<TabPanel value={this.state.value} index={2}>
						<Media />
					</TabPanel>
					<TabPanel value={this.state.value} index={2}>
						<BatchEdit1 />
					</TabPanel>

					<StyledMenu
                id="menu-appbar"
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={this.state.openUserMenu}
                onClose={this.handleClose}
              >
								<StyledMenuItem onClick={this.loadAccountPage}>
									<ListItemIcon>
										<AccountBoxIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Edit Profile" />
								</StyledMenuItem>
								<StyledMenuItem onClick={this.logoutHandler}> 
									<ListItemIcon>
										<ExitToAppIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Logout" />
								</StyledMenuItem> 
          </StyledMenu>
					<Container>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Box></Box>
							<Box></Box>
						</Grid>
						<Grid item xs={12}>
							<div>
								{ (this.state.page === 'Profile') ? <Account /> 
								: (this.state.page === 'Media') ? <Media />
								: (this.state.page === 'Movement') ? <Movement /> 
								: (this.state.page === 'BatchEdit1') ? <BatchEdit1 />
								: < Routine /> }
							</div>
						</Grid>
					</Grid>
					</Container>

				</div>

			);
		}
	}
}

export default withStyles(styles)(home);