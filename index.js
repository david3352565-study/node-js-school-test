function MyForm(id) {
	this.form = document.getElementById(id);
	this.fio = this.form.querySelector('[name="fio"]');
	this.email = this.form.querySelector('[name="email"]');
	this.phone = this.form.querySelector('[name="phone"]');
	this.button = this.form.querySelector('#submitButton');
	this.resultContainer = this.form.querySelector('#resultContainer');
	this.button.onclick = this.submit.bind(this);
	this.phone.onfocus = function() {
		var phoneNumber = new PhoneMask(this, {
			pattern: '+7(___)___-__-__',
			patternChar: '_',
			allowedRegExp: /^\d$/
		});
	};
}

MyForm.prototype.getData = function() {
	return {
		fio: this.fio.value,
		email: this.email.value,
		phone: this.phone.value
	};
};

MyForm.prototype.setData = function(obj) {
	this.fio.value = obj.fio;
	this.email.value = obj.email;
	this.phone.value = obj.phone;
};

// Функция валидации
MyForm.prototype.validate = function() {
	let data = this.getData(),
		isValid = true,
		errorFields = [];
	if (!this.nameValidating(data.fio)) {
		isValid = false;
		errorFields.push('fio');
	} else this.fio.classList.remove('error');
	if (!this.emailValidating(data.email)) {
		isValid = false;
		errorFields.push('email');
	} else this.email.classList.remove('error');
	if (!this.phoneValidating(data.phone)) {
		isValid = false;
		errorFields.push('phone');
	} else this.phone.classList.remove('error');
	if (errorFields.length > 0) {
		errorFields.forEach(name => (this[name].className += ' error'));
	}
	return { isValid: isValid, errorFields: errorFields };
};

// Валидация имени
MyForm.prototype.nameValidating = function(nameValue) {
	let arrNames = nameValue.split(' ').filter(el => {
		return el.replace(/[^A-Za-zА-Яа-яё]/gim, '');
	});
	return arrNames.length == 3;
};

// Валидация email
MyForm.prototype.emailValidating = function(emailValue) {
	const pattern = /[a-zA-Z0-9.+@]+@(ya\.ru|(yandex\.(ru|ua|by|kz|com)))/;
	return emailValue.match(pattern);
};

// Валидация телефона
MyForm.prototype.phoneValidating = function(phoneValue) {
	let numArray = phoneValue.replace(/[^0-9]/gim, '').split('');
	return numArray.length == 11 &&
	numArray.reduce((prev, curr) => {
		return +prev + +curr;
	}) <= 30
		? true
		: false;
};

MyForm.prototype.makeRequest = function() {
	var xhr = new XMLHttpRequest();
	let action = this.form.getAttribute('action');
	xhr.open('GET', action);

	xhr.send();

	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;

		if (xhr.status != 200) {
			console.log(xhr.status + ': ' + xhr.statusText);
		} else {
			let resp = JSON.parse(xhr.responseText);
			if (resp.status == 'success') {
				this.resultContainer.className += ' success';
				this.resultContainer.innerHTML = 'Success';
			} else if (resp.status == 'error') {
				this.resultContainer.className += ' error';
				this.resultContainer.innerHTML = resp.reason;
			} else if (resp.status == 'progress') {
				setTimeout(this.makeRequest.bind(this), resp.timeout);
			}
		}
	}.bind(this);
};

MyForm.prototype.submit = function() {
	let validation = this.validate();
	if (validation.isValid) {
		this.button.setAttribute('disabled', 'disabled');
		this.makeRequest();
	}
};

let form = new MyForm('myForm');
