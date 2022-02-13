export async function get_weather(lon,lat) {
    let response = await fetch(`/data/weather?lon=${lon}&lat=${lat}`)
    response = await response.json()
    return response;
}

export async function get_headlines(country="us")
{
    let response = await fetch(`/data/headlines?c=${country}`)
    response = await response.json()
    return response
}