export const urlBase = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ?
    'https://localhost:7197/api'
    :
    'http://cpaoliello-001-site1.htempurl.com/api'
    ;
