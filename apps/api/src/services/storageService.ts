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

export const uploadStudyMaterialPDF = async (userId: string, materialId: string, buffer: Buffer): Promise<string> => {
  const path = `study-materials/${userId}/${materialId}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload study material PDF: ${error.message}`);
  }

  return path;
};

export const uploadActivitySheetPDF = async (userId: string, activitySheetId: string, buffer: Buffer): Promise<string> => {
  const path = `activity-sheets/${userId}/${activitySheetId}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload activity sheet PDF: ${error.message}`);
  }

  return path;
};

export const uploadTechProjectPDF = async (userId: string, projectId: string, buffer: Buffer): Promise<string> => {
  const path = `tech-projects/${userId}/${projectId}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload tech project PDF: ${error.message}`);
  }

  return path;
};

export const uploadChemLabReportPDF = async (userId: string, attemptId: string, buffer: Buffer): Promise<string> => {
  const path = `chem-lab-reports/${userId}/${attemptId}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload Chem Lab report PDF: ${error.message}`);
  }

  return path;
};

export const uploadPhysicsLabReportPDF = async (userId: string, attemptId: string, buffer: Buffer): Promise<string> => {
  const path = `physics-lab-reports/${userId}/${attemptId}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload Physics Lab report PDF: ${error.message}`);
  }

  return path;
};

export const uploadBiologyLabReportPDF = async (userId: string, attemptId: string, buffer: Buffer): Promise<string> => {
  const path = `biology-lab-reports/${userId}/${attemptId}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload Biology Lab report PDF: ${error.message}`);
  }

  return path;
};

export const uploadMathLabReportPDF = async (userId: string, attemptId: string, buffer: Buffer): Promise<string> => {
  const path = `math-lab-reports/${userId}/${attemptId}.pdf`;

  const { error } = await supabaseAdmin.storage
    .from('worksheets')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload Math Lab report PDF: ${error.message}`);
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
