export const userValidSchema= {
    body:{
        type:"object",
        required:["nombres","correo","edad","cargo","salario"],
        properties:{
            nombres:{
                type:"string",
                minLength: 4,
                maxLength:50
            },
            apellidos:{
                type:"string",
                minLength: 4,
                maxLength:50
            },
            edad:{
                type:"number",
            },
            cargo:{
                type:"string",
            },
            salario:{
                type:"number",
            },
            correo:{
                type:"string",
                format:"email"
            }
        }
    }
}
