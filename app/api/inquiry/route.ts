import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, message, inquiryType } = await request.json();

    // Validate required fields
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        email,
        message,
        inquiry_type: inquiryType,
        status: 'unread'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      );
    }

    // Optional: Send email notification via Supabase Edge Function
    // You can create an Edge Function in Supabase to send emails
    /*
    try {
      await supabaseAdmin.functions.invoke('send-inquiry-notification', {
        body: { inquiryId: data.id, email, message, inquiryType }
      });
    } catch (emailError) {
      console.warn('Email notification failed, but inquiry was saved:', emailError);
      // Don't fail the request if email fails
    }
    */

    console.log('New inquiry saved:', data.id);

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
