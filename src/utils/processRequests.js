export const processRequests = async(data) => {
    try {
        return await data.json()
    } catch (error) {
        console.log(error)
        return {msg: "Error al procesar la solicitud."}
    }
}