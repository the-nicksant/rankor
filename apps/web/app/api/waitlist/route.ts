// app/api/waitlist/route.ts
import { appendFile } from 'fs/promises';
import { NextRequest } from 'next/server';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { email, name, type, location  } = await request.json();
    
    if (!email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), 'public', 'waitlist.csv');
    
    const timestamp = new Date().toISOString();
    const csvLine = `"${email}","${name || ''}","${type || ''}""${location || ''}","${timestamp}"\n`;
    
    // Append to file
    await appendFile(filePath, csvLine, 'utf-8');
    
    return Response.json(
      { success: true, message: 'Added to waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}