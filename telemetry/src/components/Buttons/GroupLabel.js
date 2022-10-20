import React from "react";
import {Grid, Typography, Box, useTheme} from '@material-ui/core'

export default function GroupLabel({children, text, barColor}) {
  const theme = useTheme();
  return (
    <Grid container spacing={1} direction="column" alignItems="center">
      <Grid item>
        <Typography variant="subtitle1" component="span" display="block">
          {text}
        </Typography>
      </Grid>
      <Grid item>
        <Box
          bgcolor={barColor}
          sx={{
            border: "1 solid transparent",
            width: "9rem",
            height: "1rem",
            borderRadius: "1rem",
          }}
        />
      </Grid>
      {children}
    </Grid>
  );
}
