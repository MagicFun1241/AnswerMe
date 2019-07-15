function getRandomInt(min, max) {
		return Math.floor(Math.random() * (+max - +min)) + +min;
}

module.exports = {
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (+max - +min)) + +min;
	},
	removePunctuation: function (str) {
		return str.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '').replace(/\s+/g, ' ');
	},
	getRandomGratefulExpression: function () {
		switch (getRandomInt(1, 5)) {
			case 1:
				return 'Спасибо большое';
			case 2:
				return 'Спасибо';
			case 3:
				return 'Благодарю';
			case 4:
				return 'Спасибо огромное';
			case 5:
				return 'Спасибочки';
		}
	},
	getRandomQuestion: function () {
		switch (getRandomInt(1, 2)) {
			case 1:
				return 'А как у тебя дела?';
			case 2:
				return 'А что у тебя нового?';
		}
	},
	getRandomAnswer: function () {
		switch (getRandomInt(1, 3)) {
			case 1:
				return 'Хорошо';
			case 2:
				return 'Нормально';
			case 3:
				return 'Отлично';
		}
	},
	getRandomGreeting: function () {
		switch (getRandomInt(1, 2)) {
			case 1:
				return 'Привет';
			case 2:
				return 'Приветик';
		}
	},
	addRandomEmotion: function (text) {
		switch (getRandomInt(1, 5)) {
			case 1:
				return text;
			case 2:
				return `${text})`;
			case 3:
				return `${text} :D`;
			case 4:
				return `${text} ;D`;
			case 5:
				return `${text} ;x`;
		}
	},
	getRandomErrorExpression: function () {
		switch (getRandomInt(1, 2)) {
			case 1:
				return 'Лол. У меня не сегодня день рождения';
			case 2:
				return 'Спасибо за поздравления, но День Рождения у меня в другой день';
		}
	}
};