/**
 * reviews-data.js
 * Prop Bills Shop - Review Database
 *
 * RULES:
 *  - No "UV" in any review text
 *  - No em-dashes (—). Use commas, periods, or nothing.
 *  - ~10% natural typos (missspellings, missing apostrophes, homophones)
 *  - 50% micro-short reviews (under 15 words of body text)
 *  - 50% longer detailed reviews
 *  - ~80% English, ~20% French
 *  - 95% five stars, 5% four stars
 *  - Four-star reviews: ONLY reason is a 1-day delivery delay
 *  - Many entries use nicknames (street names, initials, handles)
 *
 * ROTATION ENGINE:
 *  - MASTER array has 1320 entries
 *  - Pattern cycles 1-6 reviews per day (avg ~3.7/day)
 *  - buildDatabase() rotates which slot-pair maps to "today"
 *    based on days elapsed since epoch % 360
 *  - Result: 1-6 reviews appear every day, old reviews cycle back
 *    with fresh dates, keeping the feed always current
 *
 * WEBHOOK:
 *  Set PBS_WEBHOOK before loading this file, e.g.:
 *    <script>window.PBS_WEBHOOK='https://discord.com/api/webhooks/...';</script>
 *    <script src="reviews-data.js"></script>
 */

'use strict';

/* =====================================================
   PROMO CODE GENERATOR
   Generates a unique 10%-off code per review submission.
   Format: PBS10-XXXX where XXXX = 4 random alphanum chars.
===================================================== */
function generatePromoCode(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code='PBS10-';
  for(let i=0;i<4;i++) code+=chars[Math.floor(Math.random()*chars.length)];
  return code;
}

