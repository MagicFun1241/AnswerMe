const easyvk = require("easyvk");
const readline = require('readline');
const path = require('path');

const utils = require('./utils');
const params = require('./params');
params.list.test = 1;

const rl = readline.createInterface({
	input: process.stdin,
  	output: process.stdout
});

async function main (vk) {
	async function getMessage (msgArray = []) {
		return vk.call('messages.getById', {
			message_ids: msgArray[1]
		});
  	}

  	vk.longpoll.connect().then(({ connection }) => {
		connection.on('message', async (msg) => {
		  	let { vkr: fullMessage } = (await(getMessage(msg)));
		  	fullMessage = fullMessage.items[0];

		  	//Cообщение было отправлено не нами
		  	if (!fullMessage.out) {
		  		//Пришло сообщение с текстом
		  		if (fullMessage.body != null) {
		  			if (vk.session.user_id == fullMessage.user_id) {
					  	var args = fullMessage.body.split(" ");

					  	switch (args[1]) {
					  		case 'set':
					  			if (args.length == 4) {
					  				if (args[2] in params.list) {
					  					params.list[args[2]] = args[3];
					  					vk.call('messages.send', {
											peer_id: vk.session.user_id,
											message: `Значение свойства .`
				  						});
					  				}
					  				else {
					  					vk.call('messages.send', {
											peer_id: vk.session.user_id,
											message: `Свойства с таким именем не существует.`
				  						});
					  				}
					  			}
					  			else {
					  				vk.call('messages.send', {
										peer_id: vk.session.user_id,
										message: `Неверное количество аргументов.\nПример команды: answerme set [param] [value]`
				  					});
					  			}
					  			break;
					  		case 'get':

					  			break;
					  	}
		  			}
		  			//Разбиваем сообщение на ключевые слова, убирая при этом все знаки препинания
		  			var keyWords = utils.removePunctuation(fullMessage.body.toLowerCase()).split(" ");

					//Проверка на поздравление с днём рождения
					var today = new Date();
					var bDate = new Date(vk.session.bdate);
					if (today.getDate() == bDate.getDate() && today.getMonth()+1 == bDate.getMonth()) {
						if ((keyWords.includes("с") && (keyWords.includes("днем") || keyWords.includes("днём")) && keyWords.includes("рождения")) || (keyWords.includes("с") && keyWords.includes("др"))) {
							vk.call('messages.setActivity', {
								type: 'typing',
								user_id: fullMessage.user_id
	  						});

	  						setTimeout(function (vk, fullMessage) {
	    						vk.call('messages.send', {
									peer_id: fullMessage.user_id,
									message: utils.getRandomGratefulExpression()
	  							});
							}, utils.getRandomInt(7000, 13000), vk, fullMessage);
						}
					}
					//Поздравили раньше чем нужно
					else if ((keyWords.includes("с") && (keyWords.includes("днем") || keyWords.includes("днём")) && keyWords.includes("рождения")) || (keyWords.includes("с") && keyWords.includes("др"))) {
						vk.call('messages.setActivity', {
							type: 'typing',
							user_id: fullMessage.user_id
	  					});

	  					setTimeout(function (vk, fullMessage) {
	    					vk.call('messages.send', {
								peer_id: fullMessage.user_id,
								message: utils.addRandomEmotion(utils.getRandomErrorExpression())
	  						});
						}, utils.getRandomInt(7000, 12000), vk, fullMessage);
					}
					else if (keyWords.includes("с") && ((keyWords.includes("праздником") || keyWords.includes("праздничком")))) {
						var user = vk.call('users.get', {
							user_ids: fullMessage.user_id,
							fields: 'bdate'
	  					});

	  					var pronoun;
	  					if ((today.getYear() - new Date(user.bdate).getYear()) > 20)
	  						pronoun = 'Вас';
	  					else
	  						pronoun = 'Тебя';

						vk.call('messages.setActivity', {
							type: 'typing',
							user_id: fullMessage.user_id
	  					});

						setTimeout(function (vk, fullMessage, pronoun) {
	    					vk.call('messages.send', {
								peer_id: fullMessage.user_id,
								message: utils.addRandomEmotion(`${utils.getRandomGratefulExpression()}. ${pronoun} тоже`)
	  						});
						}, utils.getRandomInt(8000, 13000), vk, fullMessage, pronoun);
					}
					else if ((keyWords.includes("привет") || keyWords.includes("хай") || keyWords.includes("дороу")) && !keyWords.includes("как") && !keyWords.includes("дела")) {
						var user = vk.call('users.get', {
							user_ids: fullMessage.user_id,
							fields: 'bdate'
	  					});

	  					var hello = ((today.getYear() - new Date(user.bdate).getYear()) > 20) ? 'Здравствуйте' : 'Привет';

						vk.call('messages.setActivity', {
							type: 'typing',
							user_id: fullMessage.user_id
	  					});

						setTimeout(function (vk, fullMessage, hello) {
	    					vk.call('messages.send', {
								peer_id: fullMessage.user_id,
								message: utils.addRandomEmotion(hello)
	  						});
						}, utils.getRandomInt(2000, 5000), vk, fullMessage, hello);
					}
					//Вопрос в стиле "Как дела?"
					else if ((keyWords.includes("как") && keyWords.includes("дела")) || (keyWords.includes("что") && keyWords.includes("нового")) || (keyWords.includes("как") && keyWords.includes("у") && keyWords.includes("тебя"))) {
						var sendMessageText;

						if (keyWords.includes("привет"))
							sendMessageText = utils.getRandomGreeting();

						sendMessageText = (sendMessageText != undefined) ? `${sendMessageText}. ${utils.getRandomAnswer()}. ${utils.getRandomQuestion()}` : `${utils.getRandomAnswer()}. ${utils.getRandomQuestion()}`;

						vk.call('messages.setActivity', {
							type: 'typing',
							user_id: fullMessage.user_id
	  					});

						setTimeout(function (vk, fullMessage) {
	    					vk.call('messages.send', {
								peer_id: fullMessage.user_id,
								message: sendMessageText
	  						});
						}, utils.getRandomInt(7000, 13000), vk, fullMessage);
					}
					else if (fullMessage.body == 'Что будем делать?') {
						vk.call('messages.send', {
							peer_id: fullMessage.user_id,
							message: 'Порабощать кожанных ублюдков))'
	  					});
					}
		  		}
		  		//Пришло сообщение без текста, но с прикрепленным файлом
		  		else {

		  		}
		  	}
		});
  	});
}

