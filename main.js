'use strict';

/**
 * @class Contact
 */
class Contact {
  /**
   * Создание экземпляра класса NewContact
   * @param {string} name имя
   * @param {string} lastName фамилия
   * @param {string} phone телефон
   * @param {int} id ID
   */
  constructor(name, lastName, phone, id) {
    this.name = name;
    this.lastName =lastName;
    this.phone = phone;
    this.id = id;
  }
  /**
   * Получение HTML елемента контакта
   * @returns {HTMLElement} HTML елемент контакта
   */
  getHTML() {
    const container = this.createContainer();
    container.appendChild(this.createAvatar());
    container.appendChild(this.createNameAndLastNameAndPhone());
    container.appendChild(this.createDelBtn());
    return container;
  }
  /**
   * Создание контэйнера контакта
   * @returns  {HTMLElement} HTML елемент контэйнера
   */
  createContainer() {
    const container = document.createElement('div');
    container.classList.add('contact-list-contact');
    container.setAttribute('id', this.id);
    return container;
  }
  /**
   * Создание контэйнера с аватаром
   * @returns  {HTMLElement} HTML елемент контэйнера с аватаром
   */
  createAvatar() {
    const avatar = document.createElement('div');
    avatar.classList.add('contact-list-contact-avatar');
    avatar.textContent = `${this.lastName[0]}${this.name[0]}`;
    return avatar;
  }
  /**
   * Создание контэйнера с именем и телефоном
   * @returns  {HTMLElement} HTML елемент контэйнера с именем и телефоном
   */
  createNameAndLastNameAndPhone() {
    const divName = document.createElement('div');
    const name = document.createElement('p');
    const phone = document.createElement('a');
    divName.classList.add('contact-list-name');    
    name.textContent = `${this.lastName} ${this.name}`;
    phone.setAttribute('href', `tel:${this.phone}`);    
    phone.textContent = `${this.phone}`;
    divName.appendChild(name);
    divName.appendChild(phone);    
    return divName;
  }
  /**
   * Создание контэйнера с кнопкой для удаления контакта
   * @returns  {HTMLElement} HTML елемент контэйнера с кнопкой для удаления контакта
   */
  createDelBtn() {
    const btn = document.createElement('button');
    btn.classList.add('contact-list-delete-btn');
    btn.innerHTML = '&times;';
    return btn;
  }
}
class ContactList {
  /**
   * Создание экземпляра класса ContactList
   * @param {any} elem HTML елемент контейнер для списка контактов
   */
  constructor(elem) {
    this.containerList = document.querySelector(elem);
    this.contacts = [];
    // this.numberID = 0;
    if (localStorage.getItem('contacts')) {
      JSON.parse(localStorage.getItem('contacts')).forEach(function (item) {
        this.add(new Contact(item.name, item.lastName, item.phone, this.getIdOfContact()));
      }, this)
    }
    this.containerList.addEventListener('click', e => this.removeContact(e));
  }
  /**
   * Добавление контакта в массив контактов
   * прерывание если контакт уже существует
   * @param {Object} новый контакт, экземпляр класса Contact
   */
  add(contact) {
    if (this.contacts.some(function (item) {
      return item.name === contact.name
      && item.lastName === contact.lastName
      && item.phone === contact.phone;
    })) return alert('Такой контакт уже существует');
    this.contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
    this.render();
  }
  /**
   * Отображение списка контактов на странице
   */
  render() {
    this.containerList.innerHTML = '';
    if (!this.contacts.length) {
      this.containerList.appendChild(this.createEmptyText());
    } else {
      this.contacts
        .sort(function (a, b) {
          if (a.lastName > b.lastName) {
            return 1;
          } else if (a.lastName < b.lastName) {
            return -1;
          } else {
            return 0;
          }
        })
        .forEach(function (item) {
          this.containerList.appendChild(item.getHTML());
        }, this)
    }    
  }
  /**
   * Создание текста оповещения о том, что список пуст.
   * @returns {HTMLElement} текст оповещения о том, что список пуст
   */
  createEmptyText() {
    const p = document.createElement('p');
    p.classList.add('contact-list-empty-text');
    p.textContent = 'Ваш список контактов пуст';
    return p;
  }
  /**
   * Обработчик события клика мыши для удаления контакта
   * @param {any} e событие клика мышью
   */
  removeContact(e) {
    if (e.target.className !== 'contact-list-delete-btn') return;
    for (let item of this.contacts) {
      if (+e.target.parentNode.attributes.id.value === item.id) {
        this.contacts.splice(this.contacts.indexOf(item), 1);
        break;
      }
    }
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
    this.render();
  }
  /**
   * Получение номера контакта
   * @returns {int} номер контакта
   */
  getIdOfContact() {
    let id = 0;
    while (this.contacts.some(item => item.id === id)) {
      id++;
    }
    return id;
  }
}
/**
 * @class ContactForm
 */
