import { NextResponse } from 'next/server';
import { updateReviewApproval } from '@/lib/updateReviewApproval';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  const body = await req.json();
  const approved: boolean = body.approved;

  try {
    await updateReviewApproval(id, approved);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
