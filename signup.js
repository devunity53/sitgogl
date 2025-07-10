import { createClient } from 'https://esm.sh/@supabase/supabase-js'
const supabase = createClient('https://txwcdojzbvkqskseufoe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d2Nkb2p6YnZrcXNrc2V1Zm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzYyODIsImV4cCI6MjA2NzcxMjI4Mn0.daiRfXm_6d8R_i9-tDMIMLS9YGtmvZ6yacQpQ94CLAU')
const form = document.getElementById('signup-form')
const errorDiv = document.getElementById('auth-error')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const pseudo = form.pseudo.value.trim()
  const mdp = form.mdp.value.trim()
  const { data: exists } = await supabase
    .from('users')
    .select('id')
    .eq('pseudo', pseudo)
    .single()
  if (exists) {
    errorDiv.textContent = "Ce pseudo existe déjà"
    return
  }
  const { error } = await supabase
    .from('users')
    .insert([{ pseudo, mdp }])
  if (error) {
    errorDiv.textContent = "Erreur lors de la création du compte"
  } else {
    window.location = 'login.html'
  }
})