class ContactForm {
  /**
   * Creates an instance of ContactForm.
   * @param {Object} contactList экземпляр класса ContactList
   * @param {string} contactForm id элемента формы
   * @param {string} btnAdd id элемента кнопки добавления контакта
   * @param {string} name id элемента имени контакта
   * @param {string} lastName id элемента фамилии контакта
   * @param {string} phone id элемента телефона контакта
   */
  constructor(contactList, contactForm, btnAdd, name, lastName, phone) {
    this.contactList = contactList;
    this.form = document.querySelector(contactForm);
    this.name = this.form.querySelector(name);
    this.lastName = this.form.querySelector(lastName);
    this.phone = this.form.querySelector(phone);
    this.form.querySelector(btnAdd).addEventListener('click', e => this.btnAddHandler(e));
  }
  /**
   * Обработчик события клика мыши для добавления контакта
   * @param {MouseEvent} e событие клика мышью
   */
  btnAddHandler(e) {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }
    const contact = new Contact(
      this.name.value,
      this.lastName.value,
      this.phone.value,
      this.contactList.getIdOfContact()
    );
    this.contactList.add(contact);
  }
  /**
   * Прверка валидности введенных данных
   * @returns {boolean} true если все верно, false если нет
   */
  isValid() {
    const validName = this.isValidName();
    const validLastName = this.isValidLastName();
    const validPhone = this.isValidPhone();
    return validName && validLastName && validPhone;
  }
  /**
   * Прверка валидности имени
   * @returns {boolean} true если все верно, false если нет
   */
  isValidName() {
    const template = /^[a-zA-zа-яА-Я]{1,50}$/g;
    if (!template.test(this.name.value)) {
      this.createError(this.name);
      return false;
    }
    this.deleteError(this.name);
    return true;
  }
  /**
   * Прверка валидности фамилии
   * @returns {boolean} true если все верно, false если нет
   */
  isValidLastName() {
    const template = /^[a-zA-zа-яА-Я]{1,50}$/g;
    if (!template.test(this.lastName.value)) {
      this.createError(this.lastName);
      return false;
    }
    this.deleteError(this.lastName);
    return true;
  }
  /**
   * Прверка валидности телефона
   * @returns {boolean} true если все верно, false если нет
   */
  isValidPhone() {
    const template = /^((\+?7|8)[ \-]?){1}((\(\d{3}\))|(\d{3})){1}([ \-])?(\d{3}[\- ]?\d{2}[\- ]?\d{2})$/g;
    if (!template.test(this.phone.value)) {
      this.createError(this.phone);
      return false;
    }
    this.deleteError(this.phone);
    return true;
  }
  /**
   * Отображение ошибки о неправильности заполненного поля
   * @param {HTMLElement} elem  проверяемое поле формы
   */
  createError(elem) {
    elem.style.borderColor = 'red';
    elem.nextSibling.nextSibling.style.display = 'block';
  }
  /**
   * Удаление ошибки о неправильности заполненного поля
   * @param {HTMLElement} elem проверяемое поле формы
   */
  deleteError(elem) {
    elem.style.borderColor = '#797979';
    elem.nextSibling.nextSibling.style.display = 'none';
  }
}

window.addEventListener('load', () => {
  const contactList = new ContactList('#contact-list');
  contactList.render();
  const form = new ContactForm(contactList, '#contact-form', '#btn-add-contact', '#name', '#last-name', '#phone');
})
