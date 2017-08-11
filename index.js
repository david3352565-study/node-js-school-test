function MyForm(id) {
	this.form = document.getElementById(id);
	this.fio = this.form.querySelector('[name="fio"]');
	this.email = this.form.querySelector('[name="email"]');
	this.phone = this.form.querySelector('[name="phone"]');
	this.button = this.form.querySelector('#submitButton');
	this.button.onclick = this.submit.bind(this);
	this.phone.onfocus = function() {
		VMasker(this).maskPattern('+9(999)999-99-99');
		this.value = VMasker.toPattern('7', { pattern: '+9(999)999-99-99' });
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

MyForm.prototype.error = function(elem) {
	elem.className += ' error';
};

MyForm.prototype.nameValidating = function(nameValue) {
	let arrNames = nameValue.split(' ').filter(el => {
		return el.replace(/[^A-Za-zА-Яа-яё]/gim, '');
	});
	console.log(arrNames);
	return arrNames.length == 3;
};

MyForm.prototype.emailValidating = function(emailValue) {
	const pattern = /[a-zA-Z0-9.+@]+@(ya\.ru|(yandex\.(ru|ua|by|kz|com)))/;
	return emailValue.match(pattern);
};

MyForm.prototype.phoneValidating = function(phoneValue) {
	//console.log('im validating your phone');
	return true;
};

MyForm.prototype.innerValidate = function(boolCheck, isVal, arr, name) {
	if (!boolCheck) {
		isVal = false;
		arr.push(name);
	}
};

MyForm.prototype.validate = function() {
	let data = this.getData(),
		isValid = true,
		errorFields = [];
	console.log(data);
	this.innerValidate(
		this.nameValidating(data.fio),
		isValid,
		errorFields,
		'fio'
	);
	this.innerValidate(
		this.emailValidating(data.email),
		isValid,
		errorFields,
		'email'
	);
	this.innerValidate(
		this.phoneValidating(data.email),
		isValid,
		errorFields,
		'email'
	);
	if (errorFields.length > 0) {
		errorFields.forEach(name => this.error(this[name]));
	} else {
		for (let y in data) {
			this[y].classList.remove('error');
		}
	}
};

MyForm.prototype.validatePhone = () => {};

MyForm.prototype.submit = function() {
	console.log(this.validate());
};

let form = new MyForm('myForm');
