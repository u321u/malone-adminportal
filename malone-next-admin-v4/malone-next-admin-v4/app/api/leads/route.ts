import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = {
      lead_type: body.lead_type,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone || null,
      location: body.location || null,
      budget: body.budget || null,
      property_address: body.property_address || null,
      timeline: body.timeline || null,
      notes: body.notes || null,
    };

    const supabase = getServerSupabase();
    if (supabase) {
      const { error } = await supabase.from('leads').insert(lead);
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Failed to save lead' }, { status: 500 });
  }
}
