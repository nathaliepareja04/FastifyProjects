export const userValidSchema= {
    body:{
        type:"object",
        required:["name","lastname","email","password"],
        properties:{
            name:{
                type:"string"
            },
            lastname:{
                type:"string",
            },
            email:{
                type:"string",
                format: "email"
            },
            password:{
                type:"string"
            },
        }
    }
}
