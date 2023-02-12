import type { FC } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Outlet } from 'react-router-dom';
import { 
  Box
 } from '@mui/material';

export interface BasicProps {
  routes:any;
  componentPlugins?: {
    TonConnectWallet?:FC
  };
}

export const Basic = (props:BasicProps) => {
  const { routes, componentPlugins } = props;

  return (
    <Box py={4} px={3}>
      <Outlet/>
    </Box>
  )
}


export default Basic;