// app/api/download-photo/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  const fileName = searchParams.get('filename') || 'download.jpg';

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const headers = new Headers();
    
    // Set headers to trigger a file download in the browser
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Download Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
