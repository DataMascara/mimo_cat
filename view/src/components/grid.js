import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import EditIcon from '@material-ui/icons/Edit';
import MuiDialogTitle from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';


import MenuItem from '@material-ui/core/MenuItem';

import { DataGrid, ColDef, CellParams } from '@material-ui/data-grid';


import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

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
		flex: 1
	},
	p: {
		display: 'block',
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0,
		display: 'none'
	},
	form: {
		marginTop: theme.spacing(0)
	},
	root: {
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
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	formControl2: {
		minWidth: '100%',
	},
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});


class mediagrid extends Component {
	constructor(props) {
		super(props);

		this.state = {
			media: '',
			media_name: '',
			media_filename: '',
			created_by: '',
			id: '',
			errors: [],
			filters: {
				active: true,
				sort: 'Name',
			},
			lexicon: {
				movement: '',
				body_direction: '',
				tags: ''
			},
			description: '',
			page: 0,
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
		this.setState({
			[event.target.name]: event.target.value
		});
	};


	componentWillMount = () => {
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
		this.setState({
			id: data.id,
			active: data.active,
			lexicon_movement: data.lexicon.movement,
			lexicon_body_direction: data.lexicon.body_direction,
			lexicon_tags: data.lexicon.tags,
			media_id: data.id,
			media_name: data.name,
			media_tags: data.tags,
			created_by: data.username,
			media_filename: data.filename,
			description: data.description,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
		this.setState({
			active: data.item.active,
			media_id: data.item.id,
			media_name: data.item.name,
			created_by: data.item.username,
			media_filename: data.item.filename,
			created_at: data.item.created_at,
			lexicon: {
				movement: data.item.lexicon.movement,
				body_direction: data.item.lexicon.body_direction,
				tags: data.item.lexicon.tags
			},
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


		const displayCols: ColDef[] = [
			{ field: 'id', headerName: 'Tags', hide:true },
			{ field: 'actions',
				headerName: ' ',
				width: 100,
				disableClickEventBubbling: true,
				renderCell: (params: CellParams) => {
					const onClick = () => { return this.handleEditClickOpen(params.row); };

					return <Button onClick={onClick} disabled><EditIcon /></Button>;
				}

			},
			{ field: 'name', headerName: 'Name', },
			{ field: 'movement', headerName: 'Movement Category', renderCell: (params) => { return params.row.lexicon.movement;  }, width: 180 },
			{ field: 'body_direction', headerName: 'Body Direction', renderCell: (params) => params.row.lexicon.body_direction, width: 150 },
			{ field: 'tags', headerName: 'Tags', renderCell: (params) => params.row.lexicon.tags, width: 120,
				description: 'User created',  },
				{ field: 'description', headerName: 'Description', width: 220,
				description: 'User created',  },
			{ field: 'filename',
				headerName: 'Filename',
				type: 'string',
				description: 'Must match existing filename in CDN',
				width: 170,
			}
		];


		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors } = this.state;

		const handleClickOpen = () => {
			this.setState({
				id: '',
				active: true,
				created_by: this.state.created_by,
				created_at: '',
				media_name: '',
				media_filename: '',
				media_type: '',
				lexicon: {
					movement: '',
					body_direction: '',
					tags: ''
				},
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();

			const userMedia = {
						active: this.state.media.active,
						created_by: this.state.media.created_by,
						media_name: this.state.media_name,
						media_filename: this.state.media_filename,
						lexicon: {
							movement: this.state.lexicon_movement,
							body_direction: this.state.lexicon_body_direction,
							tags: this.state.lexicon_tags,
						},
						description: this.state.description
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
			const catBuckets = [
				{
					value: '',
					label: 'None',
				},
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
				},
				{
					value: 'movement',
					label: 'Movement',
				},
				{
					value: 'clips',
					label: 'Clip',
				},
				{
					value: 'other',
					label: 'Other',
				},
			];

			const catBodyDir = [
				{
					value: '',
					label: 'None',
				},
				{
					value: 'profile',
					label: 'Profile',
				},
				{
					value: 'front',
					label: 'Front',
				},
				{
					value: 'diagonal',
					label: 'Diagonal',
				},
			];




			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Card  className={classes.root} key="titleLexicon">
						<CardHeader>
							<Typography className={classes.locationText} gutterBottom variant="h4">
										Lexicon
									</Typography>
						</CardHeader>
						<CardContent>

							<div className={classes.progress} />
						</CardContent>
					</Card>
					<br />
  
					<Box style={{ flexGrow: 1, minWidth: 800, display: 'flex', height: '70vh' }}>

						<Grid container spacing={3} style={{  width: '100%' }}>
						<Grid item xs={12}>

							<DataGrid rows={this.state.media}
									xs={{ borderColor: '#FFFFFF' }}
									columns={displayCols}
									autoPageSize
									rowsPerPageOptions={[20, 50, 100]}
									onPageChange={(params) => { this.setState({page: params.page})
										// this.state.page = params.page;
									}}
							/>
						</Grid>
						</Grid>
					</Box>

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Media"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>

					<Dialog open={open} onClose={handleClose} TransitionComponent={Transition}  aria-labelledby="edit-media-dialog">
					<DialogTitle id="edit-dialog-title" >
							{this.state.buttonType === 'Edit' ? 'Edit Media' : 'Create a new Media'}
					</DialogTitle>
					<DialogContent dividers>

						<form className={classes.form} noValidate>
						<Grid container spacing={2}>
						<Grid item xs={12}>
						<TextField
								variant="standard"
								hidden
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
						</Grid>
						<Grid item xs={6}>
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
								margin="normal"
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="outlined-select-category"
								select
								fullWidth
								label="Movement Category"
								name="lexicon_movement"
								value={this.state.lexicon_movement}
								onChange={this.handleChange}
								margin="normal"
							>
								{catBuckets.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="outlined-select-category2"
								select
								fullWidth
								label="Body Direction"
								name="lexicon_body_direction"
								value={this.state.lexicon_body_direction}
								onChange={this.handleChange}
								margin="normal"
							>
								{catBodyDir.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
							</Grid>

							<TextField
								variant="outlined"
								required
								fullWidth
								id="media_tags"
								label="Tags"
								name="lexicon_tags"
								autoComplete="mediaTags"
								helperText={errors.media_tags}
								error={errors.media_tags ? true : false}
								onChange={this.handleChange}
								value={this.state.lexicon_tags}
								margin="normal"
							/>
							<TextField
								variant="outlined"
								fullWidth
								id="description"
								label="Description"
								name="description"
								autoComplete="mediaTags"
								rows={2}
								multiline
								helperText={errors.description}
								error={errors.description ? true : false}
								onChange={this.handleChange}
								value={this.state.description}
								margin="normal"
							/>


						</Grid>
						</form>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Cancel</Button>
							<Button
									autoFocus
									variant="outlined"
									color="primary"
									onClick={handleSubmit}
									disabled
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

export default (withStyles(styles)(mediagrid));
