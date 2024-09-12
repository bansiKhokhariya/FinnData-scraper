import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('scrapper');
        const collection = db.collection('olx_new_Data');

        // Fetch the listings with title and phoneNumber
        const listings = await collection.find({}, { projection: { title: 1, phoneNumber: 1, link: 1 } }).toArray();

        return NextResponse.json({ success: true, listings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