/* =====================================================
   DISCORD WEBHOOK SENDER
   Sends submitted review + promo code to Discord.
===================================================== */
async function sendToDiscord(rev, promoCode){
  const wh = window.PBS_WEBHOOK || '';
  if(!wh) return;
  const stars = '★'.repeat(rev.stars) + '☆'.repeat(5 - rev.stars);
  const statusLabel = rev.verified ? '✅ Verified (live immediately)' : '⏳ Pending approval (no order code)';
  const payload = {
    content: rev.verified ? '🟢 **New verified review**' : '🟡 **New review — pending approval**',
    embeds:[{
      title: 'New Review Submitted',
      color: rev.verified ? 0x059669 : 0xd97706,
      fields:[
        {name:'Name / Nickname', value: rev.name || '---', inline:true},
        {name:'Pack', value: rev.pack || '---', inline:true},
        {name:'Rating', value: stars, inline:true},
        {name:'Status', value: statusLabel, inline:false},
        {name:'Review Title', value: rev.title || '---', inline:false},
        {name:'Review Text', value: rev.text || '---', inline:false},
        {name:'Order Code', value: rev.code || 'None provided', inline:true},
        {name:'Promo Code Issued', value: promoCode, inline:true},
      ],
      timestamp: new Date().toISOString(),
      footer:{text:'Prop Bills Shop - Review System'}
    }]
  };
  try{
    await fetch(wh,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  }catch(e){
    console.warn('Discord webhook failed:', e.message);
  }
}

/* =====================================================
   MASTER REVIEW DATABASE
   1323 entries. Slots 0-1 = most recent day, 2-3 = next, etc.
   Nicknames are used heavily (50%+).
   Short reviews (50%) marked with brief body text.
===================================================== */
const MASTER=[
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Mid Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Sample Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'no cap', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Standard Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'fr fr', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'fr fr', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: '\uD83D\uDCAF\uD83D\uDCAF', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'No cap', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Large Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Standard Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '\uD83D\uDCAF\uD83D\uDCAF', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Sample Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Large Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Large Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Standard Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Standard Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: '\uD83D\uDCAF\uD83D\uDCAF', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Pro Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'No cap', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Mid Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Large Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Pro Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Standard Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 4, p: 'Bulk Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'fr fr', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Standard Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Bulk Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Sample Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
{ n: '', s: 5, p: 'Pro Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  // ── SLOTS 0-1
  {n:"JakeM_Buy",p:"Pro Pack",s:5,t:"absolutely insane quality",x:"opened it and was speechless. ordering again tonight no question.",v:true},
  {n:"MidnightBuyer",p:"Pro Pack",s:5,t:"wow",x:"best quality ive ever seen. just wow.",v:true},
  // ── SLOTS 2-3
  {n:"cecile_r",p:"Sample Pack",s:5,t:"that snap doe",x:"the snap on these is everything. ordered the pro pack same night.",v:true},
  {n:"loic_d",p:"Bulk Pack",s:5,t:"Quality is next level",x:"Tried a few suppliers over the past year. None come close. The raised texture, the transparent window, everything is there. Fast and discreet. Will order monthly.",v:true},
  // ── SLOTS 4-5
  {n:"FlashProp",p:"Standard Pack",s:5,t:"good",x:"fast delivery, good quality",v:true},
  {n:"jeremy_qc",p:"Standard Pack",s:5,t:"Ordered again same night",x:"Got my order, was amazed at the quality, went straight back to place another. The hologram is stunning.",v:true},
  // ── SLOTS 6-7
  {n:"tester_9000",p:"Bulk Pack",s:5,t:"perfect",x:"Perfect quality. Fast. Discreet. Done.",v:true},
  {n:"RowanK.",p:"Standard Pack",s:5,t:"Meilleure qualite",x:"J'ai essaye trois autres fournisseurs. La difference est immense. Livraison rapide, emballage discret. Je ne commanderai plus qu'ici.",v:true},
  // ── SLOTS 8-9
  {n:"Chris_V",p:"Pro Pack",s:5,t:"Worth every dollar",x:"Youre paying for genuine top-tier quality and thats exactly what you get. Re-ordering tonight.",v:true},
  {n:"Delay_Dan",p:"Standard Pack",s:5,t:"jaw dropped",x:"didnt expect this level of quality. the bills feel incredible. weight is right, snap is right, everything is right.",v:true},
  // ── SLOTS 10-11
  {n:"Cass_M",p:"Pro Pack",s:5,t:"The hologram is stunning",x:"Been looking for quality like this for a long time. Hologram shifts from gold to green at different angles. Telegram support answered in under 5 minutes. Top tier.",v:true},
  {n:"Raph_T",p:"Sample Pack",s:5,t:"ok wow",x:"didnt expect this. ordering more",v:true},
  // ── SLOTS 12-13
  {n:"ConnorFBulk",p:"Standard Pack",s:5,t:"Livraison rapide qualite top",x:"Commande vendredi, recu mardi. Emballage discret. Hologramme magnifique.",v:true},
  {n:"felix_qc",p:"Pro Pack",s:5,t:"This is the real deal",x:"Handled a lot of prop currency. Nothing comes close to this quality. The substrate feels right, the hologram is perfect. Outstanding.",v:true},
  // ── SLOTS 14-15
  {n:"CashFlow416",p:"Standard Pack",s:5,t:"fast and great quality",x:"Purolator tracking same day. Received Wednesday. Five stars easy.",v:true},
  {n:"LeoK.",p:"Bulk Pack",s:5,t:"Placed 2nd order before 1st arrived",x:"After seeing my previous order quality I was so confident I placed another before it even arrived. Discreet packaging, fast shipping. Perfect.",v:true},
  // ── SLOTS 16-17
  {n:"IanB_Worth",p:"Standard Pack",s:5,t:"exactly as described",x:"Plain box, great product. Simple as that.",v:true},
  {n:"Arthwr_C",p:"Pro Pack",s:5,t:"J'aurais du commander plus tot",x:"Un ami me l'a recommande. La qualite est dans une autre categorie. Hologramme et texture extraordinaires.",v:true},
  // ── SLOTS 18-19
  {n:"ShadyAccount",p:"Sample Pack",s:5,t:"Convinced on first touch",x:"The moment I picked up the first bill from the sample pack I knew I was ordering more. That snap, that texture. Ordered Pro Pack immediately.",v:true},
  {n:"AlanT_More",p:"Pro Pack",s:5,t:"best purchase this year",x:"hologram is jaw-dropping. ordering again tonight",v:true},
  // ── SLOTS 20-21
  {n:"nathaniel_qc",p:"Pro Pack",s:5,t:"Professional quality",x:"High standards. Exceeded. The raised intaglio texture on the portraits, the diffraction filter. Ill be a repeat customer.",v:true},
  {n:"low_profile_rev",p:"Standard Pack",s:5,t:"the snap tho",x:"that snap when you flex it. perfect. love it",v:true},
  // ── SLOTS 22-23
  {n:"PropPhoenix",p:"Standard Pack",s:5,t:"Incroyable",x:"La fenetre transparente, le hologramme or-emeraude, tout est la. Je commande ce soir.",v:true},
  {n:"ColdStacks",p:"Bulk Pack",s:5,t:"Zero defects entire order",x:"Ordered the bulk pack. Every bundle perfect. Fast delivery, discreet packaging, Purolator tracking same day. Will order again.",v:true},
  // ── SLOTS 24-25
  {n:"QuickFlip_T",p:"Pro Pack",s:5,t:"3rd order same great quality",x:"every time the same. reliable. ordering again.",v:true},
  {n:"LiquidGold_V",p:"Standard Pack",s:5,t:"Quality speaks for itself",x:"Dont write many reviews but this deserves one. The feel, the texture, the hologram. All perfect. Already planning my next order.",v:true},
  // ── SLOTS 26-27
  {n:"CruiseControl",p:"Bulk Pack",s:5,t:"massive order delivered perfectly",x:"order confirmed, shipped same day, Purolator 2 days. every bundle perfect.",v:true},
  {n:"a.non",p:"Sample Pack",s:5,t:"Tried loved ordering tonight",x:"Started with the sample. Now I completely understand. Ordering the Pro Pack tonight without hesitation.",v:true},
  // ── SLOTS 28-29
  {n:"ChronoStack",p:"Standard Pack",s:5,t:"everything is right",x:"weight, snap, texture, hologram. all right. period.",v:true},
  {n:"QuickStack_ON",p:"Pro Pack",s:5,t:"Impeccable du debut a la fin",x:"Commande lundi soir, recue jeudi. Billets parfaits. Hologramme spectaculaire. Je serai client regulier.",v:true},
  // ── SLOTS 30-31
  {n:"gregoire_qc",p:"Pro Pack",s:5,t:"Telegram support is exceptional",x:"Got a reply in 4 minutes. Product lived up. Extraordinary quality, fast delivery, discreet packaging. Definitely back.",v:true},
  {n:"DoubleDown_T",p:"Standard Pack",s:5,t:"gold to emerald",x:"that hologram shift is something else. incredible",v:true},
  // ── SLOTS 32-33 (4-star)
  {n:"RyanP_Best",p:"Sample Pack",s:4,t:"Tres bonne qualite, un jour de retard",x:"Qualite impressionnante, snap parfait. La livraison a pris un jour de plus que prevu selon Purolator. Sinon tout est excellent. Je commanderai a nouveau.",v:true},
  {n:"PropGuy_Van",p:"Pro Pack",s:5,t:"My new go-to supplier",x:"Been searching for quality like this for a long time. Found it. The feel is authentic, hologram is perfect, delivery was fast. Ordering again this week.",v:true},
  // ── SLOTS 34-35
  {n:"chris_qc",p:"Bulk Pack",s:5,t:"flawless",x:"bulk pack. 3 days. every bill perfect. done.",v:true},
  {n:"remi_p",p:"Sample Pack",s:5,t:"10 seconds to decide",x:"Held the first bill for 10 seconds and went back to order the Pro Pack. That immediate.",v:true},
  // ── SLOTS 36-37
  {n:"StreetPropz",p:"Pro Pack",s:5,t:"Re-ordering tonight no question",x:"Third order. Quality never disappoints. Same great texture, same hologram, same fast shipping.",v:true},
  {n:"PropSurge",p:"Standard Pack",s:5,t:"Top qualite top service",x:"Billets comme decrit. Service Telegram rapide. Livraison 2 jours. Parfait.",v:true},
  // ── SLOTS 38-39
  {n:"PropPulse",p:"Standard Pack",s:5,t:"raised the bar for me",x:"The raised texture is palpable. You can actually feel the intaglio effect. Hologram is stunning.",v:true},
  {n:"PropStorm",p:"Pro Pack",s:5,t:"extraordinary",x:"every detail is perfect. nothing on market compares.",v:true},
  // ── SLOTS 40-41
  {n:"jonathan_qc",p:"Standard Pack",s:5,t:"Ordering again tonight thanks",x:"Just received my order and already thinking about my next one. The hologram is especially impressive. Discreet delivery as promised.",v:true},
  {n:"GritProp_T",p:"Bulk Pack",s:5,t:"handled perfectly",x:"bulk pack. 3 days. discreet box. accurate tracking. 5 stars",v:true},
  // ── SLOTS 42-43
  {n:"PropPeak",p:"Standard Pack",s:5,t:"Texture reelle",x:"La texture en relief sur les portraits est incroyable. Jamais vu cette qualite.",v:true},
  {n:"CrissCross99",p:"Pro Pack",s:5,t:"Just wow",x:"Opened the package and literally said wow out loud. The hologram under light is spectacular.",v:true},
  // ── SLOTS 44-45
  {n:"SlowShip_Sam",p:"Sample Pack",s:5,t:"30 seconds",x:"after 30 seconds with the first bill i placed a pro pack order. thats it",v:true},
  {n:"j.lavigne",p:"Standard Pack",s:5,t:"Blown away by the hologram",x:"Gold to emerald depending on the angle. Looks completely genuine. Add the raised texture and perfect snap, youve got a winner.",v:true},
  // ── SLOTS 46-47
  {n:"IT_Props",p:"Pro Pack",s:5,t:"quality that sticks with you",x:"The intaglio texture is something you have to feel yourself. Everything else at same level. Extraordinary.",v:true},
  {n:"gabriel_qc",p:"Pro Pack",s:5,t:"Meilleur fournisseur",x:"J'ai cherche longtemps. Celui-ci est clairement le meilleur. Le snap, la texture, le hologramme, tout au niveau 1:1.",v:true},
  // ── SLOTS 48-49
  {n:"PropEmpire",p:"Bulk Pack",s:5,t:"Best supplier period",x:"After four suppliers, this is the one I'm sticking with. The quality difference is enormous.",v:true},
  {n:"nathan_f",p:"Standard Pack",s:5,t:"same quality everytime",x:"second order. same quality. same fast delivery. customer for life",v:true},
  // ── SLOTS 50-51
  {n:"GageB_Happy",p:"Pro Pack",s:5,t:"Worth every penny",x:"Quality, fast delivery, discreet packaging, responsive Telegram. What more do you want?",v:true},
  {n:"genny.b",p:"Sample Pack",s:5,t:"couldnt believe it",x:"expected decent. got extraordinary. ordered pro pack same evening.",v:true},
  // ── SLOTS 52-53
  {n:"EliG_Wow",p:"Sample Pack",s:5,t:"Convaincu en 10 secondes",x:"J'ai tenu le premier billet 10 secondes et j'ai commande le Pro Pack. Livraison tres rapide.",v:true},
  {n:"anne_sophie_l",p:"Pro Pack",s:5,t:"Exceeded all expectations",x:"Very high expectations going in. They were exceeded. Hologram spectacular. Texture perfect. Snap exactly right.",v:true},
  // ── SLOTS 54-55
  {n:"PropUltimate",p:"Standard Pack",s:5,t:"already planning next order",x:"received today. quality extraordinary. hologram worth it alone. thank you!",v:true},
  {n:"yolo_buy",p:"Bulk Pack",s:5,t:"Perfectly consistent every bill",x:"Every bill identical in quality. Sharp print, vivid hologram, perfect texture. 3 days, discreet. Exactly the reliability I needed.",v:true},
  // ── SLOTS 56-57 (4-star)
  {n:"franc_l",p:"Standard Pack",s:4,t:"Very good quality, one day delay",x:"Really impressed with the quality. Texture feels authentic, hologram is great. Delivery one extra day vs Purolator estimate. Nothing major. Product is excellent.",v:true},
  {n:"TideH_Sat",p:"Standard Pack",s:5,t:"Je commande a nouveau ce soir",x:"Commande recue, deja sur le site pour en passer une autre. Qualite parfaite. Merci beaucoup!",v:true},
  // ── SLOTS 58-59
  {n:"julien_m",p:"Pro Pack",s:5,t:"snap is addictive",x:"i keep picking these up just to feel that snap. so satisfying. hologram matches.",v:true},
  {n:"TrenchStack",p:"Sample Pack",s:5,t:"good stuff",x:"good quality. fast. will order again",v:true},
  // ── SLOTS 60-61
  {n:"HardStack_T",p:"Standard Pack",s:5,t:"6 stars if I could",x:"The hologram, the raised texture, the snap. It all comes together perfectly.",v:true},
  {n:"BillsOnDeck",p:"Pro Pack",s:5,t:"insane",x:"insane quality. ordering more rn",v:true},
  // ── SLOTS 62-63
  {n:"julien_qc",p:"Standard Pack",s:5,t:"Qualite professionnelle",x:"Le substrat polymere est exactement comme un vrai billet. Hologramme spectaculaire. Recommande a tous mes contacts.",v:true},
  {n:"CruzT_Con",p:"Pro Pack",s:5,t:"Immediately ordered more",x:"5 minutes examining the quality then went straight back for another Pro Pack.",v:true},
  // ── SLOTS 64-65
  {n:"Jess_B",p:"Standard Pack",s:5,t:"ty",x:"great quality thanks",v:true},
  {n:"burnerphone22",p:"Sample Pack",s:5,t:"texture alone sold me",x:"Run your thumbnail across the portrait. You feel the ridges. No other prop currency has this. Ordering more tonight.",v:true},
  // ── SLOTS 66-67
  {n:"PropFusion",p:"Bulk Pack",s:5,t:"reliable",x:"third bulk order. same quality every time. they don't miss.",v:true},
  {n:"marc_l",p:"Pro Pack",s:5,t:"Epoustouflée",x:"Je ne m'attendais pas a une telle qualite. Toucher parfait, snap satisfaisant, hologramme magnifique. Livraison 2 jours.",v:true},
  // ── SLOTS 68-69
  {n:"Cami.B",p:"Pro Pack",s:5,t:"Top quality top service",x:"Product is extraordinary, Telegram is excellent. Shipped same day, received in 2 days. Could not be happier.",v:true},
  {n:"RocketStack",p:"Standard Pack",s:5,t:"nice",x:"nice quality. discreet box. happy with it",v:true},
  // ── SLOTS 70-71
  {n:"CleanBillz",p:"Bulk Pack",s:5,t:"permanent supplier",x:"After this order I'm not looking anywhere else. Quality consistent, shipping reliable, product extraordinary.",v:true},
  {n:"ValeH_Happy",p:"Pro Pack",s:5,t:"wow just wow",x:"opened the box. stood there for a minute. this quality is something else",v:true},
  // ── SLOTS 72-73
  {n:"BryceT_Best",p:"Bulk Pack",s:5,t:"Qualite irreprochable",x:"Chaque billet identique. Impression nette, hologramme vif. Livre 3 jours, boite neutre. C'est le fournisseur que je cherchais.",v:true},
  {n:"MightyBillz",p:"Standard Pack",s:5,t:"Jaw-dropping quality",x:"Micro-text, braille, transparent window, hologram. All there, all perfect. Discreet delivery in 2 days.",v:true},
  // ── SLOTS 74-75
  {n:"SamD_Great",p:"Sample Pack",s:5,t:"solid",x:"solid product. fast shipping. 5 stars",v:true},
  {n:"maxime_g",p:"Pro Pack",s:5,t:"You notice new details every time",x:"The micro-text, braille dots. Made by people who care about quality. Ordering this week.",v:true},
  // ── SLOTS 76-77 (4-star)
  {n:"remi_bc",p:"Standard Pack",s:4,t:"Great product, one day late",x:"Quality is genuinely very good. Hologram impressive, texture right, snap satisfying. Delivery was one day later than estimated. Not a big deal. Would order again.",v:true},
  {n:"AtlasT_Samp",p:"Pro Pack",s:5,t:"Incroyable",x:"qualite incroyable. je commande encore ce soir",v:true},
  // ── SLOTS 78-79
  {n:"PropRook_T",p:"Standard Pack",s:5,t:"Ordering again tonight",x:"Third order. Same great quality every time. Reliable delivery, discreet packaging.",v:true},
  {n:"AidenW.",p:"Pro Pack",s:5,t:"legit",x:"legit quality. not disappointed at all",v:true},
  // ── SLOTS 80-81
  {n:"FordB_Small",p:"Pro Pack",s:5,t:"Extraordinary attention to detail",x:"The braille dots, the diffraction filter. Ive never seen all of these in one prop currency. Different level entirely.",v:true},
  {n:"TossAway_Rev",p:"Standard Pack",s:5,t:"quick and clean",x:"quick delivery. clean packaging. great product",v:true},
  // ── SLOTS 82-83
  {n:"BlazeStack",p:"Sample Pack",s:5,t:"Convaincu par l'echantillon",x:"Avant de commander en grande quantite, j'ai teste. La qualite parle d'elle-meme. Pack pro commande immediatement.",v:true},
  {n:"DiamondBillz",p:"Sample Pack",s:5,t:"Didnt expect this",x:"Tried the sample expecting decent. Got extraordinary. Ordered Pro Pack 10 minutes after opening.",v:true},
  // ── SLOTS 84-85
  {n:"nico_p",p:"Bulk Pack",s:5,t:"5/5",x:"5/5. nothing to add",v:true},
  {n:"EricM_Box",p:"Bulk Pack",s:5,t:"Best bulk order experience",x:"Large quantity, every bill perfect. Delivered 3 days, plain box, tracking came through right away.",v:true},
  // ── SLOTS 86-87
  {n:"Prop_Snapper",p:"Standard Pack",s:5,t:"happy",x:"very happy with the order. quality is great",v:true},
  {n:"GoldPile_CA",p:"Pro Pack",s:5,t:"Le meilleur que j'ai essaye",x:"J'ai essaye plusieurs fournisseurs. Aucun n'arrive a la cheville. Le snap, la texture en relief, tout a un niveau different.",v:true},
  // ── SLOTS 88-89
  {n:"TigerSnap",p:"Pro Pack",s:5,t:"You wont be disappointed",x:"Was hesitant before my first order. So glad I went through with it. The hologram, the texture, the snap. Already placed a second order.",v:true},
  {n:"BillFlipper",p:"Sample Pack",s:5,t:"does what it says",x:"quality matches the description. fast. discreet. ordered more",v:true},
  // ── SLOTS 90-91
  {n:"LedgerS.",p:"Standard Pack",s:5,t:"hologram is something else",x:"Gold to emerald depending on angle. Raised texture and perfect snap. Fast delivery. Very happy.",v:true},
  {n:"PrivateUser",p:"Pro Pack",s:4,t:"Qualite parfaite, un jour de delai",x:"Billets absolument parfaits. Hologramme magnifique. La livraison a pris un jour de plus. Rien de grave. Je recommande.",v:true},
  // ── SLOTS 92-93
  {n:"pascal_qc",p:"Standard Pack",s:5,t:"bonne qualite merci",x:"bonne qualite, livraison rapide, merci",v:true},
  {n:"TrueStack_BC",p:"Pro Pack",s:5,t:"Friends cant believe it",x:"Showed these to friends and none could believe it. Texture, snap, hologram. Extraordinary. Been recommending this shop to everyone.",v:true},
  // ── SLOTS 94-95
  {n:"DomF_Big",p:"Standard Pack",s:5,t:"arrived fast",x:"arrived fast. quality is legit. reordering",v:true},
  {n:"ThornT_Guar",p:"Sample Pack",s:5,t:"Sample worth every cent",x:"The raised texture is something Ive never felt in prop currency before. Ordering Pro Pack right after this review.",v:true},
  // ── SLOTS 96-97
  {n:"xX_anon_Xx",p:"Pro Pack",s:5,t:"no complaints",x:"no complaints. great product. fast ship.",v:true},
  {n:"PropKing_CA",p:"Standard Pack",s:5,t:"qualite top",x:"qualite top. livraison super rapide. je recommande",v:true},
  // ── SLOTS 98-99
  {n:"EvanG_Props",p:"Standard Pack",s:5,t:"Fast discreet perfect",x:"Three things I care about. This shop delivers all three perfectly. Already placed a second order.",v:true},
  {n:"v.g",p:"Sample Pack",s:5,t:"impressed",x:"more impressed than I expected. ordering again",v:true},
  // ── SLOTS 100-101
  {n:"GhostAccount",p:"Pro Pack",s:5,t:"Couldnt be more satisfied",x:"From order to delivery, everything was perfect. Telegram fast, shipping quick, product extraordinary.",v:true},
  {n:"GhostBillz",p:"Standard Pack",s:5,t:"clean",x:"clean product. clean delivery. happy customer",v:true},
  // ── SLOTS 102-103
  {n:"lurk_no_more",p:"Pro Pack",s:5,t:"impeccable",x:"qualite impeccable. hologramme parfait. livraison rapide. 5 etoiles",v:true},
  {n:"VaultPropz",p:"Bulk Pack",s:5,t:"Incredible value",x:"Quality-to-price ratio on bulk is incredible. Every bill perfect. Hologram vivid, texture palpable, snap satisfying.",v:true},
  // ── SLOTS 104-105
  {n:"DiamondSnap",p:"Pro Pack",s:5,t:"again",x:"ordering again. every time same great quality",v:true},
  {n:"incognito_buyer",p:"Standard Pack",s:5,t:"ok thanks",x:"ok quality is great thanks",v:true},
  // ── SLOTS 106-107
  {n:"mathieu_mtl",p:"Standard Pack",s:5,t:"Telegram replied in 3 min",x:"Question before ordering. Reply in 3 minutes. Product arrived 2 days later, quality extraordinary. You can trust this shop.",v:true},
  {n:"ClearBillz",p:"Sample Pack",s:5,t:"nice one",x:"quality is great. fast ship. ordered more",v:true},
  // ── SLOTS 108-109
  {n:"henri_l",p:"Sample Pack",s:5,t:"officially hooked",x:"Sample then Pro Pack twice now. The hologram, the texture, the snap. I keep finding new details. Outstanding.",v:true},
  {n:"SC_Bulk",p:"Bulk Pack",s:4,t:"Great bulk order, one extra day",x:"Great value. Every bill consistent quality. Delivery one day later than Purolator estimate. Inconvenient but not a dealbreaker. Product is excellent.",v:true},
  // ── SLOTS 110-111
  {n:"cedric_m",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. livraison rapide. qualite au rendez-vous",v:true},
  {n:"SteelBillz_T",p:"Pro Pack",s:5,t:"Nothing compares",x:"Tried everything. Nothing compares. Substrate right, hologram perfect, braille dots there. The definitive prop currency.",v:true},
  // ── SLOTS 112-113
  {n:"TrustTheProcess",p:"Standard Pack",s:5,t:"solid 5",x:"solid 5 stars. no issues.",v:true},
  {n:"SilverStack",p:"Pro Pack",s:5,t:"re-ordering again tonight",x:"this is my 4th order. quality is always the same. always great. always fast.",v:true},
  // ── SLOTS 114-115
  {n:"lurker2024",p:"Sample Pack",s:5,t:"sample pack is worth it",x:"great way to test before going big. quality blew me away. ordering pro pack now.",v:true},
  {n:"b.tremblay",p:"Pro Pack",s:5,t:"excellent",x:"excellent qualite. livraison express. hologramme superbe. je recommande",v:true},
  // ── SLOTS 116-117
  {n:"IanW_Quick",p:"Standard Pack",s:5,t:"Fast delivery happy",x:"Two days, discreet box, perfect product. Simple as that.",v:true},
  {n:"Mik3y",p:"Bulk Pack",s:5,t:"bulk was flawless",x:"every bill identical. print crisp. hologram vivid. they dont cut corners.",v:true},
  // ── SLOTS 118-119
  {n:"HiRoller",p:"Pro Pack",s:5,t:"told my friends",x:"told all my friends about this. quality is that good.",v:true},
  {n:"SlickProp_T",p:"Standard Pack",s:5,t:"smooth transaction",x:"smooth transaction. fast. discreet. 5 stars.",v:true},
  // ── SLOTS 120-121
  {n:"JordanS.",p:"Standard Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je commande encore ce soir. merci!",v:true},
  {n:"ZenStack_BC",p:"Pro Pack",s:5,t:"The braille dots are there",x:"This detail alone separates it from everything else. The braille is functional, the hologram is perfect, the texture is extraordinary.",v:true},
  // ── SLOTS 122-123
  {n:"NeilW_Out",p:"Sample Pack",s:5,t:"convinced",x:"convinced after first look. ordering the big pack.",v:true},
  {n:"ShadowBill",p:"Standard Pack",s:5,t:"good quality",x:"good quality. arrived on time. will buy again",v:true},
  // ── SLOTS 124-125
  {n:"nicolas_bc",p:"Pro Pack",s:5,t:"This shop doesnt miss",x:"Every detail of this transaction was perfect. From Telegram support to the product itself. Remarkable.",v:true},
  {n:"SlateB_Fast",p:"Pro Pack",s:5,t:"parfait",x:"parfait. snap parfait. hologramme parfait. livraison parfaite.",v:true},
  // ── SLOTS 126-127
  {n:"ColeF_Fire",p:"Bulk Pack",s:5,t:"bulk perfection",x:"large order. every bundle consistent. no issues. ordered again already.",v:true},
  {n:"FrostStack_ON",p:"Standard Pack",s:5,t:"did not disappoint",x:"was nervous ordering. didnt need to be. quality is great.",v:true},
  // ── SLOTS 128-129
  {n:"nicolas_qc",p:"Pro Pack",s:5,t:"High quality happy customer",x:"Was shown this by a friend. Completely understand the hype now. Hologram is extraordinary.",v:true},
  {n:"Soph.R",p:"Sample Pack",s:5,t:"yep",x:"yep. good. ordering more.",v:true},
  // ── SLOTS 130-131
  {n:"TightStack",p:"Standard Pack",s:5,t:"super contente",x:"super contente de ma commande. qualite parfaite. emballage discret. merci!",v:true},
  {n:"alexis_qc",p:"Pro Pack",s:5,t:"permanent customer",x:"quality is consistent every order. not going anywhere else. reliable supplier.",v:true},
  // ── SLOTS 132-133
  {n:"am_r",p:"Standard Pack",s:5,t:"works great",x:"works great. arrived fast. packaging was clean",v:true},
  {n:"martin_g",p:"Bulk Pack",s:5,t:"Bulk pack delivered",x:"Fast, discreet, perfect quality across every single bill. This is what bulk ordering should look like.",v:true},
  // ── SLOTS 134-135
  {n:"TrueGrit_ON",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. that quality.",v:true},
  {n:"TannerB_Impress",p:"Pro Pack",s:5,t:"impressionnee",x:"vraiment impressionnee par la qualite. livraison discrete comme promis. 5 etoiles.",v:true},
  // ── SLOTS 136-137
  {n:"SterlingT_Bulk",p:"Standard Pack",s:5,t:"As described",x:"Description on the website is accurate. What you read is what you get. Great product.",v:true},
  {n:"SamtheMan",p:"Sample Pack",s:5,t:"great start",x:"started with sample. great quality. going bigger next time.",v:true},
  // ── SLOTS 138-139
  {n:"LateShip_Luke",p:"Pro Pack",s:5,t:"Top-tier quality",x:"Every time I examine these closely I find another detail thats perfect. Outstanding product.",v:true},
  {n:"FrostB_Works",p:"Standard Pack",s:5,t:"very satisfied",x:"very satisfied. fast delivery. good quality",v:true},
  // ── SLOTS 140-141
  {n:"StarH_Sm",p:"Bulk Pack",s:5,t:"qualite constante",x:"qualite constante sur l'ensemble du pack vrac. parfait. je commande encore.",v:true},
  {n:"CamR.",p:"Pro Pack",s:5,t:"Everything's right",x:"Weight is right. Snap is right. Texture is right. Hologram is right. What else is there?",v:true},
  // ── SLOTS 142-143
  {n:"benjamin_qc",p:"Sample Pack",s:5,t:"nice",x:"nice quality. was surprised. ordering more",v:true},
  {n:"Oli_G",p:"Bulk Pack",s:5,t:"Reliable every time",x:"This is my fourth order. Same quality, same fast delivery, same discreet box. A supplier you can count on.",v:true},
  // ── SLOTS 144-145
  {n:"etienne_qc",p:"Standard Pack",s:5,t:"great",x:"great quality great service. ty",v:true},
  {n:"martin_qc",p:"Standard Pack",s:5,t:"tres bonne qualite",x:"tres bonne qualite. recu en 2 jours. emballage discret. parfait.",v:true},
  // ── SLOTS 146-147
  {n:"PropKing_BC",p:"Pro Pack",s:5,t:"The hologram picks up every angle",x:"Watching the hologram shift under different light is genuinely impressive. Quality throughout is exceptional.",v:true},
  {n:"fr_fr_nocap",p:"Sample Pack",s:5,t:"solid",x:"solid. fast. good quality. 5 stars",v:true},
  // ── SLOTS 148-149
  {n:"nightowl_qc",p:"Standard Pack",s:5,t:"Would buy again",x:"Already planning my next order. Great quality and fast shipping.",v:true},
  {n:"NightStack_BC",p:"Pro Pack",s:5,t:"A+ supplier",x:"A+ on product quality, A+ on shipping speed, A+ on packaging. Five stars.",v:true},
  // ── SLOTS 150-151
  {n:"phil_d",p:"Pro Pack",s:5,t:"commande parfaite",x:"commande parfaite du debut a la fin. qualite hors pair. livraison rapide.",v:true},
  {n:"FoxB_5th",p:"Bulk Pack",s:5,t:"Great bulk quality",x:"Every bill consistent. Hologram vivid. Texture perfect. This is what you want from a bulk order.",v:true},
  // ── SLOTS 152-153
  {n:"xXDarkHoodXx",p:"Standard Pack",s:5,t:"happy with order",x:"happy with the order. no complaints.",v:true},
  {n:"GreyT_Bulk",p:"Pro Pack",s:5,t:"Snapped and never looked back",x:"That snap convinced me immediately. Everything else is equally impressive. Permanent customer.",v:true},
  // ── SLOTS 154-155
  {n:"camille_qc",p:"Sample Pack",s:5,t:"good",x:"good quality. fast ship. thanks",v:true},
  {n:"MaxB_Wow",p:"Standard Pack",s:5,t:"parfait",x:"parfait en tout point. qualite, livraison, emballage. je recommande.",v:true},
  // ── SLOTS 156-157
  {n:"theo_qc",p:"Pro Pack",s:5,t:"Worth the investment",x:"Top-shelf quality. You get exactly what you pay for and then some. Ordering again next month.",v:true},
  {n:"RawQuality",p:"Standard Pack",s:5,t:"all good",x:"all good. received fast. quality is there",v:true},
  // ── SLOTS 158-159
  {n:"LegendProp",p:"Bulk Pack",s:5,t:"Bulk done right",x:"Big order. Delivered in 3 days. Perfectly packaged. Every bill identical. This is the way.",v:true},
  {n:"PropCraft",p:"Pro Pack",s:5,t:"impressed every time",x:"every order. every time. impressed. this shop is the real deal.",v:true},
  // ── SLOTS 160-161 (4-star)
  {n:"ChaseT_Bulk",p:"Standard Pack",s:4,t:"Excellent product delivery 1 day late",x:"Quality exceeded my expectations. Hologram beautiful, texture perfect, snap exactly right. Shipping one extra day. Not a big issue. Highly recommend.",v:true},
  {n:"ngl_impressed",p:"Standard Pack",s:5,t:"Couldn't ask for more",x:"Fast delivery. Discreet box. Quality product. Responsive support. This shop checks every box.",v:true},
  // ── SLOTS 162-163
  {n:"GreenPaper",p:"Sample Pack",s:5,t:"started small going big",x:"sample pack convinced me. going pro next order.",v:true},
  {n:"alexis_l",p:"Pro Pack",s:5,t:"Hologram is stunning",x:"I keep angling these under different lights just to watch the hologram shift. Outstanding detail.",v:true},
  // ── SLOTS 164-165
  {n:"nat_f",p:"Standard Pack",s:5,t:"did what it said",x:"did exactly what it said. happy.",v:true},
  {n:"PropGenesis",p:"Pro Pack",s:5,t:"je suis cliente pour la vie",x:"je suis cliente pour la vie. qualite exceptionnelle a chaque commande. livraison rapide.",v:true},
  // ── SLOTS 166-167
  {n:"RhettT_Gen",p:"Bulk Pack",s:5,t:"Large order no issues",x:"Large quantity, zero quality issues. Every bill was perfect. Delivery was fast, packaging was discreet.",v:true},
  {n:"mathieu_qc",p:"Standard Pack",s:5,t:"ty",x:"ty. quality is good. fast.",v:true},
  // ── SLOTS 168-169
  {n:"JesseT_Wow",p:"Pro Pack",s:5,t:"My go-to",x:"Been ordering here for months. Quality never drops. Shipping never disappoints. My go-to.",v:true},
  {n:"StormSnap_T",p:"Sample Pack",s:5,t:"exceeded expectations",x:"exceeded my expectations. simple as that. ordering more tonight.",v:true},
  // ── SLOTS 170-171
  {n:"PropRush_CA",p:"Standard Pack",s:5,t:"5 stars no hesitation",x:"Five stars. No hesitation. Quality is extraordinary and shipping is fast.",v:true},
  {n:"fr3sh_start",p:"Pro Pack",s:5,t:"outstanding",x:"outstanding quality. outstanding service. wont go elsewhere.",v:true},
  // ── SLOTS 172-173
  {n:"PropZone_CA",p:"Bulk Pack",s:5,t:"toujours parfait",x:"troisieme commande. toujours la meme qualite parfaite. toujours livre rapidement.",v:true},
  {n:"TravisB_Pro",p:"Pro Pack",s:5,t:"Re-ordering always",x:"This is now a regular purchase for me. Quality is consistent every time. The hologram is extraordinary.",v:true},
  // ── SLOTS 174-175
  {n:"Fr_anon",p:"Standard Pack",s:5,t:"great job",x:"great quality. fast ship. appreciate it",v:true},
  {n:"AlexP.",p:"Bulk Pack",s:5,t:"Bulk pack perfect",x:"Ordered bulk. Received in 3 days. Every single bill identical quality. This is how it should be done.",v:true},
  // ── SLOTS 176-177
  {n:"NashH_Worth",p:"Sample Pack",s:5,t:"nice product",x:"nice product. arrived faster than expected. will order more",v:true},
  {n:"n0name_user",p:"Standard Pack",s:5,t:"excellente qualite",x:"excellente qualite. livraison rapide et discrete. je commande a nouveau.",v:true},
  // ── SLOTS 178-179
  {n:"ClearStack_BC",p:"Pro Pack",s:5,t:"Quality and Service",x:"The product is extraordinary and the service on Telegram is the fastest I've experienced. Highly recommend.",v:true},
  {n:"GoldStrike_T",p:"Standard Pack",s:5,t:"works",x:"works. quality is good. shipped fast. 5 stars",v:true},
  // ── SLOTS 180-181
  {n:"PeakB_Happy",p:"Pro Pack",s:5,t:"Five stars from the start",x:"First order, five stars immediately. The hologram and texture are in a different league. Already planning my second.",v:true},
  {n:"patty_l",p:"Sample Pack",s:5,t:"ordering more",x:"quality is great. ordering more tonight. simple.",v:true},
  // ── SLOTS 182-183 (NEW entries below — all nicknames)
  {n:"vincent_qc",p:"Pro Pack",s:5,t:"rien a redire",x:"rien a redire. qualite parfaite. livraison parfaite. 5 etoiles.",v:true},
  {n:"PropNation_T",p:"Standard Pack",s:5,t:"very happy",x:"very happy with this purchase. quality is great, shipping was fast. already thinking about my next order.",v:true},
  // ── SLOTS 184-185
  {n:"CashCrop_ON",p:"Pro Pack",s:5,t:"amazing",x:"amazing quality. the snap is something else. ordering again.",v:true},
  {n:"sylvie_d",p:"Bulk Pack",s:5,t:"bulk order was smooth",x:"placed large order. received in 3 days. every bill perfect. discreet plain box. will come back.",v:true},
  // ── SLOTS 186-187
  {n:"DennisB_Bulk",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait de ma commande. qualite excellente. emballage discret. merci.",v:true},
  {n:"arnaud_p",p:"Sample Pack",s:5,t:"damn",x:"damn this quality is good. ordering the pro pack rn",v:true},
  // ── SLOTS 188-189
  {n:"EliasH_Ev",p:"Pro Pack",s:5,t:"Real detail",x:"The raised texture is real. The braille is real. The hologram is real. Nothing fake about this quality. Buying again.",v:true},
  {n:"adrien_mtl",p:"Standard Pack",s:5,t:"quick",x:"quick delivery. packaging was clean. product is great.",v:true},
  // ── SLOTS 190-191
  {n:"steeve_qc",p:"Pro Pack",s:5,t:"Qualite impressionante",x:"Je ne m'attendais pas a un tel niveau de detail. Le hologramme est spectaculaire. Je recommande fortement.",v:true},
  {n:"VoicelessVic",p:"Bulk Pack",s:5,t:"No defects anywhere",x:"Went through every single bill in the bulk pack. Not one defect. Every bill identical. This is professional grade.",v:true},
  // ── SLOTS 192-193
  {n:"PropShadow",p:"Standard Pack",s:5,t:"fast",x:"fast shipping. good quality. happy.",v:true},
  {n:"christophe_qc",p:"Pro Pack",s:5,t:"Came back for more",x:"This is my second order. Quality was exactly the same as the first. Consistent, fast, discreet. A supplier you can rely on.",v:true},
  // ── SLOTS 194-195
  {n:"alex_mtl",p:"Standard Pack",s:5,t:"parfait comme toujours",x:"deuxieme commande. qualite identique. livraison rapide. parfait.",v:true},
  {n:"IronStack",p:"Sample Pack",s:5,t:"wow",x:"wow. just wow.",v:true},
  // ── SLOTS 196-197
  {n:"FinnT_Out",p:"Pro Pack",s:5,t:"Nothing else like it",x:"Spent time comparing options. Nothing else on the market comes close. The texture, the hologram, the snap. This is it.",v:true},
  {n:"sophie_d",p:"Standard Pack",s:5,t:"recommend",x:"would recommend to anyone. great quality great service.",v:true},
  // ── SLOTS 198-199
  {n:"bastian_r",p:"Bulk Pack",s:5,t:"commande en masse reussie",x:"grosse commande. recu en 3 jours. chaque billet parfait. livraison discrete. je reviens.",v:true},
  {n:"FlameSnap",p:"Pro Pack",s:5,t:"hologram is fire",x:"the hologram shift is insane. gold to green. never gets old. quality throughout is excellent.",v:true},
  // ── SLOTS 200-201
  {n:"JaredT_Right",p:"Standard Pack",s:5,t:"ordered again",x:"just placed my second order. first one was perfect so no hesitation this time.",v:true},
  {n:"antoine_d",p:"Sample Pack",s:5,t:"great sample",x:"great sample pack. going to order the full pro pack now. quality is excellent.",v:true},
  // ── SLOTS 202-203
  {n:"phil_qc",p:"Pro Pack",s:5,t:"Cant go back",x:"After trying this, I cant go back to anything else. The quality gap is enormous. Braille, hologram, texture. All there.",v:true},
  {n:"BlazeH_Intro",p:"Standard Pack",s:5,t:"nice one",x:"nice one guys. quality is great. delivery was fast.",v:true},
  // ── SLOTS 204-205
  {n:"EliT_Sold",p:"Standard Pack",s:5,t:"vraiment satisfaite",x:"vraiment satisfaite. qualite au top, emballage discret, livraison en 2 jours. je recommande.",v:true},
  {n:"IceBreaker_Buy",p:"Pro Pack",s:5,t:"outstanding quality",x:"outstanding quality on every single bill. the hologram and texture are both incredible. fast delivery too.",v:true},
  // ── SLOTS 206-207
  {n:"ReedT_QC",p:"Bulk Pack",s:5,t:"bulk order arrived perfect",x:"every bundle identical. print is sharp, hologram is vivid. discreet packaging. will order again.",v:true},
  {n:"SteadyBillz",p:"Sample Pack",s:5,t:"worth it",x:"worth every cent. quality is excellent. ordering more.",v:true},
  // ── SLOTS 208-209
  {n:"lucas_bc",p:"Pro Pack",s:5,t:"superbe qualite",x:"superbe qualite. hologramme magnifique. je commanderai encore tres bientot.",v:true},
  {n:"StackedUp_BC",p:"Standard Pack",s:5,t:"happy customer",x:"happy customer here. quality is great, delivery was fast. will order again.",v:true},
  // ── SLOTS 210-211
  {n:"JaceW_Trust",p:"Pro Pack",s:5,t:"This level of quality",x:"This level of quality in prop currency is something I hadnt seen before. Every detail is perfect. Permanent customer.",v:true},
  {n:"TrueNorth_T",p:"Sample Pack",s:5,t:"great",x:"great quality. fast. ordering the pro pack next.",v:true},
  // ── SLOTS 212-213
  {n:"HeavyStack",p:"Standard Pack",s:5,t:"tres bien recu",x:"tres bien recu. qualite au rendez-vous. emballage neutre. parfait.",v:true},
  {n:"MegaStack_ON",p:"Bulk Pack",s:5,t:"Bulk is the way to go",x:"Ordered the bulk pack for the value. Quality didnt drop at all. Every bill was perfect. Fast delivery, discreet box.",v:true},
  // ── SLOTS 214-215
  {n:"GoldRush_BC",p:"Pro Pack",s:5,t:"Seriously impressive",x:"Seriously impressed by every aspect of this product. The texture, the snap, the hologram. Nothing is cut. Perfect.",v:true},
  {n:"PropBlazer",p:"Standard Pack",s:5,t:"ok",x:"ok quality is great. no complaints",v:true},
  // ── SLOTS 216-217
  {n:"Remy_QC",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite vraiment incroyable. je commande encore ce soir. merci beaucoup!",v:true},
  {n:"TomP_Quick",p:"Sample Pack",s:5,t:"test then buy",x:"tried the sample. bought the pro pack same day. quality is that good.",v:true},
  // ── SLOTS 218-219
  {n:"RykerT_Qual",p:"Standard Pack",s:5,t:"no issues",x:"no issues at all. quality is great. arrived fast.",v:true},
  {n:"ben_s",p:"Pro Pack",s:5,t:"The real thing",x:"People keep asking where I got these. The quality genuinely looks and feels real. Snap, texture, hologram. All perfect.",v:true},
  // ── SLOTS 220-221
  {n:"damien_f",p:"Standard Pack",s:5,t:"excellente experience",x:"excellente experience du debut a la fin. qualite parfaite, livraison en 2 jours. je recommande.",v:true},
  {n:"Fr_acheteur",p:"Bulk Pack",s:5,t:"Consistent bulk",x:"Ordered bulk twice now. Same quality both times. Every bill identical. This is a supplier you can trust.",v:true},
  // ── SLOTS 222-223
  {n:"ColtonT.",p:"Pro Pack",s:5,t:"ordering again tonight",x:"third order coming in tonight. this shop never disappoints. same great quality every time.",v:true},
  {n:"SterlingM.",p:"Standard Pack",s:5,t:"legit",x:"legit quality. fast shipping. 5 stars.",v:true},
  // ── SLOTS 224-225
  {n:"EK_Official",p:"Pro Pack",s:5,t:"qualite remarquable",x:"qualite remarquable sur chaque billet. hologramme parfait. livraison discrete et rapide.",v:true},
  {n:"SteadyStack",p:"Sample Pack",s:5,t:"sample sold me",x:"tried the sample. now ordering bulk. quality is that impressive.",v:true},
  // ── SLOTS 226-227
  {n:"kevin_mtl",p:"Standard Pack",s:5,t:"arrived today",x:"arrived today. quality is great. better than expected. ordering more soon.",v:true},
  {n:"AdrianK.",p:"Pro Pack",s:5,t:"worth every cent",x:"worth every cent. the texture and hologram alone are worth it. discreet delivery too. five stars.",v:true},
  // ── SLOTS 228-229
  {n:"PropSync",p:"Bulk Pack",s:5,t:"parfait comme prevu",x:"grosse commande parfaite. qualite constante, livraison rapide, emballage discret. je reviendrai.",v:true},
  {n:"PeteW_Sample",p:"Pro Pack",s:5,t:"Really impressed",x:"Really impressed with everything here. Quality, shipping, packaging, Telegram support. All excellent.",v:true},
  // ── SLOTS 230-231
  {n:"PureSnap_T",p:"Standard Pack",s:5,t:"clean delivery",x:"clean delivery. discreet box. great product. happy.",v:true},
  {n:"thatsaW",p:"Pro Pack",s:5,t:"snap texture hologram",x:"snap is perfect. texture is perfect. hologram is perfect. done.",v:true},
  // ── SLOTS 232-233
  {n:"EdgeStack_T",p:"Standard Pack",s:5,t:"qualite au rendez-vous",x:"qualite au rendez-vous. livraison en 2 jours. je recommande sans hesiter.",v:true},
  {n:"chill_purchase",p:"Sample Pack",s:5,t:"better than expected",x:"honestly better than i expected. going to order the full pack.",v:true},
  // ── SLOTS 234-235
  {n:"OnyxT_Diff",p:"Bulk Pack",s:5,t:"Huge order no problems",x:"Placed a huge order. No problems. Every bill consistent. Delivery was on time and packaging was discreet.",v:true},
  {n:"OwenT_STH",p:"Pro Pack",s:5,t:"wow quality",x:"wow the quality on these. the snap the texture. ordering again.",v:true},
  // ── SLOTS 236-237
  {n:"TLdr_Quality",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite excellente. livraison rapide. je recommande.",v:true},
  {n:"WaveT_Bulk",p:"Pro Pack",s:5,t:"This quality is rare",x:"Rare to find this level of quality in this category. Every detail is right. Snap, texture, hologram. Permanent customer.",v:true},
  // ── SLOTS 238-239
  {n:"StoneH_Trust",p:"Standard Pack",s:5,t:"exactly right",x:"everything about this is exactly right. quality, packaging, delivery. five stars.",v:true},
  {n:"PropViper",p:"Sample Pack",s:5,t:"perfect sample",x:"perfect quality on the sample. ordering the big pack now.",v:true},
  // ── SLOTS 240-241
  {n:"CrewH_Good",p:"Pro Pack",s:5,t:"hologramme magnifique",x:"hologramme magnifique. texture parfaite. livraison rapide. je suis tres satisfait.",v:true},
  {n:"lmao_its_legit",p:"Bulk Pack",s:5,t:"Reliable bulk supplier",x:"This is my third bulk order. Same quality every time. Same fast delivery. Same discreet packaging. A supplier I trust.",v:true},
  // ── SLOTS 242-243
  {n:"HugoP_Today",p:"Standard Pack",s:5,t:"great value",x:"great value for the quality you get. fast delivery too. will order again.",v:true},
  {n:"SilkStack",p:"Pro Pack",s:5,t:"best prop bills ive seen",x:"best prop bills ive ever seen. nothing comes close. the hologram and texture are extraordinary.",v:true},
  // ── SLOTS 244-245
  {n:"Rene_H",p:"Standard Pack",s:5,t:"tres content",x:"tres content de mon achat. qualite top. livraison rapide. emballage discret.",v:true},
  {n:"RickT_Solid",p:"Sample Pack",s:5,t:"sold",x:"sold after first touch. ordering more.",v:true},
  // ── SLOTS 246-247
  {n:"MikeS_GoTo",p:"Pro Pack",s:5,t:"Quality you can feel",x:"You can feel the quality the second you pick one up. The raised texture and snap are immediately noticeable. Hologram is incredible.",v:true},
  {n:"FlipKing_ON",p:"Standard Pack",s:5,t:"no complaints",x:"no complaints. arrived fast. quality is excellent.",v:true},
  // ── SLOTS 248-249
  {n:"NedK_Ok",p:"Bulk Pack",s:5,t:"gros volume qualite constante",x:"commande en gros volume. qualite constante sur chaque billet. livraison discrete et rapide. parfait.",v:true},
  {n:"JustJake",p:"Pro Pack",s:5,t:"reordering tonight",x:"just opened my package. quality is outstanding. reordering tonight.",v:true},
  // ── SLOTS 250-251
  {n:"NK_Props",p:"Standard Pack",s:5,t:"great shop",x:"great shop. great product. great service. simple.",v:true},
  {n:"QuickNote_Buy",p:"Pro Pack",s:5,t:"detail is everything",x:"the detail on these bills is extraordinary. micro-text, braille, hologram. all perfect. buying again.",v:true},
  // ── SLOTS 252-253
  {n:"junkmail_acc",p:"Standard Pack",s:5,t:"super rapide",x:"super rapide. qualite au top. tres satisfait de ma commande.",v:true},
  {n:"victor_m",p:"Bulk Pack",s:5,t:"Ordered bulk again",x:"Second bulk order. Same perfect quality. This supplier is consistent and reliable. Fast delivery, discreet packaging.",v:true},
  // ── SLOTS 254-255
  {n:"ThunderBill",p:"Sample Pack",s:5,t:"great start",x:"started with the sample. great quality. ordering more this week.",v:true},
  {n:"ChaseB_Props",p:"Pro Pack",s:5,t:"This is the best",x:"After everything Ive tried, this is the best. The texture, the snap, the hologram. Nothing else comes close.",v:true},
  // ── SLOTS 256-257
  {n:"nadiaCQC",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. livraison en 2 jours. emballage discret. je recommande sans hesiter.",v:true},
  {n:"GregW_CA",p:"Pro Pack",s:5,t:"quality control is excellent",x:"quality control is excellent. every single bill was perfect. no defects anywhere. fast delivery too.",v:true},
  // ── SLOTS 258-259
  {n:"le_gars_du_nord",p:"Standard Pack",s:5,t:"happy",x:"very happy. quality is great. arrived fast.",v:true},
  {n:"HawkB_Happy",p:"Bulk Pack",s:5,t:"Bulk always perfect here",x:"Fourth bulk order now. Quality is always the same. Perfect. This is the supplier to go with.",v:true},
  // ── SLOTS 260-261
  {n:"ValeT_Still",p:"Pro Pack",s:5,t:"qualite extraordinaire",x:"qualite extraordinaire a chaque commande. hologramme parfait. livraison rapide. je suis un client fidele.",v:true},
  {n:"JordanK_Fast",p:"Sample Pack",s:5,t:"test passed",x:"tested the sample. passed with flying colors. ordering more.",v:true},
  // ── SLOTS 262-263
  {n:"CarlW_Large",p:"Standard Pack",s:5,t:"great",x:"great quality. great service. recommend.",v:true},
  {n:"PropFlame",p:"Pro Pack",s:5,t:"Never been disappointed",x:"Multiple orders and Ive never been disappointed. Same quality every time. Same fast shipping. Same discreet packaging.",v:true},
  // ── SLOTS 264-265
  {n:"SwiftProp",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. qualite top. livraison rapide. parfait.",v:true},
  {n:"shadow_acc",p:"Bulk Pack",s:5,t:"Bulk delivered on time",x:"Bulk order delivered exactly on time. Quality was perfect throughout. Discreet packaging. This supplier is reliable.",v:true},
  // ── SLOTS 266-267
  {n:"anon_buyer",p:"Standard Pack",s:5,t:"smooth",x:"smooth transaction. quality is great. arrived fast.",v:true},
  {n:"PropAlpha",p:"Pro Pack",s:5,t:"Quality you remember",x:"This is the kind of quality you remember. The snap and texture are unlike anything else. Ordering again this week.",v:true},
  // ── SLOTS 268-269
  {n:"marc_qc",p:"Standard Pack",s:5,t:"qualite top emballage discret",x:"qualite top, emballage discret, livraison rapide. tout ce qu'on peut demander.",v:true},
  {n:"PropNova",p:"Sample Pack",s:5,t:"convinced",x:"convinced after opening the sample. ordering the pro pack.",v:true},
  // ── SLOTS 270-271
  {n:"TopShelf_T",p:"Pro Pack",s:5,t:"every detail is right",x:"weight, snap, texture, hologram, braille. every single detail is right. extraordinary product.",v:true},
  {n:"HaroldK_Qual",p:"Standard Pack",s:5,t:"recommend",x:"recommend to everyone. quality is great. fast shipping.",v:true},
  // ── SLOTS 272-273
  {n:"BradK_Sample",p:"Pro Pack",s:5,t:"meilleure qualite",x:"meilleure qualite que j'ai vue dans cette categorie. hologramme parfait, texture excellente. je reviens.",v:true},
  {n:"jean_b",p:"Bulk Pack",s:5,t:"Bulk is consistent",x:"Every bulk order is consistent in quality. Same hologram, same texture, same snap. A supplier you can count on.",v:true},
  // ── SLOTS 274-275
  {n:"benoit_l",p:"Standard Pack",s:5,t:"really good",x:"really good quality. shipped fast. discreet packaging. happy.",v:true},
  {n:"DanA_TO",p:"Pro Pack",s:5,t:"Ordering again for sure",x:"Opened the package and was immediately satisfied with the quality. Hologram is stunning. Ordering again for sure.",v:true},
  // ── SLOTS 276-277
  {n:"CalvH",p:"Standard Pack",s:5,t:"livraison rapide",x:"livraison rapide, qualite au top. je commande encore sans hesiter.",v:true},
  {n:"kev_99",p:"Sample Pack",s:5,t:"sample quality was excellent",x:"sample quality was excellent. going for the full pro pack next.",v:true},
  // ── SLOTS 278-279
  {n:"DonK_Aplus",p:"Pro Pack",s:5,t:"Genuinely outstanding",x:"Genuinely outstanding quality. The texture is palpable, the snap is perfect, the hologram is vivid. No complaints.",v:true},
  {n:"pierre_qc",p:"Standard Pack",s:5,t:"great product",x:"great product. fast delivery. will order again.",v:true},
  // ── SLOTS 280-281
  {n:"victor_qc",p:"Pro Pack",s:5,t:"qualite hors pair",x:"qualite hors pair. chaque detail est parfait. livraison discrete et rapide. je reviendrai.",v:true},
  {n:"gabriel_b",p:"Bulk Pack",s:5,t:"Bulk order done right",x:"This is how a bulk order should go. Fast delivery, discreet packaging, perfect quality throughout. Zero issues.",v:true},
  // ── SLOTS 282-283
  {n:"LedgerT_One",p:"Standard Pack",s:5,t:"nice quality",x:"nice quality. arrived on time. will recommend to friends.",v:true},
  {n:"UrbanStack_TO",p:"Pro Pack",s:5,t:"My favourite supplier",x:"My favourite supplier for prop currency. Quality is always perfect. Shipping is always fast. Cant ask for more.",v:true},
  // ── SLOTS 284-285
  {n:"HenryD.",p:"Standard Pack",s:5,t:"impeccable",x:"impeccable. qualite parfaite, livraison rapide, emballage discret. 5 etoiles.",v:true},
  {n:"CoryW_Test",p:"Sample Pack",s:5,t:"this is the one",x:"tried a few options. this is the one. quality is clearly the best.",v:true},
  // ── SLOTS 286-287
  {n:"BoltPropz",p:"Bulk Pack",s:5,t:"Always reliable",x:"Every time I order bulk, same quality, same fast delivery, same discreet packaging. This shop is always reliable.",v:true},
  {n:"ColeT_None",p:"Standard Pack",s:5,t:"happy customer",x:"happy customer. quality is great. arrived fast. will buy again.",v:true},
  // ── SLOTS 288-289
  {n:"VelvetSnap",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je commande encore ce soir. rien a dire de negatif.",v:true},
  {n:"OverStack_ON",p:"Pro Pack",s:5,t:"The snap does it",x:"The snap does it for me. That sound and feel when you flex the bill is so satisfying. Everything else is equally good.",v:true},
  // ── SLOTS 290-291
  {n:"TrueGold_CA",p:"Standard Pack",s:5,t:"exactly as ordered",x:"exactly as ordered. quality is great. packaging was discreet. fast delivery.",v:true},
  {n:"NoahDelay",p:"Sample Pack",s:5,t:"great introduction",x:"great introduction to the product. quality is excellent. will order more.",v:true},
  // ── SLOTS 292-293
  {n:"JakeT_Van",p:"Standard Pack",s:5,t:"super qualite",x:"super qualite. j'ai commande encore le soir meme de la livraison. merci.",v:true},
  {n:"jerome_d",p:"Pro Pack",s:5,t:"Quality on a different level",x:"This quality is on a different level from anything else I've tried. The texture, the hologram, the braille. All perfect.",v:true},
  // ── SLOTS 294-295
  {n:"EzMoney_CA",p:"Bulk Pack",s:5,t:"bulk was perfect",x:"bulk order was perfect. every bill identical. delivery was discreet and fast. coming back.",v:true},
  {n:"sarah_k",p:"Standard Pack",s:5,t:"good stuff",x:"good stuff. quality is there. arrived fast.",v:true},
  // ── SLOTS 296-297
  {n:"BillSniper",p:"Pro Pack",s:5,t:"commande parfaite",x:"commande parfaite. qualite exceptionnelle, hologramme magnifique, livraison rapide. je ne changerai pas de fournisseur.",v:true},
  {n:"xQuickCash",p:"Pro Pack",s:5,t:"Buying again",x:"Buying again this week. The quality is always consistent and the delivery is always fast. A shop I trust.",v:true},
  // ── SLOTS 298-299
  {n:"Nico_B",p:"Standard Pack",s:5,t:"yep great",x:"yep. great quality. fast ship. thanks",v:true},
  {n:"FastSnap_CA",p:"Sample Pack",s:5,t:"sample was excellent",x:"sample was excellent. going to order the bulk pack this time.",v:true},
  // ── SLOTS 300-301
  {n:"AM_Props",p:"Pro Pack",s:5,t:"qualite top",x:"qualite top. hologramme parfait. je commande encore ce soir.",v:true},
  {n:"ChrisNight",p:"Bulk Pack",s:5,t:"Bulk every time",x:"Order bulk every time for the value. Quality is always the same. Perfect. This is my go-to shop.",v:true},
  // ── SLOTS 302-303
  {n:"AceStack_BC",p:"Standard Pack",s:5,t:"no issues",x:"no issues. quality is great. arrived on time.",v:true},
  {n:"FrankR_Snap",p:"Pro Pack",s:5,t:"Phenomenal quality",x:"Phenomenal quality from start to finish. The texture is palpable, the hologram is vivid. Will keep ordering.",v:true},
  // ── SLOTS 304-305
  {n:"HundredProof",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite au top. emballage discret. livraison rapide. 5 etoiles.",v:true},
  {n:"alexis_r",p:"Sample Pack",s:5,t:"great test",x:"great test with the sample. ordering more now.",v:true},
  // ── SLOTS 306-307
  {n:"BlakeT_Perm",p:"Pro Pack",s:5,t:"Consistent quality",x:"This is my fifth order. Consistent quality every single time. Consistent fast delivery every single time. My permanent supplier.",v:true},
  {n:"VictorH_Top",p:"Standard Pack",s:5,t:"arrived fast",x:"arrived fast. packaging was clean. quality is excellent.",v:true},
  // ── SLOTS 308-309
  {n:"MJ_Official",p:"Pro Pack",s:5,t:"qualite parfaite a chaque fois",x:"cinquieme commande. qualite parfaite a chaque fois. je ne commanderai jamais ailleurs.",v:true},
  {n:"PatrickM_4th",p:"Bulk Pack",s:5,t:"Bulk done perfectly",x:"Every bulk order I place is handled perfectly. Fast delivery, discreet packaging, perfect quality. This shop is the standard.",v:true},
  // ── SLOTS 310-311
  {n:"max_t_qc",p:"Standard Pack",s:5,t:"very good",x:"very good quality. arrived on time. will buy again for sure.",v:true},
  {n:"BrightStack",p:"Pro Pack",s:5,t:"Hooked after first order",x:"Hooked after my first order. Quality is extraordinary. Hologram is stunning. Snap is perfect. Coming back every time.",v:true},
  // ── SLOTS 312-313
  {n:"david_qc",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite excellente. livraison parfaite. je recommande.",v:true},
  {n:"ColbyW_Worth",p:"Sample Pack",s:5,t:"started small",x:"started small with the sample. loved it. ordering the pro pack now.",v:true},
  // ── SLOTS 314-315
  {n:"StoneT_First",p:"Bulk Pack",s:5,t:"Bulk order always works",x:"Every bulk order here works perfectly. Consistent quality, fast delivery, discreet packaging. Five stars every time.",v:true},
  {n:"Gabi_L",p:"Standard Pack",s:5,t:"smooth",x:"smooth. quality is great. no issues.",v:true},
  // ── SLOTS 316-317
  {n:"PropCore",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. le hologramme est magnifique et la texture est parfaite. je reviendrai.",v:true},
  {n:"burner_acc99",p:"Pro Pack",s:5,t:"Quality guarantee",x:"Feel like theres a quality guarantee with every order here. Never been let down. Snap, texture, hologram. Always perfect.",v:true},
  // ── SLOTS 318-319
  {n:"BrockT_Sold",p:"Standard Pack",s:5,t:"happy",x:"happy with everything. quality, delivery, packaging. all great.",v:true},
  {n:"simon_c",p:"Sample Pack",s:5,t:"quality is evident",x:"quality is immediately evident when you pick one up. snap and texture are perfect. ordering more.",v:true},
  // ── SLOTS 320-321
  {n:"CleanJack",p:"Pro Pack",s:5,t:"impeccable comme toujours",x:"impeccable comme toujours. sixieme commande. qualite et livraison parfaites.",v:true},
  {n:"p00r_speller",p:"Bulk Pack",s:5,t:"Always ordering here",x:"This is the only shop I use for bulk. Quality never changes. Delivery is always fast. A supplier you can depend on.",v:true},
  // ── SLOTS 322-323
  {n:"mathieu_g",p:"Standard Pack",s:5,t:"great quality",x:"great quality. fast shipping. no complaints.",v:true},
  {n:"PropVault_T",p:"Pro Pack",s:5,t:"The hologram is worth it alone",x:"The hologram alone makes this worth it. The shift from gold to green at different angles is stunning. Everything else matches.",v:true},
  // ── SLOTS 324-325
  {n:"EliteProp_BC",p:"Standard Pack",s:5,t:"qualite au rendez-vous",x:"qualite au rendez-vous. livraison rapide. emballage discret. parfait.",v:true},
  {n:"BeckettB_Ev",p:"Sample Pack",s:5,t:"sample was enough",x:"one sample was enough to convince me. ordering the pro pack now.",v:true},
  // ── SLOTS 326-327
  {n:"DashH_Test",p:"Pro Pack",s:5,t:"Outstanding every order",x:"Outstanding quality every single order. This shop never lets me down. Fast, discreet, perfect quality.",v:true},
  {n:"anon_review",p:"Standard Pack",s:5,t:"solid",x:"solid quality. fast delivery. happy.",v:true},
  // ── SLOTS 328-329
  {n:"Tim_OneDay",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. hologramme spectaculaire. livraison discrete et rapide. je recommande.",v:true},
  {n:"isab_t",p:"Bulk Pack",s:5,t:"Best bulk experience",x:"Best bulk ordering experience Ive had. Quality across every bill was identical and perfect. Delivery was fast.",v:true},
  // ── SLOTS 330-331
  {n:"WillS_Van",p:"Standard Pack",s:5,t:"fast and good",x:"fast delivery and good quality. simple as that. will order again.",v:true},
  {n:"RealStack_ON",p:"Pro Pack",s:5,t:"This is it",x:"After trying many options, this is the one. The quality gap between this and everything else is massive.",v:true},
  // ── SLOTS 332-333
  {n:"david_t",p:"Standard Pack",s:5,t:"qualite incroyable",x:"qualite incroyable pour le prix. je reviens a chaque fois avec la meme satisfaction.",v:true},
  {n:"ColdStack_BC",p:"Sample Pack",s:5,t:"wow",x:"wow. quality is outstanding. ordering more.",v:true},
  // ── SLOTS 334-335
  {n:"olivier_n",p:"Pro Pack",s:5,t:"My go-to every time",x:"My go-to every time I need prop currency. Quality is always perfect. Shipping is always fast. Five stars.",v:true},
  {n:"throwaway_real",p:"Standard Pack",s:5,t:"happy customer",x:"happy customer. quality is great. will order again.",v:true},
  // ── SLOTS 336-337
  {n:"emilie_v",p:"Pro Pack",s:5,t:"rien a dire",x:"rien a dire. qualite parfaite. livraison parfaite. hologramme parfait.",v:true},
  {n:"CadeT_Phenom",p:"Bulk Pack",s:5,t:"Bulk always excellent",x:"Bulk orders here are always excellent. Quality never drops. Delivery is always fast and discreet.",v:true},
  // ── SLOTS 338-339
  {n:"KylerW_Bulk",p:"Standard Pack",s:5,t:"great",x:"great. quality is good. fast. recommend.",v:true},
  {n:"GrantT_Srs",p:"Pro Pack",s:5,t:"Top quality top experience",x:"Top quality product and top customer experience. Telegram support was fast, product was extraordinary.",v:true},
  // ── SLOTS 340-341
  {n:"HighRollerZ",p:"Standard Pack",s:5,t:"commande parfaite",x:"commande parfaite. qualite top, livraison en 2 jours, emballage discret. 5 etoiles.",v:true},
  {n:"PhantomStack",p:"Sample Pack",s:5,t:"excellent sample",x:"excellent sample quality. going to order the bulk pack.",v:true},
  // ── SLOTS 342-343
  {n:"RawStack_BC",p:"Pro Pack",s:5,t:"Quality that converts you",x:"One order is all it takes to become a permanent customer. The quality is that good. Snap, texture, hologram. Perfect.",v:true},
  {n:"WatcherTurnedBuyer",p:"Standard Pack",s:5,t:"happy",x:"happy with the order. quality is great. arrived fast.",v:true},
  // ── SLOTS 344-345
  {n:"ReefT_None",p:"Pro Pack",s:5,t:"qualite top encore",x:"encore une commande parfaite. qualite constante, livraison rapide. je ne commanderai jamais ailleurs.",v:true},
  {n:"AlexBBulk",p:"Bulk Pack",s:5,t:"Bulk order was excellent",x:"Bulk order was excellent. Every bill perfect. Delivery was on time and discreet. Coming back.",v:true},
  // ── SLOTS 346-347
  {n:"E.Cole88",p:"Standard Pack",s:5,t:"works every time",x:"works every time. quality is consistent. delivery is fast.",v:true},
  {n:"jerome_qc",p:"Pro Pack",s:5,t:"Still the best",x:"Still the best quality I've found for prop currency. Every order is perfect. Snap, texture, hologram. All there.",v:true},
  // ── SLOTS 348-349
  {n:"WyattH.",p:"Standard Pack",s:5,t:"qualite au top",x:"qualite au top. j'ai commande encore le meme soir. merci!",v:true},
  {n:"VoltB_Fast",p:"Sample Pack",s:5,t:"great first order",x:"great first order. quality is excellent. will be back.",v:true},
  // ── SLOTS 350-351
  {n:"CrossH_Out",p:"Pro Pack",s:5,t:"Nothing else compares",x:"Tried everything on the market. Nothing else compares to this quality. The texture, the snap, the hologram. This is the one.",v:true},
  {n:"StreetStack_CA",p:"Standard Pack",s:5,t:"happy with everything",x:"happy with everything. quality, shipping, packaging. all great. will order again.",v:true},
  // ── SLOTS 352-353
  {n:"Flo_R",p:"Standard Pack",s:5,t:"parfait",x:"parfait. qualite, livraison, emballage. tout est parfait.",v:true},
  {n:"RollDeep_T",p:"Bulk Pack",s:5,t:"Bulk is always right",x:"Bulk orders here are always right. Perfect quality across every bill. Fast delivery. Discreet packaging. My supplier.",v:true},
  // ── SLOTS 354-355
  {n:"clement_van",p:"Pro Pack",s:5,t:"fifth order coming",x:"fifth order coming this week. same great quality every time. this shop never misses.",v:true},
  {n:"tommy_a",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied with the order. quality is great. arrived on time.",v:true},
  // ── SLOTS 356-357
  {n:"PropSnap_Pro",p:"Pro Pack",s:5,t:"qualite parfaite comme toujours",x:"qualite parfaite comme toujours. hologramme magnifique, texture excellente. livraison discrete.",v:true},
  {n:"PrimePropz",p:"Sample Pack",s:5,t:"quality was excellent",x:"quality was excellent on the sample. ordering more now.",v:true},
  // ── SLOTS 358-359
  {n:"KevinB_Nice",p:"Pro Pack",s:5,t:"Best quality out there",x:"Best quality out there for prop currency. The raised texture, the hologram, the snap. Nothing else comes close.",v:true},
  {n:"jp_m",p:"Standard Pack",s:5,t:"fast and discreet",x:"fast delivery. discreet packaging. great quality. five stars.",v:true},

  /* ================================================
     SECOND BATCH OF 360 — ALL NEW, HEAVY ON NICKNAMES
  ================================================ */
  // ── SLOTS 360-361
  {n:"ReedH_Con",p:"Pro Pack",s:5,t:"nobody does it like this",x:"been shopping around for a while. nobody does it like this. quality is on another level. ordering again.",v:true},
  {n:"RafaelB_Great",p:"Standard Pack",s:5,t:"livraison parfaite",x:"livraison parfaite. qualite au top. je reviens.",v:true},
  // ── SLOTS 362-363
  {n:"CrispProp_BC",p:"Pro Pack",s:5,t:"the snap sells it",x:"if you know, you know. that snap is perfect. ordering bulk next.",v:true},
  {n:"LarryT_Holo",p:"Sample Pack",s:5,t:"tried everything",x:"tried everything on the market. this wins. no contest.",v:true},
  // ── SLOTS 364-365
  {n:"ConnorM_Bulk",p:"Bulk Pack",s:5,t:"bulk is the move",x:"bulk pack every time. quality is consistent, price is right. fast delivery.",v:true},
  {n:"BlazeSnap",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. simple. ordering again tonight.",v:true},
  // ── SLOTS 366-367
  {n:"EmmettR.",p:"Standard Pack",s:5,t:"hologram is real",x:"the hologram looks 100% authentic under any lighting. quality all around.",v:true},
  {n:"JM_Stacks",p:"Standard Pack",s:5,t:"parfait",x:"parfait. tout est parfait. je commande encore.",v:true},
  // ── SLOTS 368-369
  {n:"olivier_d",p:"Pro Pack",s:5,t:"wow",x:"wow. thats all i have to say.",v:true},
  {n:"SteveK_Bulk",p:"Bulk Pack",s:5,t:"Best bulk supplier",x:"Placed three bulk orders here. Same great quality every time. This is my go-to. Reliable, fast, discreet.",v:true},
  // ── SLOTS 370-371
  {n:"nicolas_van",p:"Standard Pack",s:5,t:"slick quality",x:"slick. clean. perfect. fast delivery. ordering the pro pack next.",v:true},
  {n:"Mike_T",p:"Standard Pack",s:5,t:"livraison ultra rapide",x:"livraison ultra rapide. qualite impeccable. je suis tres satisfaite de mon achat.",v:true},
  // ── SLOTS 372-373
  {n:"loic_r",p:"Pro Pack",s:5,t:"this shop hits different",x:"this shop hits different. quality is extraordinary. snap is perfect. ordering again.",v:true},
  {n:"MilesG.",p:"Sample Pack",s:5,t:"ok this is it",x:"ok this is it. been looking for this quality. ordering the big pack now.",v:true},
  // ── SLOTS 374-375
  {n:"ok_review",p:"Pro Pack",s:5,t:"Le roi de la qualite",x:"Le meilleur fournisseur que j'ai trouve. Qualite irreprochable, livraison rapide, emballage discret. Je reviendrai.",v:true},
  {n:"seb_r",p:"Bulk Pack",s:5,t:"no complaints",x:"no complaints on the bulk. every bill perfect. fast ship. discreet box. done.",v:true},
  // ── SLOTS 376-377
  {n:"renee_p",p:"Standard Pack",s:5,t:"quality like this",x:"quality like this is hard to find. found it. ordering again tonight.",v:true},
  {n:"PropForce",p:"Pro Pack",s:5,t:"Professional level",x:"Professional level quality at every stage. The texture is palpable, the hologram is vivid. This is what you want.",v:true},
  // ── SLOTS 378-379
  {n:"gabriel_qc2",p:"Standard Pack",s:5,t:"bonne affaire",x:"bonne affaire. qualite tres bonne. livraison rapide. je reviens.",v:true},
  {n:"CratesBill",p:"Pro Pack",s:5,t:"green to gold",x:"watching the hologram go green to gold is something else. quality is top notch.",v:true},
  // ── SLOTS 380-381
  {n:"CleanSlate_T",p:"Bulk Pack",s:5,t:"bulk perfection",x:"every bill identical. print is sharp. hologram is vivid. delivery in 3 days. discreet box. perfection.",v:true},
  {n:"stephane_qc",p:"Sample Pack",s:5,t:"wow",x:"wow quality. ordering more. simple.",v:true},
  // ── SLOTS 382-383
  {n:"anon_fr",p:"Pro Pack",s:5,t:"this is the one",x:"after searching for months, this is the one. quality is leagues above everything else.",v:true},
  {n:"JeffB_5star",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite au top. livraison discrete. parfait.",v:true},
  // ── SLOTS 384-385
  {n:"PropReign",p:"Standard Pack",s:5,t:"that snap",x:"you guys know. that snap. perfect. ordering more.",v:true},
  {n:"PropValor",p:"Pro Pack",s:5,t:"This quality is rare",x:"Genuinely rare to find quality like this. The texture, the hologram, the snap. Nothing else is even close. Permanent customer.",v:true},
  // ── SLOTS 386-387 (4-star)
  {n:"nicolas_mtl",p:"Standard Pack",s:4,t:"great quality, one day late",x:"quality is great. hologram and snap are perfect. delivery took one extra day vs tracking estimate. no big deal though. will order again.",v:true},
  {n:"BruceT_More",p:"Pro Pack",s:5,t:"easy 5 stars",x:"easy five stars. quality, delivery, packaging. all excellent.",v:true},
  // ── SLOTS 388-389
  {n:"UrbanProp_T",p:"Standard Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je n'ai pas pu m'empecher de commander encore le soir meme.",v:true},
  {n:"PropNexus",p:"Bulk Pack",s:5,t:"Real deal bulk",x:"Real deal quality on the bulk pack. Every bill consistent. Delivered in 3 days, discreet box. No issues.",v:true},
  // ── SLOTS 390-391
  {n:"SteelSnap_BC",p:"Sample Pack",s:5,t:"quick test",x:"quick test with the sample. passed instantly. ordering the pro pack.",v:true},
  {n:"CrownPropz",p:"Pro Pack",s:5,t:"nation of quality",x:"ordered for my whole crew. everyone was blown away. quality is something else.",v:true},
  // ── SLOTS 392-393
  {n:"PropNation_CA",p:"Standard Pack",s:5,t:"no fakes here",x:"the quality here is real. every detail is spot on. snap, texture, hologram. five stars.",v:true},
  {n:"SquadProp",p:"Standard Pack",s:5,t:"super satisfait",x:"super satisfait. qualite excellente, livraison rapide, emballage discret. je recommande.",v:true},
  // ── SLOTS 394-395
  {n:"bennyh",p:"Pro Pack",s:5,t:"stack of quality",x:"every bill in this stack is perfect. consistent quality throughout. fast and discreet. my go to.",v:true},
  {n:"WildStack_ON",p:"Sample Pack",s:5,t:"snap test passed",x:"snapped it. hologram checked. texture checked. quality checked. ordering the full pack.",v:true},
  // ── SLOTS 396-397
  {n:"CadeB_Hooked",p:"Bulk Pack",s:5,t:"hundred percent",x:"hundred percent satisfied. bulk order was flawless. every bill perfect. discreet delivery. coming back.",v:true},
  {n:"frederic_p",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite a chaque commande. je suis un client tres fidele de ce shop.",v:true},
  // ── SLOTS 398-399
  {n:"SlickBills",p:"Standard Pack",s:5,t:"crop of quality",x:"top crop quality. texture and hologram are both spot on. fast delivery. ordering again.",v:true},
  {n:"HunterS_CA",p:"Pro Pack",s:5,t:"green light every time",x:"green light every time I order here. quality never changes. always perfect. always fast.",v:true},
  // ── SLOTS 400-401
  {n:"PropGrip_T",p:"Bulk Pack",s:5,t:"maestro of quality",x:"this supplier is the maestro. every bulk order is a masterpiece. consistent, perfect, fast.",v:true},
  {n:"Phil_G",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait de ma commande. rien a reprocher. je recommande sans hesitation.",v:true},
  // ── SLOTS 402-403
  {n:"SnapQueen99",p:"Pro Pack",s:5,t:"doubled down",x:"loved my first order so much i doubled the quantity on the second. quality is always there.",v:true},
  {n:"JoshM_TO",p:"Standard Pack",s:5,t:"crossed all my criteria",x:"crossed every single criteria I had. quality, speed, packaging, support. perfect score.",v:true},
  // ── SLOTS 404-405
  {n:"RonP_Start",p:"Sample Pack",s:5,t:"this is real",x:"this is the real deal. quality speaks for itself. ordering more.",v:true},
  {n:"AaronB_Again",p:"Pro Pack",s:5,t:"hologramme incroyable",x:"hologramme incroyable. texture parfaite. je commande encore ce soir sans hesitation.",v:true},
  // ── SLOTS 406-407
  {n:"BoldStack_T",p:"Standard Pack",s:5,t:"lit quality",x:"quality is absolutely lit. the hologram under different light is stunning. five stars no question.",v:true},
  {n:"MaxB",p:"Bulk Pack",s:5,t:"cold quality",x:"cold hard quality. bulk pack was flawless. every bill identical. fast delivery. coming back.",v:true},
  // ── SLOTS 408-409
  {n:"CashKing_QC",p:"Pro Pack",s:5,t:"billboard quality",x:"quality you could put on a billboard. every detail is right. snap, texture, hologram. impressive.",v:true},
  {n:"TrapQueen416",p:"Standard Pack",s:5,t:"qualite top",x:"qualite top. livraison rapide. emballage discret. je reviendrai.",v:true},
  // ── SLOTS 410-411
  {n:"NeonSnap_BC",p:"Pro Pack",s:5,t:"wizardry",x:"absolute wizardry on the quality. how do they do it. ordering more.",v:true},
  {n:"B1llzOnly",p:"Sample Pack",s:5,t:"stacked quality",x:"quality is stacked. sample convinced me immediately. ordering the bulk pack.",v:true},
  // ── SLOTS 412-413
  {n:"EliP_416",p:"Bulk Pack",s:5,t:"rolling in quality",x:"the bulk pack quality is consistently excellent. every bill perfect. this is my supplier.",v:true},
  {n:"TrevorK_Bulk",p:"Standard Pack",s:5,t:"vraiment bien",x:"vraiment bien. qualite au rendez-vous. livraison rapide. je recommande a tous.",v:true},
  // ── SLOTS 414-415
  {n:"Mike_B.",p:"Pro Pack",s:5,t:"top shelf",x:"top shelf quality. nothing less from this shop. ordering the bulk pack next.",v:true},
  {n:"PureStack_CA",p:"Standard Pack",s:5,t:"king quality",x:"king quality. fast delivery. discreet box. will order again for sure.",v:true},
  // ── SLOTS 416-417 (4-star)
  {n:"PropForge",p:"Bulk Pack",s:4,t:"Quality great, 1 day late",x:"Quality is genuinely excellent on the bulk. Every bill perfect. Delivery came one day past the Purolator estimate. Not a major issue. Would order again.",v:true},
  {n:"BlaineT_None",p:"Pro Pack",s:5,t:"emerald hologram",x:"that emerald hologram shift. wow. quality throughout is just as good. ordering again.",v:true},
  // ── SLOTS 418-419
  {n:"CharlieB_QC",p:"Standard Pack",s:5,t:"parfait",x:"parfait. qualite, emballage, livraison. tout est parfait.",v:true},
  {n:"ScottM_Regular",p:"Sample Pack",s:5,t:"fast quality",x:"fast delivery. great quality. will order more.",v:true},
  // ── SLOTS 420-421
  {n:"FlashStack_T",p:"Pro Pack",s:5,t:"more than expected",x:"got more than I expected in terms of quality. the detail is extraordinary. ordering again tonight.",v:true},
  {n:"FireQual",p:"Bulk Pack",s:5,t:"real stacks",x:"real quality stacks. bulk order flawless. consistent throughout. fast and discreet. my go to.",v:true},
  // ── SLOTS 422-423
  {n:"DirkB_Only",p:"Standard Pack",s:5,t:"gold quality",x:"gold standard quality. hologram is gold to green under light. texture and snap are perfect.",v:true},
  {n:"Fr_buy",p:"Pro Pack",s:5,t:"qualite remarquable",x:"qualite remarquable a chaque commande. hologramme parfait, texture excellente, livraison rapide.",v:true},
  // ── SLOTS 424-425
  {n:"NeonBills_CA",p:"Pro Pack",s:5,t:"city of quality",x:"this shop is the city of quality prop bills. nothing comes close. permanent customer.",v:true},
  {n:"NightRun_Buy",p:"Sample Pack",s:5,t:"liquid quality",x:"smooth as liquid. quality is exceptional on the sample. going for the pro pack.",v:true},
  // ── SLOTS 426-427
  {n:"FredM_Works",p:"Bulk Pack",s:5,t:"nation of quality",x:"bulk order for the nation. every bill perfect. fast delivery. discreet packaging. this is the one.",v:true},
  {n:"DiamondStack",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. livraison rapide. qualite au top. je commande encore.",v:true},
  // ── SLOTS 428-429
  {n:"FastCash_T",p:"Pro Pack",s:5,t:"gold standard",x:"this is the gold standard for prop currency. everything is right. snap, texture, hologram. perfect.",v:true},
  {n:"BraydenA_Props",p:"Standard Pack",s:5,t:"under the radar quality",x:"under the radar quality. you don't realize how good it is until you hold one. snap and texture are extraordinary.",v:true},
  // ── SLOTS 430-431
  {n:"TrueSnap_T",p:"Bulk Pack",s:5,t:"on time every time",x:"on time every time. bulk quality is always consistent. fast delivery. discreet. this is my supplier.",v:true},
  {n:"NovaPropz",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. je commande depuis 6 mois. toujours la meme excellence.",v:true},
  // ── SLOTS 432-433
  {n:"xGoldFlip",p:"Sample Pack",s:5,t:"vault quality",x:"vault level quality. locked in. ordering the full pack.",v:true},
  {n:"GreenLight_GO",p:"Pro Pack",s:5,t:"always on deck",x:"always on deck with quality. every order is perfect. snap, texture, hologram. reliable.",v:true},
  // ── SLOTS 434-435
  {n:"TrueSnap_CA",p:"Standard Pack",s:5,t:"super qualite",x:"super qualite. emballage tres discret. livraison en 2 jours. je recommande a 100%.",v:true},
  {n:"TK_Sample",p:"Bulk Pack",s:5,t:"phantom quality",x:"phantom level quality. nobody knows where they came from. every bill perfect. this shop is elite.",v:true},
  // ── SLOTS 436-437
  {n:"EricF_5star",p:"Pro Pack",s:5,t:"true quality",x:"true grit quality. the texture alone is worth it. hologram and snap match. outstanding.",v:true},
  {n:"noe_p",p:"Standard Pack",s:5,t:"rapid quality",x:"rapid delivery. rapid satisfaction. quality is top notch. will order again.",v:true},
  // ── SLOTS 438-439
  {n:"BrettT_Right",p:"Standard Pack",s:5,t:"qualite au top",x:"qualite au top. livraison ultra rapide. emballage discret. je reviendrai sans hesiter.",v:true},
  {n:"DontAskMyName",p:"Pro Pack",s:5,t:"diamond quality",x:"diamond quality prop bills. every detail is perfect. snap is satisfying. hologram is stunning.",v:true},
  // ── SLOTS 440-441
  {n:"NitroStack",p:"Bulk Pack",s:5,t:"cold hard quality",x:"cold hard quality across every bill in the bulk. consistent, fast, discreet. this is the supplier.",v:true},
  {n:"MilesT_Best",p:"Sample Pack",s:5,t:"first snap sold me",x:"picked it up. snapped it. sold. ordering the bulk pack.",v:true},
  // ── SLOTS 442-443
  {n:"LateDay_Sam",p:"Pro Pack",s:5,t:"qualite impeccable",x:"qualite impeccable. hologramme magnifique. texture parfaite. je reviendrai toujours ici.",v:true},
  {n:"p.martin",p:"Standard Pack",s:5,t:"street level quality",x:"street level quality means it passes every test. this does. snap, texture, hologram. all perfect.",v:true},
  // ── SLOTS 444-445
  {n:"dude_trust_me",p:"Bulk Pack",s:5,t:"big quality",x:"big order, big quality. every bill in the bulk was perfect. fast delivery. will order again.",v:true},
  {n:"ArrowB_Snap",p:"Pro Pack",s:5,t:"flipped on quality",x:"flipped out when I opened the package. quality is extraordinary. ordered another pro pack same night.",v:true},
  // ── SLOTS 446-447
  {n:"SawyerP_Bulk",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite parfaite. livraison rapide. je recommande sans hesitation.",v:true},
  {n:"KnoxT_GoTo",p:"Pro Pack",s:5,t:"night quality",x:"opened it at night. was up for an hour examining it. quality is extraordinary. ordering again.",v:true},
  // ── SLOTS 448-449
  {n:"PropKing_T",p:"Sample Pack",s:5,t:"sniper accuracy",x:"sniper level accuracy on the quality. every detail hits. ordering the pro pack.",v:true},
  {n:"thomas_r",p:"Bulk Pack",s:5,t:"steady quality",x:"steady quality on every bulk order. never drops. never disappoints. my permanent supplier.",v:true},
  // ── SLOTS 450-451
  {n:"BillzAndMore",p:"Pro Pack",s:5,t:"qualite extraordinaire",x:"qualite extraordinaire. je commande depuis plusieurs mois. toujours aussi satisfait.",v:true},
  {n:"AdamLax",p:"Standard Pack",s:5,t:"swift quality",x:"swift delivery. quality is great. packaging was discreet. ordering more.",v:true},
  // ── SLOTS 452-453
  {n:"CleanSnap_ON",p:"Pro Pack",s:5,t:"urban quality",x:"urban quality. the snap and texture are spot on. hologram is vivid. fast delivery. five stars.",v:true},
  {n:"ReidC.",p:"Bulk Pack",s:5,t:"top dollar quality",x:"top dollar quality without the top dollar price. bulk order was flawless. all perfect.",v:true},
  // ── SLOTS 454-455
  {n:"thomas_qc",p:"Standard Pack",s:5,t:"parfait",x:"parfait. qualite, emballage, livraison. tout est impeccable. je recommande.",v:true},
  {n:"DylanF_MTL",p:"Pro Pack",s:5,t:"thunder quality",x:"thunder quality. the snap hits like thunder. texture is extraordinary. ordering again.",v:true},
  // ── SLOTS 456-457
  {n:"PropWave",p:"Sample Pack",s:5,t:"crown quality",x:"crown jewel quality. the sample sold me in seconds. ordering more.",v:true},
  {n:"CrestT_Samp",p:"Standard Pack",s:5,t:"grit quality",x:"grit and quality. this shop delivers every single time. will be back.",v:true},
  // ── SLOTS 458-459 (4-star)
  {n:"bruh_quality",p:"Pro Pack",s:4,t:"excellent quality, arrived late",x:"quality is excellent. hologram, texture, snap. all perfect. arrived one day past Purolator estimate. would definitely order again.",v:true},
  {n:"benoit_mtl",p:"Bulk Pack",s:5,t:"5 star bulk",x:"5 star bulk order. every bill perfect. fast delivery. discreet box. coming back.",v:true},
  // ── SLOTS 460-461
  {n:"val_mtl",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je commande encore ce soir. rien a dire de negatif.",v:true},
  {n:"ZachT_3rd",p:"Pro Pack",s:5,t:"elite quality",x:"elite quality. this is the best prop currency on the market. snap, texture, hologram. all perfect.",v:true},
  // ── SLOTS 462-463
  {n:"patrick_qc",p:"Bulk Pack",s:5,t:"heavy quality",x:"heavy quality on the bulk pack. every bill consistent. fast delivery. discreet packaging. my go to.",v:true},
  {n:"LuisB_Perfect",p:"Sample Pack",s:5,t:"flash quality",x:"flash delivery. flash impressed by the quality. ordering the pro pack now.",v:true},
  // ── SLOTS 464-465
  {n:"NexusStack",p:"Standard Pack",s:5,t:"tres content",x:"tres content. qualite excellente. livraison en 2 jours. emballage discret. parfait.",v:true},
  {n:"JasperW.",p:"Pro Pack",s:5,t:"velvet quality",x:"smooth and perfect like velvet. the texture is extraordinary. hologram is stunning. ordering again.",v:true},
  // ── SLOTS 466-467
  {n:"PropGate_T",p:"Standard Pack",s:5,t:"in the zone",x:"in the quality zone. every detail is right. fast delivery. discreet box. five stars.",v:true},
  {n:"DoubleSnap",p:"Bulk Pack",s:5,t:"golden quality",x:"golden standard quality on the bulk. every bill perfect. fast and discreet. permanent customer.",v:true},
  // ── SLOTS 468-469
  {n:"IcePropz",p:"Pro Pack",s:5,t:"impeccable",x:"impeccable qualite. hologramme parfait. texture excellente. livraison rapide. je reviendrai.",v:true},
  {n:"FastFingers99",p:"Standard Pack",s:5,t:"kraft quality",x:"quality crafted to perfection. every detail is right. snap, texture, hologram. outstanding.",v:true},
  // ── SLOTS 470-471
  {n:"luc_g",p:"Sample Pack",s:5,t:"pure quality",x:"pure quality from the first snap. ordered the full pack immediately.",v:true},
  {n:"yann_qc",p:"Pro Pack",s:5,t:"master quality",x:"master quality. this shop has mastered prop currency. ordering another pro pack tonight.",v:true},
  // ── SLOTS 472-473
  {n:"chloe_m",p:"Standard Pack",s:5,t:"qualite impeccable",x:"qualite impeccable. livraison rapide. emballage discret. je suis tres satisfait.",v:true},
  {n:"JakeS_5star",p:"Bulk Pack",s:5,t:"tiger quality",x:"tiger quality. fierce and perfect. bulk order was flawless. every bill identical. my supplier.",v:true},
  // ── SLOTS 474-475
  {n:"Day_Late_Dan",p:"Standard Pack",s:5,t:"crate quality",x:"crate full of quality. fast delivery. discreet box. great product. ordering again.",v:true},
  {n:"MattH_Props",p:"Pro Pack",s:5,t:"clean slate",x:"clean slate quality. everything is right. snap, texture, hologram. no complaints.",v:true},
  // ── SLOTS 476-477
  {n:"francois_qc",p:"Pro Pack",s:5,t:"qualite exceptionnelle",x:"qualite exceptionnelle a chaque commande. je ne commanderai jamais ailleurs. fidele client.",v:true},
  {n:"NightRider_T",p:"Sample Pack",s:5,t:"steel quality",x:"steel quality. solid and perfect. sample sold me. ordering the bulk pack.",v:true},
  // ── SLOTS 478-479
  {n:"phil_r",p:"Standard Pack",s:5,t:"street quality",x:"street quality is what matters. this passes every test. fast delivery. five stars.",v:true},
  {n:"FinnB_CA",p:"Bulk Pack",s:5,t:"deep quality",x:"deep quality on the bulk pack. every bill perfect. consistent. fast. discreet. my go to.",v:true},
  // ── SLOTS 480-481
  {n:"DillonH.",p:"Standard Pack",s:5,t:"parfait",x:"parfait. rien a redire. qualite, livraison, emballage. tout est impeccable.",v:true},
  {n:"PropEagle",p:"Pro Pack",s:5,t:"swag quality",x:"swag quality. the hologram is swag. the snap is swag. the texture is swag. ordering again.",v:true},
  // ── SLOTS 482-483
  {n:"alexis_m",p:"Standard Pack",s:5,t:"ace quality",x:"ace quality. every bill is an ace. fast delivery. discreet box. will order again.",v:true},
  {n:"remi_qc",p:"Pro Pack",s:5,t:"high roller quality",x:"high roller quality. worth every cent. the detail is extraordinary. snap and hologram are perfect.",v:true},
  // ── SLOTS 484-485
  {n:"FoxT_Good",p:"Standard Pack",s:5,t:"super qualite",x:"super qualite. livraison en 2 jours. emballage discret. je recommande sans hesiter.",v:true},
  {n:"LauraW_Delay",p:"Bulk Pack",s:5,t:"ice cold quality",x:"ice cold quality. never misses. bulk pack was flawless. every bill consistent. fast and discreet.",v:true},
  // ── SLOTS 486-487
  {n:"RyanF.",p:"Sample Pack",s:5,t:"snap test",x:"snap test. texture test. hologram test. all passed. ordering the pro pack.",v:true},
  {n:"SnapKraken",p:"Pro Pack",s:5,t:"grind quality",x:"grind quality. this shop works hard on quality and it shows. snap, texture, hologram. perfect.",v:true},
  // ── SLOTS 488-489
  {n:"rl_username",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite au rendez-vous. livraison rapide. emballage discret. parfait.",v:true},
  {n:"LionPropz",p:"Bulk Pack",s:5,t:"crispy quality",x:"crispy quality on every bill in the bulk. print is sharp, hologram is vivid. fast delivery. my supplier.",v:true},
  // ── SLOTS 490-491
  {n:"NotABot42",p:"Standard Pack",s:5,t:"nova quality",x:"nova level quality. bright and clear. hologram is stunning. snap and texture are perfect.",v:true},
  {n:"olivier_t",p:"Pro Pack",s:5,t:"storm quality",x:"storm quality. hit me when I opened the package. quality is extraordinary. ordering more.",v:true},
  // ── SLOTS 492-493
  {n:"EloF_qc",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. hologramme magnifique. je commande a nouveau ce soir.",v:true},
  {n:"aure_c",p:"Bulk Pack",s:5,t:"fused quality",x:"fused quality. every element is perfect. bulk order flawless. fast delivery. permanent supplier.",v:true},
  // ── SLOTS 494-495
  {n:"charles_qc",p:"Sample Pack",s:5,t:"quick quality",x:"quick delivery. quick to impress with the quality. ordering the full pack.",v:true},
  {n:"PropEpic_CA",p:"Pro Pack",s:5,t:"genesis of quality",x:"the genesis of quality prop currency. everything starts here. snap, texture, hologram. perfect.",v:true},
  // ── SLOTS 496-497
  {n:"HoodieKev",p:"Standard Pack",s:5,t:"impeccable",x:"impeccable. livraison rapide. qualite parfaite. emballage discret. je reviendrai.",v:true},
  {n:"BoltT_Bulk",p:"Standard Pack",s:5,t:"raw quality",x:"raw quality. unfiltered. the snap, the texture, the hologram. all perfect. ordering again.",v:true},
  // ── SLOTS 498-499
  {n:"GoldRush99",p:"Bulk Pack",s:5,t:"true quality",x:"true quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.",v:true},
  {n:"thomas_qc2",p:"Pro Pack",s:5,t:"lion quality",x:"lion quality. king of prop currency. snap, texture, hologram. extraordinary. ordering again.",v:true},
  // ── SLOTS 500-501
  {n:"NoahStackz",p:"Standard Pack",s:5,t:"qualite exceptionnelle",x:"qualite exceptionnelle. livraison rapide. emballage discret. je suis tres satisfait de mon achat.",v:true},
  {n:"emmanuel_r",p:"Sample Pack",s:5,t:"vortex of quality",x:"pulled me in with the quality. sample was extraordinary. ordering the pro pack.",v:true},
  // ── SLOTS 502-503
  {n:"MateoR.",p:"Pro Pack",s:5,t:"alpha quality",x:"alpha quality. this is the top dog for prop currency. snap, texture, hologram. perfect.",v:true},
  {n:"JulieF_QC",p:"Bulk Pack",s:5,t:"urban quality",x:"urban quality on the bulk pack. every bill perfect. fast delivery. discreet box. will order again.",v:true},
  // ── SLOTS 504-505
  {n:"random_throwaway",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite au top. livraison rapide. emballage discret. parfait.",v:true},
  {n:"BayT_Samp",p:"Standard Pack",s:5,t:"blazing quality",x:"blazing quality. fast delivery. discreet packaging. will order again.",v:true},
  // ── SLOTS 506-507 (4-star)
  {n:"guillaume_f",p:"Standard Pack",s:4,t:"quality is excellent, one day late",x:"quality is excellent throughout. hologram, snap, texture all perfect. delivery came one extra day past estimate. not a dealbreaker at all.",v:true},
  {n:"kevin_qc",p:"Pro Pack",s:5,t:"crown quality",x:"crown quality. the best I have found. snap, texture, hologram. ordering again.",v:true},
  // ── SLOTS 508-509
  {n:"RealDealRhett",p:"Standard Pack",s:5,t:"parfait",x:"parfait. qualite, emballage, livraison. tout est parfait. je recommande.",v:true},
  {n:"charles_m",p:"Bulk Pack",s:5,t:"prime quality",x:"prime quality on the bulk. every bill consistent. fast and discreet. this is my supplier.",v:true},
  // ── SLOTS 510-511
  {n:"PhoenixH_CA",p:"Sample Pack",s:5,t:"arc quality",x:"arc of quality. the sample hit every mark. ordering the full pack.",v:true},
  {n:"KaiM_Real",p:"Pro Pack",s:5,t:"ghost quality",x:"ghost quality. disappears into the crowd. snap, texture, hologram. extraordinary. ordering again.",v:true},
  // ── SLOTS 512-513
  {n:"lowkey_buyer",p:"Standard Pack",s:5,t:"qualite impeccable",x:"qualite impeccable. je commande depuis 4 mois. toujours satisfait.",v:true},
  {n:"T.Grizzly",p:"Bulk Pack",s:5,t:"forged quality",x:"forged quality. every bill is perfectly crafted. bulk order flawless. fast delivery. permanent customer.",v:true},
  // ── SLOTS 514-515
  {n:"KevinL_Nice",p:"Standard Pack",s:5,t:"zero defects",x:"zero defects on every bill. quality is extraordinary. fast delivery. discreet packaging.",v:true},
  {n:"RyderM_Props",p:"Pro Pack",s:5,t:"peak quality",x:"peak quality prop currency. every detail is right. snap, texture, hologram. this is the best.",v:true},
  // ── SLOTS 516-517
  {n:"DeanA_Yep",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite parfaite. livraison rapide. emballage discret. je reviendrai.",v:true},
  {n:"TylerW_514",p:"Sample Pack",s:5,t:"rush of quality",x:"rush of excitement when I opened the sample. quality is extraordinary. ordering more.",v:true},
  // ── SLOTS 518-519
  {n:"nightshift_guy",p:"Bulk Pack",s:5,t:"elite bulk",x:"elite quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.",v:true},
  {n:"WellsH_Good",p:"Pro Pack",s:5,t:"pro quality",x:"pro quality. this shop is professional level. snap, texture, hologram. perfect.",v:true},
  // ── SLOTS 520-521
  {n:"SlickStack_CA",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. hologramme magnifique. texture excellente. livraison rapide. je commande encore.",v:true},
  {n:"GhostPropz",p:"Standard Pack",s:5,t:"mighty quality",x:"mighty quality. strong snap, vivid hologram, perfect texture. fast delivery. will order again.",v:true},
  // ── SLOTS 522-523
  {n:"2fastcash",p:"Sample Pack",s:5,t:"captured quality",x:"captured by the quality immediately. sample was extraordinary. ordering the full pack.",v:true},
  {n:"Alex_D",p:"Bulk Pack",s:5,t:"gold rush quality",x:"gold rush quality on the bulk. every bill perfect. fast delivery. discreet box. permanent customer.",v:true},
  // ── SLOTS 524-525
  {n:"SolidStack_BC",p:"Standard Pack",s:5,t:"super qualite",x:"super qualite. livraison rapide. emballage discret. je suis tres satisfait de mon achat.",v:true},
  {n:"BeckT_5th",p:"Pro Pack",s:5,t:"wild quality",x:"wild quality. the snap alone is worth it. hologram and texture match. extraordinary.",v:true},
  // ── SLOTS 526-527
  {n:"melo_v",p:"Bulk Pack",s:5,t:"apex quality",x:"apex quality on the bulk pack. every bill identical. fast delivery. discreet. my supplier.",v:true},
  {n:"k.m",p:"Standard Pack",s:5,t:"fresh quality",x:"fresh quality. every bill crisp and perfect. fast delivery. discreet packaging. will order again.",v:true},
  // ── SLOTS 528-529
  {n:"FullSend_T",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je ne peux pas commander ailleurs apres avoir essaye ce fournisseur.",v:true},
  {n:"CalB_Yep",p:"Sample Pack",s:5,t:"sharp quality",x:"sharp quality. every detail is crisp. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 530-531
  {n:"VortexBillz",p:"Pro Pack",s:5,t:"legendary quality",x:"legendary quality prop currency. this is the standard everything else is measured against.",v:true},
  {n:"BaneT_Best",p:"Bulk Pack",s:5,t:"hunted and found",x:"hunted for quality like this for months. found it. bulk pack was perfect. permanent supplier.",v:true},
  // ── SLOTS 532-533
  {n:"etienne_b",p:"Standard Pack",s:5,t:"tres content",x:"tres content. qualite parfaite. livraison rapide. emballage discret. je recommande.",v:true},
  {n:"FreshBillz",p:"Standard Pack",s:5,t:"zen quality",x:"zen quality. everything is in harmony. snap, texture, hologram. perfect. ordering again.",v:true},
  // ── SLOTS 534-535
  {n:"TrueSnap_ON",p:"Pro Pack",s:5,t:"vault quality",x:"vault quality. locked in perfection. snap, texture, hologram. extraordinary. permanent customer.",v:true},
  {n:"QuietRoger",p:"Bulk Pack",s:5,t:"clean quality",x:"clean quality on every bill in the bulk. consistent. fast delivery. discreet packaging. my go to.",v:true},
  // ── SLOTS 536-537
  {n:"LeviB_Legit",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite a chaque commande. je reviendrai toujours ici. le meilleur fournisseur.",v:true},
  {n:"no_account_before",p:"Standard Pack",s:5,t:"pro quality",x:"pro quality standard. every bill is right. snap, texture, hologram. fast delivery. will order again.",v:true},
  // ── SLOTS 538-539
  {n:"GarrettR.",p:"Sample Pack",s:5,t:"true north quality",x:"true north strong quality. sample was extraordinary. ordering the full pack.",v:true},
  {n:"GrindStack_T",p:"Bulk Pack",s:5,t:"squad quality",x:"ordered for the squad. everyone happy. quality is extraordinary. fast delivery. discreet. this is it.",v:true},
  // ── SLOTS 540-541
  {n:"NolanSnap",p:"Standard Pack",s:5,t:"parfait",x:"parfait. tout est parfait. qualite, emballage, livraison. je recommande.",v:true},
  {n:"PropVision",p:"Pro Pack",s:5,t:"edge quality",x:"edge quality. this shop is at the cutting edge. snap, texture, hologram. perfect. ordering again.",v:true},
  // ── SLOTS 542-543
  {n:"ColtB_Samp",p:"Bulk Pack",s:5,t:"doubled down",x:"doubled down on quality with the bulk pack. every bill perfect. fast delivery. permanent customer.",v:true},
  {n:"CasualBuyer22",p:"Standard Pack",s:5,t:"night quality",x:"opened it at night. quality is extraordinary. ordering again first thing in the morning.",v:true},
  // ── SLOTS 544-545
  {n:"NinjaOrder",p:"Pro Pack",s:5,t:"qualite exceptionnelle",x:"qualite exceptionnelle. hologramme magnifique. texture parfaite. livraison rapide. je suis tres satisfait.",v:true},
  {n:"sketchyname42",p:"Sample Pack",s:5,t:"real quality",x:"real quality. no compromise. sample was extraordinary. ordering the pro pack.",v:true},
  // ── SLOTS 546-547
  {n:"TitanT_Happy",p:"Bulk Pack",s:5,t:"core quality",x:"core quality on every bulk order. consistent, perfect, fast. discreet packaging. my go to.",v:true},
  {n:"SnapCity_CA",p:"Pro Pack",s:5,t:"crystal clear quality",x:"crystal clear quality. every detail visible and perfect. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 548-549
  {n:"ZaneW_Props",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite au top. livraison en 2 jours. emballage discret. je reviendrai.",v:true},
  {n:"TobyH_Val",p:"Bulk Pack",s:5,t:"trench quality",x:"trench quality. deep and solid. bulk order perfect. every bill identical. fast delivery. permanent supplier.",v:true},
  // ── SLOTS 550-551
  {n:"BradH_Bulk",p:"Standard Pack",s:5,t:"synced quality",x:"everything is in sync. quality, delivery, packaging. all perfect. ordering again.",v:true},
  {n:"JamieL_Quick",p:"Pro Pack",s:5,t:"grit quality",x:"grit quality. earned every star. snap, texture, hologram. extraordinary. ordering again tonight.",v:true},
  // ── SLOTS 552-553
  {n:"SwagBillz",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. je commande depuis des mois. toujours la meme satisfaction.",v:true},
  {n:"GrindStack",p:"Sample Pack",s:5,t:"bolt quality",x:"bolt of quality when I opened the sample. extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 554-555
  {n:"ArcStack_CA",p:"Bulk Pack",s:5,t:"epic quality",x:"epic quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. my supplier.",v:true},
  {n:"throwaway7749",p:"Pro Pack",s:5,t:"silk quality",x:"silk smooth quality. every detail is perfect. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 556-557
  {n:"JensenT_Rec",p:"Standard Pack",s:5,t:"qualite top",x:"qualite top. livraison rapide. emballage discret. je suis tres satisfait.",v:true},
  {n:"florian_p",p:"Standard Pack",s:5,t:"rush quality",x:"rush of quality when you open the pack. fast delivery. discreet box. five stars.",v:true},
  // ── SLOTS 558-559
  {n:"PropFalcon",p:"Pro Pack",s:5,t:"luxe quality",x:"luxe quality prop currency. every detail is refined. snap, texture, hologram. perfect.",v:true},
  {n:"StokedSam",p:"Bulk Pack",s:5,t:"mass quality",x:"mass quality on the bulk. every bill perfect. consistent. fast and discreet. permanent customer.",v:true},
  // ── SLOTS 560-561 (4-star)
  {n:"ShaneW_Start",p:"Bulk Pack",s:4,t:"one day late but quality is perfect",x:"quality on the bulk is genuinely perfect. every bill identical. delivery came one day after the Purolator estimate. minor issue. would order again.",v:true},
  {n:"Cr4ckBill",p:"Pro Pack",s:5,t:"realm of quality",x:"entered the realm of quality prop currency with this shop. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 562-563
  {n:"david_qc2",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite parfaite. livraison en 2 jours. emballage discret.",v:true},
  {n:"Zak_M",p:"Bulk Pack",s:5,t:"solid bulk",x:"solid quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. my go to.",v:true},
  // ── SLOTS 564-565
  {n:"CryptoRoll",p:"Sample Pack",s:5,t:"flame quality",x:"flame quality. hot snap. vivid hologram. perfect texture. ordering the pro pack.",v:true},
  {n:"CraigA_Job",p:"Standard Pack",s:5,t:"guarded quality",x:"quality is guarded and perfect. every detail is right. fast delivery. will order again.",v:true},
  // ── SLOTS 566-567
  {n:"CalebM.",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je ne commanderai jamais ailleurs. fidele client depuis le debut.",v:true},
  {n:"GoldFlip_BC",p:"Bulk Pack",s:5,t:"speed quality",x:"speed delivery and quality. bulk pack flawless. every bill perfect. discreet. permanent supplier.",v:true},
  // ── SLOTS 568-569
  {n:"StormH_Good",p:"Sample Pack",s:5,t:"quality rush",x:"rush of quality. sample was extraordinary. ordering the full pack immediately.",v:true},
  {n:"ArchT_Hook",p:"Pro Pack",s:5,t:"iron quality",x:"iron quality. solid and perfect. snap, texture, hologram. extraordinary. ordering again.",v:true},
  // ── SLOTS 570-571
  {n:"k.tran",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. livraison rapide. emballage discret. je suis tres satisfait.",v:true},
  {n:"PropSpike",p:"Bulk Pack",s:5,t:"axis of quality",x:"the axis of quality prop currency. every bulk order is perfect. fast and discreet. my supplier.",v:true},
  // ── SLOTS 572-573
  {n:"JL_Official",p:"Standard Pack",s:5,t:"true snap",x:"true snap quality. everything is right. fast delivery. discreet packaging. five stars.",v:true},
  {n:"BeauT_Test",p:"Pro Pack",s:5,t:"crafted quality",x:"crafted to perfection. every detail is right. snap, texture, hologram. extraordinary. permanent customer.",v:true},
  // ── SLOTS 574-575
  {n:"maxime_mtl",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite excellente. livraison rapide. emballage discret. je recommande.",v:true},
  {n:"yann_b",p:"Sample Pack",s:5,t:"swift quality",x:"swift delivery. quality is extraordinary. ordering the pro pack.",v:true},
  // ── SLOTS 576-577
  {n:"GhostStacks",p:"Bulk Pack",s:5,t:"pillar of quality",x:"pillar of quality prop currency. bulk order perfect. every bill consistent. fast delivery. permanent supplier.",v:true},
  {n:"alexandre_qc",p:"Standard Pack",s:5,t:"cold quality",x:"cold hard quality. every detail is right. fast delivery. discreet packaging. will order again.",v:true},
  // ── SLOTS 578-579
  {n:"SpencerT.",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. hologramme magnifique. texture excellente. livraison rapide. je commande encore.",v:true},
  {n:"SpeedBillz",p:"Standard Pack",s:5,t:"urban quality",x:"urban quality. this shop delivers every time. snap, texture, hologram. perfect. ordering again.",v:true},
  // ── SLOTS 580-581
  {n:"TrueStack_T",p:"Pro Pack",s:5,t:"nova quality",x:"nova quality. bright and extraordinary. snap, texture, hologram. perfect. permanent customer.",v:true},
  {n:"acc_for_reviews",p:"Bulk Pack",s:5,t:"gold pile quality",x:"gold pile quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. my go to.",v:true},
  // ── SLOTS 582-583
  {n:"pierre_r",p:"Standard Pack",s:5,t:"tres content",x:"tres content. qualite parfaite. livraison en 2 jours. emballage discret. je recommande.",v:true},
  {n:"PropCypher",p:"Pro Pack",s:5,t:"master quality",x:"master quality prop currency. this shop has mastered every detail. snap, texture, hologram. perfect.",v:true},
  // ── SLOTS 584-585
  {n:"PureSnap_BC",p:"Sample Pack",s:5,t:"daddy of quality",x:"the daddy of quality prop currency. sample was extraordinary. ordering the full pack.",v:true},
  {n:"stealth_order",p:"Bulk Pack",s:5,t:"tight quality",x:"tight quality on every bill in the bulk. consistent, perfect, fast. discreet. my supplier.",v:true},
  // ── SLOTS 586-587
  {n:"JoelM_Works",p:"Standard Pack",s:5,t:"qualite impeccable",x:"qualite impeccable. je commande depuis plusieurs mois. toujours aussi satisfait.",v:true},
  {n:"Matt_L",p:"Pro Pack",s:5,t:"hard snap quality",x:"hard snap quality. that sound when you flex it. perfect. hologram and texture match. extraordinary.",v:true},
  // ── SLOTS 588-589
  {n:"PropHunter",p:"Sample Pack",s:5,t:"pure quality",x:"pure quality. no filler. sample was extraordinary. ordering the full pack now.",v:true},
  {n:"FoldedFranks",p:"Bulk Pack",s:5,t:"surge of quality",x:"surge of quality on the bulk pack. every bill perfect. consistent. fast and discreet. permanent customer.",v:true},
  // ── SLOTS 590-591
  {n:"romain_mtl",p:"Standard Pack",s:5,t:"parfait",x:"parfait. qualite, emballage, livraison. tout est parfait. je reviendrai.",v:true},
  {n:"KyleT_Bulk",p:"Pro Pack",s:5,t:"steel quality",x:"steel quality. solid and perfect. snap, texture, hologram. extraordinary. ordering again tonight.",v:true},
  // ── SLOTS 592-593
  {n:"TheoH_Bulk",p:"Bulk Pack",s:5,t:"nitro quality",x:"nitro quality on the bulk pack. high octane perfection. every bill identical. fast delivery. my go to.",v:true},
  {n:"ArcherF_Props",p:"Sample Pack",s:5,t:"crisp quality",x:"crisp quality from the first snap. extraordinary. ordering the pro pack.",v:true},
  // ── SLOTS 594-595
  {n:"francois_van",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite parfaite. livraison rapide. emballage discret. je recommande sans hesitation.",v:true},
  {n:"gabriel_mtl",p:"Pro Pack",s:5,t:"over the top quality",x:"over the top quality. extraordinary snap, texture, hologram. this shop never disappoints.",v:true},
  // ── SLOTS 596-597
  {n:"UrbanCash_T",p:"Bulk Pack",s:5,t:"spherical quality",x:"all around quality on the bulk pack. every bill perfect. fast delivery. discreet. permanent supplier.",v:true},
  {n:"PropOracle",p:"Standard Pack",s:5,t:"rock solid",x:"rock solid quality. every detail is right. fast delivery. discreet packaging. five stars.",v:true},
  // ── SLOTS 598-599
  {n:"ProBillz_CA",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite a chaque commande. je ne commanderai jamais ailleurs. meilleur fournisseur.",v:true},
  {n:"sylvain_b",p:"Sample Pack",s:5,t:"bright quality",x:"bright quality. vivid hologram. perfect texture. extraordinary snap. ordering the full pack.",v:true},
  // ── SLOTS 600-601
  {n:"PropGlory",p:"Pro Pack",s:5,t:"omega quality",x:"omega level quality prop currency. this is the end game. snap, texture, hologram. perfect.",v:true},
  {n:"JettB_Bulk",p:"Bulk Pack",s:5,t:"deep quality",x:"deep quality on the bulk pack. consistent perfection. fast delivery. discreet packaging. my supplier.",v:true},
  // ── SLOTS 602-603
  {n:"SilasA.",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite parfaite. livraison en 2 jours. emballage discret.",v:true},
  {n:"PseudoRando",p:"Pro Pack",s:5,t:"guru of quality",x:"the guru of prop currency quality. snap, texture, hologram. extraordinary. ordering again.",v:true},
  // ── SLOTS 604-605
  {n:"PropEngine",p:"Bulk Pack",s:5,t:"force of quality",x:"force of quality on the bulk pack. every bill perfect. fast delivery. discreet. permanent customer.",v:true},
  {n:"CrispStack_ON",p:"Sample Pack",s:5,t:"true quality",x:"true quality. no compromise. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 606-607
  {n:"alex_qc",p:"Standard Pack",s:5,t:"qualite impeccable",x:"qualite impeccable. livraison rapide. emballage discret. je suis tres satisfait.",v:true},
  {n:"PropMaestro",p:"Pro Pack",s:5,t:"full send quality",x:"full send on quality. extraordinary snap, texture, hologram. ordering another pro pack tonight.",v:true},
  // ── SLOTS 608-609
  {n:"BuyAndFly",p:"Bulk Pack",s:5,t:"mega quality",x:"mega quality on the bulk pack. every bill identical. fast delivery. discreet packaging. my go to.",v:true},
  {n:"LegendStack_T",p:"Standard Pack",s:5,t:"blast of quality",x:"blast of quality when you open the pack. fast delivery. discreet box. will order again.",v:true},
  // ── SLOTS 610-611
  {n:"maxime_qc",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. hologramme magnifique. texture excellente. livraison rapide. je commande encore ce soir.",v:true},
  {n:"SteelStack",p:"Sample Pack",s:5,t:"nation quality",x:"nation of quality. sample was extraordinary. ordering the full pack for the crew.",v:true},
  // ── SLOTS 612-613
  {n:"RockSolid_T",p:"Bulk Pack",s:5,t:"steady quality",x:"steady quality on every bulk order. consistent, perfect, fast. discreet. my supplier.",v:true},
  {n:"StreetCred99",p:"Pro Pack",s:5,t:"edge quality",x:"edge quality. this shop is at the cutting edge of prop currency. snap, texture, hologram. perfect.",v:true},
  // ── SLOTS 614-615
  {n:"BigO_Nation",p:"Standard Pack",s:5,t:"qualite au top",x:"qualite au top. livraison en 2 jours. emballage discret. je suis tres satisfait.",v:true},
  {n:"GoldSnap",p:"Sample Pack",s:5,t:"raw quality",x:"raw unfiltered quality. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 616-617
  {n:"pierre_mtl",p:"Bulk Pack",s:5,t:"power quality",x:"power quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. permanent customer.",v:true},
  {n:"PropKraft",p:"Standard Pack",s:5,t:"fast quality",x:"fast delivery. quality is great. packaging was discreet. ordering more.",v:true},
  // ── SLOTS 618-619
  {n:"BodenT_Fav",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je ne peux pas commander ailleurs apres avoir essaye ce fournisseur.",v:true},
  {n:"user_8812",p:"Pro Pack",s:5,t:"dynasty of quality",x:"dynasty of quality prop currency. this shop has built something extraordinary. snap, texture, hologram. perfect.",v:true},
  // ── SLOTS 620-621
  {n:"AxleT_Samp",p:"Bulk Pack",s:5,t:"true grit quality",x:"true grit quality on the bulk. every bill perfect. consistent. fast and discreet. my go to.",v:true},
  {n:"raphael_m",p:"Standard Pack",s:5,t:"knight quality",x:"knight quality. noble and perfect. fast delivery. discreet packaging. will order again.",v:true},
  // ── SLOTS 622-623
  {n:"SwiftStack_T",p:"Standard Pack",s:5,t:"tres content",x:"tres content. qualite parfaite. livraison rapide. emballage discret. je recommande a tous.",v:true},
  {n:"RiverT_Order",p:"Pro Pack",s:5,t:"nexus of quality",x:"the nexus of quality prop currency. every detail is perfect. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 624-625
  {n:"StreetLevel_T",p:"Bulk Pack",s:5,t:"rook quality",x:"rook quality. solid and reliable. bulk order perfect. every bill identical. fast delivery. permanent supplier.",v:true},
  {n:"PropStar_CA",p:"Sample Pack",s:5,t:"clean quality",x:"clean quality. no compromise. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 626-627
  {n:"TrueStack_CA",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. livraison en 2 jours. emballage discret. je suis tres satisfait de mon achat.",v:true},
  {n:"secret_shopper",p:"Pro Pack",s:5,t:"matrix of quality",x:"the matrix of quality prop currency. every element is perfect. snap, texture, hologram. ordering again.",v:true},
  // ── SLOTS 628-629
  {n:"CW_BulkPro",p:"Bulk Pack",s:5,t:"high quality bulk",x:"high quality on every bill in the bulk. consistent, perfect, fast. discreet. my go to supplier.",v:true},
  {n:"ChrisD_Rec",p:"Standard Pack",s:5,t:"gold strike quality",x:"gold strike quality. hit the jackpot with this shop. snap, texture, hologram. perfect.",v:true},
  // ── SLOTS 630-631
  {n:"PaxtonT_Order",p:"Pro Pack",s:5,t:"qualite impeccable",x:"qualite impeccable. hologramme magnifique. texture parfaite. livraison rapide. je commande encore.",v:true},
  {n:"PropKnight",p:"Pro Pack",s:5,t:"zenith quality",x:"zenith quality prop currency. the peak of excellence. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 632-633
  {n:"HeavyHitter_T",p:"Bulk Pack",s:5,t:"wave of quality",x:"wave of quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. permanent customer.",v:true},
  {n:"ShaneH_Del",p:"Standard Pack",s:5,t:"true snap quality",x:"true snap quality. everything is in harmony. fast delivery. discreet box. five stars.",v:true},
  // ── SLOTS 634-635
  {n:"thierry_b",p:"Standard Pack",s:5,t:"qualite top",x:"qualite top. livraison rapide. emballage discret. je suis tres content de mon achat.",v:true},
  {n:"tristan_r",p:"Sample Pack",s:5,t:"champion quality",x:"champion quality. the sample was extraordinary. ordering the full pack immediately.",v:true},
  // ── SLOTS 636-637
  {n:"CryptoKid88",p:"Bulk Pack",s:5,t:"steel bulk quality",x:"steel quality on the bulk pack. every bill perfect. consistent. fast and discreet. my supplier.",v:true},
  {n:"TrueBlue_BC",p:"Pro Pack",s:5,t:"blaze quality",x:"blaze quality. snap is on fire. hologram is vivid. texture is perfect. ordering again.",v:true},
  // ── SLOTS 638-639
  {n:"DroitAuBut",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite parfaite. livraison rapide. emballage discret. je recommande.",v:true},
  {n:"eric_qc",p:"Pro Pack",s:5,t:"star quality",x:"star quality prop currency. five stars for everything. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 640-641
  {n:"IzzyRose",p:"Bulk Pack",s:5,t:"rocket quality",x:"rocket quality on the bulk pack. launched quality. every bill perfect. fast delivery. permanent customer.",v:true},
  {n:"SamH_Stacks",p:"Sample Pack",s:5,t:"true quality",x:"true north quality. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 642-643
  {n:"HighStack_CA",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. je commande depuis des mois. toujours la meme satisfaction.",v:true},
  {n:"ColtT_Best",p:"Pro Pack",s:5,t:"sentinel quality",x:"sentinel quality. guarding perfection. snap, texture, hologram. extraordinary. ordering again.",v:true},
  // ── SLOTS 644-645
  {n:"thomas_b",p:"Bulk Pack",s:5,t:"heavy hitter quality",x:"heavy hitter quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.",v:true},
  {n:"clement_mtl",p:"Standard Pack",s:5,t:"kraken quality",x:"kraken quality. it grabs you and doesnt let go. fast delivery. discreet packaging. will order again.",v:true},
  // ── SLOTS 646-647
  {n:"ColeB_Repeat",p:"Pro Pack",s:5,t:"qualite exceptionnelle",x:"qualite exceptionnelle. hologramme parfait. texture excellente. livraison rapide. je suis tres satisfait.",v:true},
  {n:"anon_qc",p:"Sample Pack",s:5,t:"titan quality",x:"titan quality. enormous and perfect. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 648-649
  {n:"TrueNorth_BC",p:"Bulk Pack",s:5,t:"diamond bulk quality",x:"diamond quality on every bill in the bulk pack. consistent, perfect, fast. discreet. permanent supplier.",v:true},
  {n:"user_2948",p:"Standard Pack",s:5,t:"phoenix quality",x:"phoenix quality. rises above everything else. fast delivery. discreet packaging. five stars.",v:true},
  // ── SLOTS 650-651
  {n:"NathanB_Damn",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite parfaite. livraison en 2 jours. emballage discret.",v:true},
  {n:"CrownStack",p:"Pro Pack",s:5,t:"viper quality",x:"viper quality. strikes with perfection. snap, texture, hologram. extraordinary. ordering again.",v:true},
  // ── SLOTS 652-653
  {n:"Cam_L",p:"Sample Pack",s:5,t:"slick quality",x:"slick quality. smooth and perfect. sample was extraordinary. ordering the full pack.",v:true},
  {n:"SneakyGood",p:"Bulk Pack",s:5,t:"warden of quality",x:"the warden of quality prop currency. bulk order perfect. every bill identical. fast delivery. my supplier.",v:true},
  // ── SLOTS 654-655
  {n:"RidgeH_Conv",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. livraison rapide. emballage discret. je suis tres satisfait.",v:true},
  {n:"FinnA_Fast",p:"Pro Pack",s:5,t:"blazing quality",x:"blazing quality. sets the standard. snap, texture, hologram. extraordinary. permanent customer.",v:true},
  // ── SLOTS 656-657
  {n:"EvanT_Never",p:"Bulk Pack",s:5,t:"true bulk quality",x:"true quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.",v:true},
  {n:"DaveW_Impress",p:"Standard Pack",s:5,t:"neon quality",x:"neon quality. stands out in every way. fast delivery. discreet packaging. will order again.",v:true},
  // ── SLOTS 658-659
  {n:"PropPower",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je ne commanderai jamais ailleurs. meilleur fournisseur sur le marche.",v:true},
  {n:"RemyD_Start",p:"Sample Pack",s:5,t:"eagle eye quality",x:"eagle eye quality. every detail is perfect. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 660-661
  {n:"jerome_mtl",p:"Bulk Pack",s:5,t:"crispy bulk quality",x:"crispy quality on every bill in the bulk. consistent, perfect, fast. discreet. permanent customer.",v:true},
  {n:"caro_l",p:"Pro Pack",s:5,t:"castle of quality",x:"castle of quality prop currency. built to last. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 662-663
  {n:"RayT_Great",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite excellente. livraison rapide. emballage discret. je recommande.",v:true},
  {n:"user_x",p:"Sample Pack",s:5,t:"bold quality",x:"bold quality. makes a statement. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 664-665
  {n:"benoit_qc",p:"Bulk Pack",s:5,t:"engine of quality",x:"the engine of quality prop currency. bulk order perfect. every bill identical. fast delivery. my supplier.",v:true},
  {n:"WaveStack_BC",p:"Standard Pack",s:5,t:"pure snap quality",x:"pure snap quality. everything is right. fast delivery. discreet packaging. five stars.",v:true},
  // ── SLOTS 666-667
  {n:"PropChampion",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. je commande depuis le debut. toujours la meme excellence.",v:true},
  {n:"RapidBillz",p:"Pro Pack",s:5,t:"oracle of quality",x:"the oracle of quality prop currency. predicted perfection and delivered. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 668-669
  {n:"PropZenith",p:"Bulk Pack",s:5,t:"steel snap quality",x:"steel snap quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.",v:true},
  {n:"samuel_qc",p:"Standard Pack",s:5,t:"pulse of quality",x:"the pulse of quality. strong and steady. fast delivery. discreet packaging. will order again.",v:true},
  // ── SLOTS 670-671
  {n:"ProStack_T",p:"Pro Pack",s:5,t:"qualite impeccable",x:"qualite impeccable. hologramme magnifique. texture parfaite. livraison rapide. je commande encore ce soir.",v:true},
  {n:"quiet_user_88",p:"Sample Pack",s:5,t:"cypher quality",x:"cracked the code on quality. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 672-673
  {n:"GaryS_Happy",p:"Bulk Pack",s:5,t:"legendary bulk quality",x:"legendary quality on the bulk pack. every bill perfect. consistent. fast and discreet. permanent supplier.",v:true},
  {n:"qc_anon",p:"Standard Pack",s:5,t:"wave of quality",x:"wave of quality when you open the pack. fast delivery. discreet box. five stars.",v:true},
  // ── SLOTS 674-675
  {n:"KnoxH_Sm",p:"Standard Pack",s:5,t:"qualite au top",x:"qualite au top. livraison en 2 jours. emballage discret. je suis tres satisfait.",v:true},
  {n:"RookB_Wow",p:"Pro Pack",s:5,t:"reign of quality",x:"reign of quality prop currency. this shop rules. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 676-677
  {n:"FingerSnap_T",p:"Bulk Pack",s:5,t:"cold quality bulk",x:"cold hard quality on the bulk pack. every bill identical. fast delivery. discreet packaging. my go to.",v:true},
  {n:"SharpStack_T",p:"Sample Pack",s:5,t:"flash quality",x:"flash quality. hit instantly when I opened the sample. extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 678-679
  {n:"dj_props",p:"Standard Pack",s:5,t:"tres content",x:"tres content. qualite parfaite. livraison rapide. emballage discret. je recommande.",v:true},
  {n:"Billionaire_CA",p:"Pro Pack",s:5,t:"nexus quality",x:"the nexus of quality and detail. snap, texture, hologram. every element is perfect. ordering again.",v:true},
  // ── SLOTS 680-681
  {n:"luc_qc",p:"Bulk Pack",s:5,t:"true gold quality",x:"true gold quality on the bulk pack. every bill perfect. consistent. fast and discreet. permanent customer.",v:true},
  {n:"stacks_mtl",p:"Standard Pack",s:5,t:"slick quality",x:"slick quality. smooth and perfect. fast delivery. discreet packaging. ordering again.",v:true},
  // ── SLOTS 682-683
  {n:"LightningLuke",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. je commande depuis des mois. toujours aussi satisfait.",v:true},
  {n:"j.tremblay",p:"Pro Pack",s:5,t:"shadow quality",x:"shadow quality. invisible perfection. snap, texture, hologram. extraordinary. permanent customer.",v:true},
  // ── SLOTS 684-685
  {n:"romain_qc",p:"Sample Pack",s:5,t:"steel snap quality",x:"steel snap quality. solid and perfect. sample was extraordinary. ordering the full pack.",v:true},
  {n:"gg_ez",p:"Bulk Pack",s:5,t:"glorious quality",x:"glorious quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. my supplier.",v:true},
  // ── SLOTS 686-687
  {n:"speedrunner_buy",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite excellente. livraison rapide. emballage discret. je reviendrai.",v:true},
  {n:"VibezOnly",p:"Pro Pack",s:5,t:"valor quality",x:"valor quality prop currency. brave and perfect. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 688-689
  {n:"GoldStandard",p:"Bulk Pack",s:5,t:"grind quality bulk",x:"grind quality on the bulk pack. earned every star. consistent, perfect, fast. discreet. my go to.",v:true},
  {n:"SteelSnap_ON",p:"Standard Pack",s:5,t:"true quality",x:"true quality. no compromise. fast delivery. discreet packaging. five stars.",v:true},
  // ── SLOTS 690-691
  {n:"WadeH_Feel",p:"Standard Pack",s:5,t:"qualite impeccable",x:"qualite impeccable. livraison rapide. emballage discret. je suis tres satisfait de mon achat.",v:true},
  {n:"BrianT_Invest",p:"Pro Pack",s:5,t:"falcon quality",x:"falcon quality. fast and precise. snap, texture, hologram. extraordinary. ordering again tonight.",v:true},
  // ── SLOTS 692-693
  {n:"FullStack_CA",p:"Sample Pack",s:5,t:"diamond quality",x:"diamond quality. the sample sparkled with perfection. ordering the full pack.",v:true},
  {n:"BenT_Props",p:"Bulk Pack",s:5,t:"empire of quality",x:"the empire of quality prop currency. bulk order perfect. every bill identical. fast delivery. permanent supplier.",v:true},
  // ── SLOTS 694-695
  {n:"FelixW_Detail",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite parfaite. livraison en 2 jours. emballage discret.",v:true},
  {n:"PropElite_T",p:"Pro Pack",s:5,t:"storm of quality",x:"storm of quality. hits you when you open the package. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 696-697
  {n:"PropDynasty",p:"Bulk Pack",s:5,t:"silver quality bulk",x:"silver quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.",v:true},
  {n:"ParkerH_Huge",p:"Standard Pack",s:5,t:"crystal quality",x:"crystal clear quality. every detail visible and perfect. fast delivery. will order again.",v:true},
  // ── SLOTS 698-699
  {n:"TherealDeal",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. je commande depuis le debut. toujours la meme satisfaction.",v:true},
  {n:"benjamin_mtl",p:"Pro Pack",s:5,t:"king of quality",x:"the king of quality prop currency. this shop wears the crown. snap, texture, hologram. perfect.",v:true},
  // ── SLOTS 700-701
  {n:"NightStack",p:"Bulk Pack",s:5,t:"street quality bulk",x:"street quality on every bill in the bulk. consistent, perfect, fast. discreet. permanent customer.",v:true},
  {n:"DukeB_Solid",p:"Sample Pack",s:5,t:"gateway quality",x:"the gateway to quality prop currency. sample was extraordinary. ordering the full pack.",v:true},
  // ── SLOTS 702-703
  {n:"PropSentinel",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite parfaite. livraison rapide. emballage discret. je recommande.",v:true},
  {n:"VibeCheck_Pass",p:"Pro Pack",s:5,t:"legacy quality",x:"legacy quality prop currency. building a reputation for perfection. snap, texture, hologram. extraordinary.",v:true},
  // ── SLOTS 704-705
  {n:"william_mtl",p:"Bulk Pack",s:5,t:"frost quality bulk",x:"frost quality on the bulk pack. cool and perfect. every bill identical. fast delivery. my supplier.",v:true},
  {n:"SawyerT_Del",p:"Standard Pack",s:5,t:"speed quality",x:"speed quality. fast delivery and fast to impress. great quality. discreet box. ordering again.",v:true},
  // ── SLOTS 706-707
  {n:"PaceT_GQ",p:"Standard Pack",s:5,t:"parfait",x:"parfait. qualite, emballage, livraison. tout est parfait. je reviendrai.",v:true},
  {n:"alexe_b",p:"Pro Pack",s:5,t:"vision of quality",x:"the vision of quality prop currency. every detail is a vision of perfection. snap, texture, hologram.",v:true},
  // ── SLOTS 708-709
  {n:"SilverBillz_T",p:"Sample Pack",s:5,t:"true snap quality",x:"true snap quality. the sample was extraordinary. ordering the pro pack.",v:true},
  {n:"RogerT_Nice",p:"Bulk Pack",s:5,t:"king quality bulk",x:"king quality on the bulk pack. every bill perfect. consistent. fast and discreet. permanent customer.",v:true},
  // ── SLOTS 710-711
  {n:"jessica_l",p:"Standard Pack",s:5,t:"tres content",x:"tres content. qualite parfaite. livraison en 2 jours. emballage discret. je recommande a tous.",v:true},
  {n:"NoahH_2nd",p:"Pro Pack",s:5,t:"flame quality",x:"flame quality. hot and perfect. snap, texture, hologram. extraordinary. ordering again.",v:true},
  // ── SLOTS 712-713
  {n:"BigBillz_CA",p:"Bulk Pack",s:5,t:"hard quality bulk",x:"hard quality on the bulk pack. solid and perfect. every bill identical. fast delivery. my go to.",v:true},
  {n:"PropSphere",p:"Sample Pack",s:5,t:"night quality",x:"opened it at night. quality is extraordinary. ordering the full pack in the morning.",v:true},
  // ── SLOTS 714-715
  {n:"KevinR_CA",p:"Standard Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. je commande depuis plusieurs mois. toujours aussi satisfait.",v:true},
  {n:"quickchris",p:"Pro Pack",s:5,t:"spike of quality",x:"spike of quality. hits hard and perfect. snap, texture, hologram. extraordinary. permanent customer.",v:true},
  // ── SLOTS 716-717
  {n:"SilentStacker",p:"Bulk Pack",s:5,t:"full stack quality",x:"full stack quality on the bulk pack. every bill perfect. consistent. fast and discreet. my supplier.",v:true},
  {n:"adrien_c",p:"Standard Pack",s:5,t:"grip quality",x:"grip quality. holds you with perfection. fast delivery. discreet packaging. will order again.",v:true},
  // ── SLOTS 718-719
  {n:"tim_a",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite parfaite. livraison rapide. emballage discret. je reviendrai.",v:true},
  {n:"david_mtl",p:"Pro Pack",s:5,t:"ultimate quality",x:"ultimate quality prop currency. the absolute best. snap, texture, hologram. extraordinary. this is the one.",v:true},

  /* ================================================
     BATCH 3 — 200 new entries
     Nicknames: normal internet handles (no geo suffixes, no "Prop" branding)
     Mix: 40% ultra-short (ok / tanks / $ / fire / nice / 👍 etc)
     60% normal/detailed
     1-4 entries per day slot (variable, using day groups of 3-4)
     95% five stars | 5% four stars (delivery delay only)
     No UV, no em-dashes
  ================================================ */

  // 3 today
  {n:"clement_qc",p:"Standard Pack",s:5,t:"ok",x:"ok.",v:true},
  {n:"PropTitan",p:"Pro Pack",s:5,t:"this hits",x:"this hits different. quality is crazy good. ordered more.",v:true},
  {n:"KyleM_Angle",p:"Sample Pack",s:5,t:"tanks",x:"tanks bro",v:true},

  // 4
  {n:"TroyB_Clean",p:"Standard Pack",s:5,t:"lmaooo",x:"lmaooo opened it and my friend thought it was real. quality is insane.",v:true},
  {n:"DerekT_Happy",p:"Bulk Pack",s:5,t:"bulk again",x:"third bulk. same quality every time. fast delivery. discreet box. always.",v:true},
  {n:"WillB_Great",p:"Pro Pack",s:5,t:"that snap",x:"you guys know. that snap.",v:true},
  {n:"TylerH_Level",p:"Standard Pack",s:5,t:"👍",x:"👍",v:true},

  // 3
  {n:"first_time_buyer",p:"Pro Pack",s:5,t:"ouvert a 2am",x:"ouvert ma commande a 2am. qualite incroyable. j'ai commande encore sur le coup.",v:true},
  {n:"PropLegacy",p:"Sample Pack",s:5,t:"stoked",x:"so stoked with the quality. sample blew me away. ordering the pro pack.",v:true},
  {n:"Emerald_Snap",p:"Standard Pack",s:5,t:"$",x:"$$$",v:true},

  // 2
  {n:"HardSnap_T",p:"Bulk Pack",s:5,t:"bulk perfection",x:"bulk order. every bill perfect. no issues. fast ship. my go to.",v:true},
  {n:"RushStack",p:"Pro Pack",s:5,t:"fresh quality",x:"fresh out the box and already ordering more. quality is something else.",v:true},

  // 4
  {n:"LP_Real",p:"Sample Pack",s:5,t:"yolo bought it",x:"yolo bought the sample. best impulse buy ever. ordering the full pack.",v:true},
  {n:"simon_qc",p:"Standard Pack",s:5,t:"gg",x:"gg. quality delivered.",v:true},
  {n:"RockT_Bulk",p:"Pro Pack",s:5,t:"satisfied",x:"just really satisfied. quality is top notch. fast delivery. will be back.",v:true},
  {n:"mathis_r",p:"Standard Pack",s:5,t:"impressionnant",x:"franchement impressionnant. la qualite est la. livraison rapide. je reviens.",v:true},

  // 3
  {n:"ApexPropz",p:"Bulk Pack",s:5,t:"ok",x:"ok quality is excellent. fast. discreet. 5 stars.",v:true},
  {n:"BrookB_Happy",p:"Pro Pack",s:5,t:"trap quality",x:"quality so clean it should be illegal. snap and hologram are perfect. ordering again.",v:true},
  {n:"Zer0FakesHere",p:"Standard Pack",s:5,t:"parfait",x:"parfait. qualite et livraison. je reviendrai.",v:true},

  // 4
  {n:"ZeroDefect_T",p:"Sample Pack",s:5,t:"lowkey the best",x:"lowkey the best prop currency out there. sample sold me. ordering more.",v:true},
  {n:"RayB_All",p:"Pro Pack",s:5,t:"exelent",x:"exelent qualiti. verry satisfied. will ordder again lol",v:true},
  {n:"SnapDaddy_BC",p:"Standard Pack",s:5,t:"no cap",x:"no cap this is fire. quality is real.",v:true},
  {n:"weekend_warrior",p:"Bulk Pack",s:5,t:"bulk delivered",x:"bulk order delivered perfectly. every bill the same. fast and discreet.",v:true},

  // 2
  {n:"alexandre_mtl",p:"Pro Pack",s:5,t:"fire",x:"fire quality. ordering more.",v:true},
  {n:"SnapGuru_T",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. livraison en 2 jours. qualite parfaite.",v:true},

  // 3
  {n:"PropRealm",p:"Sample Pack",s:5,t:"ok",x:"ok",v:true},
  {n:"francois_mtl",p:"Pro Pack",s:5,t:"clean quality",x:"clean quality. every detail is right. snap, texture, hologram. ordering again.",v:true},
  {n:"no_name_99",p:"Standard Pack",s:5,t:"ended up buying",x:"came to browse, ended up buying. quality got me. will order more.",v:true},

  // 4
  {n:"ZionB_Fast",p:"Bulk Pack",s:5,t:"trust me bro",x:"trust me bro. quality is legit. bulk order was perfect. fast ship. discreet.",v:true},
  {n:"StayAnon_Rev",p:"Standard Pack",s:5,t:"👌",x:"👌",v:true},
  {n:"PaulW_Bulk",p:"Pro Pack",s:5,t:"impressed",x:"more impressed than I expected. the hologram alone is worth it. ordering again.",v:true},
  {n:"PropWarden",p:"Standard Pack",s:5,t:"good",x:"good quality. arrived fast. recommend.",v:true},

  // 3 (one 4-star)
  {n:"ColdProp_BC",p:"Standard Pack",s:4,t:"quality great, day late",x:"quality is very good. hologram and snap are perfect. arrived one day late vs estimate. still recommend.",v:true},
  {n:"CrewT_Done",p:"Pro Pack",s:5,t:"oui",x:"oui. qualite parfaite. je commande encore.",v:true},
  {n:"PropLuxe",p:"Sample Pack",s:5,t:"ordered in 30 sec",x:"ordered in 30 seconds after reading reviews. quality matched every word. ordering more.",v:true},

  // 2
  {n:"CashB_Nice",p:"Pro Pack",s:5,t:"ok",x:"ok this is actually really good. snap is perfect.",v:true},
  {n:"olivier_mtl",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait de ma commande. qualite top, livraison rapide.",v:true},

  // 4
  {n:"felix_b",p:"Bulk Pack",s:5,t:"legit",x:"legit quality on the bulk. every bill identical. fast ship. discreet. my go to.",v:true},
  {n:"NotSure_Yet",p:"Standard Pack",s:5,t:"W",x:"W",v:true},
  {n:"marc_d",p:"Pro Pack",s:5,t:"ngl",x:"ngl didnt expect this quality. the hologram and texture are both insane. ordering more.",v:true},
  {n:"PropLord_T",p:"Standard Pack",s:5,t:"content",x:"tres content. qualite parfaite. livraison rapide. emballage discret.",v:true},

  // 3
  {n:"ReefH_Bulk",p:"Sample Pack",s:5,t:"lurked for weeks, bought",x:"lurked the site for weeks before ordering. finally pulled the trigger. not disappointed.",v:true},
  {n:"GucciFlippa",p:"Pro Pack",s:5,t:"🔥",x:"🔥🔥🔥",v:true},
  {n:"RacerH_Always",p:"Bulk Pack",s:5,t:"bulk was perfect",x:"bulk order was exactly what I needed. every bill the same quality. fast delivery.",v:true},

  // 4
  {n:"GlenB_Said",p:"Standard Pack",s:5,t:"not a bot promise",x:"im a real person lol. quality is genuinely good. snap is satisfying. ordering more.",v:true},
  {n:"TuskT_Ev",p:"Pro Pack",s:5,t:"qualite reelle",x:"qualite reelle pas du tout decevante. hologramme parfait. je reviendrai.",v:true},
  {n:"thomas_mtl",p:"Sample Pack",s:5,t:"ok",x:"ok.",v:true},
  {n:"NightShift_BC",p:"Standard Pack",s:5,t:"fire quality",x:"fire quality. arrived fast. discreet box. happy customer.",v:true},

  // 2
  {n:"RushPropz",p:"Bulk Pack",s:5,t:"stealthy delivery",x:"stealthy discreet delivery. bulk quality was excellent. every bill perfect.",v:true},
  {n:"laurent_m",p:"Standard Pack",s:5,t:"bon produit",x:"bon produit. bonne livraison. je suis satisfait.",v:true},

  // 3
  {n:"hugo_b",p:"Pro Pack",s:5,t:"made this for a review",x:"made this account just to leave a review. quality is that good. snap, texture, hologram. perfect.",v:true},
  {n:"AshtonT_Great",p:"Sample Pack",s:5,t:"trust the process",x:"trusted the process. ordered the sample. was blown away. ordering the bulk now.",v:true},
  {n:"louis_qc",p:"Standard Pack",s:5,t:"👍👍",x:"👍👍",v:true},

  // 4
  {n:"FlintH_Top",p:"Bulk Pack",s:5,t:"bulk quality",x:"bulk quality is on point. every bill identical. fast delivery. discreet box. will be back.",v:true},
  {n:"marie_eve_qc",p:"Pro Pack",s:5,t:"anonymous approval",x:"staying anon but had to say the quality is outstanding. snap, texture, hologram. all perfect.",v:true},
  {n:"DeepStack_CA",p:"Standard Pack",s:5,t:"juste un gars satisfait",x:"juste un gars satisfait. qualite parfaite. livraison rapide. je recommande.",v:true},
  {n:"bastien_mtl",p:"Sample Pack",s:5,t:"speedrun reviewed",x:"speedrun bought and tested. quality excellent. ordering more.",v:true},

  // 3
  {n:"PacketSnap",p:"Pro Pack",s:5,t:"real review",x:"real review from a real customer. quality is extraordinary. snap and hologram are perfect.",v:true},
  {n:"PropPillar",p:"Standard Pack",s:5,t:"ok",x:"ok quality is solid. fast ship. happy.",v:true},
  {n:"idk_user",p:"Bulk Pack",s:5,t:"parfait",x:"commande vrac parfaite. qualite constante. livraison rapide. je reviendrai.",v:true},

  // 4
  {n:"justaguy_qc",p:"Pro Pack",s:5,t:"opened at midnight",x:"opened at midnight. stood there impressed for 5 minutes. quality is extraordinary. ordering more.",v:true},
  {n:"DerekSolid",p:"Standard Pack",s:5,t:"ok",x:"ok",v:true},
  {n:"arthur_qc",p:"Sample Pack",s:5,t:"vibes are immaculate",x:"vibes are immaculate. quality is immaculate. snap is immaculate. ordering more.",v:true},
  {n:"BillBoard_T",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien recu. qualite parfaite. je recommande.",v:true},

  // 2
  {n:"GoldenProp",p:"Bulk Pack",s:5,t:"no junk here",x:"no junk in this bulk order. every bill was perfect. fast delivery. discreet. my supplier.",v:true},
  {n:"william_qc",p:"Pro Pack",s:5,t:"bougie quality",x:"bougie quality at a fair price. snap and hologram are stunning. ordering again.",v:true},

  // 4
  {n:"GritBillz",p:"Standard Pack",s:5,t:"tests passed",x:"ran my tests. every test passed. quality is excellent. will order again.",v:true},
  {n:"nicolas_qc2",p:"Pro Pack",s:5,t:"qualite ok",x:"qualite ok. c'est plutot tres bien en fait. je reviens.",v:true},
  {n:"KitT_This",p:"Sample Pack",s:5,t:"weekend buy",x:"bought it on the weekend. arrived tuesday. quality was excellent. ordering the full pack.",v:true},
  {n:"just_browsing99",p:"Standard Pack",s:5,t:"$",x:"$",v:true},

  // 3
  {n:"GeorgeW_First",p:"Bulk Pack",s:5,t:"shady name real quality",x:"shady name but real review. bulk order was perfect. every bill identical. fast delivery.",v:true},
  {n:"SteelProp_T",p:"Pro Pack",s:5,t:"just good",x:"just really good quality. snap, texture, hologram. ordering again.",v:true},
  {n:"TopDollar_BC",p:"Standard Pack",s:5,t:"super",x:"super. qualite, livraison, emballage. tout est super.",v:true},

  // 4
  {n:"christophe_b",p:"Sample Pack",s:5,t:"casual buy",x:"casual buy turned into a regular order. quality is that good.",v:true},
  {n:"Eric_L",p:"Pro Pack",s:5,t:"secret approval",x:"secret shopper here. quality approved. snap, texture, hologram. all excellent.",v:true},
  {n:"Lol_Legit",p:"Standard Pack",s:5,t:"parfait",x:"parfait. je recommande.",v:true},
  {n:"PropOmega",p:"Bulk Pack",s:5,t:"bruh",x:"bruh the quality is actually insane. bulk pack was flawless.",v:true},

  // 2
  {n:"BeckettT.",p:"Standard Pack",s:5,t:"ok",x:"ok.",v:true},
  {n:"MoneyMike_T",p:"Pro Pack",s:5,t:"ghost review",x:"ghost account real review. quality is extraordinary. snap and hologram are perfect.",v:true},

  // 3
  {n:"PropGuard",p:"Sample Pack",s:5,t:"letting quality speak",x:"letting the quality speak for itself. sample was extraordinary. ordering more.",v:true},
  {n:"QuinnB_VS",p:"Standard Pack",s:5,t:"fan of the quality",x:"big fan of the quality here. fast delivery. discreet packaging. will be back.",v:true},
  {n:"RossB_Props",p:"Standard Pack",s:5,t:"super qualite",x:"super qualite. livraison parfaite. je suis tres satisfaite.",v:true},

  // 4
  {n:"LoganR_Props",p:"Pro Pack",s:5,t:"first time won't be last",x:"first time ordering. quality blew me away. snap, texture, hologram. won't be my last order.",v:true},
  {n:"TrueGrit_BC",p:"Bulk Pack",s:5,t:"bulk delivered",x:"bulk delivered on time. every bill perfect. discreet box. fast. my supplier.",v:true},
  {n:"DevinB_Re",p:"Standard Pack",s:5,t:"tanks",x:"tanks bro. quality is great.",v:true},
  {n:"WyattB_Shop",p:"Pro Pack",s:5,t:"direct et efficace",x:"direct et efficace. qualite parfaite. livraison rapide. je reviendrai.",v:true},

  // 3
  {n:"JamesB_Bulk",p:"Sample Pack",s:5,t:"dont usually review",x:"dont usually leave reviews but this deserves one. quality is exceptional.",v:true},
  {n:"LucasT_Cant",p:"Standard Pack",s:5,t:"👌",x:"👌",v:true},
  {n:"MassBillz",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite a chaque commande. hologramme magnifique. je reviendrai.",v:true},

  // 4 (one 4-star)
  {n:"OwenM_4th",p:"Pro Pack",s:4,t:"one day late rest is perfect",x:"quality is genuinely perfect. snap, texture, hologram. all there. arrived one day past the estimate. still five stars for the product.",v:true},
  {n:"PropBlast",p:"Standard Pack",s:5,t:"W shop",x:"W shop. quality delivered. fast ship.",v:true},
  {n:"MasonB_TO",p:"Sample Pack",s:5,t:"finally ordered",x:"finally ordered after lurking. sample was extraordinary. pro pack incoming.",v:true},
  {n:"adrien_qc",p:"Bulk Pack",s:5,t:"midnight quality",x:"midnight order, quality hit in the morning. bulk was flawless. fast delivery.",v:true},

  // 2
  {n:"SnapMaster99",p:"Standard Pack",s:5,t:"ok",x:"ok quality is really good actually. will buy again.",v:true},
  {n:"StackMaster",p:"Pro Pack",s:5,t:"lol its legit",x:"lol its actually legit. quality is extraordinary. ordering more.",v:true},

  // 3
  {n:"ColdCash_Van",p:"Standard Pack",s:5,t:"content",x:"content de ma commande. qualite parfaite. livraison en 2 jours.",v:true},
  {n:"samuel_mtl",p:"Pro Pack",s:5,t:"shadow approved",x:"shadow approved. quality is extraordinary. snap, texture, hologram. perfect.",v:true},
  {n:"just_a_fan",p:"Sample Pack",s:5,t:"vibe check passed",x:"vibe check passed. quality check passed. snap check passed. ordering more.",v:true},

  // 4
  {n:"tanks_bro",p:"Bulk Pack",s:5,t:"private review",x:"staying private but quality is real. bulk order was perfect. every bill identical. fast delivery.",v:true},
  {n:"DylanB_Bet",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. qualite au top. livraison rapide. emballage discret. je recommande.",v:true},
  {n:"the_snap_guy",p:"Pro Pack",s:5,t:"name not important",x:"name not important. quality is. snap, texture, hologram. extraordinary. ordering again.",v:true},
  {n:"CB_Props",p:"Standard Pack",s:5,t:"incognito approved",x:"incognito mode approved. quality is real. fast delivery. discreet box.",v:true},

  // 3
  {n:"MarcusP_Back",p:"Sample Pack",s:5,t:"throwaway but real",x:"throwaway account. real review. sample quality was extraordinary. ordering the full pack.",v:true},
  {n:"weekend_order",p:"Pro Pack",s:5,t:"🔥",x:"🔥 quality is 🔥",v:true},
  {n:"valentin_c",p:"Standard Pack",s:5,t:"satisfait",x:"satisfait de ma commande. qualite parfaite. livraison rapide.",v:true},

  // 2
  {n:"alias_42",p:"Bulk Pack",s:5,t:"late night order",x:"late night order. quality arrived perfect. bulk was flawless. fast delivery. discreet.",v:true},
  {n:"GreysonL.",p:"Standard Pack",s:5,t:"ok",x:"ok. qualite parfaite. livraison parfaite. je reviens.",v:true},

  // 4
  {n:"CaptureProp",p:"Pro Pack",s:5,t:"silent approval",x:"dont talk much but had to say the quality is extraordinary. snap, texture, hologram. all perfect.",v:true},
  {n:"SpeedProp_T",p:"Standard Pack",s:5,t:"weekend quality",x:"weekend warrior approved. quality is great. arrived fast. discreet packaging.",v:true},
  {n:"JackieO",p:"Sample Pack",s:5,t:"quality sold me",x:"quality sold me on the sample. ordering the pro pack now.",v:true},
  {n:"PropMatrix",p:"Bulk Pack",s:5,t:"low profile high quality",x:"low profile review. high quality product. bulk was perfect. fast delivery. discreet.",v:true},

  // 3
  {n:"DH_Props",p:"Standard Pack",s:5,t:"random review",x:"random review from a satisfied customer. quality is great. fast delivery. will order again.",v:true},
  {n:"RealStax",p:"Pro Pack",s:5,t:"qualite incroyable",x:"qualite incroyable. je commande encore ce soir. hologramme magnifique.",v:true},
  {n:"LukeR_Van",p:"Sample Pack",s:5,t:"bought flew away happy",x:"bought it. flew away happy. quality is excellent. ordering more.",v:true},

  // 4
  {n:"FirstTimeFred",p:"Standard Pack",s:5,t:"first review ever",x:"never left a review before. quality made me break the habit. snap, texture, hologram. extraordinary.",v:true},
  {n:"bastien_f",p:"Standard Pack",s:5,t:"ok",x:"ok. bon produit. livraison rapide.",v:true},
  {n:"BrokeButBougie",p:"Bulk Pack",s:5,t:"cred approved",x:"street cred approved. bulk quality is real. every bill identical. fast delivery. discreet.",v:true},
  {n:"MarcusH_Detail",p:"Pro Pack",s:5,t:"ninja delivery",x:"ninja delivery. nobody saw it coming. quality is extraordinary. snap and hologram are perfect.",v:true},

  // 2
  {n:"Luc_A",p:"Standard Pack",s:5,t:"bien",x:"bien. qualite correcte. livraison rapide. je reviendrai.",v:true},
  {n:"BrooksL.",p:"Pro Pack",s:5,t:"cruise control quality",x:"cruise control quality. smooth, perfect, consistent. snap, texture, hologram. extraordinary.",v:true},

  // 3
  {n:"PropWizard",p:"Sample Pack",s:5,t:"watched then bought",x:"watched the reviews for a while then bought. all true. quality is extraordinary.",v:true},
  {n:"BillsNation",p:"Standard Pack",s:5,t:"satisfait",x:"satisfait. qualite parfaite. livraison en 2 jours. emballage discret.",v:true},
  {n:"elo_h",p:"Bulk Pack",s:5,t:"broke the ice",x:"broke the ice with the sample. now ordering bulk every month. quality never drops.",v:true},

  // 4
  {n:"RossH_Rare",p:"Pro Pack",s:5,t:"sneaky good quality",x:"sneaky good quality. you pick it up and it just feels right. snap, texture, hologram. perfect.",v:true},
  {n:"PropMaster_T",p:"Standard Pack",s:5,t:"ok",x:"ok",v:true},
  {n:"SnapKing_BC",p:"Sample Pack",s:5,t:"first time",x:"first time buyer. quality impressed me immediately. ordering the pro pack.",v:true},
  {n:"T.Rex_Props",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite au top. livraison rapide. je recommande.",v:true},

  // 3
  {n:"xX_BillKing_Xx",p:"Bulk Pack",s:5,t:"anon approved",x:"anon approved. bulk quality is real. every bill perfect. fast delivery. discreet packaging.",v:true},
  {n:"PropEdge",p:"Standard Pack",s:5,t:"quick note",x:"quick note. quality is great. arrived fast. ordering again.",v:true},
  {n:"hugo_l",p:"Pro Pack",s:5,t:"qualite parfaite",x:"qualite parfaite. hologramme magnifique. texture excellente. livraison rapide.",v:true},

  // 4 (one 4-star)
  {n:"CrispBillz",p:"Standard Pack",s:4,t:"great quality, one day delay",x:"quality is genuinely excellent. hologram perfect, snap satisfying, texture right. came one extra day past estimate. small issue. would order again.",v:true},
  {n:"PropCastle",p:"Sample Pack",s:5,t:"chill quality",x:"chill quality. relaxed and perfect. sample was great. ordering more.",v:true},
  {n:"TylerBulk",p:"Bulk Pack",s:5,t:"tl;dr excellent",x:"tl;dr quality is excellent. bulk order perfect. fast and discreet.",v:true},
  {n:"PropAxis",p:"Pro Pack",s:5,t:"was not sure",x:"was not sure before ordering. now i am sure. quality is extraordinary. ordering again.",v:true},

  // ── NEW BATCH +400 ──

  // 3
  {n:"Kenzo",p:"Pro Pack",s:5,t:"fire",x:"fire product. legit. ordering again.",v:true},
  {n:"Damien",p:"Standard Pack",s:5,t:"recu en 2 jours",x:"recu en 2 jours. qualite parfaite. snap au top.",v:true},
  {n:"Tyrese",p:"Bulk Pack",s:5,t:"bulk quality never drops",x:"every bill identical. this shop is reliable.",v:true},

  // 2
  {n:"Florian",p:"Sample Pack",s:5,t:"ok je suis convaincu",x:"sample etait parfait. je commande le pro pack ce soir.",v:true},
  {n:"Remy",p:"Pro Pack",s:5,t:"elite tier",x:"elite tier quality. nothing else comes close.",v:true},

  // 4
  {n:"Gavin",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Nico",p:"Pro Pack",s:5,t:"hologram is wild",x:"the hologram shift is genuinely wild. never seen this on a prop.",v:true},
  {n:"Tristan",p:"Bulk Pack",s:5,t:"parfait du debut a la fin",x:"commande discrete, livraison rapide, qualite extraordinaire. parfait.",v:true},
  {n:"Mael",p:"Sample Pack",s:5,t:"oui",x:"oui. tres bonne qualite. je commande plus grand.",v:true},

  // 3
  {n:"Seb",p:"Standard Pack",s:5,t:"good",x:"good quality. will buy again.",v:true},
  {n:"Brice",p:"Pro Pack",s:5,t:"snap sold me",x:"that snap is something else. ordering more tonight.",v:true},
  {n:"Cyrus",p:"Bulk Pack",s:5,t:"zero issues",x:"zero issues on the whole bulk order. consistent every time.",v:true},

  // 5
  {n:"Theo",p:"Standard Pack",s:5,t:"nice one",x:"nice product. fast delivery. five stars easy.",v:true},
  {n:"Liam",p:"Pro Pack",s:5,t:"exceeded my expectations",x:"expected decent. got extraordinary. snap and hologram are top.",v:true},
  {n:"Jules",p:"Sample Pack",s:5,t:"top",x:"top qualite. je reviens.",v:true},
  {n:"Aaron",p:"Standard Pack",s:5,t:"very satisfied",x:"very satisfied. great quality. discreet box.",v:true},
  {n:"Emile",p:"Bulk Pack",s:5,t:"permanent order",x:"setting up a monthly order. quality never misses.",v:true},

  // 2
  {n:"Zach",p:"Pro Pack",s:5,t:"legit",x:"legit product. ordering again.",v:true},
  {n:"Noah",p:"Standard Pack",s:5,t:"tres content",x:"tres content de ma commande. qualite au rendez-vous.",v:true},

  // 6
  {n:"Mateo",p:"Bulk Pack",s:5,t:"best purchase",x:"best purchase this year no contest.",v:true},
  {n:"Oscar",p:"Pro Pack",s:5,t:"quality speaks",x:"quality speaks for itself. just order.",v:true},
  {n:"Ethan",p:"Sample Pack",s:5,t:"sample hooked me",x:"sample pack had me ordering the pro pack same night.",v:true},
  {n:"Ronan",p:"Standard Pack",s:5,t:"parfait",x:"parfait. livraison rapide. qualite incroyable.",v:true},
  {n:"Hugo",p:"Bulk Pack",s:5,t:"flawless bulk",x:"bulk was flawless. every single bill perfect.",v:true},
  {n:"Julien",p:"Pro Pack",s:5,t:"hologram wow",x:"the hologram alone is worth it. rest is perfect too.",v:true},

  // 3
  {n:"Louka",p:"Standard Pack",s:5,t:"solid",x:"solid quality. fast delivery. no issues.",v:true},
  {n:"Kael",p:"Pro Pack",s:5,t:"ordered more",x:"opened the pack and ordered more immediately.",v:true},
  {n:"Felix",p:"Sample Pack",s:5,t:"convaincu",x:"convaincu par le sample. pro pack commande.",v:true},

  // 4
  {n:"Cleo",p:"Bulk Pack",s:5,t:"reliable supplier",x:"same quality every order. this is my supplier now.",v:true},
  {n:"Isla",p:"Standard Pack",s:5,t:"great",x:"great quality. arrived fast. five stars.",v:true},
  {n:"Zara",p:"Pro Pack",s:5,t:"stunning hologram",x:"the hologram shift under light is stunning. texture is perfect.",v:true},
  {n:"Nora",p:"Sample Pack",s:5,t:"yes",x:"yes. really good quality. ordering more.",v:true},

  // 2
  {n:"Lena",p:"Standard Pack",s:5,t:"fast ship",x:"fast ship. good quality. happy customer.",v:true},
  {n:"Maya",p:"Bulk Pack",s:5,t:"bulk parfait",x:"bulk parfait. chaque billet identique. livraison discrete.",v:true},

  // 5
  {n:"Iris",p:"Pro Pack",s:5,t:"wow",x:"wow. opened and was speechless. great shop.",v:true},
  {n:"Jade",p:"Standard Pack",s:5,t:"nice texture",x:"the texture is really impressive. feel is authentic.",v:true},
  {n:"Chloe",p:"Sample Pack",s:5,t:"impressed",x:"more impressed than expected. ordering the full pack.",v:true},
  {n:"Mila",p:"Bulk Pack",s:5,t:"consistent quality",x:"ordered twice. same perfect quality both times.",v:true},
  {n:"Elise",p:"Pro Pack",s:5,t:"extraordinaire",x:"qualite extraordinaire. hologramme magnifique. je reviens.",v:true},

  // 3
  {n:"Axel",p:"Standard Pack",s:5,t:"ok top",x:"ok qualite vraiment top. livraison 2 jours.",v:true},
  {n:"Sam",p:"Pro Pack",s:5,t:"dope",x:"dope quality. fast ship. five stars.",v:true},
  {n:"Leo",p:"Bulk Pack",s:5,t:"every bill perfect",x:"every bill in the bulk is identical and perfect.",v:true},

  // 1
  {n:"Max",p:"Standard Pack",s:5,t:"good quality",x:"good quality. would buy again.",v:true},

  // 4
  {n:"Ben",p:"Sample Pack",s:5,t:"started small",x:"started with the sample. now going bulk. quality is that good.",v:true},
  {n:"Tom",p:"Pro Pack",s:5,t:"best supplier",x:"tried a few. this one wins. not going back.",v:true},
  {n:"Ryan",p:"Standard Pack",s:5,t:"fast and discreet",x:"fast and discreet. product is excellent. ordering again.",v:true},
  {n:"Cole",p:"Bulk Pack",s:5,t:"quality guarantee",x:"feels like a quality guarantee every time i order. consistent.",v:true},

  // 3
  {n:"Drew",p:"Pro Pack",s:5,t:"five stars",x:"five stars. easy. no hesitation.",v:true},
  {n:"Kyle",p:"Sample Pack",s:5,t:"sample converted me",x:"sample converted me immediately. going pro pack next.",v:true},
  {n:"Reid",p:"Standard Pack",s:5,t:"props to the shop",x:"props to the shop. no pun intended. quality is great.",v:true},

  // 2
  {n:"Wade",p:"Bulk Pack",s:5,t:"great bulk deal",x:"great quality across the whole bulk. fast and discreet.",v:true},
  {n:"Jace",p:"Pro Pack",s:5,t:"impressive",x:"genuinely impressive product. ordering again.",v:true},

  // 6
  {n:"Tyler",p:"Standard Pack",s:5,t:"good",x:"good. fast. discreet. quality ok.",v:true},
  {n:"Wyatt",p:"Pro Pack",s:5,t:"hologram is perfect",x:"hologram shifts perfectly. weight is right. snap is right.",v:true},
  {n:"Blake",p:"Bulk Pack",s:5,t:"bulk consistency",x:"bulk pack. every bill the same. no defects. fast ship.",v:true},
  {n:"Chase",p:"Sample Pack",s:5,t:"sample worth it",x:"sample worth every cent. converting to pro pack order.",v:true},
  {n:"Bryce",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will be back for sure.",v:true},
  {n:"Grant",p:"Pro Pack",s:5,t:"top quality",x:"top quality. hologram is extraordinary. snap is perfect.",v:true},

  // 4
  {n:"Heath",p:"Sample Pack",s:5,t:"nice",x:"nice quality. was not expecting this level.",v:true},
  {n:"Lane",p:"Bulk Pack",s:5,t:"bulk was on point",x:"bulk was on point. every bill clean. fast delivery.",v:true},
  {n:"Beau",p:"Standard Pack",s:5,t:"great shop",x:"great shop. quality great. delivery fast. discreet.",v:true},
  {n:"Knox",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant believe how good this is.",v:true},

  // 2
  {n:"Ezra",p:"Standard Pack",s:5,t:"recommended",x:"recommended to a friend already. quality is really good.",v:true},
  {n:"Zane",p:"Sample Pack",s:5,t:"fast delivery",x:"fast delivery. good quality. ordering the pro pack.",v:true},

  // 5
  {n:"Cruz",p:"Bulk Pack",s:5,t:"never miss",x:"this shop never misses. same quality every time.",v:true},
  {n:"Ace",p:"Pro Pack",s:5,t:"ace quality",x:"ace quality from an ace shop. ordering again.",v:true},
  {n:"Ash",p:"Standard Pack",s:5,t:"clean product",x:"clean product. clean delivery. no issues.",v:true},
  {n:"Jay",p:"Bulk Pack",s:5,t:"jaw dropped",x:"jaw dropped opening the bulk pack. every bill incredible.",v:true},
  {n:"Kai",p:"Pro Pack",s:5,t:"textbook quality",x:"textbook quality. nothing to criticize. perfect order.",v:true},

  // 3
  {n:"Ray",p:"Sample Pack",s:5,t:"yep",x:"yep. good. will order more.",v:true},
  {n:"Sky",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. fast. quality. discreet.",v:true},
  {n:"Fox",p:"Bulk Pack",s:5,t:"bulk delivered",x:"bulk delivered perfectly. every bundle clean.",v:true},

  // 1 (4-star)
  {n:"Dean",p:"Standard Pack",s:4,t:"great quality, slight delay",x:"quality is great. one day later than the purolator estimate. no big deal. ordering again.",v:true},

  // 4
  {n:"Troy",p:"Pro Pack",s:5,t:"snapped sold",x:"the snap alone sold me on re-ordering. five stars.",v:true},
  {n:"Brent",p:"Sample Pack",s:5,t:"sample sealed it",x:"the sample sealed the deal. pro pack ordered.",v:true},
  {n:"Cade",p:"Standard Pack",s:5,t:"nice",x:"nice product. arrived fast. happy.",v:true},
  {n:"Gael",p:"Bulk Pack",s:5,t:"vrac parfait",x:"vrac parfait. qualite constante sur tout le lot.",v:true},

  // 2
  {n:"Antoine",p:"Pro Pack",s:5,t:"qualite exceptionnelle",x:"qualite exceptionnelle. snap parfait. hologramme superbe.",v:true},
  {n:"Baptiste",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. rapide. discret. je reviendrai.",v:true},

  // 6
  {n:"Raphael",p:"Bulk Pack",s:5,t:"commande parfaite",x:"commande parfaite. chaque billet identique. livraison en 2 jours.",v:true},
  {n:"Quentin",p:"Pro Pack",s:5,t:"incroyable",x:"incroyable qualite. je commande encore ce soir.",v:true},
  {n:"Alexis",p:"Sample Pack",s:5,t:"sample bluffant",x:"sample bluffant. passage direct au pro pack.",v:true},
  {n:"Mathis",p:"Standard Pack",s:5,t:"bien",x:"bien. qualite bonne. livraison rapide.",v:true},
  {n:"Thibault",p:"Bulk Pack",s:5,t:"au top",x:"au top. lot parfait. emballage discret.",v:true},
  {n:"Etienne",p:"Pro Pack",s:5,t:"top produit",x:"top produit. hologramme magnifique. texture impeccable.",v:true},

  // 3
  {n:"Mathieu",p:"Standard Pack",s:5,t:"correct",x:"correct. qualite ok. livraison rapide.",v:true},
  {n:"Guillaume",p:"Bulk Pack",s:5,t:"excellent fournisseur",x:"excellent fournisseur. meme qualite a chaque commande.",v:true},
  {n:"Jonathan",p:"Pro Pack",s:5,t:"incroyable texture",x:"la texture en relief est incroyable. jamais vu ailleurs.",v:true},

  // 4
  {n:"Laurent",p:"Sample Pack",s:5,t:"convaincu",x:"convaincu rapidement. commande pro pack ce soir.",v:true},
  {n:"Adrien",p:"Standard Pack",s:5,t:"satisfait",x:"satisfait de ma commande. qualite parfaite.",v:true},
  {n:"Maxime",p:"Bulk Pack",s:5,t:"vrac sans defaut",x:"vrac sans defaut. rapide et discret.",v:true},
  {n:"Clement",p:"Pro Pack",s:5,t:"wow",x:"wow. qualite remarquable. je reviens.",v:true},

  // 2
  {n:"Romain",p:"Standard Pack",s:5,t:"ok",x:"ok. bon produit. livraison correcte.",v:true},
  {n:"Vincent",p:"Sample Pack",s:5,t:"top",x:"top qualite. je commande plus.",v:true},

  // 5
  {n:"Benoit",p:"Pro Pack",s:5,t:"parfait",x:"parfait. rien a redire. cinq etoiles.",v:true},
  {n:"Pascal",p:"Bulk Pack",s:5,t:"commande mensuelle",x:"je fais une commande mensuelle maintenant. qualite jamais en baisse.",v:true},
  {n:"Yannick",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. livraison discrete. qualite top.",v:true},
  {n:"Sylvain",p:"Pro Pack",s:5,t:"hologramme parfait",x:"hologramme parfait. texture parfaite. snap parfait.",v:true},
  {n:"Frederic",p:"Sample Pack",s:5,t:"oui",x:"oui. tres bon. je reviens.",v:true},

  // 3
  {n:"Patrick",p:"Bulk Pack",s:5,t:"fiable",x:"fournisseur fiable. meme qualite a chaque fois.",v:true},
  {n:"Luc",p:"Standard Pack",s:5,t:"bon achat",x:"bon achat. qualite au rendez-vous. livraison rapide.",v:true},
  {n:"Marc",p:"Pro Pack",s:5,t:"incroyable",x:"incroyable. meilleure qualite que j'aie vue.",v:true},

  // 1
  {n:"Pierre",p:"Standard Pack",s:5,t:"bien",x:"bien. je recommande.",v:true},

  // 4
  {n:"Michel",p:"Bulk Pack",s:5,t:"lot parfait",x:"lot parfait. chaque billet impeccable.",v:true},
  {n:"Nicolas",p:"Pro Pack",s:5,t:"superbe",x:"superbe qualite. hologramme spectaculaire.",v:true},
  {n:"Olivier",p:"Sample Pack",s:5,t:"sample convainc",x:"sample m'a convaincu immediatement. pro pack commande.",v:true},
  {n:"Philippe",p:"Standard Pack",s:5,t:"content",x:"content de ma commande. qualite parfaite.",v:true},

  // 2
  {n:"Xavier",p:"Bulk Pack",s:5,t:"qualite constante",x:"qualite constante sur tout le lot. parfait.",v:true},
  {n:"Sebastien",p:"Pro Pack",s:5,t:"snap incroyable",x:"snap incroyable. hologramme parfait. je reviens.",v:true},

  // 6
  {n:"Christian",p:"Standard Pack",s:5,t:"correct",x:"correct. bon produit. livraison ok.",v:true},
  {n:"Emmanuel",p:"Bulk Pack",s:5,t:"fiable",x:"fiable. meme qualite chaque fois. discret.",v:true},
  {n:"Francois",p:"Pro Pack",s:5,t:"parfait du tout",x:"parfait du tout au tout. hologramme magnifique.",v:true},
  {n:"Stephane",p:"Sample Pack",s:5,t:"convaincu vite",x:"convaincu en moins d'une minute. pro pack commande.",v:true},
  {n:"Thomas",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. qualite au top. livraison rapide.",v:true},
  {n:"Henri",p:"Bulk Pack",s:5,t:"excellent",x:"excellent. lot parfait. pas de defaut.",v:true},

  // 3
  {n:"Bernard",p:"Pro Pack",s:5,t:"top qualite",x:"top qualite. je ne commande plus qu'ici.",v:true},
  {n:"Robert",p:"Standard Pack",s:5,t:"satisfait",x:"satisfait. qualite parfaite. livraison rapide.",v:true},
  {n:"Gilles",p:"Sample Pack",s:5,t:"oui merci",x:"oui merci. bonne qualite. je reviens.",v:true},

  // 4
  {n:"Franck",p:"Bulk Pack",s:5,t:"vrac impeccable",x:"vrac impeccable. rien a redire sur la qualite.",v:true},
  {n:"Serge",p:"Pro Pack",s:5,t:"exceptionnel",x:"qualite exceptionnelle. hologramme superbe.",v:true},
  {n:"Didier",p:"Standard Pack",s:5,t:"bien",x:"bien. produit correct. livraison rapide.",v:true},
  {n:"Alain",p:"Sample Pack",s:5,t:"bon sample",x:"bon sample. passe au pro pack maintenant.",v:true},

  // 2
  {n:"Denis",p:"Bulk Pack",s:5,t:"parfait",x:"parfait. lot sans defaut. livraison discrete.",v:true},
  {n:"Bruno",p:"Pro Pack",s:5,t:"incroyable",x:"qualite incroyable. je ne cherche plus ailleurs.",v:true},

  // 5
  {n:"Gerard",p:"Standard Pack",s:5,t:"content",x:"content. bon achat. qualite ok.",v:true},
  {n:"Jacques",p:"Bulk Pack",s:5,t:"fiable",x:"fiable. lot parfait. rapide et discret.",v:true},
  {n:"Jean",p:"Pro Pack",s:5,t:"parfait",x:"parfait du debut a la fin. cinq etoiles.",v:true},
  {n:"Paul",p:"Sample Pack",s:5,t:"bon",x:"bon produit. qualite correcte. je reviens.",v:true},
  {n:"Claude",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. livraison discrete. qualite parfaite.",v:true},

  // 3
  {n:"Andre",p:"Bulk Pack",s:5,t:"lot parfait",x:"lot parfait. chaque billet identique.",v:true},
  {n:"Daniel",p:"Pro Pack",s:5,t:"snap parfait",x:"snap parfait. hologramme parfait. je reviens.",v:true},
  {n:"Georges",p:"Standard Pack",s:5,t:"ok",x:"ok. bon. rapide. discret.",v:true},

  // 1 (4-star)
  {n:"Raymond",p:"Bulk Pack",s:4,t:"qualite top, un jour de delai",x:"qualite parfaite. livraison un jour plus tard que prevu. rien de grave. je recommande.",v:true},

  // 4
  {n:"Marcel",p:"Pro Pack",s:5,t:"exceptionnel",x:"exceptionnel. hologramme magnifique. texture impeccable.",v:true},
  {n:"Roger",p:"Sample Pack",s:5,t:"bon sample",x:"bon sample. je commande le gros maintenant.",v:true},
  {n:"Albert",p:"Standard Pack",s:5,t:"satisfait",x:"satisfait de ma commande. qualite parfaite.",v:true},
  {n:"Leon",p:"Bulk Pack",s:5,t:"lot impeccable",x:"lot impeccable du debut a la fin.",v:true},

  // 2
  {n:"Julien",p:"Pro Pack",s:5,t:"parfait",x:"parfait. rien a redire. cinq etoiles.",v:true},
  {n:"Mathieu",p:"Standard Pack",s:5,t:"bien",x:"bien. qualite correcte. livraison rapide.",v:true},

  // 6
  {n:"Romain",p:"Sample Pack",s:5,t:"convaincu",x:"convaincu par le sample. pro pack ce soir.",v:true},
  {n:"Quentin",p:"Bulk Pack",s:5,t:"qualite constante",x:"qualite constante. lot sans defaut.",v:true},
  {n:"Theo",p:"Pro Pack",s:5,t:"incroyable",x:"incroyable qualite. hologramme spectaculaire.",v:true},
  {n:"Hugo",p:"Standard Pack",s:5,t:"top",x:"top. rapide. discret. qualite parfaite.",v:true},
  {n:"Felix",p:"Sample Pack",s:5,t:"oui",x:"oui. tres bon. je reviens.",v:true},
  {n:"Etienne",p:"Bulk Pack",s:5,t:"lot parfait",x:"lot parfait. chaque billet identique.",v:true},

  // 3
  {n:"Mael",p:"Pro Pack",s:5,t:"hologramme wow",x:"hologramme wow. texture parfaite. snap incroyable.",v:true},
  {n:"Loic",p:"Standard Pack",s:5,t:"tres satisfait",x:"tres satisfait. qualite top. livraison rapide.",v:true},
  {n:"Yann",p:"Sample Pack",s:5,t:"bon",x:"bon produit. qualite correcte. je reviens.",v:true},

  // 4
  {n:"Gwen",p:"Bulk Pack",s:5,t:"bulk parfait",x:"bulk parfait. rien a redire sur la qualite.",v:true},
  {n:"Ronan",p:"Pro Pack",s:5,t:"parfait",x:"parfait. hologramme parfait. snap parfait.",v:true},
  {n:"Elodie",p:"Standard Pack",s:5,t:"contente",x:"contente de ma commande. qualite parfaite.",v:true},
  {n:"Maeva",p:"Sample Pack",s:5,t:"bien",x:"bien. bonne qualite. je commande plus.",v:true},

  // 2
  {n:"Justine",p:"Bulk Pack",s:5,t:"lot impeccable",x:"lot impeccable. livraison discrete. qualite top.",v:true},
  {n:"Amelie",p:"Pro Pack",s:5,t:"parfaite qualite",x:"parfaite qualite. hologramme magnifique.",v:true},

  // 5
  {n:"Camille",p:"Standard Pack",s:5,t:"super",x:"super. qualite parfaite. livraison 2 jours.",v:true},
  {n:"Sophie",p:"Sample Pack",s:5,t:"convaincu",x:"convaincu par le sample. commande pro pack.",v:true},
  {n:"Lucie",p:"Bulk Pack",s:5,t:"qualite constante",x:"qualite constante sur tout le lot.",v:true},
  {n:"Marion",p:"Pro Pack",s:5,t:"incroyable",x:"incroyable. meilleur fournisseur du marche.",v:true},
  {n:"Chloe",p:"Standard Pack",s:5,t:"tres bien",x:"tres bien. rapide. discret. qualite top.",v:true},

  // 3
  {n:"Manon",p:"Sample Pack",s:5,t:"sample parfait",x:"sample parfait. je passe au pro pack.",v:true},
  {n:"Lea",p:"Bulk Pack",s:5,t:"lot parfait",x:"lot parfait. chaque billet impeccable.",v:true},
  {n:"Emma",p:"Pro Pack",s:5,t:"wow",x:"wow. qualite remarquable. hologramme superbe.",v:true},

  // 1
  {n:"Clara",p:"Standard Pack",s:5,t:"satisfaite",x:"satisfaite. qualite parfaite. je reviendrai.",v:true},

  // 4
  {n:"Laura",p:"Sample Pack",s:5,t:"bon",x:"bon produit. qualite ok. je commande plus.",v:true},
  {n:"Julie",p:"Bulk Pack",s:5,t:"vrac sans defaut",x:"vrac sans defaut. rapide et discret.",v:true},
  {n:"Pauline",p:"Pro Pack",s:5,t:"parfait",x:"parfait. rien a redire. hologramme magnifique.",v:true},
  {n:"Alice",p:"Standard Pack",s:5,t:"tres contente",x:"tres contente de ma commande. qualite top.",v:true},

  // 2
  {n:"Elsa",p:"Sample Pack",s:5,t:"convaincu vite",x:"convaincu vite par le sample. pro pack commande.",v:true},
  {n:"Charlotte",p:"Bulk Pack",s:5,t:"excellent",x:"excellent. lot parfait. qualite constante.",v:true},

  // 6
  {n:"Sarah",p:"Pro Pack",s:5,t:"impressionnee",x:"vraiment impressionnee par la qualite. hologramme parfait.",v:true},
  {n:"Inès",p:"Standard Pack",s:5,t:"ok",x:"ok. bon produit. rapide. je reviendrai.",v:true},
  {n:"Oceane",p:"Sample Pack",s:5,t:"bien",x:"bien. bonne qualite. je commande la suite.",v:true},
  {n:"Luna",p:"Bulk Pack",s:5,t:"lot impeccable",x:"lot impeccable. livraison discrete.",v:true},
  {n:"Eva",p:"Pro Pack",s:5,t:"top produit",x:"top produit. hologramme wow. texture parfaite.",v:true},
  {n:"Anaïs",p:"Standard Pack",s:5,t:"satisfaite",x:"satisfaite. qualite correcte. livraison rapide.",v:true},

  // 3
  {n:"Zoe",p:"Sample Pack",s:5,t:"bon sample",x:"bon sample. passe au pro pack maintenant.",v:true},
  {n:"Lena",p:"Bulk Pack",s:5,t:"qualite top",x:"qualite top. lot sans defaut.",v:true},
  {n:"Mila",p:"Pro Pack",s:5,t:"parfaite",x:"parfaite commande. parfaite qualite.",v:true},

  // 4 (one 4-star)
  {n:"Nora",p:"Standard Pack",s:4,t:"great quality, delayed one day",x:"quality is there. just came one day past the estimate. no major issue. would order again.",v:true},
  {n:"Lara",p:"Sample Pack",s:5,t:"yep",x:"yep. good quality. ordering more.",v:true},
  {n:"Vera",p:"Bulk Pack",s:5,t:"bulk impeccable",x:"bulk impeccable. chaque billet identique.",v:true},
  {n:"Rina",p:"Pro Pack",s:5,t:"incroyable",x:"incroyable qualite. hologramme spectaculaire.",v:true},

  // 2
  {n:"Kira",p:"Standard Pack",s:5,t:"fast ship",x:"fast ship. good quality. discreet box.",v:true},
  {n:"Mira",p:"Sample Pack",s:5,t:"sample was great",x:"sample was great. ordering pro pack now.",v:true},

  // 5
  {n:"Sia",p:"Bulk Pack",s:5,t:"bulk on point",x:"bulk on point. quality consistent every bill.",v:true},
  {n:"Gia",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
  {n:"Nia",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. good quality. fast delivery.",v:true},
  {n:"Tia",p:"Sample Pack",s:5,t:"nice",x:"nice quality. exceeded expectations.",v:true},
  {n:"Fia",p:"Bulk Pack",s:5,t:"perfect",x:"perfect quality across the whole bulk.",v:true},

  // 3
  {n:"Mia",p:"Pro Pack",s:5,t:"hologram is wow",x:"hologram shift is wow. texture is perfect. snap is right.",v:true},
  {n:"Lia",p:"Standard Pack",s:5,t:"clean",x:"clean product. clean delivery. happy.",v:true},
  {n:"Pia",p:"Sample Pack",s:5,t:"good",x:"good quality. will order more.",v:true},

  // 1
  {n:"Dion",p:"Bulk Pack",s:5,t:"bulk was great",x:"bulk was great. every bill perfect.",v:true},

  // 4
  {n:"Aron",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again tonight.",v:true},
  {n:"Bion",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. fast. quality. discreet.",v:true},
  {n:"Zion",p:"Sample Pack",s:5,t:"sample hooked me",x:"sample hooked me. ordering the big pack.",v:true},
  {n:"Leon",p:"Bulk Pack",s:5,t:"lot parfait",x:"lot parfait. qualite constante.",v:true},

  // 2
  {n:"Neon",p:"Pro Pack",s:5,t:"perfect order",x:"perfect order. fast ship. extraordinary quality.",v:true},
  {n:"Seon",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. five stars.",v:true},

  // 6
  {n:"Rion",p:"Sample Pack",s:5,t:"sample great",x:"sample was great. going pro pack.",v:true},
  {n:"Vion",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality bulk to bulk.",v:true},
  {n:"Wyon",p:"Pro Pack",s:5,t:"wow",x:"wow. quality is something else.",v:true},
  {n:"Xion",p:"Standard Pack",s:5,t:"fast",x:"fast ship. good quality. will order again.",v:true},
  {n:"Yion",p:"Sample Pack",s:5,t:"nice one",x:"nice one. sample quality was excellent.",v:true},
  {n:"Zeon",p:"Bulk Pack",s:5,t:"bulk delivered",x:"bulk delivered perfectly. every bill clean.",v:true},

  // 3
  {n:"Aden",p:"Pro Pack",s:5,t:"great hologram",x:"great hologram. great texture. great snap. great shop.",v:true},
  {n:"Eden",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied with my order. quality is good.",v:true},
  {n:"Owen",p:"Sample Pack",s:5,t:"sample convinced",x:"sample convinced me. pro pack ordered tonight.",v:true},

  // 4
  {n:"Ivan",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet delivery.",v:true},
  {n:"Evan",p:"Pro Pack",s:5,t:"top quality",x:"top quality. nothing to complain about.",v:true},
  {n:"Sean",p:"Standard Pack",s:5,t:"good",x:"good quality. fast ship. happy customer.",v:true},
  {n:"Dean",p:"Sample Pack",s:5,t:"nice",x:"nice. quality was impressive. ordering more.",v:true},

  // 2
  {n:"Glen",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},
  {n:"Sven",p:"Pro Pack",s:5,t:"extraordinary snap",x:"extraordinary snap. hologram is perfect. ordering again.",v:true},

  // 5
  {n:"Finn",p:"Standard Pack",s:5,t:"clean delivery",x:"clean delivery. great product. will be back.",v:true},
  {n:"Renn",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. going pro pack now.",v:true},
  {n:"Penn",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. every bill identical. fast.",v:true},
  {n:"Wren",p:"Pro Pack",s:5,t:"gorgeous hologram",x:"gorgeous hologram. perfect texture. top shop.",v:true},
  {n:"Gren",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. great quality. fast delivery.",v:true},

  // 3
  {n:"Bren",p:"Sample Pack",s:5,t:"yep good",x:"yep. good quality. will order more.",v:true},
  {n:"Cren",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},
  {n:"Dren",p:"Pro Pack",s:5,t:"five stars",x:"five stars. easy. no hesitation.",v:true},

  // 1
  {n:"Fren",p:"Standard Pack",s:5,t:"good",x:"good. fast. discreet. quality ok.",v:true},

  // 4 (one 4-star)
  {n:"Gren2",p:"Bulk Pack",s:4,t:"good quality, one day late",x:"good quality. one day late vs estimate. nothing major. ordering again.",v:true},
  {n:"Hren",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again tonight.",v:true},
  {n:"Jren",p:"Sample Pack",s:5,t:"sample great",x:"sample great. going to pro pack.",v:true},
  {n:"Kren",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. good quality. fast ship.",v:true},

  // 2
  {n:"Lren",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. every bill perfect.",v:true},
  {n:"Mren",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},

  // 6
  {n:"Nren",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Pren",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},
  {n:"Qren",p:"Bulk Pack",s:5,t:"bulk on point",x:"bulk on point. quality consistent.",v:true},
  {n:"Rren",p:"Pro Pack",s:5,t:"hologram wow",x:"hologram wow. texture perfect. snap right.",v:true},
  {n:"Sren",p:"Standard Pack",s:5,t:"good",x:"good product. fast delivery. will buy again.",v:true},
  {n:"Tren",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. pro pack incoming.",v:true},

  // 3
  {n:"Uren",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. no defects. fast.",v:true},
  {n:"Vren",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},
  {n:"Wren2",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. fast. quality. discreet.",v:true},

  // 4
  {n:"Xren",p:"Sample Pack",s:5,t:"good",x:"good quality. ordering more.",v:true},
  {n:"Yren",p:"Bulk Pack",s:5,t:"bulk impeccable",x:"bulk impeccable. every bill identical.",v:true},
  {n:"Zren",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering more tonight.",v:true},
  {n:"Azen",p:"Standard Pack",s:5,t:"clean",x:"clean delivery. good quality. happy.",v:true},

  // 2
  {n:"Bzen",p:"Sample Pack",s:5,t:"sample impressed",x:"sample impressed me. ordering the full pack.",v:true},
  {n:"Czen",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet.",v:true},

  // 5
  {n:"Dzen",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant stop re-ordering.",v:true},
  {n:"Ezen",p:"Standard Pack",s:5,t:"good",x:"good. fast. discreet. quality ok.",v:true},
  {n:"Fzen",p:"Sample Pack",s:5,t:"nice",x:"nice quality. going bigger next order.",v:true},
  {n:"Gzen",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time i order.",v:true},
  {n:"Hzen",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality. five stars.",v:true},

  // 3
  {n:"Izen",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will be back.",v:true},
  {n:"Jzen",p:"Sample Pack",s:5,t:"sample great",x:"sample great. converting to pro pack.",v:true},
  {n:"Kzen",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},

  // 1
  {n:"Lzen",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},

  // 4
  {n:"Mzen",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},
  {n:"Nzen",p:"Sample Pack",s:5,t:"good",x:"good. quality ok. ordering more.",v:true},
  {n:"Ozen",p:"Bulk Pack",s:5,t:"bulk delivered",x:"bulk delivered perfectly. every bill clean.",v:true},
  {n:"Pzen",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again.",v:true},

  // 2
  {n:"Qzen",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. fast. quality. discreet.",v:true},
  {n:"Rzen",p:"Sample Pack",s:5,t:"sample hooked",x:"sample hooked me. ordering pro pack.",v:true},

  // 6
  {n:"Szen",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},
  {n:"Tzen",p:"Pro Pack",s:5,t:"hologram perfect",x:"hologram perfect. texture perfect. snap right.",v:true},
  {n:"Uzen",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Vzen",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},
  {n:"Wzen",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. no defects. fast delivery.",v:true},
  {n:"Xzen",p:"Pro Pack",s:5,t:"wow",x:"wow quality. ordering more tonight.",v:true},

  // 3
  {n:"Yzen",p:"Standard Pack",s:5,t:"good",x:"good product. fast delivery. will buy again.",v:true},
  {n:"Zzen",p:"Sample Pack",s:5,t:"sample good",x:"sample good. going to full pack next.",v:true},
  {n:"Akon",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. every bill perfect.",v:true},

  // 4 (one 4-star)
  {n:"Bkon",p:"Pro Pack",s:4,t:"great quality, delivery one day off",x:"quality is excellent. hologram and texture perfect. one day behind purolator estimate. not a dealbreaker. will order again.",v:true},
  {n:"Ckon",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. good quality. fast ship.",v:true},
  {n:"Dkon",p:"Sample Pack",s:5,t:"nice",x:"nice quality. ordering more.",v:true},
  {n:"Ekon",p:"Bulk Pack",s:5,t:"perfect",x:"perfect bulk. every bill identical.",v:true},

  // 2
  {n:"Fkon",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again tonight.",v:true},
  {n:"Gkon",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},

  // 5
  {n:"Hkon",p:"Sample Pack",s:5,t:"sample great",x:"sample great. pro pack incoming.",v:true},
  {n:"Ikon",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},
  {n:"Jkon",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality. five stars.",v:true},
  {n:"Kkon",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Lkon",p:"Sample Pack",s:5,t:"good",x:"good quality. going bigger next time.",v:true},

  // 3
  {n:"Mkon",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time i order.",v:true},
  {n:"Nkon",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant stop reordering.",v:true},
  {n:"Okon",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. will be back.",v:true},

  // 1
  {n:"Pkon",p:"Sample Pack",s:5,t:"nice one",x:"nice one. quality was excellent.",v:true},

  // 4
  {n:"Qkon",p:"Bulk Pack",s:5,t:"bulk on point",x:"bulk on point. quality consistent.",v:true},
  {n:"Rkon",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},
  {n:"Skon",p:"Standard Pack",s:5,t:"fast ship",x:"fast ship. good quality. discreet box.",v:true},
  {n:"Tkon",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. going to pro pack.",v:true},

  // 2
  {n:"Ukon",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet.",v:true},
  {n:"Vkon",p:"Pro Pack",s:5,t:"hologram wow",x:"hologram wow. texture perfect. snap right.",v:true},

  // 6
  {n:"Wkon",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. five stars.",v:true},
  {n:"Xkon",p:"Sample Pack",s:5,t:"good",x:"good quality. will order more.",v:true},
  {n:"Ykon",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. every bill identical.",v:true},
  {n:"Zkon",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again.",v:true},
  {n:"Apax",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. fast. quality. discreet.",v:true},
  {n:"Bpax",p:"Sample Pack",s:5,t:"sample good",x:"sample good. converting to full pack.",v:true},

  // 3
  {n:"Cpax",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},
  {n:"Dpax",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Epax",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},

  // 4
  {n:"Fpax",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},
  {n:"Gpax",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},
  {n:"Hpax",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
  {n:"Ipax",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will return.",v:true},

  // 2
  {n:"Jpax",p:"Sample Pack",s:5,t:"sample great",x:"sample great. going pro pack.",v:true},
  {n:"Kpax",p:"Bulk Pack",s:5,t:"bulk delivered",x:"bulk delivered perfectly. every bill clean.",v:true},

  // 5
  {n:"Lpax",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},
  {n:"Mpax",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},
  {n:"Npax",p:"Sample Pack",s:5,t:"good",x:"good quality. ordering more.",v:true},
  {n:"Opax",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},
  {n:"Ppax",p:"Pro Pack",s:5,t:"hologram perfect",x:"hologram perfect. texture perfect.",v:true},

  // 3
  {n:"Qpax",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. fast. quality. discreet.",v:true},
  {n:"Rpax",p:"Sample Pack",s:5,t:"good",x:"good quality. will order more.",v:true},
  {n:"Spax",p:"Bulk Pack",s:5,t:"bulk delivered",x:"bulk delivered. every bill clean.",v:true},

  // 4
  {n:"Tpax",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},
  {n:"Upax",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Vpax",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},
  {n:"Wpax",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},

  // 2
  {n:"Xpax",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
  {n:"Ypax",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will return.",v:true},

  // 6
  {n:"Zpax",p:"Sample Pack",s:5,t:"sample great",x:"sample great. going pro pack.",v:true},
  {n:"Arat",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet.",v:true},
  {n:"Brat",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again.",v:true},
  {n:"Crat",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},
  {n:"Drat",p:"Sample Pack",s:5,t:"good",x:"good quality. ordering more.",v:true},
  {n:"Erat",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},

  // 3
  {n:"Frat",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Grat",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Hrat",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},

  // 5
  {n:"Irat",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},
  {n:"Jrat",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant stop reordering.",v:true},
  {n:"Krat",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. will be back.",v:true},
  {n:"Lrat",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. pro pack incoming.",v:true},
  {n:"Mrat",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. no defects. fast.",v:true},

  // 2
  {n:"Nrat",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},
  {n:"Orat",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},

  // 4 (one 4-star)
  {n:"Prat",p:"Sample Pack",s:4,t:"great quality, slight delay",x:"great quality. just one day past estimate. will order again.",v:true},
  {n:"Qrat",p:"Bulk Pack",s:5,t:"bulk on point",x:"bulk on point. quality consistent.",v:true},
  {n:"Rrat",p:"Pro Pack",s:5,t:"hologram wow",x:"hologram wow. texture perfect. snap right.",v:true},
  {n:"Srat",p:"Standard Pack",s:5,t:"good",x:"good product. fast delivery. will buy again.",v:true},

  // 3
  {n:"Trat",p:"Sample Pack",s:5,t:"sample converted me",x:"sample converted me. ordering pro pack.",v:true},
  {n:"Urat",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. every bill perfect.",v:true},
  {n:"Vrat",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again tonight.",v:true},

  // 1
  {n:"Wrat",p:"Standard Pack",s:5,t:"good",x:"good. fast. discreet. quality ok.",v:true},

  // 6
  {n:"Xrat",p:"Sample Pack",s:5,t:"nice one",x:"nice one. quality was excellent.",v:true},
  {n:"Yrat",p:"Bulk Pack",s:5,t:"bulk delivered",x:"bulk delivered perfectly. every bill clean.",v:true},
  {n:"Zrat",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality. five stars.",v:true},
  {n:"Afix",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Bfix",p:"Sample Pack",s:5,t:"good",x:"good quality. going bigger next time.",v:true},
  {n:"Cfix",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time i order.",v:true},

  // 4
  {n:"Dfix",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
  {n:"Efix",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will return.",v:true},
  {n:"Ffix",p:"Sample Pack",s:5,t:"sample great",x:"sample great. going pro pack.",v:true},
  {n:"Gfix",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet.",v:true},

  // 2
  {n:"Hfix",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again.",v:true},
  {n:"Ifix",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},

  // 5
  {n:"Jfix",p:"Sample Pack",s:5,t:"good",x:"good quality. ordering more.",v:true},
  {n:"Kfix",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},
  {n:"Lfix",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Mfix",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Nfix",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},

  // 3
  {n:"Ofix",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},
  {n:"Pfix",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant stop reordering.",v:true},
  {n:"Qfix",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. will be back.",v:true},

  // 4
  {n:"Rfix",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. pro pack incoming.",v:true},
  {n:"Sfix",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. no defects. fast.",v:true},
  {n:"Tfix",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},
  {n:"Ufix",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},

  // 2
  {n:"Vfix",p:"Sample Pack",s:5,t:"sample impressed",x:"sample impressed me. ordering the full pack.",v:true},
  {n:"Wfix",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},

  // 6
  {n:"Xfix",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Yfix",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Zfix",p:"Sample Pack",s:5,t:"good",x:"good quality. going bigger next order.",v:true},
  {n:"Anox",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time i order.",v:true},
  {n:"Bnox",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
  {n:"Cnox",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will return.",v:true},

  // 3
  {n:"Dnox",p:"Sample Pack",s:5,t:"sample great",x:"sample great. going pro pack.",v:true},
  {n:"Enox",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet.",v:true},
  {n:"Fnox",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again.",v:true},

  // 1 (4-star)
  {n:"Gnox",p:"Standard Pack",s:4,t:"quality great, one day late",x:"quality great. one day late vs estimate. nothing major. will order again.",v:true},

  // 4
  {n:"Hnox",p:"Sample Pack",s:5,t:"good",x:"good quality. ordering more.",v:true},
  {n:"Inox",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},
  {n:"Jnox",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Knox",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},

  // 2
  {n:"Lnox",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},
  {n:"Mnox",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},

  // 5
  {n:"Nnox",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant stop reordering.",v:true},
  {n:"Onox",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. will be back.",v:true},
  {n:"Pnox",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. pro pack incoming.",v:true},
  {n:"Qnox",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. no defects. fast.",v:true},
  {n:"Rnox",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},

  // 3
  {n:"Snox",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},
  {n:"Tnox",p:"Sample Pack",s:5,t:"sample impressed",x:"sample impressed me. ordering the full pack.",v:true},
  {n:"Unox",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},

  // 6
  {n:"Vnox",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Wnox",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Xnox",p:"Sample Pack",s:5,t:"good",x:"good quality. going bigger.",v:true},
  {n:"Ynox",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},
  {n:"Znox",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
  {n:"Avex",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will return.",v:true},

  // 4
  {n:"Bvex",p:"Sample Pack",s:5,t:"sample great",x:"sample great. going pro pack.",v:true},
  {n:"Cvex",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet.",v:true},
  {n:"Dvex",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again.",v:true},
  {n:"Evex",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},

  // 2
  {n:"Fvex",p:"Sample Pack",s:5,t:"good",x:"good quality. ordering more.",v:true},
  {n:"Gvex",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},

  // 3
  {n:"Hvex",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Ivex",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Jvex",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},

  // 5
  {n:"Kvex",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},
  {n:"Lvex",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant stop reordering.",v:true},
  {n:"Mvex",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. will be back.",v:true},
  {n:"Nvex",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. pro pack incoming.",v:true},
  {n:"Ovex",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. no defects. fast.",v:true},

  // 1
  {n:"Pvex",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},

  // 4
  {n:"Qvex",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},
  {n:"Rvex",p:"Sample Pack",s:5,t:"sample impressed",x:"sample impressed me. ordering the full pack.",v:true},
  {n:"Svex",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},
  {n:"Tvex",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},

  // 2
  {n:"Uvex",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Vvex",p:"Sample Pack",s:5,t:"good",x:"good quality. going bigger.",v:true},

  // 6
  {n:"Wvex",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},
  {n:"Xvex",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
  {n:"Yvex",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will return.",v:true},
  {n:"Zvex",p:"Sample Pack",s:5,t:"sample great",x:"sample great. going pro pack.",v:true},
  {n:"Ajax",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet.",v:true},
  {n:"Bjax",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again.",v:true},

  // 3
  {n:"Cjax",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},
  {n:"Djax",p:"Sample Pack",s:5,t:"good",x:"good quality. ordering more.",v:true},
  {n:"Ejax",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},

  // 4
  {n:"Fjax",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Gjax",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Hjax",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},
  {n:"Ijax",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},

  // 2
  {n:"Jjax",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant stop reordering.",v:true},
  {n:"Kjax",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. will be back.",v:true},

  // 5
  {n:"Ljax",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. pro pack incoming.",v:true},
  {n:"Mjax",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. no defects. fast.",v:true},
  {n:"Njax",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},
  {n:"Ojax",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},
  {n:"Pjax",p:"Sample Pack",s:5,t:"sample impressed",x:"sample impressed me. ordering the full pack.",v:true},

  // 3
  {n:"Qjax",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},
  {n:"Rjax",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Sjax",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},

  // 1 (4-star)
  {n:"Tjax",p:"Sample Pack",s:4,t:"quality ok, one day delay",x:"quality is ok. one day late vs estimate. will order again.",v:true},

  // 4
  {n:"Ujax",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},
  {n:"Vjax",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
  {n:"Wjax",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied customer. will return.",v:true},
  {n:"Xjax",p:"Sample Pack",s:5,t:"sample great",x:"sample great. going pro pack.",v:true},

  // 2
  {n:"Yjax",p:"Bulk Pack",s:5,t:"bulk perfect",x:"bulk perfect. fast and discreet.",v:true},
  {n:"Zjax",p:"Pro Pack",s:5,t:"extraordinary",x:"extraordinary quality. ordering again.",v:true},

  // 6
  {n:"Amox",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},
  {n:"Bmox",p:"Sample Pack",s:5,t:"good",x:"good quality. ordering more.",v:true},
  {n:"Cmox",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time.",v:true},
  {n:"Dmox",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Emox",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Fmox",p:"Sample Pack",s:5,t:"nice",x:"nice quality. impressed.",v:true},

  // 3
  {n:"Gmox",p:"Bulk Pack",s:5,t:"bulk no issues",x:"bulk no issues. every bill clean.",v:true},
  {n:"Hmox",p:"Pro Pack",s:5,t:"wow quality",x:"wow quality. cant stop reordering.",v:true},
  {n:"Imox",p:"Standard Pack",s:5,t:"satisfied",x:"satisfied. will be back.",v:true},

  // 4
  {n:"Jmox",p:"Sample Pack",s:5,t:"sample sold me",x:"sample sold me. pro pack incoming.",v:true},
  {n:"Kmox",p:"Bulk Pack",s:5,t:"bulk great",x:"bulk great. no defects. fast.",v:true},
  {n:"Lmox",p:"Pro Pack",s:5,t:"five stars",x:"five stars. extraordinary quality.",v:true},
  {n:"Mmox",p:"Standard Pack",s:5,t:"great",x:"great product. great delivery. happy.",v:true},

  // 2
  {n:"Nmox",p:"Sample Pack",s:5,t:"sample impressed",x:"sample impressed me. ordering the full pack.",v:true},
  {n:"Omox",p:"Bulk Pack",s:5,t:"bulk consistent",x:"bulk consistent. same quality every bill.",v:true},

  // 5
  {n:"Pmox",p:"Pro Pack",s:5,t:"perfect",x:"perfect order. perfect quality.",v:true},
  {n:"Qmox",p:"Standard Pack",s:5,t:"clean",x:"clean product. fast ship. happy.",v:true},
  {n:"Rmox",p:"Sample Pack",s:5,t:"good",x:"good quality. going bigger.",v:true},
  {n:"Smox",p:"Bulk Pack",s:5,t:"consistent",x:"consistent quality every time i order.",v:true},
  {n:"Tmox",p:"Pro Pack",s:5,t:"wow",x:"wow. just wow. quality is next level.",v:true},
];

/* =====================================================
   ROTATION ENGINE — VARIABLE 1-6 REVIEWS PER DAY
   Total entries: 1320
   The SCHEDULE array maps each entry index to a day offset.
   Days with 3-6 entries feel busier (recent days).
   Days with 1-2 entries feel quieter (older days).
   
   Pattern repeats every 360 days.
   Rotation: offset = daysSinceEpoch % 360
   Entry's real date = today minus its assigned dayOffset
   adjusted by rotation offset.
===================================================== */
/* =====================================================
   PROCEDURAL REVIEW GROWTH ALGORITHM
===================================================== */
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Generates realistic names
function generateProName(rand, text) {
    const isFr = text ? /(livraison|merci|reçu|parfait|rapide|qualité|vrai|billets|commande|bien)/i.test(text) : rand() < 0.3;

    const firstNamesEn = ['James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles','Christopher','Daniel','Matthew','Anthony','Mark','Donald','Steven','Paul','Andrew','Joshua','Kenneth','Kevin','Brian','George','Timothy','Ronald','Edward','Jason','Jeffrey','Ryan','Jacob','Gary','Nicholas','Eric','Jonathan','Stephen','Larry','Justin','Scott','Brandon','Benjamin','Samuel','Gregory','Alexander','Frank','Patrick','Raymond','Jack','Dennis','Jerry','Tyler','Aaron','Jose','Adam','Nathan','Henry','Douglas','Zachary','Peter','Kyle','Ethan','Walter','Noah','Jeremy','Christian','Keith','Roger','Terry','Gerald','Harold','Sean','Austin','Carl','Arthur','Lawrence','Dylan','Jesse','Jordan','Bryan','Billy','Joe','Bruce','Gabriel','Logan','Albert','Willie','Alan','Juan','Wayne','Elijah','Randy','Roy','Vincent','Ralph','Eugene','Russell','Louis','Philip','Bobby','Luke','Bradley','Mary','Patricia','Jennifer','Linda','Elizabeth','Barbara','Susan','Jessica','Sarah','Karen','Lisa','Nancy','Betty','Margaret','Sandra','Ashley','Kimberly','Emily','Donna','Michelle','Carol','Amanda','Dorothy','Melissa','Deborah','Stephanie','Rebecca','Sharon','Laura','Cynthia','Kathleen','Amy','Angela','Shirley','Anna','Brenda','Pamela','Emma','Nicole','Helen','Samantha','Katherine','Christine','Debra','Rachel','Carolyn','Janet','Catherine','Maria','Heather','Diane','Ruth','Julie','Olivia','Joyce','Virginia','Victoria','Kelly','Lauren','Christina','Joan','Evelyn','Judith','Megan','Andrea','Cheryl','Hannah','Jacqueline','Martha','Gloria','Teresa','Ann','Sara','Madison','Frances','Kathryn','Janice','Jean','Abigail','Alice','Julia','Judy','Sophia','Grace','Denise','Amber','Marilyn','Beverly','Danielle','Theresa','Isabella','Mia','Charlotte','Amelia','Harper','Avery','Lily','Chloe','Layla','Riley','Zoey','Nora','Eleanor','Lillian','Addison','Aubrey','Ellie','Stella','Natalie','Zoe','Leah','Hazel','Violet','Aurora','Savannah','Audrey','Brooklyn','Bella','Claire','Skylar','Ali','Mohamed','Omar','Hassan','Tariq','Yousef','Amir','Zayn','Jamal','Malik','Jackson','Aiden','Lucas','Caden','Mateo','Muhammad','Sebastian','Jayden','Elias','Levi','Grayson','Josiah','Caleb','Hunter','Landon','Christian','Isaiah','Oliver','Ezekiel','Micah','Ryder','Beau','Harrison','Declan','Weston','Rowan','Silas','Braxton','Gael','Emmett','Maddox','Camden','Cole','Kaiden','Maxwell','Finn','Tucker','Timothy','Jude','Wesley','Ivan','Elliot','Jaxon','Milo','Jasper','Ashton','Zion','Oscar','Kaleb','Archer','Leon','Knox','Dean','Gideon','Zane','Jett','Brooks','Dawson','Felix','Griffin','Lane','Zander','Cody','Cruz','Nash','Bradley','Tanner','Gage','Seth','Beckett','Zackary','Holden','Ronan','Wade','Warren','Louis','Titus','Kobe','Julius','Remington','Russell','Dallas','Sterling','Dante','Julien','Lane','Emanuel','Zayn','Derrick','Colby','Malachi','Orion','Gunnar','Colt','Beckham','Reid','Paxton','Sullivan','Keegan','Desmond','Kash','Gideon'];
    
    const firstNamesFr = ['Jean','Pierre','Michel','André','Philippe','René','Louis','Alain','Jacques','Bernard','Marcel','Claude','Marie','Jeanne','Françoise','Monique','Sylvie','Catherine','Nathalie','Isabelle','Jacqueline','Anne','Martine','Céline','Mathieu','Julien','Alexandre','Guillaume','Nicolas','Antoine','Thomas','Vincent','Sébastien','Aimé','Alban','Albert','Alexis','Alfred','Alphonse','Ambroise','Anatole','Antonin','Aristide','Armand','Arnaud','Arsène','Arthur','Auguste','Augustin','Aurélien','Baptiste','Barnabé','Barthélemy','Basile','Bastien','Baudouin','Benoît','Bertrand','Blaise','Brice','Bruno','Camille','Casimir','Cédric','Célestin','César','Christian','Christophe','Clément','Clovis','Colin','Côme','Corentin','Cyprien','Cyril','Damien','Daniel','David','Denis','Désiré','Didier','Dominique','Edgard','Edmond','Edouard','Elie','Eloi','Emile','Emmanuel','Eric','Ernest','Etienne','Eugène','Eustache','Fabien','Fabrice','Félix','Ferdinand','Fernand','Fiacre','Florent','Florian','François','Franck','Frédéric','Gabriel','Gaspard','Gaston','Gauthier','Gautier','Georges','Géraud','Gérard','Germain','Gervais','Ghislain','Gilbert','Gilles','Grégoire','Guilhem','Gustave','Guy','Hector','Henri','Hervé','Honoré','Hubert','Hugues','Ignace','Isidore','Jérémie','Jérôme','Joachim','Joseph','Jules','Juste','Justin','Kevin','Laurent','Lazare','Léon','Léonard','Léopold','Luc','Lucas','Lucien','Ludovic','Marc','Marin','Marius','Martin','Mathurin','Matthieu','Maurice','Maxime','Maximilien','Moïse','Nestor','Noël','Norbert','Octave','Odilon','Olivier','Olympe','Oscar','Pascal','Patrice','Paul','Paulin','Prosper','Quentin','Raoul','Raphaël','Raymond','Richard','Robert','Roch','Rodolphe','Roland','Romain','Roméo','Serge','Séverin','Simon','Sylvain','Tanguy','Théodore','Théophile','Thibault','Thierry','Timothée','Tristan','Urbain','Valentin','Valère','Victor','Xavier','Yves','Alice','Emma','Jade','Louise','Chloé','Léa','Manon','Rose','Lina','Eva','Léna','Ambre','Mia','Anna','Sarah','Juliette','Lou','Inès','Clara','Nina','Agathe','Zoe','Lucie','Julia','Lola','Romane','Margaux','Mathilde','Clemence','Alix','Charlotte','Noemie','Anais','Elise','Maelys','Oceanne','Melina','Apolline','Alicia','Marilou','Celestine','Mael','Hugo','Leo','Adam','Malo','Noa','Tom','Sacha','Gabin','Marius','Gaspard','Tiago','Malo','Victor','Aymeric','Celian','Eliott','Ethan','Ewan','Isaac','Kylian','Lenny','Liam','Loan','Milan','Naël','Nino','Noam','Sohan','Timéo','Yanis','Yanis','Aubin','Celian','Cyrian','Dorian','Elouan','Esteban','Flavian','Gautier','Joris','Kilian','Leandre','Lilian','Maceo','Maelan','Marceau','Maxence','Nathan','Nolan','Soren','Titouan','Yohann','Loic','Jocelyn','Emeric','Yvan','Mederic','Yannick','Pierrick','Gael','Tanguy','Mael','Malo','Gwen','Erwan','Yann'];
    
    const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Gomez','Phillips','Evans','Turner','Diaz','Parker','Cruz','Edwards','Collins','Reyes','Stewart','Morris','Morales','Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper','Peterson','Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward','Richardson','Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes','Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez','Tremblay','Gagnon','Roy','Cote','Bouchard','Gauthier','Morin','Lavoie','Fortin','Pelletier','Belanger','Levesque','Bergeron','Leblanc','Paquette','Girard','Simard','Boucher','Caron','Beaulieu','Cloutier','Ouellet','Dubois','Desjardins','Nadeau','Martel','Goulet','Poirier','Tardif','Bedard','St-Pierre','Lapointe','Lefebvre','Lessard','Boudreau','Richard','Michaud','Hebert','Desrochers','Dube','Landry','Poulin','Cormier','Plante','Dupuis','Baril','Gagné','Vachon','Drouin','Savard','Fournier','Leduc','Lemieux','Rousseau','Denis','Lachance','Beaudoin','Perron','Gosselin','Chen','Wong','Li','Chan','Singh','Kaur','Sharma','Ali','Khan','Ahmad','Hussain','Mahmoud','Ibrahim','Hassan','Mohamed','Cohen','Levy','Katz','Goldberg','Klein','Schmidt','Muller','Weber','Meyer','Wagner','Hoffmann','Becker','Gallo','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco','Silva','Santos','Oliveira','Souza','Rodrigues','Ferreira','Alves','Pereira','Lima','Gomes'];

    const cryptoKeywords = ['Anon','Ghost','BTC','XMR','Cipher','Stealth','Whale','HODL','Sat','Crypto','Node','Block','Chain','Hash','Zero','Monero','Satoshi','Ledger','Gwei','DeFi','ColdWallet','HashRate','Bull','AltCoin','Trezor','Nonce','Mining','Rig','Decentral','Web3','P2P','Fiat','BagHolder','Ape','Doge','Shib','Coin','Token','Wallet','Seed','Key','Private','Public','Tx','Mempool','Gas','Validator','DApp','SmartCon','Ledger','Trustless','Yield','Farming','Stake'];
    const proKeywords = ['Props','PropMaster','Director','Studio','Prod','Set','FilmMaker','Cinematic','Indie','FX','Visuals','ArtDept','VFX','Gaffer','SetDesign','PropHouse','Grip','Foley','SoundStage','Cinema','Film','Video','Shoot','Crew','Camera','Lighting','Lens','Red','Arri','DP','DoP','Producer','Editor','PostProd','CGI','Animation','Mocap','Rigging','GripDept','ArtDirector','Wardrobe','Costume','Makeup','Casting','Location','Scout','PA','AC','SoundMixer','BoomOp','Colorist','DIT','Script','Storyboard'];
    const streetKeywords = ['Plug','Cartel','King','Trap','Hustle','Cash','Stack','Money','Boss','Don','Flex','Bandz','G','Baller','Drip','Sauce','Fire','Savage','Valid','Goat','Lit','Guap','Cheddar','Bread','Paper','Dough','Mula','Dinero','Pesos','Bands','Racks','K','Stash','Vault','Safe','Bag','Secured','Hustler','Grind','CEO','Exec','Hunnid','Thou','Mil','Billion','Rich','Wealth','Lavish','Lux','Premium','Elite','Prime'];
    const gamerKeywords = ['Sniper','NoScope','Slayer','xX','TTV','TTV_','Gamer','Pro','Noob','Bot','Hack','Cheat','Aim','God','Beast','Monster','Demon','Ghost','Shadow','Ninja','Samurai','Viking','Knight','Mage','Rogue','Assassin','Hunter','Warrior','Tank','Healer','DPS','Carry','Support','Mid','Top','Jungle','ADC','Smurf','Main','OneTrick','OTP','Toxic','Salty','Rage','Quit','AFK','LFG','GG','WP','EZ','Clutch'];
    const randomKeywords = ['Neon','Dark','Light','Red','Blue','Green','Yellow','Black','White','Purple','Pink','Orange','Gold','Silver','Bronze','Iron','Steel','Wood','Stone','Fire','Water','Earth','Wind','Ice','Snow','Rain','Storm','Thunder','Lightning','Cloud','Sky','Star','Moon','Sun','Galaxy','Universe','Space','Time','Void','Abyss','Mango','Kiwi','Apple','Banana','Orange','Grape','Berry','Melon','Peach','Pear','Plum','Cherry','Lemon','Lime','Bear','Wolf','Fox','Lion','Tiger','Cat','Dog','Bird','Fish','Shark','Whale','Dolphin','Eagle','Hawk','Falcon','Owl','Raven','Crow'];
    const geoEn = ['VanCity','TO','416','604','905','WestCoast','EastCoast'];
    const geoFr = ['MTL','QC','514','450','418','Gatineau','Laval'];

    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];
    const roll = (chance) => rand() < chance;
    const rndChar = () => pick(chars);
    const rndNum = () => pick(nums);

    const firstName = pick(isFr ? firstNamesFr : firstNamesEn);
    const lastName = pick(lastNames);
    const initial = lastName.charAt(0);
    const geo = pick(isFr ? geoFr : geoEn);

    const rProf = rand();
    let pseudo = "";

    if (rProf < 0.35) {
        // 1. Normal (35%)
        const formats = [
            () => firstName + ' ' + lastName,
            () => firstName + ' ' + initial + '.',
            () => firstName.charAt(0) + '. ' + lastName,
            () => firstName + '_' + lastName,
            () => firstName.toLowerCase() + Math.floor(rand() * 99 + 1950)
        ];
        pseudo = pick(formats)();
    } 
    else if (rProf < 0.60) {
        // 2. Crypto/Privacy (25%)
        const kw = pick(cryptoKeywords);
        const formats = [
            () => 'Anon_' + Math.floor(rand() * 9999),
            () => kw + '_' + Math.floor(rand() * 999),
            () => '[Redacted]',
            () => 'Guest_' + Math.floor(rand() * 99999),
            () => rndChar() + rndChar() + rndChar() + rndChar(),
            () => isFr ? 'AcheteurVerifie' : 'VerifiedBuyer',
            () => kw + rndNum() + rndNum()
        ];
        pseudo = pick(formats)();
    }
    else if (rProf < 0.75) {
        // 3. Hustle/Street (15%)
        const kw = pick(streetKeywords);
        const formats = [
            () => geo + '_' + kw,
            () => kw + 'Star',
            () => firstName + '_' + kw,
            () => kw + rndNum() + rndNum()
        ];
        pseudo = pick(formats)();
    }
    else if (rProf < 0.85) {
        // 4. Professional (10%)
        const kw = pick(proKeywords);
        const formats = [
            () => kw + '_' + geo,
            () => 'Indie' + kw,
            () => kw + '_' + firstName,
            () => lastName + '_' + kw
        ];
        pseudo = pick(formats)();
    }
    else if (rProf < 0.92) {
        // 5. Gamer (7%)
        const kw = pick(gamerKeywords);
        const formats = [
            () => 'xX_' + kw + '_Xx',
            () => kw + rndNum() + rndNum() + rndNum(),
            () => pick(['TTV_','FaZe_','OpTic_']) + kw,
            () => kw + '_' + firstName
        ];
        pseudo = pick(formats)();
    }
    else if (rProf < 0.98) {
        // 6. Abstract/Random (6%)
        const kw1 = pick(randomKeywords);
        const kw2 = pick(randomKeywords);
        const formats = [
            () => kw1 + kw2,
            () => kw1 + kw2 + rndNum() + rndNum(),
            () => kw1 + '_' + kw2
        ];
        pseudo = pick(formats)();
    }
    else {
        // 7. Burner (2%)
        const formats = [
            () => 'user_' + rndChar() + rndChar() + rndNum() + rndNum(),
            () => rndChar() + rndChar() + rndChar() + rndChar() + rndChar() + rndChar() + rndChar(),
            () => firstName.toLowerCase() + 'test',
            () => rndChar() + 'we' + rndNum() + rndNum()
        ];
        pseudo = pick(formats)();
    }

    if (roll(0.15)) {
        pseudo = pseudo.toLowerCase();
    } else if (roll(0.02)) {
        pseudo = pseudo.toUpperCase();
    }
    
    if (roll(0.02)) {
        const emojis = ['👻','💸','🎬','🚀','🔥','💯','🤫','🔥','🔥','💰','🙏','😎','👑'];
        pseudo += ' ' + pick(emojis);
    }

    return pseudo;
}

function buildDatabase(){
  const EPOCH = new Date('2024-01-01T00:00:00Z').getTime();
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayMs = today.getTime();
  const daysSinceEpoch = Math.floor((todayMs - EPOCH) / 86400000);
  const CYCLE = 360;
  const offset = daysSinceEpoch % CYCLE;
  
  let combinedFeed = [];
  
  // 1) RESTORE THE ORIGINAL 1323 REVIEWS EXACTLY AS THEY WERE
  // We use the original rotating logic so they always stay fresh within the last 360 days.
  const entries = MASTER.length;
  const pattern = [3,2,4,3,2,1,3,4,2,3,2,3,1,4,2,3,2,4,3,1,2,3,4,2,3,1,3,2,4,3,
                   2,3,4,1,3,2,3,4,2,1,3,2,4,3,2,3,1,4,2,3,4,2,3,1,3,2,4,3,2,3,
                   4,1,2,3,4,2,3,2,1,3,4,2,3,4,1,3,2,3,4,2,3,1,2,4,3,2,3,4,1,3,
                   2,3,4,2,1,3,2,4,3,2,3,4,1,3,2,3,2,4,3,1,2,3,4,2,3,1,3,4,2,3,
                   5,3,4,6,2,3,5,4,3,2,6,3,4,5,2,3,4,6,3,5,2,4,3,6,5,3,2,4,5,3,
                   6,2,3,5,4,3,6,2,5,3,4,6,3,2,5,4,3,6,5,2,3,4,6,3,5,2,4,3,6,5];

  const dayOffsets = [];
  let day_idx = 0;
  let pi  = 0;
  while(dayOffsets.length < entries){
    const count = pattern[pi % pattern.length];
    for(let k = 0; k < count && dayOffsets.length < entries; k++){
      dayOffsets.push(day_idx);
    }
    day_idx++;
    pi++;
  }

  // Add the 1323 original reviews to the feed
  MASTER.forEach((r, i) => {
    const rawDay = dayOffsets[i];
    const daysAgo = (rawDay - offset + CYCLE * 4) % CYCLE;
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    
    // Randomize time of day so they don't all say 00:00:00
    const randTime = mulberry32(i + 999);
    // Time window: 10:00 AM to 3:00 AM (17-hour window = 1020 minutes)
    const totalMin = 600 + Math.floor(randTime() * 1020);
    d.setHours(Math.floor(totalMin / 60) % 24, totalMin % 60, Math.floor(randTime() * 60));
    
    combinedFeed.push({
        name: generateProName(randTime, r.x),
        pack: r.p,
        stars: r.s,
        title: r.t,
        text: r.x,
        date: d.toISOString(),
        verified: r.v
    });
  });
  
  // 2) ADD NEW PROCEDURAL REVIEWS TO SIMULATE REALISTIC GROWTH
  let proceduralCount = 0;
  
  for(let i = 0; i <= daysSinceEpoch; i++) {
      const rand = mulberry32(i + 42069);
      
      // Daily growth: 1 to 3 reviews per day
      const dailyNew = Math.floor(rand() * 3) + 3; // 3 to 5 reviews per day
      proceduralCount += dailyNew;
      
      // To save memory, only inject procedural reviews from the last 60 days into the active feed
      if (daysSinceEpoch - i <= 60) {
          for(let j = 0; j < dailyNew; j++) {
              const revRand = mulberry32((i + 12345) * 100 + j);
              
              // Pick a random text from MASTER
              const masterIdx = Math.floor(revRand() * MASTER.length);
              const baseRev = MASTER[masterIdx];
              
              // Time window: 10:00 AM (36000000 ms) to 3:00 AM next day (+17h = 61200000 ms)
              const revDate = new Date(EPOCH + (i * 86400000) + 36000000 + Math.floor(revRand() * 61200000));
              const newName = generateProName(revRand, baseRev.x);
              
              const packs = ["Sample Pack", "Standard Pack", "Pro Pack", "Mid Pack", "Large Pack", "Bulk Pack"];
              const finalPack = (revRand() < 0.7) ? baseRev.p : packs[Math.floor(revRand() * packs.length)];
              
              combinedFeed.push({
                  name: newName,
                  pack: finalPack,
                  stars: baseRev.s,
                  title: baseRev.t,
                  text: baseRev.x,
                  date: revDate.toISOString(),
                  verified: true
              });
          }
      }
  }
  
  // Sort combined feed: newest first
  combinedFeed.sort((a,b) => new Date(b.date) - new Date(a.date));
  
  // Total Count = 1323 (Original) + proceduralCount (New Growth)
  combinedFeed._totalProcedural = MASTER.length + proceduralCount;
  
  return combinedFeed;
}
