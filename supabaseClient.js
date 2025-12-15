// supabaseClient.js
// Connexion à Supabase

// ⚠️ IMPORTANT : Remplacez ces valeurs par VOS clés Supabase
const SUPABASE_URL = 'https://dwzcykmqftsgkhctpxby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3emN5a21xZnRzZ2toY3RweGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ2MDgsImV4cCI6MjA4MTEwMDYwOH0.4_zYG9Mm7QtiG6MVcfWZsrfLH24cQODISocoUKfNzj0';

// Fonction pour faire des requêtes à Supabase
async function supabaseQuery(table, method = 'GET', data = null, filter = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filter}`;
  
  const options = {
    method: method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };
  
  if (data && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  return await response.json();
}

// Fonctions utilitaires
async function supabaseInsert(table, data) {
  return await supabaseQuery(table, 'POST', data);
}

async function supabaseSelect(table, filter = '') {
  return await supabaseQuery(table, 'GET', null, filter);
}

async function supabaseUpdate(table, data, filter) {
  return await supabaseQuery(table, 'PATCH', data, filter);
}
// Fonction pour supprimer des données
async function supabaseDelete(table, filter) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${filter}`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Erreur suppression: ${response.status}`);
    }

    return true;
}
