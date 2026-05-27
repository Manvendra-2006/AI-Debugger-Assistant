export const analyzeLogs = (logs) => {

    try {

        let analysis = ""

        if(
            logs.includes("EADDRINUSE")
        ){

            analysis =
            "Port already in use"
        }

        else if(
            logs.includes("MongoNetworkError")
        ){

            analysis =
            "MongoDB connection failed"
        }

        else if(
            logs.includes("JWT")
        ){

            analysis =
            "JWT authentication issue detected"
        }

        else {

            analysis =
            "No known issue detected"
        }

        return {
            content:[
                {
                    type:'text',
                    text:analysis
                }
            ]
        }

    } catch(error){

        return {
            content:[
                {
                    type:'text',
                    text:error.message
                }
            ]
        }
    }
}