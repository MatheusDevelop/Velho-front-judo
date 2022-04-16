import { AddAPhotoOutlined, Save } from '@mui/icons-material'
import { Alert, AlertTitle, Avatar, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ComponenteBotoesDeCadastro from '../botoesCadastro'

const baseUrl = 'https://localhost:7051/api'

function ComponenteCadastroAtleta() {
    const atualCliente = 1
    const [registroAtleta, setRegistroAtleta]: any = useState({
        idSexo: 1,
        idCliente:atualCliente
    });

    const [cidades, setCidades] = useState([])
    const [estados, setEstados] = useState([])
    const [estadoCivis, setEstadoCivis] = useState([])
    const [sexos, setSexos] = useState([])
    const [paises, setPaises] = useState([])
    const [orgaoEmissor, setOrgaoEmissor] = useState([])
    const [profissoes, setProfissoes] = useState([])

    const [aguardandoResposta, setAguardandoResposta] = useState(false)
    const [respostaDeSucesso, setRespostaDeSucesso] = useState(false)
    const [camposInvalidos, setCamposInvalidos] = useState(false)

    const [errosEmCamposObrigatorios, setErrosEmCamposObrigatorios] = useState({
        registroFederacao: false,
        registroConfederacao: false,
        nomeAtleta: false,
        profissao: false,
        dataNascimento: false,
        estadoCivil: false,
        dataEmissao: false,
        orgaoEmissor: false,
        dataFiliacao: false,
        pais: false,
        estado: false,
        cidade: false,
        endereco: false,
        bairro: false,
        nomeMae: false,
        nomePai: false,
        cpf: false,
        identidade: false,
    })

    useEffect(() => {
        fetchProfissoes();
        fetchEstados();
        fetchEstadosCivil();
        fetchCidades();
        fetchSexos();
        fetchPaises();
        fetchOrgaoEmissor();
    }, [])

    const eventoDeSalvar = async () => {
        try {

            let invalid = false
            invalid = validateInputs(registroAtleta, invalid, setErrosEmCamposObrigatorios)
            if (invalid) {
                setCamposInvalidos(true)
                setTimeout(() => {
                    setCamposInvalidos(false)
                }, 3000);
                return;
            }
            setAguardandoResposta(true);

            let registroFormatado = {
                ...registroAtleta,
                dataFiliacao: registroAtleta.dataFiliacao + 'T00:00:00.000Z',
                dataIdentidade: registroAtleta.dataIdentidade + 'T00:00:00.000Z',
                dataNascimento: registroAtleta.dataNascimento + 'T00:00:00.000Z'
            }

            await fetch(baseUrl + '/Atletas', { body: JSON.stringify(registroFormatado), method: 'POST',headers:{'Content-type':"application/json"}})
            setAguardandoResposta(false);
            // setRegistroAtleta({ idSexo: 1 })
            setRespostaDeSucesso(true)
            setTimeout(() => {
                setRespostaDeSucesso(false)
            }, 3000);
        } catch (e) {
            console.log(e)
        }

    }

    const fetchOrgaoEmissor = async () => {
        try {
            const dados = await fetch(baseUrl + '/EmissoresIdentidades');
            const json = await dados.json();
            setOrgaoEmissor(json)
        } catch (e) {
            console.log(e)
        }
    }
    const fetchPaises = async () => {
        try {
            const dados = await fetch(baseUrl + '/Paises');
            const json = await dados.json();
            setPaises(json)
        } catch (e) {
            console.log(e)
        }
    }
    const fetchSexos = async () => {
        try {
            const dados = await fetch(baseUrl + '/Sexos');
            const json = await dados.json();
            setSexos(json)
        } catch (e) {
            console.log(e)
        }
    }
    const fetchCidades = async () => {
        try {
            const dados = await fetch(baseUrl + '/Cidades');
            const json = await dados.json();
            setCidades(json)
        } catch (e) {
            console.log(e)
        }
    }
    const fetchProfissoes = async () => {
        try {
            const dados = await fetch(baseUrl + '/Profissoes');
            const json = await dados.json();
            setProfissoes(json)
        } catch (e) {
            console.log(e)
        }
    }
    const fetchEstados = async () => {
        try {
            const dados = await fetch(baseUrl + '/Estados');
            const json = await dados.json();
            setEstados(json);
        } catch (e) {
            console.log(e)
        }
    }
    const fetchEstadosCivil = async () => {
        try {
            const dados = await fetch(baseUrl + '/EstadosCivis');
            const json = await dados.json();
            setEstadoCivis(json);
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Stack sx={{ flex: 1, backgroundColor: "#cccccc" }}>
            {
                respostaDeSucesso &&
                <Box sx={{ width: '100%', position: 'absolute', left: 0, top: 0, display: 'flex', justifyContent: 'center' }}>
                    <Alert>
                        <AlertTitle>Atleta adicionado(a) com sucesso</AlertTitle>
                    </Alert>
                </Box>
            }
            {
                camposInvalidos &&
                <Box sx={{ width: '100%', position: 'absolute', left: 0, top: 0, display: 'flex', justifyContent: 'center' }}>
                    <Alert severity='error'>
                        <AlertTitle>Verifique e preencha os campos obrigatorios</AlertTitle>
                    </Alert>
                </Box>
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={aguardandoResposta}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box padding={2} sx={{ flex: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <Paper elevation={2} component={Box} padding={2}>
                            <Typography variant='subtitle2' mb={2}>
                                Dados pessoais
                            </Typography>
                            <Divider />
                            <Grid container wrap={'nowrap'} >
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
                                <Grid item xs={7}>
                                    <Box mt={2} sx={{ display: 'flex' }}>
                                        <TextField
                                            error={errosEmCamposObrigatorios.registroFederacao}
                                            onChange={e => setRegistroAtleta({ ...registroAtleta, registroFederacao: e.target.value })} value={registroAtleta.registroFederacao} margin={'dense'} required size="small" variant="outlined" label="Registro federação" />
                                        <TextField
                                            error={errosEmCamposObrigatorios.registroConfederacao}
                                            onChange={e => setRegistroAtleta({ ...registroAtleta, registroConfederacao: e.target.value })} value={registroAtleta.registroConfederacao} margin={'dense'} sx={{ marginLeft: 1 }} required size="small" variant="outlined" label="Registro confederação" />
                                    </Box>
                                    <TextField
                                        error={errosEmCamposObrigatorios.nomeAtleta}
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, nomeAtleta: e.target.value })} value={registroAtleta.nomeAtleta} margin={'dense'} required size="small" variant="outlined" label="Nome" fullWidth
                                    />
                                    <TextField
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, email: e.target.value })} value={registroAtleta.email} margin={'dense'} size="small" variant="outlined" label="Email" fullWidth />
                                    <FormControl
                                        error={errosEmCamposObrigatorios.profissao}
                                        required sx={{ mt: 1, mb: 2, width: '100%' }} size="small">
                                        <InputLabel id="a-profi">Profissão</InputLabel>
                                        <Select
                                            labelId="a-profi"
                                            id="a-profi-select"
                                            label="Profissão"
                                            value={registroAtleta.idProfissaoAtleta || ''}
                                            onChange={(e: SelectChangeEvent) => {
                                                setRegistroAtleta({ ...registroAtleta, idProfissaoAtleta: e.target.value })
                                            }}
                                        >

                                            {
                                                profissoes.map((profissao: any) => (
                                                    <MenuItem value={profissao.idProfissao} >{profissao.descricao}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <Box sx={{ display: 'flex' }}>
                                        <TextField
                                            size='small'
                                            onChange={e => setRegistroAtleta({ ...registroAtleta, dataNascimento: e.target.value })} value={registroAtleta.dataNascimento}
                                            label="Data de nascimento"
                                            type="date"
                                            sx={{ mr: 2 }}
                                            error={errosEmCamposObrigatorios.dataNascimento}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <FormControl
                                            error={errosEmCamposObrigatorios.estadoCivil}
                                            required sx={{ minWidth: '200px' }} size="small">
                                            <InputLabel id="est-civil">Estado civil</InputLabel>
                                            <Select
                                                labelId="est-civil"
                                                label="Estado civil"
                                                value={registroAtleta.idEstadoCivil || ''}
                                                onChange={(e: SelectChangeEvent) => {
                                                    setRegistroAtleta({ ...registroAtleta, idEstadoCivil: e.target.value })
                                                }}
                                            >

                                                {
                                                    estadoCivis.map((estadoCivil: any) => (
                                                        <MenuItem value={estadoCivil.idEstadoCivil} >{estadoCivil.descricao}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ display: 'flex' }} mt={1} mb={2}>
                                        <TextField
                                            onChange={e => setRegistroAtleta({ ...registroAtleta, telefone: e.target.value })} value={registroAtleta.telefone}
                                            margin={'dense'} size="small" variant="outlined" label="Telefone" />
                                        <TextField
                                            disabled
                                            size='small'
                                            sx={{ ml: 2 }}
                                            required
                                            label="Sigla"
                                            onChange={e => setRegistroAtleta({ ...registroAtleta, sigla: e.target.value })} value={registroAtleta.sigla}
                                            margin={'dense'}
                                        />
                                    </Box>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Sexo</FormLabel>
                                        <FormGroup >
                                            {
                                                sexos.map((sexo: any) => (
                                                    <FormControlLabel
                                                        onClick={() => setRegistroAtleta({ ...registroAtleta, idSexo: sexo.idSexo })}
                                                        control={<Checkbox checked={registroAtleta.idSexo == sexo.idSexo} name={sexo.descricao} />}
                                                        label={sexo.descricao}
                                                    />
                                                ))
                                            }
                                        </FormGroup>
                                    </FormControl>
                                    <FormControl disabled component="fieldset" sx={{ marginLeft: 8 }}>
                                        <FormLabel component="legend">Situação</FormLabel>
                                        <FormGroup >
                                            <FormControlLabel
                                                control={<Checkbox checked={true} name="Ativo" />}
                                                label="Ativo"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={false} name="Inativo" />}
                                                label="Inativo"
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Box mt={2}>
                            <Paper elevation={2} component={Box} padding={2}>
                                <Typography variant='subtitle2' mb={2}>
                                    Endereço
                                </Typography>
                                <Divider />
                                <Grid container spacing={2} mt={.1}>
                                    <Grid item xs>
                                        <TextField
                                            onChange={e => setRegistroAtleta({ ...registroAtleta, cep: e.target.value })} value={registroAtleta.cep}
                                            margin={'dense'} size="small" variant="outlined" label="CEP" />
                                        <FormControl
                                            error={errosEmCamposObrigatorios.pais}
                                            required
                                            sx={{ minWidth: '210px', mt: 2 }} size="small">
                                            <InputLabel id="pais">Pais</InputLabel>
                                            <Select
                                                labelId="pais"
                                                label="Pais"
                                                value={registroAtleta.idPais || ''}
                                                onChange={(e: SelectChangeEvent) => {
                                                    setRegistroAtleta({ ...registroAtleta, idPais: e.target.value })
                                                }}
                                            >

                                                {
                                                    paises.map((pais: any) => (
                                                        <MenuItem value={pais.idPais} >{pais.descricao}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            error={errosEmCamposObrigatorios.endereco}
                                            required
                                            onChange={e => setRegistroAtleta({ ...registroAtleta, endereco: e.target.value })} value={registroAtleta.endereco}
                                            margin={'dense'} size="small" variant="outlined" label="Endereço" fullWidth />
                                        <Box sx={{ display: 'flex' }}>
                                            <FormControl
                                                error={errosEmCamposObrigatorios.estado}
                                                required
                                                sx={{ minWidth: '150px', mt: 2, mr: 2 }} size="small">
                                                <InputLabel id="estado">Estado</InputLabel>
                                                <Select
                                                    labelId="estado"
                                                    label="Estado"
                                                    value={registroAtleta.idEstado || ''}
                                                    onChange={(e: SelectChangeEvent) => {
                                                        setRegistroAtleta({ ...registroAtleta, idEstado: e.target.value })
                                                    }}
                                                >

                                                    {
                                                        estados.map((estado: any) => (
                                                            <MenuItem value={estado.idEstado} >{estado.descricao}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                            <FormControl
                                                error={errosEmCamposObrigatorios.cidade}
                                                required
                                                sx={{ minWidth: '150px', mt: 2, mr: 2 }} size="small">
                                                <InputLabel id="cidade">Cidade</InputLabel>
                                                <Select
                                                    labelId="cidade"
                                                    label="Cidade"
                                                    value={registroAtleta.idCidade || ''}
                                                    onChange={(e: SelectChangeEvent) => {
                                                        let obj = cidades.find((c: any) => c.idCidade == e.target.value)
                                                        //@ts-ignore
                                                        setRegistroAtleta((state: any) => ({ ...state, idCidade: obj.idCidade }))
                                                        //@ts-ignore
                                                        setRegistroAtleta((state: any) => ({ ...state, idEstado: obj.idEstado }))
                                                        //@ts-ignore
                                                        setRegistroAtleta((state: any) => ({ ...state, idPais: obj.idPais }))
                                                    }}
                                                >

                                                    {
                                                        cidades.map((cidade: any) => (
                                                            <MenuItem value={cidade.idCidade} >{cidade.descricao}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            onChange={e => setRegistroAtleta({ ...registroAtleta, complemento: e.target.value })} value={registroAtleta.complemento}
                                            margin={'dense'} size="small" variant="outlined" label="Complemento" fullWidth />
                                        <Box mt={1}>
                                            <TextField
                                                error={errosEmCamposObrigatorios.bairro}
                                                required
                                                onChange={e => setRegistroAtleta({ ...registroAtleta, bairro: e.target.value })} value={registroAtleta.bairro}
                                                margin={'dense'} size="small" variant="outlined" label="Bairro" fullWidth />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs>
                        <Stack>
                            <Paper elevation={2} component={Box} padding={2}>
                                <Typography variant='subtitle2' mb={2}>
                                    Documentos
                                </Typography>
                                <Divider />
                                <Box mt={2} sx={{ display: 'flex' }}>
                                    <TextField
                                        error={errosEmCamposObrigatorios.identidade}
                                        required
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, identidade: e.target.value })} value={registroAtleta.identidade}
                                        margin={'dense'} size="small" variant="outlined" label="Identidade" />
                                    <TextField margin={'dense'} type="date"
                                        error={errosEmCamposObrigatorios.dataEmissao}
                                        sx={{ ml: 2 }}
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, dataIdentidade: e.target.value })} value={registroAtleta.dataIdentidade}
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }} size="small" variant="outlined" label="Data de emissão" />
                                </Box>

                                <Box mt={2} sx={{ display: 'flex' }}>
                                    <FormControl
                                        error={errosEmCamposObrigatorios.orgaoEmissor}
                                        required sx={{ minWidth: '210px' }} size="small">
                                        <InputLabel id="est-civil">Orgão emissor</InputLabel>
                                        <Select
                                            labelId="est-civil"
                                            label="Orgão emissor"
                                            value={registroAtleta.idEmissor || ''}
                                            onChange={(e: SelectChangeEvent) => {
                                                setRegistroAtleta({ ...registroAtleta, idEmissor: e.target.value })
                                            }}
                                        >

                                            {
                                                orgaoEmissor.map((emissor: any) => (
                                                    <MenuItem value={emissor.idEmissor} >{emissor.descricao}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        error={errosEmCamposObrigatorios.cpf}
                                        required
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, cpf: e.target.value })} value={registroAtleta.cpf}
                                        sx={{ ml: 2 }} size="small" variant="outlined" label="CPF" />
                                </Box>
                                <Box mt={1} sx={{ display: 'flex' }}>
                                    <TextField
                                        disabled
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, pis: e.target.value })} value={registroAtleta.pis}
                                        margin={'dense'} size="small" variant="outlined" label="PIS" />
                                    <TextField
                                        disabled
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, inss: e.target.value })} value={registroAtleta.inss}
                                        sx={{ ml: 2 }} margin={'dense'} size="small" variant="outlined" label="INSS" />
                                </Box>
                                <Box mt={1} sx={{ display: 'flex' }}>
                                    <TextField margin={'dense'}
                                        disabled
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, passaporte: e.target.value })} value={registroAtleta.passaporte}
                                        size="small" variant="outlined" label="Passaporte"
                                    />
                                    <TextField margin={'dense'} type="date"
                                        sx={{ ml: 2 }}
                                        required
                                        disabled
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, dataValidadePassaporte: e.target.value })} value={registroAtleta.dataValidadePassaporte}
                                        InputLabelProps={{
                                            shrink: true,
                                        }} size="small" variant="outlined" label="Data de validade" />
                                </Box>
                                <Box mt={1} sx={{ display: 'flex' }}>
                                    <TextField margin={'dense'} type="date"
                                        error={errosEmCamposObrigatorios.dataFiliacao}
                                        required
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, dataFiliacao: e.target.value })} value={registroAtleta.dataFiliacao}
                                        InputLabelProps={{
                                            shrink: true,
                                        }} size="small" variant="outlined" label="Data de filiação" />
                                    <TextField
                                        sx={{ ml: 2 }}
                                        margin={'dense'}
                                        disabled
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, cref: e.target.value })} value={registroAtleta.cref}
                                        size="small" variant="outlined" label="CREF" />
                                </Box>
                            </Paper>
                        </Stack>
                        <Stack mt={2}>
                            <Paper elevation={2} component={Box} padding={2}>
                                <Typography variant='subtitle2' mb={2}>
                                    Filiação
                                </Typography>
                                <Divider />
                                <Box mt={3} sx={{ display: 'flex' }}>
                                    <TextField
                                        required
                                        error={errosEmCamposObrigatorios.nomeMae}
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, nomeMae: e.target.value })} value={registroAtleta.nomeMae}
                                        sx={{ mr: 2 }} size="small" variant="outlined" label="Nome da mãe"
                                    />
                                    <FormControl sx={{ minWidth: '250px' }} size="small">
                                        <InputLabel id="m-profi">Profissão da mãe</InputLabel>
                                        <Select
                                            labelId="m-profi"
                                            label="Profissao da mãe"
                                            value={registroAtleta.idProfissaoMae || ''}
                                            onChange={(e: SelectChangeEvent) => {
                                                setRegistroAtleta({ ...registroAtleta, idProfissaoMae: e.target.value })
                                            }}
                                        >

                                            {
                                                profissoes.map((profissao: any) => (
                                                    <MenuItem value={profissao.idProfissao} >{profissao.descricao}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box mt={2} sx={{ display: 'flex' }}>
                                    <TextField
                                        error={errosEmCamposObrigatorios.nomePai}
                                        required
                                        onChange={e => setRegistroAtleta({ ...registroAtleta, nomePai: e.target.value })} value={registroAtleta.nomePai}
                                        sx={{ mr: 2 }} size="small" variant="outlined" label="Nome do pai" />
                                    <FormControl sx={{ minWidth: '250px' }} size="small">
                                        <InputLabel id="f-profi">Profissão do pai</InputLabel>
                                        <Select
                                            labelId="f-profi"
                                            label="Profissão do pai"
                                            value={registroAtleta.idProfissaoPai || ''}
                                            onChange={(e: SelectChangeEvent) => {
                                                setRegistroAtleta({ ...registroAtleta, idProfissaoPai: e.target.value })
                                            }}
                                        >

                                            {
                                                profissoes.map((profissao: any) => (
                                                    <MenuItem value={profissao.idProfissao} >{profissao.descricao}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Paper>
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
                    <ComponenteBotoesDeCadastro clickEmSalvar={eventoDeSalvar} />
                </Box>
            </Box>
        </Stack >
    )
}

export default ComponenteCadastroAtleta


function validateInputs(registroAtleta: any, invalid: boolean, setErrosEmCamposObrigatorios: any) {
    if (registroAtleta.registroConfederacao == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, registroConfederacao: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, registroConfederacao: false }))
    }
    if (registroAtleta.registroFederacao == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, registroFederacao: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, registroFederacao: false }))
    }
    if (registroAtleta.nomeAtleta == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, nomeAtleta: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, nomeAtleta: false }))
    }
    if (registroAtleta.idProfissaoAtleta == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, profissao: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, profissao: false }))
    }
    if (registroAtleta.dataNascimento == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, dataNascimento: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, dataNascimento: false }))
    }
    if (registroAtleta.idEstadoCivil == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, estadoCivil: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, estadoCivil: false }))
    }
    if (registroAtleta.dataIdentidade == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, dataEmissao: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, dataEmissao: false }))
    }
    if (registroAtleta.dataFiliacao == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, dataFiliacao: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, dataFiliacao: false }))
    }
    if (registroAtleta.idEmissor == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, orgaoEmissor: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, orgaoEmissor: false }))
    }
    if (registroAtleta.idPais == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, pais: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, pais: false }))
    }
    if (registroAtleta.endereco == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, endereco: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, endereco: false }))
    }
    if (registroAtleta.idEstado == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, estado: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, estado: false }))
    }
    if (registroAtleta.idCidade == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, cidade: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, cidade: false }))
    }
    if (registroAtleta.bairro == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, bairro: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, bairro: false }))
    }
    if (registroAtleta.nomeMae == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, nomeMae: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, nomeMae: false }))
    }
    if (registroAtleta.nomePai == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, nomePai: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, nomePai: false }))
    }
    if (registroAtleta.cpf == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, cpf: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, cpf: false }))
    }

    if (registroAtleta.identidade == null) {
        invalid = true
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, identidade: true }))
    } else {
        setErrosEmCamposObrigatorios((state: any) => ({ ...state, identidade: false }))
    }
    return invalid
}

