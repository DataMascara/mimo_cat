import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
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
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(10)
	},
	root: {
		minWidth: 470
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
			height: 250
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
			media_category: '',
			created_by: '',
			id: '',
			errors: [],
			filters_category: 'movement',
			filters: {
				active: true,
				created_by: '',
				category: 'movement',
				sort: 'Name'
			},
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false
		};

		this.deleteMediaHandler = this.deleteMediaHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
	}

	handleChange = (event) => {
		console.log("handleChange " + event.target + " Id: " + event.target.id + "; Name: " + [event.target.name] + " ; Value: " + event.target.value)
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
    console.log(data)
		this.setState({
			active: data.item.active,
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

		const DialogContent = withStyles((theme) => ({
			viewRoot: {
				padding: theme.spacing(2)
			}
		}))(MuiDialogContent);

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
			this.setState({
				id: '',
				active: '',
				created_by: '',
				created_at: '',
				media_name: '',
				media_filename: '',
				media_tags: '',
				metia_type: '',
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userMedia = {
						id: this.state.media.id,
						active: this.state.media.active,
						created_by: this.state.media.uploade_by,
            media_name: this.state.media_name,
						media_filename: this.state.media_filename,
						media_tags: this.state.media_tags,
						media_category: this.state.category
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
					url: '/media',
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

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			// var filterCatOpt=this.props.data.map((item) => { return item.filters.category });
      // filterCatOpt.unshift("");
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Media"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>
					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									{this.state.buttonType === 'Edit' ? 'Edit Media' : 'Create a new Media'}
								</Typography>
								<Button
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
								</Button>
							</Toolbar>
						</AppBar>

						<form className={classes.form} noValidate>
					
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="media_name"
										label="Media Name"
										name="media_name"
										autoComplete="mediaName"
										helperText={errors.media_name}
										value={this.state.media_name}
										error={errors.media_name ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>
								
                <Grid item xs={12}>
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
									/>
								</Grid>
								
								<Grid item xs={6}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="media_category"
										label="Category"
										name="media_category"
										autoComplete="mediaFileName"
										helperText={errors.media_category}
										error={errors.media_filename ? true : false}
										onChange={this.handleChange}
										value={this.state.media_category}
									/>
									<FormHelperText>This should default to 'movement'</FormHelperText>
								</Grid>
								<Grid item xs={6}>
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
									/>
									<FormHelperText>Filename</FormHelperText>
								</Grid>
							</Grid>
						</form>
					</Dialog>
					{/* <FilterItems data={this.props.data} filter={this.state.filters.category} /> */}
					

					<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography className={classes.locationText} gutterBottom variant="h4">
							Movements
						</Typography>
					</Grid>

						{this.state.media.filter((x) => x.category === 'movement' )
							.map((item) => (
							<Grid item xs={12} sm={6} sm={4} md={3}>
								<Card variant="outlined">
									<CardMedia
											component="iframe"
											className={classes.media}
											title={item.filename}
											image={`https://storage.googleapis.com/mimo-cat-f82c7/${item.category}/${item.filename}`}
									/>
									<CardContent>
										<Typography variant="h5" component="h2">
											{item.name}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											{dayjs(item.created_at).fromNow()}
										</Typography>

										<div className={classes.tags}>
											{item.tags.split(',').map((t) => (
												<Chip label={t} variant="outlined" color="primary" />
											))} 
										</div>
									</CardContent>
									<CardActions>
										<Button size="small" color="secondary" onClick={() => this.handleViewOpen({ item })}>
											{' '}
											View{' '}
										</Button>
										<Button size="small" color="secondary" onClick={() => this.handleEditClickOpen({ item })}>
											Edit
										</Button>
										<Button size="small" color="secondary" 
										disabled
										onClick={() => this.deleteMediaHandler({ item })}>
											Delete
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>

					<Dialog
						onClose={handleViewClose}
						aria-labelledby="customized-dialog-title"
						open={viewOpen}
						fullWidth
						classes={{ paperFullWidth: classes.dialogeStyle }}
					>
						<DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
							{this.state.media_name}
						</DialogTitle>
						<DialogContent dividers>
						<CardMedia
											component="iframe"
											className={classes.media}
											title={this.state.media_name}
											image={`https://storage.googleapis.com/mimo-cat-f82c7/movement/${this.state.media_filename}`}
									/>
						<Typography className={classes.pos} color="textSecondary">
						{this.state.media_filename}
						</Typography>
            <div className={classes.media_tags}>
							{this.state.media_tags.split(',').map((t) => (
								<Chip label={t} variant="outlined" color="primary" />
							))}
						</div>
										
						</DialogContent>
					</Dialog>
				</main>
			);
		}
	}
}

export default (withStyles(styles)(media));