import { createClient } from 'https://esm.sh/@supabase/supabase-js'
const supabase = createClient('https://txwcdojzbvkqskseufoe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d2Nkb2p6YnZrcXNrc2V1Zm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzYyODIsImV4cCI6MjA2NzcxMjI4Mn0.daiRfXm_6d8R_i9-tDMIMLS9YGtmvZ6yacQpQ94CLAU')
const form = document.getElementById('login-form')
const errorDiv = document.getElementById('auth-error')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const pseudo = form.pseudo.value.trim()
  const mdp = form.mdp.value.trim()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('pseudo', pseudo)
    .eq('mdp', mdp)
    .single()
  if (error || !data) {
    errorDiv.textContent = "Pseudo ou mot de passe incorrect"
  } else {
    sessionStorage.setItem('user', JSON.stringify(data))
    window.location = 'gogl.html'
  }
})