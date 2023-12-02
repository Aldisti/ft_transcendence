export default async function loginAPI(data)
{
    const rest = fetch("http://localhost:4200/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })

}