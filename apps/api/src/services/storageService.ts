import { supabaseAdmin } from '../lib/supabase';

export const uploadPDF = async (userId: string, worksheetId: string, buffer: Buffer): Promise<string> => {
  const path = `${userId}/${worksheetId}.pdf`;
  
  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }

  return path;
};

export const uploadProjectPDF = async (userId: string, projectId: string, buffer: Buffer): Promise<string> => {
  const path = `projects/${userId}/${projectId}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload project PDF: ${error.message}`);
  }

  return path;
};

export const getSignedURL = async (path: string, expiresIn = 3600): Promise<string> => {
  const { data, error } = await supabaseAdmin.storage
    .from('worksheets')
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    throw new Error(`Failed to get signed URL: ${error?.message}`);
  }

  return data.signedUrl;
};

export const deletePDF = async (path: string): Promise<void> => {
  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete PDF: ${error.message}`);
  }
};
