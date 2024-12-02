import { createModalWindow, createFormNewClient, createTitleClient, createSaveBtn, createCancelBtn } from './modal.js';
import { clearModalInfo, getInfoClient } from './function.js';
import { validation } from './validationForm.js';
import { postClientsServer } from './api.js';
import { render, studentList } from '../main.js';

// Создаем кнопку добавления клиента
export function createBtnAddStudent() {
  const btn = document.createElement("button");
  btn.classList.add("btn-add");
  btn.textContent = "Добавить клиента";

  btn.addEventListener("click", function () {
    const form = createFormNewClient();
    const modalWindow = createModalWindow(
      "modal-wrapper",
      "modal-inner",
      createTitleClient("Новый контакт", "add-client"),
      form.$form,
      createSaveBtn(),
      createCancelBtn()
    );
    modalWindow.$modalWrapper.classList.add("open");
    modalWindow.$modalInner.classList.add("open");
    document.querySelector(".modal-add-btn").classList.remove("hide");
    clearModalInfo(); // чистим форму
    //Обрабочик события для формы
    form.$form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (validation(this)) {
        let serverDataObj = await postClientsServer(getInfoClient());
        studentList.push(serverDataObj);
        modalWindow.$modalWrapper.remove();
        render(studentList);
      }
    });
  });

  return btn;
}