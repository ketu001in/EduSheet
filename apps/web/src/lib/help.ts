import { api } from './api';

// Same "open tab synchronously" popup-blocker workaround as lib/activitySheet.ts's
// downloadActivitySheetPdf -- the guide itself is static content (same for every
// user), generated fresh server-side on each request.
export async function downloadUserGuidePdf() {
  const tab = window.open('', '_blank', 'noopener,noreferrer');
  try {
    const res = await api.get<{ success: boolean; url: string }>('/api/help/guide/pdf');
    if (tab) tab.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    tab?.close();
    throw err;
  }
}
