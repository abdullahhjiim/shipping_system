import React from 'react';

export default function Select(props) {

    const { name, label, value,error=null, onChange, options } = props;

    return (
        <select
            className="form-select form-control"
            placeholder={label}
            data-trigger
            id="status-field"
            name={name}
            value={value}
            onChange={onChange}
            >
                <option>{label}</option>
            {options.map((item, index) => (
            <option value={item.id} key={index}>
                {item.name ? item.name : item.title}
            </option>
            ))}
        </select>
    )
}
