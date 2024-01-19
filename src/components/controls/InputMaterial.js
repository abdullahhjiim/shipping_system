import { TextField } from '@material-ui/core';
import React from 'react';

export default function InputMaterial(props) {

    const { name, label, value,error=null, onChange, ...other } = props;
    return (
        <TextField
            variant="standard"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            {...other}
            {...(error && {error:true,helperText:error})}
        />
    )
}