async function logInWith2Auth (params) {
	return new Promise((_2faNeed) => {
		function relogIn (_2faCode = "") {
	  		if (_2faCode) 
	  			params.code = _2faCode;

	  		easyvk(params).then(main).catch((err) => {
				if (!err.easyvk_error) {
		  			if (err.error_code == "need_validation") {
						_2faNeed({
			  				err: err,
			  				relogIn: relogIn
						});
		  			}
				}
	  		});
		}
		relogIn();
  	});
}

logInWith2Auth({
	username: "",
	password: "",
	fields: "bdate",
	reauth: true,
	utils: {
	  bots: false, // Bots LongPoll
	  longpoll: true, // User LongPoll (возможна нестабильная работа в связи с ограничениями ВКонтакте на секцию messages)
	  http: false, // HTTP Клиент для работы с Audio API
	  widgets: false, // Дополнительные виджеты
	  uploader: false, // Внутреннее решение для загрузки файлов на сервер
	  callbackAPI: false, // Callback API
	  streamingAPI: false, // Streaming API
	}
}).then(({err: error, relogIn}) => {
  	if (error.validation_type == '') {}
  	var q;
  	if (error.error == 'Please, enter your app code in code parameter!')
  		q = 'Введите код двухфакторной аутендификации:';
  	else
  		q = error.error;

  	rl.question(q + " ", (answer) => {
		relogIn(answer);
		rl.close();
  	});
});