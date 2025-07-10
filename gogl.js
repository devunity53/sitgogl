import { createClient } from 'https://esm.sh/@supabase/supabase-js'
const supabase = createClient('https://txwcdojzbvkqskseufoe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d2Nkb2p6YnZrcXNrc2V1Zm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzYyODIsImV4cCI6MjA2NzcxMjI4Mn0.daiRfXm_6d8R_i9-tDMIMLS9YGtmvZ6yacQpQ94CLAU')
const user = JSON.parse(sessionStorage.getItem('user'))
if (!user) window.location = 'login.html'

const logoutBtn = document.getElementById('logout-btn')
const messageList = document.getElementById('message-list')
const messageInput = document.getElementById('message-input')
const sendBtn = document.getElementById('send-btn')
const destinataireSelect = document.getElementById('destinataire-select')

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('user')
  window.location = 'login.html'
})

async function loadUsers() {
  const { data } = await supabase.from('users').select('pseudo')
  destinataireSelect.innerHTML = '<option value="">Choisir un destinataire</option>'
  data.filter(u => u.pseudo !== user.pseudo).forEach(u => {
    const opt = document.createElement('option')
    opt.value = u.pseudo
    opt.textContent = u.pseudo
    destinataireSelect.appendChild(opt)
  })
}

async function loadMessages() {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .or(`expediteur.eq.${user.pseudo},destinataire.eq.${user.pseudo}`)
    .order('id', { ascending: true })
  messageList.innerHTML = ''
  data.forEach(msg => {
    let exp = msg.expediteur === user.pseudo ? "Vous" : msg.expediteur
    let dest = msg.destinataire === user.pseudo ? "Vous" : msg.destinataire
    const div = document.createElement('div')
    div.className = 'message'
    div.textContent = `[${exp} → ${dest}] ${msg.message}`
    messageList.appendChild(div)
  })
  messageList.scrollTop = messageList.scrollHeight
}

sendBtn.addEventListener('click', async () => {
  const content = messageInput.value.trim()
  const destinataire = destinataireSelect.value
  if (!content || !destinataire) return
  await supabase.from('messages').insert([{ message: content, expediteur: user.pseudo, destinataire }])
  messageInput.value = ''
  loadMessages()
})

loadUsers()
loadMessages()

// --- Realtime pour nouveaux messages ---
const channel = supabase
  .channel('realtime-messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
    },
    (payload) => {
      const msg = payload.new
      // Affiche seulement si je suis concerné
      if (
        msg.expediteur === user.pseudo ||
        msg.destinataire === user.pseudo
      ) {
        let exp = msg.expediteur === user.pseudo ? "Vous" : msg.expediteur
        let dest = msg.destinataire === user.pseudo ? "Vous" : msg.destinataire
        const div = document.createElement('div')
        div.className = 'message'
        div.textContent = `[${exp} → ${dest}] ${msg.message}`
        messageList.appendChild(div)
        messageList.scrollTop = messageList.scrollHeight
      }
    }
  )
  .subscribe()
