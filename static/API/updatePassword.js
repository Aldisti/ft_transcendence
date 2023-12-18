export default async function updatePasswordAPI(data)
{
    const rest = await fetch("http://localhost:4200/password", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
	return (rest);
}