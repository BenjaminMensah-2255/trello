'use server';

import { createClient } from '@supabase/supabase-js';

// Create a server-side Supabase client with service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function getInvitationByToken(token: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('organization_invitations')
      .select(`
        *,
        organizations (
          id,
          name
        )
      `)
      .eq('token', token)
      .single();

    if (error) {
      console.error('Error fetching invitation:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return { data: null, error: err.message };
  }
}

export async function acceptInvitation(
  invitationId: string, 
  userId: string, 
  organizationId: string, 
  role: string
) {
  try {
    // Check if user is already a member
    const { data: existingMembership } = await supabaseAdmin
      .from('organization_members')
      .select('id, role')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .single();

    if (existingMembership) {
      // Update invitation status
      await supabaseAdmin
        .from('organization_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      return { 
        success: true, 
        message: 'You are already a member', 
        existing: true,
        role: existingMembership.role 
      };
    }

    // Add user to organization
    const { error: memberError } = await supabaseAdmin
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        role: role
      });

    if (memberError) {
      console.error('Error adding member:', memberError);
      return { success: false, error: memberError.message };
    }

    // Update invitation status
    const { error: updateError } = await supabaseAdmin
      .from('organization_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitationId);

    if (updateError) {
      console.error('Error updating invitation:', updateError);
    }

    return { success: true, message: 'Invitation accepted successfully' };
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
}