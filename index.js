function MyForm(id) {
	this.form = document.getElementById(id);
	this.fio = this.form.querySelector('[name="fio"]');
	this.email = this.form.querySelector('[name="email"]');
	this.phone = this.form.querySelector('[name="phone"]');
	this.button = this.form.querySelector('#submitButton');
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
	let numArray = phoneValue.replace(/[^0-9]/gim, '').split(''),
		sumNum = 0;
	if (numArray.length != 11) return false;
	numArray.forEach(elem => (sumNum += +elem));
	return sumNum <= 30 ? true : false;
};

MyForm.prototype.submit = function() {
	console.log(this.validate());
};

let form = new MyForm('myForm');
