// Webhook Stripe : active Jade+ ou le pack Fondateur après un paiement confirmé.
// Secrets : STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Les liens de paiement doivent porter client_reference_id = identifiant du compte Jade (ajouté par le site).
import Stripe from 'https://esm.sh/stripe@17?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { httpClient: Stripe.createFetchHttpClient() });
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const DAY = 864e5;
// Montant payé (centimes) → offre.
const OFFER: Record<number, { offer: string; days: number }> = { 499: { offer: 'plus_m', days: 31 }, 3999: { offer: 'plus_y', days: 366 }, 1499: { offer: 'founder', days: 90 } };
Deno.serve(async req => {
  let ev: Stripe.Event;
  try { ev = await stripe.webhooks.constructEventAsync(await req.text(), req.headers.get('stripe-signature')!, Deno.env.get('STRIPE_WEBHOOK_SECRET')!, undefined, Stripe.createSubtleCryptoProvider()); }
  catch (e) { return new Response('signature invalide', { status: 400 }); }
  if (ev.type === 'checkout.session.completed') {
    const s = ev.data.object as Stripe.Checkout.Session; const uid = s.client_reference_id; const o = OFFER[s.amount_total ?? 0];
    if (uid && o) {
      await db.from('purchases').upsert({ user_id: uid, offer: o.offer, price: (s.amount_total ?? 0) / 100, stripe_session: s.id }, { onConflict: 'stripe_session' });
      const { data: cur } = await db.from('subscriptions').select('until').eq('user_id', uid).maybeSingle();
      const base = cur && Date.parse(cur.until) > Date.now() ? Date.parse(cur.until) : Date.now();
      await db.from('subscriptions').upsert({ user_id: uid, offer: o.offer, until: new Date(base + o.days * DAY).toISOString(), renew: o.offer !== 'founder', source: 'stripe', stripe_customer: String(s.customer ?? ''), stripe_subscription: String(s.subscription ?? ''), updated_at: new Date().toISOString() });
    }
  }
  if (ev.type === 'invoice.paid') {
    const inv = ev.data.object as Stripe.Invoice; const sub = String(inv.subscription ?? ''); const end = inv.lines.data[0]?.period?.end;
    if (sub && end) await db.from('subscriptions').update({ until: new Date(end * 1000).toISOString(), renew: true, updated_at: new Date().toISOString() }).eq('stripe_subscription', sub);
  }
  if (ev.type === 'customer.subscription.updated' || ev.type === 'customer.subscription.deleted') {
    const sub = ev.data.object as Stripe.Subscription;
    await db.from('subscriptions').update({ renew: ev.type === 'customer.subscription.updated' && !sub.cancel_at_period_end, updated_at: new Date().toISOString() }).eq('stripe_subscription', sub.id);
  }
  return new Response('ok');
});
