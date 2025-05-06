document.addEventListener("DOMContentLoaded", () => {
  const btnListar = document.getElementById("listarContatos");
  const contactList = document.getElementById("contactList");
  const chatTitle = document.getElementById("chatTitle");
  const chatMessages = document.getElementById("chatMessages");

  btnListar.addEventListener("click", loadContacts);

  function loadContacts() {
    fetch("http://localhost:8080/v1/whatsapp/contatos/11987876567")
      .then(response => response.json())
      .then(data => {
        contactList.innerHTML = "";
        data.forEach(contact => {
          const div = document.createElement("div");
          div.classList.add("contact");
          div.textContent = contact.name;
          div.addEventListener("click", () => loadConversation(contact.name));
          contactList.appendChild(div);
        });
      })
      .catch(err => console.error("Erro ao carregar contatos:", err));
  }

  function loadConversation(contactName) {
    chatTitle.textContent = `Conversando com ${contactName}`;
    chatMessages.innerHTML = "";

    fetch("http://localhost:8080/v1/whatsapp/conversas/11987876567")
      .then(response => response.json())
      .then(conversas => {
        const conversa = conversas.find(c => c.name === contactName);
        if (!conversa) {
          chatMessages.innerHTML = "<p>Nenhuma conversa encontrada.</p>";
          return;
        }

        conversa.messages.forEach(msg => {
          const div = document.createElement("div");
          div.classList.add("message");
          div.classList.add(msg.sender === "me" ? "me" : "them");
          div.textContent = msg.content;
          chatMessages.appendChild(div);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
      })
      .catch(err => console.error("Erro ao carregar mensagens:", err));
  }
});
