import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import './ClientListSelect.css'
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

interface ClientListSelectProps {
  list: string[],
  didChangeSelected: (selected: string) => void
}

const StyledInputLabel = styled(InputLabel)(() => ({
  color: '#ffffff',
  fontSize: '14px',
  transform: 'translate(3px, -22px)',
  '&.Mui-focused': {
    color: '#ffffff',
  }
}));

const BootstrapInput = styled(InputBase)(() => ({
  '& .MuiInputBase-input': {
    color: '#ffffff',
    padding: '10px 26px 10px 12px',
    position: 'relative',
    fontSize: 16,
    backgroundColor: '#1A1A1A',
    border: '1px solid #1A1A1A',
    '&:hover': {
      borderColor: '#9500fa',
    },
    '&:focus': {
      borderColor: '#ffffff',
    },
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  }
}));

const ClientListSelect = ({list, didChangeSelected}: ClientListSelectProps) => {
  const [client, setClient] = React.useState('');
  const handleChangeSelected = (event: SelectChangeEvent) => {
    setClient(event.target.value as string);
    didChangeSelected(event.target.value);
  };

  return <FormControl fullWidth >
    <StyledInputLabel className="FormControl" id="select-input-id">Cliente</StyledInputLabel>
    <Select
      labelId="select-label-id"
      id="select-id"
      value={client}
      autoWidth
      onChange={handleChangeSelected}
      input={<BootstrapInput />}
    >
      {createMenuItems(list)}
    </Select>
  </FormControl>;
}

function createMenuItems(clientsList: string[]){
  return clientsList.map((element) => { 
    return <MenuItem key={element} value={element}>{element}</MenuItem>
  })
}

export default ClientListSelect;