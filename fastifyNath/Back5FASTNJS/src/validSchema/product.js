export const productValidSchema= {
    body:{
        type:"object",
        required:["title","description","price","category"],
        properties:{
            title:{
                type:"string",
            },
            description:{
                type:"string",
            },
            rate:{
                type:"number",
                maximum:5,
                minimum:0,
                default: 0
            },
            price:{
                type:"number",
            },
            stock:{
                type:"number",
                default: 0
            },
            category:{
                type:"string",
            },
            user:{
                type:"string",
            },
        }
    }
}
