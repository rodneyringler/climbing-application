import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export interface MPRouteData {
  stars: number | null;
  votes: number | null;
  description: string | null;
  protection: string | null;
  location: string | null;
  gps: string | null;
  fa: string | null;
  photos: string[];
  url: string;
}

export async function GET(req: NextRequest) {
  const mpId = req.nextUrl.searchParams.get('mpId');
  if (!mpId) {
    return NextResponse.json({ error: 'mpId query param required' }, { status: 400 });
  }

  const url = `https://www.mountainproject.com/route/${mpId}`;

  try {
    console.log('[MP scraper] fetching', url);
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    console.log('[MP scraper] response status', res.status, res.url);

    if (!res.ok) {
      const msg = `Mountain Project returned ${res.status}`;
      console.error('[MP scraper]', msg);
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const html = await res.text();
    console.log('[MP scraper] html length', html.length);
    const data = parseRouteData(html, mpId);
    console.log('[MP scraper] parsed', { stars: data.stars, votes: data.votes, hasDesc: !!data.description });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[MP scraper] exception', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function getTextAfterH2(
  $: cheerio.CheerioAPI,
  heading: string,
): string | null {
  let result: string | null = null;

  $('h2').each((_, el) => {
    const h2Text = $(el).clone().find('img').remove().end().text().trim();
    if (h2Text !== heading) return;

    const parts: string[] = [];
    let sibling = $(el).next();
    while (sibling.length && (sibling.is('p') || sibling.is('div'))) {
      const text = sibling.text().trim();
      if (text) parts.push(text);
      sibling = sibling.next();
    }
    if (parts.length) result = parts.join('\n\n');
    return false; // break .each
  });

  return result;
}

function parseRouteData(html: string, mpId: string): MPRouteData {
  const $ = cheerio.load(html);

  // ── Stars & votes ──────────────────────────────────────────────────────────
  let stars: number | null = null;
  let votes: number | null = null;

  $('a').each((_, el) => {
    const text = $(el).text().trim();
    const match = text.match(/Avg:\s*([\d.]+)\s*from\s*([\d,]+)\s*vote/i);
    if (match) {
      stars = parseFloat(match[1]);
      votes = parseInt(match[2].replace(/,/g, ''), 10);
      return false; // break
    }
  });

  // ── Text sections ──────────────────────────────────────────────────────────
  const description = getTextAfterH2($, 'Description');
  const protection = getTextAfterH2($, 'Protection');
  const location = getTextAfterH2($, 'Location');

  // ── GPS & FA ───────────────────────────────────────────────────────────────
  let gps: string | null = null;
  let fa: string | null = null;

  $('td').each((_, el) => {
    const label = $(el).text().trim();
    if (label === 'GPS:') {
      gps = $(el).next('td').text().trim() || null;
    } else if (label === 'FA:') {
      fa = $(el).next('td').text().trim() || null;
    }
  });

  // ── Photos ─────────────────────────────────────────────────────────────────
  const photos: string[] = [];

  // og:image is the first carousel slide's photo
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) photos.push(ogImage);

  // Remaining carousel items use style="background-image: url(...)" or data-src
  $('#photo-carousel .carousel-item').each((_, el) => {
    const style = $(el).attr('style') ?? '';
    const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch) {
      photos.push(bgMatch[1]);
      return;
    }
    const dataSrc = $(el).attr('data-src');
    if (dataSrc) photos.push(dataSrc);
  });

  console.log('[MP scraper] photos found', photos.length);

  return {
    stars,
    votes,
    description,
    protection,
    location,
    gps,
    fa,
    photos,
    url: `https://www.mountainproject.com/route/${mpId}`,
  };
}
