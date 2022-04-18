import { AddAPhotoOutlined, Save } from '@mui/icons-material'
import { Alert, AlertTitle, Avatar, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ComponenteBotoesDeCadastro from '../botoesCadastro'
import FormBoxComponent from '../formBox'

const baseUrl = 'https://localhost:7082/api/v1'

function InsertAthleteComponent() {
    const client = 3
    const [athleteRegistry, setAthleteRegistry]: any = useState({
        clientId: client
    });

    const [cities, setCities] = useState([])
    const [states, setStates] = useState([])
    const [civilStates, setCivilStates] = useState([])
    const [sexes, setSexes] = useState([])
    const [countries, setCountries] = useState([])
    const [documentIssuers, setDocumentIssuers] = useState([])
    const [profissions, setProfissions] = useState([])

    const [validateInputs, setValidateInputs] = useState(false)
    const [inputsInvalid, setInputsInvalid] = useState(false)


    const [waitingResponse, setWaitingResponse] = useState(false)
    const [successResponse, setSuccessResponse] = useState(false)
    const [errorResponse, setErrorResponse] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])
    const [showInvalidInputsAlert, setShowInvalidInputsAlert] = useState(false)
    const [firstRender, setFirstRender] = useState(true)
    const [showErrorOnLoadingAlert, setShowErrorOnLoadingAlert] = useState(false)

    useEffect(() => {
        fetchSelects();
    }, [])
    const fetchSelects = () => {
        [
            { apiName: 'cities', setToState: setCities },
            { apiName: 'states', setToState: setStates },
            { apiName: 'civilStates', setToState: setCivilStates },
            { apiName: 'sexes', setToState: setSexes },
            { apiName: 'countries', setToState: setCountries },
            { apiName: 'documentIssuers', setToState: setDocumentIssuers },
            { apiName: 'profissions', setToState: setProfissions },

        ].map(apiFetch => {
            fetchData(apiFetch.apiName, apiFetch.setToState);
        })
    }
    useEffect(() => {
        if (inputsInvalid) {
            setShowInvalidInputsAlert(true)
            setTimeout(() => {
                setShowInvalidInputsAlert(false)
            }, 3000);
        }
    }, [inputsInvalid])
    const fetchData = async (apiName: string, setToState: any) => {
        try {
            const content = await fetch(baseUrl + '/' + apiName);
            const json = await content.json();
            if (json.success)
                setToState(json.data)
            else {
                setShowErrorOnLoadingAlert(true)
                setTimeout(() => {
                    setShowErrorOnLoadingAlert(false)
                }, 3000);
            }
        } catch (e) {
            console.log(e)
            setShowErrorOnLoadingAlert(true)
            setTimeout(() => {
                setShowErrorOnLoadingAlert(false)
            }, 3000);
        }
    }
    const requestSaveAthlete = async () => {
        setValidateInputs(false)
        setInputsInvalid(false)
        setWaitingResponse(true)
        const content = await fetch(baseUrl + '/athletes',
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(athleteRegistry)
            })
        const json = await content.json();
        setWaitingResponse(false)
        if (json.success) {

            setSuccessResponse(true)
            setTimeout(() => {
                setSuccessResponse(false)
            }, 3000);
        } else {
            console.log(json.status,json.traceId)
            if (json.status == '400') {
                if (json.traceId != null) {
                    setValidateInputs(true)
                    return;
                }
                else {
                    setErrorResponse(true)
                    setErrorMessages(json.errors)
                    setTimeout(() => {
                        setErrorResponse(false)
                        setErrorMessages([])
                    }, 8000);
                    return;
                }
            }
            setErrorResponse(true)
            setErrorMessages(json.errors)
            setTimeout(() => {
                setErrorResponse(false)
                setErrorMessages([])
            }, 8000);
        }
    }
    const handleSaveClick = async () => {
        await requestSaveAthlete();
    }



    return (
        <Stack sx={{ flex: 1, backgroundColor: "#cccccc" }}>
            {
                successResponse &&
                <Box sx={{ width: '100%', position: 'fixed', left: 0, top: 0, display: 'flex', justifyContent: 'center' }}>
                    <Alert>
                        <AlertTitle>Atleta adicionado(a) com sucesso</AlertTitle>
                    </Alert>
                </Box>
            }
            {
                showInvalidInputsAlert &&
                <Box sx={{ width: '100%', position: 'fixed', left: 0, top: 0, display: 'flex', justifyContent: 'center' }}>
                    <Alert severity='error'>
                        <AlertTitle>Verifique e preencha os campos obrigatorios</AlertTitle>
                    </Alert>
                </Box>
            }
            {
                showErrorOnLoadingAlert &&
                <Box sx={{ width: '100%', position: 'fixed', left: 0, top: 0, display: 'flex', justifyContent: 'center' }}>
                    <Alert severity='error'>
                        <AlertTitle>Ocorreu um erro ao carregar o conteudo, tente novamente mais tarde.</AlertTitle>
                    </Alert>
                </Box>
            }
            {
                errorResponse &&
                <Box sx={{ width: '100%', position: 'fixed', left: 0, top: 0, display: 'flex', justifyContent: 'center' }}>
                    <Alert severity='error'>
                        <AlertTitle>Erro ao adicionar atleta.</AlertTitle>
                        {errorMessages.map(e => e)}
                    </Alert>
                </Box>
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={waitingResponse}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box padding={2} sx={{ flex: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <Stack>
                            <FormBoxComponent
                                title="Dados pessoais"
                                state={athleteRegistry}
                                setState={setAthleteRegistry}
                                validateInputs={validateInputs}
                                setInvalid={setInputsInvalid}
                                leftSide={
                                    <Grid item xs={4} >
                                        <Box mt={2}>
                                            <Avatar
                                                src="/static/images/avatar/1.jpg"
                                                sx={{ width: 150, height: 150 }}
                                            />
                                        </Box>
                                        <Box mt={1}>
                                            <label htmlFor="imge-file">
                                                <input hidden id="imge-file" type="file" />
                                                <Button color="secondary" variant="outlined" startIcon={<AddAPhotoOutlined fontSize='small' />} >
                                                    Adicionar foto
                                                </Button>
                                            </label>
                                        </Box>
                                    </Grid>
                                }
                                rows={[
                                    {
                                        inputs: [
                                            { type: "text", label: "Registro federação", isRequired: true, name: "federationRegistry" },
                                            { type: "text", label: "Registro confederação", isRequired: true, name: "confederationRegistry" },
                                        ]
                                    },
                                    {
                                        inputs: [
                                            { type: "text", label: "Nome", isRequired: true, name: "name" },
                                        ]
                                    },
                                    {
                                        inputs: [
                                            { type: "text", label: "Email", isRequired: true, name: "email" },
                                        ]
                                    },
                                    {
                                        inputs: [
                                            {
                                                type: "select"
                                                , label: "Profissão"
                                                , isRequired: true
                                                , name: "profissionId"
                                                , options: profissions.map((e: any) => ({ label: e.name, value: e.id }))
                                            }
                                        ]
                                    },
                                    {
                                        inputs: [
                                            { type: "date", label: "Data de nascimento", isRequired: true, name: "birthDate" },
                                            {
                                                type: "select"
                                                , label: "Estado civíl"
                                                , isRequired: true
                                                , name: "civilStateId"
                                                , options: civilStates.map((e: any) => ({ label: e.name, value: e.id }))
                                            },
                                            {
                                                type: "select"
                                                , label: "Sexo"
                                                , isRequired: true
                                                , name: "sexId"
                                                , options: sexes.map((e: any) => ({ label: e.name, value: e.id }))
                                            },

                                        ]
                                    },
                                    {
                                        inputs: [
                                            { type: "text", label: "Telefone", isRequired: true, name: "phone" },
                                            {
                                                type: "select"
                                                , label: "Nacionalidade"
                                                , isRequired: true
                                                , name: "nationalityId"
                                                , options: countries.map((e: any) => ({ label: `${e.name} - ${e.citizenNationalityName || ''} `, value: e.id }))
                                            },
                                        ],
                                        
                                    },

                                ]}
                            />
                        </Stack>
                        <Stack mt={2}>
                            <FormBoxComponent
                                title="Endereço"
                                state={athleteRegistry}
                                setState={setAthleteRegistry}
                                validateInputs={validateInputs}
                                setInvalid={setInputsInvalid}
                                rows={[
                                    {
                                        inputs: [
                                            { type: "text", label: "CEP", name: "cep", isRequired: true },
                                            { type: "text", label: "Endereço", isRequired: true, name: "address" },
                                            { type: "text", label: "Complemento", name: "complement" },
                                        ]
                                    },
                                    {
                                        inputs: [
                                            {
                                                type: "select"
                                                , label: "Pais"
                                                , isRequired: true
                                                , name: "countryId"
                                                , options: countries.map((e: any) => ({ label: e.name, value: e.id }))
                                            },
                                            {
                                                type: "select"
                                                , label: "Estado"
                                                , isRequired: true
                                                , name: "stateId"
                                                , options: states.map((e: any) => ({ label: e.name, value: e.id }))
                                            },
                                            {
                                                type: "select"
                                                , label: "Cidade"
                                                , isRequired: true
                                                , name: "cityId"
                                                , options: cities.map((e: any) => ({ label: e.name, value: e.id }))
                                            },
                                            { type: "text", label: "Bairro", isRequired: true, name: "district" },
                                        ]
                                    }
                                ]}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs>
                        <Stack>
                            <FormBoxComponent
                                title='Documentos'
                                state={athleteRegistry}
                                setState={setAthleteRegistry}
                                setInvalid={setInputsInvalid}
                                validateInputs={validateInputs}
                                rows={[
                                    {
                                        inputs: [
                                            { type: "text", label: "Identidade", isRequired: true, name: "document" },
                                            { type: "date", label: "Data de emissão", isRequired: true, name: "documentDate" },
                                        ]
                                    },
                                    {
                                        inputs: [
                                            {
                                                type: "select"
                                                , label: "Orgão emissor"
                                                , isRequired: true
                                                , name: "issuerId"
                                                , options: documentIssuers.map((e: any) => ({ label: e.name, value: e.id }))
                                            },
                                            { type: "text", label: "CPF", isRequired: true, name: "cpf" },
                                        ]
                                    },
                                    {
                                        inputs: [
                                            { type: "date", label: "Data de filiação", isRequired: true, name: "filiationDate" },
                                        ]
                                    }
                                ]}
                            />
                        </Stack>
                        <Stack mt={2}>
                            <FormBoxComponent
                                title='Filiação'
                                state={athleteRegistry}
                                setState={setAthleteRegistry}
                                validateInputs={validateInputs}
                                setInvalid={setInputsInvalid}
                                rows={[
                                    {
                                        inputs: [
                                            { type: "text", label: "Nome da mãe", isRequired: true, name: "motherName" },
                                            {
                                                type: "select"
                                                , label: "Profissão da mãe"
                                                , isRequired: true
                                                , name: "motherProfissionId"
                                                , options: profissions.map((e: any) => ({ label: e.name, value: e.id }))
                                            },
                                        ]
                                    },
                                    {
                                        inputs: [
                                            { type: "text", label: "Nome do pai", isRequired: true, name: "fatherName" },
                                            {
                                                type: "select"
                                                , label: "Profissão do pai"
                                                , isRequired: true
                                                , name: "fatherProfissionId"
                                                , options: profissions.map((e: any) => ({ label: e.name, value: e.id }))
                                            },
                                        ]
                                    }
                                ]}
                            />
                        </Stack>
                        <Stack mt={2}>
                            <Paper elevation={2} component={Box} padding={2}>
                                <Typography variant='subtitle2' mb={2}>
                                    Mensagens
                                </Typography>
                                <Divider />
                            </Paper>
                        </Stack>
                        <Stack mt={2}>
                            <Paper elevation={2} component={Box} padding={2}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography variant='subtitle2'>
                                        Codigo:
                                    </Typography>
                                    <Typography variant="body1" ml={2}>
                                        0
                                    </Typography>
                                </Box>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid >
            </Box >
            <Box sx={{ height: 100 }}>
                <Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 99 }}>
                    <ComponenteBotoesDeCadastro clickEmSalvar={handleSaveClick} />
                </Box>
            </Box>
        </Stack >
    )
}

export default InsertAthleteComponent