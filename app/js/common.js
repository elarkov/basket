$(function() {

	// Custom JS

	let cartCont = document.querySelector('.cart__product'),
			asideCart = document.querySelector('.cart'),
			heightWindow = null,
			cartSum = document.querySelector('.cart__biling'),
			cartCircle = document.querySelector('.cart-circle'),
			orderCartBtn = document.querySelector('.btn-cart'),
			addP = document.querySelectorAll('.js-add-item');
			cartCircleText = document.querySelector('.cart-circle__btn'),
			cartData = getCartData() || {};

	function getCartData(){ //получить данные из localStorage
		return JSON.parse(localStorage.getItem('cart'));
	}

	function setCartData(o){ //записать данные в localStorage
		localStorage.setItem('cart', JSON.stringify(o));
		return false;
	}


	function makeListProduct(){ //функция отрисовывает данные добавленные в корзину
		let totalItems = '';

		if(cartData !== null){
			totalItems = `<ul class="shop-list">`;

			var sum = 0;

			for(var items in cartData){
				totalItems += `<li class="shop-list__item">`;
				totalItems += `<img class="btn-del" data-id="${items}" src="img/plus.png">`;
				for(let i = 0; i < cartData[items].length; i++){
					totalItems += `<div>${cartData[items][i]}</div>`;
				}
				sum += parseInt(cartData[items][1]);
				totalItems += `</li>`;
			}

			cartSum.innerHTML = sum;
			totalItems += `</ul>`;
			
			cartCont.innerHTML = totalItems;
			
			let delBtn = document.querySelectorAll('.btn-del');

			for(let i = 0; i < delBtn.length; i++){
				delBtn[i].addEventListener('click', function(e){
					if(e.target.className === 'btn-del'){
						var itemId = e.target.getAttribute('data-id');
						cartData = getCartData();
						
					let parent = delBtn[i].parentNode;
					parent.classList.add('js-hide');

					if(parent.classList.contains('js-hide')){
						let def = parent.textContent;
						let resDef = def.replace(/[^-0-9]/gim,'');
						cartSum.innerHTML = Number(cartSum.innerHTML) - Number(resDef);
					}
						delete cartData[itemId];
						setCartData(cartData);
					}
				});
			}
		} else {
			cartCont.innerHTML = 'В корзине пусто';
		}
	}

	makeListProduct();

	function addToCart(e){ //функция добавляет товар в корзину, при клике на кнопку "В корзину"
		parentBox = this.parentNode.parentNode,
		itemId = this.getAttribute('data-id'),
		itemTitle = parentBox.querySelector('.product-list__title').innerHTML,
		itemPrice = parentBox.querySelector('.product-list__digit').innerHTML;
		cartData[itemId] = [itemTitle, itemPrice];
		setCartData(cartData);

		makeListProduct();
	}

	function orderCart(){ //функция отображает добавленый товар в модальном окне

		var modal = document.querySelector('#myModal');
		var span = document.getElementsByClassName("modal__close")[0];
		var modalText = document.querySelector('.modal__product');
		var modalCount = document.querySelector('.modal__sell');

		modal.style.display = 'block';

		cartData = getCartData();

		if(cartData !== null){
			for(var items in cartData){
				modalText.innerHTML += `${cartData[items][0]}<br>`;
				modalCount.innerHTML = `на сумму: <span>${cartSum.innerHTML} руб.</span>`;
			}
		}

		span.addEventListener('click', function(){
			modal.style.display = 'none';
			modalText.innerHTML = '';
		});

		window.onclick = function(event) {
			if (event.target == modal) {
					modal.style.display = "none";
			}
		}
	}

	orderCartBtn.addEventListener('click', orderCart);

	for(let i = 0; i < addP.length; i++){
		addP[i].addEventListener('click', addToCart);
	}

	//раскоментировать что бы проверить очистку данных в localStorage(также кнопку раскомментировать в html)
	/*addEvent(document.querySelector('.clear-cart'), 'click', function(e){
		localStorage.removeItem('cart');
		cartCont.innerHTML = 'Корзина очищена';
		cartSum.innerHTML = 0;
	});*/


	//корзина прилипает к верху
	window.addEventListener('scroll', doScroll, false);
	document.body.addEventListener('scroll', doScroll, false);

	function doScroll(){
		if (heightWindow == null) {  // добавить потомка-обёртку, чтобы убрать зависимость с соседями
			let copyStyle = getComputedStyle(asideCart, ''), copyRes = '';
			for (let i = 0; i < copyStyle.length; i++) {  // перечислить стили CSS, которые нужно скопировать с родителя
				if (copyStyle[i].indexOf('padding') == 0 || copyStyle[i].indexOf('border') == 0 || copyStyle[i].indexOf('background') == 1) {
					copyRes += copyStyle[i] + ': ' +copyStyle.getPropertyValue(copyStyle[i]) + '; '
				}
			}
			heightWindow = document.createElement('div');  // создать потомка
			heightWindow.style.cssText = copyRes + ' box-sizing: border-box; width: ' + asideCart.offsetWidth + 'px;';
			asideCart.insertBefore(heightWindow, asideCart.firstChild);  // поместить потомка в цепляющийся блок первым
			let elemNodes = asideCart.childNodes.length;
			for (let i = 1; i < elemNodes; i++) {  // переместить во вновь созданного потомка всех остальных потомков (итого: создан потомок-обёртка, внутри которого по прежнему работают скрипты)
				heightWindow.appendChild(asideCart.childNodes[1]);
			}
			asideCart.style.height = heightWindow.getBoundingClientRect().height + 'px';  // если под скользящим элементом есть другие блоки, можно своё значение
			asideCart.style.padding = '0';
			asideCart.style.border = '0';  // если элементу присвоен padding или border
		}
		if (asideCart.getBoundingClientRect().top <= 0) { // elem.getBoundingClientRect() возвращает в px координаты элемента относительно верхнего левого угла области просмотра окна браузера
			heightWindow.className = 'js-fixed ';
		} else {
			heightWindow.className = '';
		}
		window.addEventListener('resize', function() {
			asideCart.children[0].style.width = getComputedStyle(asideCart, '').width
		}, false);  // если изменить размер окна браузера, измениться ширина элемента
	}

	//кнопка которая отвечает за показ корзины на мобильных устройствах
	cartCircle.addEventListener('click', function(){

		let cartMobile = document.querySelector('.js-fixed');
		cartMobile.classList.toggle('cart-show');
		
		if(cartMobile.classList.contains('cart-show')){
			cartCircleText.innerHTML = 'закрыть корзину';
		} else {
			cartCircleText.innerHTML = 'открыть корзину';
		}
		
	});


});
