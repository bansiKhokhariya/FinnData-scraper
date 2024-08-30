import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import clientPromise from '@/lib/mongodb';


export async function GET(req: NextRequest) {
    try {
        const url = 'https://www.finn.no/b2b/agriculturecombines/search.html?sort=PUBLISHED_DESC';
        const response = await axios.get(url);
        const htmlData = response.data;

        const $ = cheerio.load(htmlData);

        // Extract JSON data from the <script> tag
        const jsonData = $('script#__NEXT_DATA__').html();
        if (!jsonData) {
            throw new Error('JSON data not found in the HTML');
        }

        // Parse JSON data
        const data = JSON.parse(jsonData);

        // Extract the posts
        const posts = data.props.pageProps.search.docs;

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('finndata');
        const collection = db.collection('posts');

        const newPosts = [];

        // Check if each post exists and insert if not
        for (const post of posts) {
            const exists = await collection.findOne({ ad_id: post.ad_id });
            if (!exists) {
                await collection.insertOne(post);
                newPosts.push(post);
            }
        }

        if (newPosts.length > 0) {
            // Send Telegram message with the new posts
            const message = `New posts added:\n${newPosts.map(post => `- ${post.heading}`).join('\n')}`;
            await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
            });
        }

        return NextResponse.json({ success: true, newPosts });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
