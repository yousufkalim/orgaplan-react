import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import LoginBG from '../assets/images/login.png';

const styles = (theme) => ({
  ErrorBoundary: {
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(${LoginBG})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text404: {
    margin: '0',
    color: '#fff',
    fontSize: '24px',
    letterSpacing: '.2px',
    fontFamily: 'Roboto Mono, monospace',
  },
  button: {
    minWidth: 150,
    color: '#fff',
    borderColor: '#fff',
    backgroundColor: 'transparent',
    marginTop: '2em',
  },
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  //   static getDerivedStateFromError(error) {
  //     // Update state so the next render will show the fallback UI.
  //     return { hasError: true };
  //   }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { classes } = this.props;
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className={classes.ErrorBoundary}>
          <p className={classes.Text404}>404, page not found.</p>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => (window.location = '/')}
          >
            Home
          </Button>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default withStyles(styles, { withTheme: true })(ErrorBoundary);
