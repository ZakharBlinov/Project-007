const API_URL = 'http://localhost:3000/api/clients';
const clientTableBody = document.getElementById('clientTableBody');
const searchInput = document.getElementById('search');
const addClientBtn = document.getElementById('addClientBtn');
const clientModal = document.getElementById('clientModal');
const closeModalBtn = document.getElementById('closeModal');
const clientForm = document.getElementById('clientForm');
const contactsContainer = document.getElementById('contactsContainer');
const addContactBtn = document.getElementById('addContactBtn');
const deleteClientBtn = document.getElementById('deleteClientBtn');
let currentClientId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadClients();

  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadClients(searchInput.value);
    }, 300);
  });

  addClientBtn.addEventListener('click', () => {
    openClientModal();
  });
});

async function loadClients(search = '') {
  try {
    const response = await fetch(`${API_URL}?search=${encodeURIComponent(search)}`);
    const clients = await response.json();
    renderClientTable(clients);
  } catch (error) {
    console.error('Ошибка при загрузке клиентов:', error);
  }
}

function renderClientTable(clients) {
  clientTableBody.innerHTML = '';

  clients.forEach(client => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${client.id}</td>
      <td>${client.surname} ${client.name} ${client.lastName || ''}</td>
      <td>${new Date(client.createdAt).toLocaleString()}</td>
      <td>${new Date(client.updatedAt).toLocaleString()}</td>
      <td>${renderContacts(client.contacts)}</td>
      <td>
        <button class="edit-client-btn" data-id="${client.id}">Изменить</button>
        <button onclick="deleteClient('${client.id}')">Удалить</button>
      </td>
    `;

    clientTableBody.appendChild(row);
  });

  document.querySelectorAll('.edit-client-btn').forEach(button => {
    button.addEventListener('click', () => {
      editClient(button.dataset.id);
    });
  });
}

function renderContacts(contacts) {
  return contacts.map(contact => {
    return `<span onclick="copyToClipboard('${contact.value}')" title="${contact.type}: ${contact.value}">${getContactIcon(contact.type)}<span class="contact-tooltip">${contact.type}: ${contact.value}</span></span>`;
  }).join(' ');
}

function getContactIcon(type) {
  switch (type.toLowerCase()) {
    case 'телефон':
      return '📱';
    case 'email':
      return '📥';
    case 'vk':
      return '☢️';
    default:
      return '👤';
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Контакт скопирован в буфер обмена');
  }).catch(err => {
    console.error('Ошибка при копировании:', err);
  });
}

function openClientModal(clientId = null) {
  clientModal.style.display = 'flex';
  currentClientId = clientId;
  if (clientId) {
    loadClientData(clientId);
    document.getElementById('modalTitle').innerText = 'Изменить клиента';
    deleteClientBtn.style.display = 'inline-block';
  } else {
    clientForm.reset();
    contactsContainer.querySelectorAll('.contact-item').forEach(item => item.remove());
    document.getElementById('modalTitle').innerText = 'Добавить клиента';
    deleteClientBtn.style.display = 'none';
  }
}

function editClient(currentClientId){
  openClientModal(currentClientId)
}

closeModalBtn.addEventListener('click', () => {
  clientModal.style.display = 'none';
});

window.onclick = function(event) {
  if (event.target == clientModal) {
    clientModal.style.display = 'none';
  }
}

addContactBtn.addEventListener('click', () => {
  if (contactsContainer.querySelectorAll('.contact-item').length < 10) {
    const contactItem = document.createElement('div');
    contactItem.classList.add('contact-item');
    contactItem.innerHTML = `
      <select class="contact-type" required>
        <option value="телефон">Телефон</option>
        <option value="email">Email</option>
        <option value="vk">VK</option>
        <option value="другое">Другое</option>
      </select>
      <input type="text" class="contact-value" placeholder="Значение контакта" required>
      <button type="button" onclick="this.parentElement.remove()">Удалить</button>
    `;
    contactsContainer.appendChild(contactItem);
  }
});

clientForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    name: clientForm.name.value,
    surname: clientForm.surname.value,
    lastName: clientForm.lastName.value,
    contacts: []
  };

  contactsContainer.querySelectorAll('.contact-item').forEach(contactItem => {
    formData.contacts.push({
      type: contactItem.querySelector('.contact-type').value,
      value: contactItem.querySelector('.contact-value').value
    });
  });

  try {
    let response;
    if (currentClientId) {
      response = await fetch(`${API_URL}/${currentClientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
    } else {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
    }

    if (response.ok) {
      clientModal.style.display = 'none';
      loadClients();
    } else {
      const errorData = await response.json();
      alert(`Ошибка: ${errorData.message || 'Не удалось сохранить клиента'}`);
    }
  } catch (error) {
    console.error('Ошибка при сохранении клиента:', error);
    alert('Ошибка при сохранении клиента');
  }
});

async function loadClientData(clientId) {
  try {
    const response = await fetch(`${API_URL}/${clientId}`);
    if (response.ok) {
      const client = await response.json();
      clientForm.name.value = client.name;
      clientForm.surname.value = client.surname;
      clientForm.lastName.value = client.lastName;
      contactsContainer.querySelectorAll('.contact-item').forEach(item => item.remove());
      client.contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.classList.add('contact-item');
        contactItem.innerHTML = `
          <select class="contact-type" required>
            <option value="телефон" ${contact.type === 'телефон' ? 'selected' : ''}>Телефон</option>
            <option value="email" ${contact.type === 'email' ? 'selected' : ''}>Email</option>
            <option value="vk" ${contact.type === 'vk' ? 'selected' : ''}>VK</option>
            <option value="другое" ${contact.type === 'другое' ? 'selected' : ''}>Другое</option>
          </select>
          <input type="text" class="contact-value" value="${contact.value}" placeholder="Значение контакта" required>
          <button type="button" onclick="this.parentElement.remove()">Удалить</button>
        `;
        contactsContainer.appendChild(contactItem);
      });
      clientModal.style.display = 'flex';
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных клиента:', error);
  }
}

async function deleteClient(clientId) {
  if (confirm('Вы уверены, что хотите удалить клиента?')) {
    try {
      await fetch(`${API_URL}/${clientId}`, { method: 'DELETE' });
      loadClients();
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error);
    }
  }
}

deleteClientBtn.addEventListener('click', async () => {
  if (currentClientId && confirm('Вы уверены, что хотите удалить клиента?')) {
    try {
      await fetch(`${API_URL}/${currentClientId}`, { method: 'DELETE' });
      clientModal.style.display = 'none';
      loadClients();
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error);
    }
  }
});