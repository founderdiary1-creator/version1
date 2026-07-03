import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;
    const oldImageUrl = formData.get('oldImageUrl') as string | null; // <-- Look for old image

    if (!file || !slug) {
      return NextResponse.json({ error: 'File and slug are required' }, { status: 400 });
    }

    // 1. Verify User
    const cookieStore = await cookies();
    const authClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
    );

    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Initialize Admin Client
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, 
      { auth: { persistSession: false } }
    );

    // 3. DELETE OLD IMAGE (The Garbage Collection Step)
    if (oldImageUrl) {
      try {
        // We have to extract just the filepath from the full URL
        // Example URL: https://[project-id].supabase.co/storage/v1/object/public/article-images/articles/my-slug-123.jpg
        // We split by the bucket name ('article-images/') to get just 'articles/my-slug-123.jpg'
        const urlParts = oldImageUrl.split('/article-images/');
        if (urlParts.length === 2) {
          const oldPath = urlParts[1];
          await adminSupabase.storage.from('article-images').remove([oldPath]);
          console.log(`Successfully deleted old image: ${oldPath}`);
        }
      } catch (delError) {
        // We log the error but don't stop the upload if the delete fails 
        // (e.g., if the old image was already deleted manually)
        console.warn('Failed to delete old image:', delError);
      }
    }

    // 4. Process & Upload NEW file
    const fileExt = file.name.split('.').pop();
    const fileName = `articles/${slug}-${Date.now()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await adminSupabase.storage
      .from('article-images')
      .upload(fileName, buffer, { contentType: file.type, upsert: true });

    if (uploadError) throw uploadError;

    // 5. Get Public URL
    const { data: publicUrlData } = adminSupabase.storage
      .from('article-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}