'use strict'

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('Delivery');


const getData = async function(url) {


  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
  }

  return await response.json();

};

getData('./db/partners.json');

function validName (str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
};

function toggleModal() {
  modal.classList.toggle("is-open");
};

function toogleModalAuth() {
  modalAuth.classList.toggle( 'is-open');
  if (modalAuth.classList.contains('is-open')) {
    disabledScroll();
  } else {
    enableScroll();
  }
};

function clearForm() {
  loginInput.style.borderColor = '';
  logInForm.reset();
};

function authorized() {

  function logOut() {
    login = null;

    localStorage.removeItem('Delivery')

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut)
};

function notAuthorized() {
  function logIn(event) {
    event.preventDefault();
    
    if(validName(loginInput.value)) {
      login = loginInput.value;

      localStorage.setItem('Delivery', login);
  
      toogleModalAuth();

      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      
      checkAuth();
    } else {
      loginInput.style.borderColor = '#ff0000';
      loginInput.value = '';
    }
    
  }

  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function(event) {
    if (event.target.classList.contains('is-open')) { 
      toogleModalAuth();
    }
  })
}


function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}




function createCardRestaurant({ image, kitchen, name, price, stars, products,time_of_delivery: timeOfDelivery }) {

  const card = `
    <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery}</span>
        </div>
        <div class="card-info">
          <div class="rating">${stars}</div>
          <div class="price">От ${price}</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>`;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);
}



function createCardGood({ description, id, image, name, price }) {

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price}</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}


function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
        cardsMenu.textContent = '';
        
        restaurant.dataset.products
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
        getData(`./db/${restaurant.dataset.products}`).then(function(data) {
          data.forEach(createCardGood);
        });
    }
  } else {
    toogleModalAuth();
  }

}

function init() {
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant)
  });
  
  buttonAuth.addEventListener('click', clearForm);
  
  cartButton.addEventListener("click", toggleModal);
  
  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })
  
  
  checkAuth();
  
  
  
  // slider
  
  new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    effect: 'flip',
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  })
}

init();