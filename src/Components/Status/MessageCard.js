import * as React from 'react';
import { Card } from '@mui/material';

export default function MessageCard(props) {
  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        padding: '1em',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: props.backgroundColor ? props.backgroundColor : 'black',
        alignItems: 'center',
      }}
    >
      {props.children}
    </Card>
  );
}
