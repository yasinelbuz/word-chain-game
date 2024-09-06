import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // URL'den inputValue'yu al
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  // inputValue boş veya null ise hata döndür
  if (!word) {
    return NextResponse.json({ error: 'Input value is required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://sozluk.gov.tr/yazim?ara=${encodeURIComponent(word)}`
    );

    const data = await res.json();
    
    // API'den gelen veriyi doğrudan döndür
    return NextResponse.json(data);

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
