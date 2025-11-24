import { NextRequest, NextResponse } from 'next/server';

// This is a simple in-memory store for development
// In production, replace this with a real database (Supabase, MongoDB, etc.)
const betaSignups: string[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (betaSignups.includes(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Store email (in production, save to database here)
    betaSignups.push(email.toLowerCase());

    // TODO: Replace with actual database call
    // Example for Supabase:
    // const { data, error } = await supabase
    //   .from('beta_signups')
    //   .insert([{ email: email.toLowerCase(), created_at: new Date() }]);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully signed up for beta access!' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing beta signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check signup status (for admin purposes)
export async function GET() {
  return NextResponse.json(
    { count: betaSignups.length },
    { status: 200 }
  );
}

