// supabase/functions/send-notification/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

// Récupère les clés VAPID depuis les secrets du projet Supabase
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Configure web-push
webpush.setVapidDetails(
  'mailto:antoineburonfosse@hotmail.com', // 
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

Deno.serve(async (req) => {
  try {
    const { targetUserId, notification } = await req.json()

    // On a besoin d'un client Supabase avec les droits "service_role" pour lire la table joueurs
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Récupère l'abonnement push de la cible
    const { data: joueur, error } = await supabaseAdmin
      .from('joueurs')
      .select('push_subscription')
      .eq('id', targetUserId)
      .single()

    if (error || !joueur || !joueur.push_subscription) {
      console.warn(`Abonnement non trouvé pour l'utilisateur ${targetUserId}`)
      return new Response(JSON.stringify({ message: 'Abonnement non trouvé.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Envoie la notification
    await webpush.sendNotification(
      joueur.push_subscription,
      JSON.stringify(notification)
    )

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    if (err.statusCode === 410) {
        console.log('Abonnement expiré, suppression...');
        const { targetUserId } = await req.json();
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabaseAdmin.from('joueurs').update({ push_subscription: null }).eq('id', targetUserId);
    } else {
        console.error('Erreur dans la Edge Function:', err)
    }
    
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
