import styled from 'styled-components';
import colors from '../../styles/colors';

export const Input = styled.input`
    padding: 12px 16px;
    border-radius: 8px;
    border: solid 2px ${ colors.blue };
    
    &[type="number"] {
        max-width: 100px;
    }
    
    &[readonly] {
        border: none;
        font-size: 16px;
    }
    
    &:not(:last-child) {
        margin-right: 10px;
    }
`;

export const Select = styled.select`
    padding: 12px 16px;
    border-radius: 8px;
    border: solid 2px ${ colors.blue };
    
    &[disabled] {
        border: none;
        font-size: 16px;
    }
    
    &:not(:last-child) {
        margin-right: 10px;
    }
`;

export const Button = styled.button`
    cursor: pointer; 
    border: none;
    box-shadow: none;
    background-color: ${ colors.blue };
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    
    &.delete {
        background-color: ${ colors.red }
    }
    
    &:not(:last-child) {
        margin-right: 10px;
    }
`;

export const AssetList = styled.ul`
    padding: 0;
    background-color: white;
    position: absolute;
    left: 0;
    top: 100%;
    max-height: 400px;
    overflow-y: auto;
    list-style: none;
    
    li {
        &:not(:last-child) {
            margin-bottom: 6px;
        }
    }
    
    button {
        background-color: white;
        border: solid 2px black;
        cursor: pointer;
        padding: 12px;
        border-radius: 6px;
        display: block;
    }
`;

export const Form = styled.form`
    position: relative;
    
    p.error {
        display: inline-block;
        padding: 10px;
        font-size: 12px;
        border-radius: 6px;
        background-color: ${ colors.red };
        color: white;
        margin-top: 5px;
    }
`; 