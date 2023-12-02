export default async function registerAPI(data)
{
    const rest = fetch("http://localhost:4200/register", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })

}