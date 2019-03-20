class JSMailer {

	constructor(formName = '#myForm') {

		this.form = document.querySelector(formName);
		this.formData = {};
		this.validator = new Map ([
			['name', /^[a-zA-Zа-яА-ЯёЁ]+/],
			['phone', /^\+7\(\d{3}\)\d{3}-\d{4}$/],
			['email', /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/],
			['text', /[^\s]+/]
		]);
		this._init()
	}

	_init() {

		this.form.addEventListener('submit', e => {
			e.preventDefault();
			this.formData = new FormData(this.form);
			if (this._validate()) {
				this._sending()
			}
		})
	}

	_sending() {

		// посылаем сообщение на обработчик mailer.php - простая заглушка
		fetch('mailer.php', {
				method: 'post',
				body: this.formData
			}).then(response => {
				return response.json()
			}).then(data => {
				// отправлено успешно
				console.log('Сообщение успешно отправлено');
				this._clearInputs()
			}).catch(error => {
				// ошибка отправления
				console.error(error)
			});
	}

	_validate() {

		let valid = true;
		this.validator.forEach((reg, field) => {
			const blockHelp = document.querySelector(`#${field}Help`);
			const blockInput = document.querySelector(`[name=${field}]`);
			if (reg.test(this.formData.get(field))) {
				// проверка поля пройдена
				blockHelp.classList.add('hidden');
				blockInput.classList.remove('red-border')
			} else {
				// проверка не пройдена
				valid = false;
				blockHelp.classList.remove('hidden');
				blockInput.classList.add('red-border')

			}
		})
		return valid
	}

	_clearInputs() {

		// очистка полей после удечной отправки формы
		let inputs = this.form.querySelectorAll('input');
		inputs.forEach(el => {
			el.value = '';
		});
		let textareas = this.form.querySelectorAll('textarea');
		textareas.forEach(el => {
			el.value = '';
		});				
	}
}

const jsMailer = new JSMailer();