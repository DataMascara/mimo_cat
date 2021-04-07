import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Card, CardContent } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardActions';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress'; 
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import FormHelperText from '@material-ui/core/FormHelperText';

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
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(0)
	},
	root: {
		flexGrow : 1,
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
			height: 250,
			cursor: 'pointer'
	},
	tags: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
		'& > *': {
				margin: theme.spacing(0.5),
		},
	
	},
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});


class media extends Component {
	constructor(props) {
		super(props);

		this.state = {
			media: [],
			media_name: '',
			media_filename: '',
			created_by: '',
			id: '',
			errors: [],
			filters: {
				active: true,
				created_by: '',
				sort: 'Name'
			},
			lexicon: {
				movement: '',
				body_direction: '',
				tags: ''
			},
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false,

			hover:false
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
			media_type: data.item.media_category,
			media_id: data.item.id,
			media_name: data.item.name,
			lexicon_movement: data.item.lexicon.movement,
			lexicon_body_direction: data.item.lexicon.body_direction,
			lexicon_tags: data.item.lexicon.tags,
			created_by: data.item.username,
      media_filename: data.item.filename,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
		this.setState({
			active: data.item.active,
			media_type: data.item.media_type,
			media_id: data.item.id,
			media_name: data.item.name,
			lexicon_tags: data.item.lexicon.tags,
			lexicon_body_direction: data.item.lexicon.body_direction,
			lexicon_movement: data.item.lexicon.movement,
			created_by: data.item.username,
			media_filename: data.item.filename,
			created_at: data.item.created_at,
			viewOpen: true
		});
	}
	handleOnMouseEnter = () => {
		this.setState({hover:true});
	}
	handleOnMouseLeave = () => {
		this.setState({hover:false})
	}


	render() {
		const { hover } = this.state;
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
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
			this.setState({
				id: '',
				active: '',
				created_by: '',
				created_at: '',
				media_name: '',
				media_filename: '',
				lexicon_tags: '',
				lexicon_movement: '',
				lexicon_body_direction: '',
				media_type: '',
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
						lexicon: {
							movement: this.state.lexicon_movement,
							body_direction: this.state.lexicon_body_direction,
							tags: this.state.lexicon_tags
						}
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

			return (
				<main className={classes.content}>

					<Card className={classes.root} >
            <CardHeader>
              <Typography className={classes.locationText} gutterBottom variant="h4">
										Movements
							</Typography>
            </CardHeader>
						<CardContent>
						<div className={classes.progress} />
						</CardContent>
					</Card>

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Media"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>
					<Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
						
						<DialogTitle id="edit-dialog-title">
							<Typography variant="h6" className={classes.title}>
								{this.state.buttonType === 'Edit' ? 'Edit Movement' : 'Create a new Movement'}
							</Typography>
						</DialogTitle>
						<DialogContent>

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
										id="lexicon_movement"
										label="Category"
										name="lexicon_movement"
										autoComplete="mediaFileName"
										helperText={errors.lexicon_movement}
										error={errors.media_filename ? true : false}
										onChange={this.handleChange}
										value={this.state.lexicon_movement}
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
					{/* <FilterItems data={this.props.data} filter={this.state.filters.category} /> */}
					
					<br />
					<Grid container spacing={2}>

						{this.state.media.filter((x) => x.media_type === 'movement' )
							.map((item) => (
							<Grid item xs={12} sm={4} md={3}>
								<Card variant="outlined"> 
									<div onClick={() => this.handleViewOpen({ item })} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}>
										<CardMedia
												component="image"
												className={classes.media}
												title={item.filename}
												image={`${baseurl}/movement/${item.thumbnail}`}
										/>
									</div>
									<CardContent>
										<Typography variant="h5" component="h2">
											{item.name}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											{dayjs(item.created_at).fromNow()}
										</Typography>

										<div className={classes.tags}>
											{item.lexicon.tags.split(',').map((t) => (
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
										<Button size="small" color="secondary" disabled onClick={() => this.deleteMediaHandler({ item })}>
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
											image={`${baseurl}/${this.state.media_type}/${this.state.media_filename}`}
									/>
						<Typography className={classes.pos} color="textSecondary">
						{this.state.media_filename}
						</Typography>
            			<div className={classes.media_tags}>
							{}
							{this.state.lexicon.tags.split(',').filter((i) => i !== "").map((t) => (
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