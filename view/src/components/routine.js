import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';


import CardHeader from '@material-ui/core/CardActions';
import { Card, CardContent, TextField, Chip} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LaunchIcon from '@material-ui/icons/Launch';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';
// import media from './media';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    root: {
        flexGrow : 1,
        "& .MuiPaper-root": {
          borderColor: '#FFFFFF'
        }
    },
    floatingButton: {
        position: 'fixed',
        bottom: 0,
        right: 0
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
    table: {
        minWidth: 650,
    },
    hideLastBorder: {
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      },
    })
);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


class routine extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          routines: [],
          media: [],
          routine_name: '',
          movements: [], 
          mList: '',
          created_at: '',
          id: '',
          errors: [], 
          page: 1,
          page_count: 0,
          pageSize: 10,
          open: false,
          uiLoading: true,
          buttonType: '',
          viewOpen: false
        };
    
        this.pageSizes = [3, 6, 9];
    
        this.deleteRoutineHandler = this.deleteRoutineHandler.bind(this);
        this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
        this.handleViewOpen = this.handleViewOpen.bind(this);
    
      }
    
      handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
      };
    
      handleChangePage = (event, newPage) => {
        this.setState({
          [event.target.page]: newPage
        });
        // setPage(newPage);
      };
    
      componentWillMount = () => {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
          .get('/routines')
          .then((response) => {
            this.setState({
              routines: response.data,
              uiLoading: false
            });
          })
          .catch((err) => {
            console.log(err);
          });

      };
    
      deleteRoutineHandler(data) {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        let routineId = data.routines.id;
        axios
          .delete(`routnes/${routineId}`)
          .then(() => {
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    
      handleEditClickOpen(data) {
        // console.log(data.item);
        this.setState({
          active: true,
          id: data.item.routineId,
          routine_name: data.item.name,
          movements: data.item.movements, 
          created_at: data.item.created_at,
          buttonType: 'Edit',
          open: true
        });
      }
    
      handleViewOpen(data) {

        axios.get(`/routines/${data.row.id}`)
            .then((response) => {
            
              this.setState({ 
                routines: response.data, 
                id: data.row.id,
                routine_name: data.row.name,
                num_movements: data.row.num_movements,
                movements: response.data[0].movements,
                created_at: data.row.created_at,
                viewOpen: true
              })
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
      const { open, errors, viewOpen } = this.state;

      const handleClickOpen = () => {
        this.setState({
                  id: '',
                  routine_name: '',
                  movements: [], 
                  created_at: '',
          buttonType: '',
          open: true
        });
      };

      const handleSubmit = (event) => {
        authMiddleWare(this.props.history);
        event.preventDefault();
        const newRoutine = {
          id: this.state.media.id,
          active: this.state.media.active,
          created_by: this.state.media.uploade_by,
          movements: null,
          mList: this.state.mList || '',
          name: this.state.name,
          username: this.state.username,
          video_url: this.state.video_url || '',
          description: this.state.description || ''
        };
        let options = {};
        if (this.state.buttonType === 'Edit') {
          options = {
            url: `/routines/${this.state.id}`,
            method: 'put',
            data: newRoutine
          };
        } else {
          options = {
            url: '/routines/add',
            method: 'post',
            data: newRoutine
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
        
        return (
            <div className={classes.content}>
            <Card  className={classes.root}>
            <CardHeader>
              <Typography className={classes.locationText} gutterBottom variant="h4">
                Routines
            </Typography>
            </CardHeader>
            <CardContent>
                <div className={classes.progress} />
            </CardContent>
            </Card>
            <br />
            <Card>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell align="center">Display Name</TableCell>
                        <TableCell align="center">Video</TableCell>
                        <TableCell align="center">Length</TableCell>
                        <TableCell align="center">Date of Creation</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center"> </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.routines.map((row) => (
                        <TableRow key={row.name} className={classes.hideLastBorder}>
                        <TableCell component="th" scope="row">
                            {row.username}
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">
                          <Link href={row.video_url} variant="body2" rel="noopener" target="_blank">{row.video_url}</Link>
                        </TableCell>
                        <TableCell align="center"><Chip size="small" label={row.num_movements} variant="outlined" color="primary">
                            </Chip>{' '}{row.mList} 
                        </TableCell>                        
                        <TableCell align="center">{dayjs(row.created_at).fromNow()}</TableCell>
                        <TableCell align="center" component="th" scope="row">{row.description}</TableCell>
                        <TableCell align="center">
                            <Button size="small" color="secondary" onClick={() => this.handleViewOpen({ row })} disabled tooltip='disabled'>
                                {' '}
                                View{' '}
                            </Button>
                            <Button size="small" color="secondary" disabled onClick={() => this.handleEditOpen({ row })}>
                                {' '}
                                Edit{' '}
                            </Button>
                        </TableCell>
                        
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Card>

            <IconButton
            className={classes.floatingButton}
            color="primary"
            aria-label="Add Media"
            onClick={handleClickOpen}
          >
            <AddCircleIcon style={{ fontSize: 60 }} />
          </IconButton>

            <Dialog
                onClose={handleViewClose}
                aria-labelledby="routine-dialog"
                open={viewOpen}
                fullWidth
                classes={{ paperFullWidth: classes.dialogStyle }}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                    {this.state.routine_name}
                </DialogTitle>
                <DialogContent dividers>
                <CardMedia
                    component="img"
                    className={classes.media}
                    title={this.state.name} 
                />
                
                
                <div className={classes.media_tags}>
                    This routine contains {this.state.num_movements} movements, created {dayjs(this.state.created_at).fromNow()}
                </div>
                
                <br />

                {this.state.movements.map((move) => (
                  (move.media_filename ? 
                    <Typography className={classes.pos} color="textSecondary">
                    <Link href={`${baseurl}/movement/${move.media_filename}`} variant="body2">
                        {move.media_name} <LaunchIcon fontSize="small" />
                    </Link>
                    </Typography>
                  : '' )
                ))}
                {/* .map((move) => (
                      <Link href="#" variant="body2">
                        {move.media_name} {' '}
                      </Link>
                    )) */}
                                
                </DialogContent>
            </Dialog>
            
          <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}  aria-labelledby="edit-routine-dialog">
          <DialogTitle id="edit-dialog-title">
            <Typography variant="h6" className={classes.title}>
              {this.state.buttonType === 'Edit' ? 'Edit Routine' : 'Create a new Routine'}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Instructions for the form can go here.
            </DialogContentText>


            <form className={classes.form} noValidate>
            <TextField
                variant="standard"
                disabled
                fullWidth
                id="username"
                label="Id"
                name="username"
                autoComplete="username"
                helperText={errors.username}
                value={this.state.username}
                error={errors.username ? true : false}
                onChange={this.handleChange}
                margin="normal"
              />

              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Display Name"
                name="name"
                autoComplete="routineName"
                helperText={errors.name}
                value={this.state.name}
                error={errors.name ? true : false}
                onChange={this.handleChange}
                margin="normal"
              />

              <TextField
                variant="outlined"
                fullWidth
                id="video_url"
                label="Video URL"
                name="video_url"
                autoComplete="video_url"
                helperText={errors.video_url}
                value={this.state.video_url}
                error={errors.video_url ? true : false}
                onChange={this.handleChange}
                margin="normal"
              />

              <TextField
                variant="outlined"
                fullWidth
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                helperText={errors.description}
                value={this.state.description}
                error={errors.description ? true : false}
                onChange={this.handleChange}
                margin="normal"
              />

              <TextField
                variant="outlined"
                required
                fullWidth
                id="mList"
                label="Movements"
                name="mList"
                autoComplete="mList"
                helperText={errors.mList}
                error={errors.movements ? true : false}
                onChange={this.handleChange}
                value={this.state.mList}
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

            </div>
        )
    }
}

export default (withStyles(styles)(routine));