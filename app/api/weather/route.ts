import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const latitude = searchParams.get('lat');
    const longitude = searchParams.get('lon');

    const API_KEY ="f4dca6469ab53bfc37c7149737ee09ea"

    let url = '';
    if (address) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${API_KEY}`;
    } else if (latitude && longitude) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
}
