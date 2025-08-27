import { NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS, ID } from '@/lib/appwrite';

export async function POST(request) {
  try {
    const { type, data, shareId } = await request.json();

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    const collectionId = type === 'collection' 
      ? COLLECTIONS.SHARED_COLLECTIONS 
      : COLLECTIONS.SHARED_REQUESTS;

    // Create shared document
    let document;
    try {
      document = await databases.createDocument(
        DATABASE_ID,
        collectionId,
        shareId || ID.unique(),
        {
          type,
          data: JSON.stringify(data),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        }
      );
    } catch (error) {
      if (error.code === 404) {
        return NextResponse.json(
          { 
            error: 'Sharing collections not set up',
            details: 'Please set up the sharing collections in Appwrite. See scripts/setup-sharing.md for instructions.'
          },
          { status: 501 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      shareId: document.$id,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shared/${document.$id}`
    });

  } catch (error) {
    console.error('Share creation error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Failed to create share'
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const shareId = url.searchParams.get('id');

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      );
    }

    // Try to find in both collections
    let document = null;
    try {
      document = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.SHARED_COLLECTIONS,
        shareId
      );
    } catch {
      try {
        document = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.SHARED_REQUESTS,
          shareId
        );
      } catch (error) {
        if (error.code === 404 && error.message.includes('Collection')) {
          return NextResponse.json(
            { 
              error: 'Sharing not configured',
              details: 'Sharing collections are not set up. Please check the setup instructions.'
            },
            { status: 501 }
          );
        }
        return NextResponse.json(
          { error: 'Shared content not found' },
          { status: 404 }
        );
      }
    }

    // Check if expired
    if (new Date(document.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Shared content has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      type: document.type,
      data: JSON.parse(document.data),
      createdAt: document.$createdAt
    });

  } catch (error) {
    console.error('Share retrieval error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Failed to retrieve shared content'
      },
      { status: 500 }
    );
  }
}