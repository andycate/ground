import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';

import FieldHeater from './FieldHeater';

const styles = theme => ({
  root: {
    height: '100%'
  },
  cardContent: {
    height: '100%',
    padding: '8px',
    paddingBottom: '8px !important'
  },
  container: {
    height: '100%'
  },
  item: {
    height: '33%',
    textAlign: 'center'
  }
});

class TankHeaterSquare extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, field1, field2, field3, field4, field5, field6 } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} className={classes.container}>
            <Grid item xs={12}>
              <Typography align='center' variant='h5'>
                Tank Heaters
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <FieldHeater
                name={field1.name}
                field={field1.field}
              />
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <FieldHeater
                name={field2.name}
                field={field2.field}
              />
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <FieldHeater
                name={field3.name}
                field={field3.field}
              />
            </Grid>

            <Grid item xs={6} className={classes.item}>
              <FieldHeater
                name={field4.name}
                field={field4.field}
              />
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <FieldHeater
                name={field5.name}
                field={field5.field}
              />
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <FieldHeater
                name={field6.name}
                field={field6.field}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(TankHeaterSquare));
