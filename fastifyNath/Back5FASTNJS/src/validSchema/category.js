export const categoryValidSchema= {
    body:{
        type:"object",
        required:["name","description"],
        properties:{
            name:{
                type:"string"
            },
            description:{
                type:"string"
            },
        }
    }
}
