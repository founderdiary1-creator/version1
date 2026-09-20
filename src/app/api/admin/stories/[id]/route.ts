import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('stories')
      .select('*, category:categories(*), industry:industries(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`[API_ERROR] /api/admin/stories/${id} GET:`, error);
      return NextResponse.json(
        { success: false, error: error.message, code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error(`[API_ERROR] /api/admin/stories/[id] GET (unexpected):`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', code: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    // --- DEEP MEDIA GARBAGE COLLECTION ---
    // Fetch the existing story to compare images
    const { data: oldStory } = await supabase
      .from('stories')
      .select('featured_image, content_blocks')
      .eq('id', id)
      .single();

    if (oldStory) {
      const extractImages = (story: any) => {
        const images = [];
        if (story.featured_image) images.push(story.featured_image);
        if (story.content_blocks && Array.isArray(story.content_blocks)) {
          story.content_blocks.forEach((block: any) => {
            if (block.image_url) images.push(block.image_url);
          });
        }
        return images;
      };

      const oldImages = extractImages(oldStory);
      const newImages = extractImages(body);

      // Find orphaned images (exist in DB but not in incoming update payload)
      const orphanedImages = oldImages.filter(img => !newImages.includes(img));

      if (orphanedImages.length > 0) {
        import('@supabase/supabase-js').then(({ createClient }) => {
          const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!, 
            { auth: { persistSession: false } }
          );

          const pathsToDelete = orphanedImages
            .map(img => {
              const parts = img.split('/article-images/');
              return parts.length === 2 ? parts[1] : null;
            })
            .filter(Boolean) as string[];

          if (pathsToDelete.length > 0) {
            adminSupabase.storage
              .from('article-images')
              .remove(pathsToDelete)
              .then(() => console.log(`Garbage collected ${pathsToDelete.length} orphaned images.`))
              .catch(err => console.error('Failed to garbage collect images:', err));
          }
        });
      }
    }
    // -------------------------------------

    const { data, error } = await supabase
      .from('stories')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`[API_ERROR] /api/admin/stories/${id} PUT:`, error);
      return NextResponse.json(
        { success: false, error: error.message, code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error(`[API_ERROR] /api/admin/stories/[id] PUT (unexpected):`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', code: 500 },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`[API_ERROR] /api/admin/stories/${id} DELETE:`, error);
      return NextResponse.json(
        { success: false, error: error.message, code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`[API_ERROR] /api/admin/stories/[id] DELETE (unexpected):`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', code: 500 },
      { status: 500 }
    );
  }
}
