import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Card, CardContent, TextField, Grid, CardActionArea } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';


// import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';


import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

const styles = (theme) => ({
	content: {
				flexGrow: 1,
				padding: theme.spacing(3),
		},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	p: {
		display: 'block',
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0,
		display: 'none'
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(0)
	},
	root: {
		minWidth: 800,
		flexGrow : 1,
		"& .MuiPaper-root": {
			borderColor: '#FFFFFF'
		}
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	},
	media: {
			height: 300,
	},
	tags: {
		display: 'flex',
		justifyContent: 'flex-start',
		flexWrap: 'wrap',
		'& > *': {
			margin: theme.spacing(0.5),
		},
	},
	locationText: {
		paddingLeft: '15px'
	},

	icon: {
		// color: 'rgba(255, 255, 255, 0.54)',
		color: 'white',
	},
	tileRoot: {
		// width: 800,
		// height: 450,
		// Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
		transform: 'translateZ(0)',
	},
	titleBar: {
		background:
			'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
			'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
});


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});


class media extends Component {

	constructor(props) {
		super(props);

		this.state = {
			media: '',
			media_name: '',
			media_filename: '',
			media_tags: '',
			media_category: 'movement',
			created_by: '',
			id: '',
			errors: [],
			filters: {
				active: true,
				created_by: '',
				category: 'movement',
				sort: 'Name'
			},
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false,
		};

		this.deleteMediaHandler = this.deleteMediaHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
	}
  
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/media')
			.then((response) => {
				this.setState({
					media: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	deleteMediaHandler(data) {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		let mediaId = data.media.id;
		axios
			.delete(`media/${mediaId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleEditClickOpen(data) {
		console.log(data.item);
		this.setState({
			active: true,
			id: data.item.id,
			media_category: data.item.category,
			media_id: data.item.id,
			media_name: data.item.name,
			media_tags: data.item.tags,
			created_by: data.item.username,
			media_filename: data.item.filename,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
		this.setState({
			active: data.item.active,
			media_category: data.item.category,
			media_id: data.item.id,
			media_name: data.item.name,
			media_tags: data.item.tags,
			created_by: data.item.username,
			media_filename: data.item.filename,
			created_at: data.item.created_at,
			viewOpen: true
		});
	}

	render() {
		const DialogTitle = withStyles(styles)((props) => {
			const { children, classes, onClose, ...other } = props;
			return (
				<MuiDialogTitle disableTypography className={classes.root} {...other}>
					<Typography variant="h6">{children}</Typography>
					{onClose ? (
						<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
							<CloseIcon />
						</IconButton>
					) : null}
				</MuiDialogTitle>
			);
		});

		const baseurl = "https://storage.googleapis.com/mimo-cat-f82c7";



		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors } = this.state;

		const handleClickOpen = () => {
			this.setState({
				id: '',
				active: '',
				created_by: '',
				created_at: '',
				media_name: '',
				media_filename: '',
				media_tags: '',
				media_category: '',
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userMedia = {
						active: this.state.active,
						id: this.state.id,
						created_by: this.state.created_by,
						name: this.state.media_name,
						filename: this.state.media_filename,
						tags: this.state.media_tags,
						category: this.state.media_category
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/media/${this.state.id}`,
					method: 'put',
					data: userMedia
				};
			} else {
				options = {
					url: '/media/add',
					method: 'post',
					data: userMedia
				};
			}
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			const catBuckets = [
				{
					value: 'bending',
					label: 'Bending',
				},
				{
					value: 'curving',
					label: 'Curving',
				},
				{
					value: 'centerOfGravity',
					label: 'Center of Gravity',
				},
				{
					value: 'elevating',
					label: 'Elevating',
				},
				{
					value: 'dropping',
					label: 'Dropping',
				},
				{
					value: 'pushing',
					label: 'Pushing',
				},
				{
					value: 'loweringHip',
					label: 'Lowering Hip',
				}
			];


			return (
				<main className={classes.content}>
					<Route exact path="/categories">
						<Grid container spacing={2} key="home-main">
							
							{catBuckets.map((item,index) => (
									<Grid item xs={12} sm={6} md={4} key={item.value+"g1"}>
										
										<CardActionArea component="a" href={`/categories/`+item.value} value={index.value} key={item.value+"c"} name={this.state.value} >
								
											<Card variant="outlined">
													<CardContent>
															<Typography variant="h5" component="h2">
																	{item.label}
															</Typography>

															<div style={{ color: '#AAA' }}>
																	<em>Description</em>
																	<br/>
																	<br/>
															</div>
													</CardContent>
											</Card>
										</CardActionArea>
									</Grid>
							))}
						</Grid>
					</Route>
					<Route exact path="/categories/bending">
						<CategoryClips name="Bending" baseurl={baseurl} media={this.state.media.filter(item => item.lexicon.movement === 'bending')} />
					</Route>
					<Route exact path="/categories/curving">
						<CategoryClips name="Curving" baseurl={baseurl} media={this.state.media.filter(item => item.lexicon.movement === 'curving')} />
					</Route>
					<Route exact path="/categories/centerOfGravity">
						<CategoryClips name="Center of Gravity" baseurl={baseurl} media={this.state.media.filter(item => item.lexicon.movement === 'centerOfGravity')} />
					</Route>
					<Route exact path="/categories/elevating">
						<CategoryClips name="Elevating" baseurl={baseurl} media={this.state.media.filter(item => item.lexicon.movement === 'elevating')} />
					</Route>
					<Route exact path="/categories/dropping">
						<CategoryClips name="Dropping" baseurl={baseurl} media={this.state.media.filter(item => item.lexicon.movement === 'dropping')} />
					</Route>
					<Route exact path="/categories/pushing">
						<CategoryClips name="Pushing" baseurl={baseurl} media={this.state.media.filter(item => item.lexicon.movement === 'pushing')} />
					</Route>
					<Route exact path="/categories/loweringHip">
						<CategoryClips name="Lowering Hip" baseurl={baseurl} media={this.state.media.filter(item => item.lexicon.movement === 'loweringHip')} />
					</Route>

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Media"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>

					<Dialog open={open} onClose={handleClose} TransitionComponent={Transition} aria-labelledby="edit-dialog"
					>
					<DialogTitle id="edit-dialog-title">
						<Typography variant="h6" className={classes.title}>
							{this.state.buttonType === 'Edit' ? 'Edit Media' : 'Create a new Media'}
						</Typography>
					</DialogTitle>
					<DialogContent dividers>
						<DialogContentText>
							Instructions for the form can go here.
						</DialogContentText>

						<form className={classes.form} noValidate>
						<TextField
								variant="standard"
								hidden
								disabled
								fullWidth
								id="media_id"
								label="Id"
								name="media_id"
								autoComplete="mediaId"
								helperText={errors.media_id}
								value={this.state.media_id}
								error={errors.media_id ? true : false}
								onChange={this.handleChange}
							/>

							<TextField
								variant="outlined"
								required
								fullWidth
								id="media_name"
								label="Display Name"
								name="media_name"
								autoComplete="mediaName"
								helperText={errors.media_name}
								value={this.state.media_name}
								error={errors.media_name ? true : false}
								onChange={this.handleChange}
								margin="normal"
							/>

							<TextField
								variant="outlined"
								required
								fullWidth
								id="media_tags"
								label="Tags"
								name="media_tags"
								autoComplete="mediaTags"
								helperText={errors.media_tags}
								error={errors.media_tags ? true : false}
								onChange={this.handleChange}
								value={this.state.media_tags}
								// helperText="Tags separated by commas"
								margin="normal"
							/>

							<TextField
								id="outlined-select-category"
								select
								fullWidth
								label="Select Category"
								value={this.state.filters.category}
								onChange={this.handleChange}
							>
								{catBuckets.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>

							<TextField
								variant="outlined"
								required
								fullWidth
								id="media_filename"
								label="FileName"
								name="media_filename"
								autoComplete="mediaFileName"
								helperText={errors.media_filename}
								error={errors.media_filename ? true : false}
								onChange={this.handleChange}
								value={this.state.media_filename}
								margin="normal"
							/>

						</form>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Cancel</Button>
							<Button
									autoFocus
									variant="contained"
									color="primary"
									onClick={handleSubmit}
								>
									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
								</Button>
						</DialogActions>
					</Dialog>

  
				</main>
			);
		}
	}
}

export default (withStyles(styles)(media));


class CategoryClips extends React.Component {
	render(){
		return(
	<>
	<Card key={"category_"+this.props.name}>
		<CardContent>
			<div style={{ display: 'flex' }}>
				<div>
					<Typography gutterBottom variant="h4">
						{this.props.name} Movement
					</Typography>

				</div>
			</div>
		</CardContent>
	</Card>
	<br />
		<GridList variant="standard" cols={3} gap={8}>

		{this.props.media.map((item) => (
			<GridListTile key={item.media_filename}>
				<img
					srcSet={`${this.props.baseurl}/movement/${item.thumbnail}`}
					alt={item.title}
				/>


				<GridListTileBar
					title={item.name}
					position="top"
					actionPosition="right"
				/>

			</GridListTile>
		))}

	</GridList>
	</>)
}
}
