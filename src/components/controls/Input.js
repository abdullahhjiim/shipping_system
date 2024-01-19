import React from 'react';

export default function Input(props) {

    const { name, label, value, error=null, onChange, isError, ...other } = props;
    return (

        <input
                  type="text"
                  className={`form-control ${isError}`}
                  placeholder={label}
                  name={name}
                  value={value}
                  onChange={onChange}
                  {...other}
                  {...(error && {error:true,helperText:error})}
                />
    )
}
