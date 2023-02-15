export const facturaValidSchema= {
    body:{
        type:"object",
        required:["product","quantity"],
        properties:{
            product:{
                type:"string",
            },
            quantity:{
                type:"number",
            },
            user:{
                type:"string",
            },
            total:{
                type:"number",
                default: 0
            }
        }
    }
}
