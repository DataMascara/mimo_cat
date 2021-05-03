import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {' © '}
      <Link color="inherit" href="https://github.com/DataMascara/mimo_cat">
        data mascara
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function GH(props) {
  return (
    <Link color="primary" href="https://github.com/${props.username">
        {props.username}
    </Link> 
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url("unnamed.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: { 
    margin: theme.spacing('auto'),
    padding: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    maxWidth: 600
  },
  bottom: {
    position: 'fixed',
    bottom: 0,
    alignContent: "flex-end"
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper}  elevation={6} square>
        <div className={classes.paper}>
        <Grid container > 
          <Box  style={{ textAlign : 'center',  width: '600', mx: 'auto' }}  >
            
          <br />
          
          <Typography component="h1" variant="h5">
            <b>Minimum Movement Catalog</b>
          </Typography>
          </Box>


          <Typography variant="body2" component="p" gutterBottom>
            <br />
            This is a database of dance movements with a routine builder build with NodeJS/ReactJS, hosted on Firebase platform.
            <br />
            <br />
          </Typography>
          <Typography variant="body2" component="p" gutterBottom>

            Project idea comes from Maho Ogawa <Link href="https://www.suisoco.com" variant="body2">www.suisoco.com</Link> for her dissertation study at Brooklyn College.
            <br />
            <br />
          </Typography>

          <Typography component="p" variant="body2" gutterBottom>
            The project is based off of the project spec requirements and prototype produced by students in CISC 4900 of Fall 2020. 
            <br />
            <br />
            <Link color="primary" href="https://github.com/khinethet">Khine Thet</Link>, 
            <Link color="primary" href="https://github.com/stevezhuravel"> Steve Zhuravel</Link>, 
            <Link color="primary" href="https://github.com/CallMeOnii-chan"> Davante Middleton</Link>,
            <Link color="primary" href="https://github.com/Oljasa"> Oljas Alishev</Link>, 
            <Link color="primary" href="https://github.com/edmundSin"> Edmund Sin</Link>, 
            <Link color="primary" href="https://github.com/Michael-Volynskiy-BC"> Michael Volynskiy</Link>
            <br />supervised by <Link color="primary" href="https://github.com/katychuang"> Katherine Chuang</Link>
            <br /><br />
            The source for this website is hosted on <Link color="textPrimary" href="https://github.com/DataMascara/mimo_cat">
								GitHub
							</Link> protected under the MIT License.
          </Typography>
          </Grid>
          <Divider />
  
          <Box  style={{  width: '100%', }} >
            <Link href="/" variant="body2" className={classes.legal}>
              {"← Home"}
            </Link>
          </Box>
          <Box className={classes.bottom}>
            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}