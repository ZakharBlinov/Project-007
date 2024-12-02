import {
    createPreLoader,
    createDeleteModal,
    createErrorServer,
  } from "./function.js";
  
  export async function postClientsServer(obj) {
    let btn = document.querySelector(".modal-btn");
    let loader = createPreLoader("loader-btn");
    btn.append(loader);
    let errorMessage = "Что-то пошло не так";
    try {
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
  
      if (response.ok) {
        createDeleteModal(".modal-wrapper", ".modal-inner");
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error(`Ошибка от сервера - ${error}`);
      createErrorServer(errorMessage);
    } finally {
      loader.remove();
    }
  }
  
  export async function changeClientInfo(client) {
    let btn = document.querySelector(".modal-btn");
    let loader = createPreLoader("loader-btn");
    btn.append(loader);
    let errorMessage = "Что-то пошло не так";
    try {
      const response = await fetch(
        `http://localhost:3000/api/clients/${client.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: client.name,
            surname: client.surname,
            lastName: client.lastName,
            updatedAt: client.updatedAt,
            contacts: client.contacts,
          }),
        }
      );
      if (response.ok) {
        createDeleteModal(".modal-wrapper", ".modal-inner");
        const data = await response.json();
        return data;
      }
    } catch (error) {
      createErrorServer(errorMessage);
      console.error(`Ошибка от сервера - ${error}`);
    } finally {
      loader.remove();
    }
  }
  
  export async function getClientsServer() {
    const table = document.querySelector('.table-body-app');
    const loader = createPreLoader("loader-table");
    table.append(loader);
    try {
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      loader.remove();
    }
  }
  
  export async function deleteClientServer(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "DELETE",
    });
  
    const date = await response.json();
  
    return date;
  }
  
  export async function getSearchServer(client) {
  
    try {
      const response = await fetch(
        `http://localhost:3000/api/clients/?search=${client.trim()}`
      );
  
      const data = response.json();
  
      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  }