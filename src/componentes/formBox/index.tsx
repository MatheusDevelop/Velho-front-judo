import { Stack, Paper, Typography, Divider, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";


export default function FormBoxComponent(props: {
    title: string,
    setState: any,
    state: any,
    setInvalid: any,
    leftSide?: any,
    validateInputs: any
    rows: Array<
        {
            inputs: Array<{ type: string, label: string, isRequired?: boolean, name: string, handleSelectChange?: any, options?: Array<{ label: string, value: any }> }>
        }
    >
}) {
    useEffect(() => { }, [props.validateInputs])
    return (
        <Paper elevation={2} component={Box} padding={2}>
            <Typography variant='subtitle2' mb={2}>
                {props.title}
            </Typography>
            <Divider />
            <Grid container>
                {props.leftSide && props.leftSide}
                <Grid item xs>
                    <Stack mt={2}>
                        {
                            props.rows.map((row, rowIdx) => (
                                <Grid container spacing={2}>
                                    {
                                        row.inputs.map((input, ipIdx) => (
                                            <Grid item xs mb={2}>
                                                {
                                                    input.type == 'select' ?

                                                        <FormControl
                                                            onError={() => props.setInvalid(true)}
                                                            error={props.validateInputs && input.isRequired && !props.state[input.name]}
                                                            required={input.isRequired}
                                                            size={'small'} fullWidth>
                                                            <InputLabel id={`${rowIdx}-${ipIdx}`}>{input.label}</InputLabel>
                                                            <Select
                                                                labelId={`${rowIdx}-${ipIdx}`}
                                                                id={`${rowIdx}-${ipIdx}-slct`}
                                                                value={props.state[input.name] || ''}
                                                                label={input.label}
                                                                onChange={(e) => {
                                                                    if (input.handleSelectChange != null)
                                                                        input.handleSelectChange(e)
                                                                    else
                                                                        props.setState((state: any) => ({ ...state, [input.name]: e.target.value }))
                                                                }}
                                                            >
                                                                {input.options && input.options.map(option => (
                                                                    <MenuItem value={option.value}>{option.label}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        :
                                                        <>
                                                            {props.validateInputs && input.isRequired && !props.state[input.name] && props.setInvalid(true)}
                                                            <TextField
                                                                size={'small'}

                                                                key={input.name}
                                                                onChange={(e) => {
                                                                    if( e.target.value != "")
                                                                        console.log('Nullable')
                                                                    props.setState((state: any) => ({ ...state, [input.name]: e.target.value != "" && e.target.value }))
                                                                }}
                                                                value={props.state[input.name] || ''}
                                                                fullWidth
                                                                variant="outlined"
                                                                required={input.isRequired}
                                                                label={input.label}
                                                                type={input.type}
                                                                {...input.type == 'date' && ({
                                                                    InputLabelProps: {
                                                                        shrink: true,
                                                                    }
                                                                })}
                                                                error={props.validateInputs && input.isRequired && !props.state[input.name]}
                                                            />
                                                        </>
                                                }

                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            ))
                        }
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    )
}