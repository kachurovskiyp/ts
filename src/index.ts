const inquirer = require('inquirer');
const consola = require('Console');

enum Action {
	List = "list",
	Add = "add",
	Remove = "remove",
	Quit = "quit"
}

type InquirerAnswers = {
	action: Action
}

type User = {
	name: string,
	age: number
}

enum Types {
	success = 'success',
	error = 'error',
	info = 'info'
};

class Message {
	constructor(public content: string) { }

	show() {
		console.log(this.content);
	}

	capitalize() {
		const firstLetter: string = this.content[0].toUpperCase();
		const restWord: string = this.content.slice(1).toLocaleLowerCase();
		this.content = firstLetter + restWord

		console.log(this.content);
	}

	toUpperCase() {
		this.content = this.content.toUpperCase();
		console.log(this.content);
	}

	toLowerCase() {
		this.content = this.content.toLowerCase();
		console.log(this.content);
	}

	static showColorized(type: Types, text: string) {
		switch (type) {
			case 'info':
				consola.debug(text);
				break;
			case 'success':
				consola.success(text);
				break;
			case 'error':
				consola.error(text);
				break;
		}
	}
};

class UsersData {
	private data: User[] = [];

	showAll() {
		Message.showColorized(Types.info, 'Users data');
		if (this.data) {
			this.data.map((user: User) => {
				console.log(`Name: ${user.name}, ${user.age} years old`);
				console.log('---------------');
			});
		}
	};

	add(user: User) {
		if (user.name.length < 1 || user.age < 0) {
			Message.showColorized(Types.error, 'Wrong data!')
		} else {
			this.data.push(user);
			Message.showColorized(Types.success, 'User has been successfully added!');
		}
	};

	remove(name: string) {
		const user: User | undefined = this.data.find((user) => user.name === name);

		if (!user) {
			Message.showColorized(Types.error, 'User not found...');
			return;
		}

		const index: number = this.data.indexOf(user);
		if (index > -1) {
			this.data.splice(index, 1);
			Message.showColorized(Types.success, 'User deleted!');
		} else {
			Message.showColorized(Types.error, 'User not found...');
		}
	};
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(Types.info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

const startApp = () => {
	inquirer.prompt([{
		name: 'action',
		type: 'input',
		message: 'How can I help you?',
	}]).then(async (answers: InquirerAnswers) => {
		switch (answers.action) {
			case Action.List:
				users.showAll();
				break;
			case Action.Add:
				const user = await inquirer.prompt([{
					name: 'name',
					type: 'input',
					message: 'Enter name',
				}, {
					name: 'age',
					type: 'number',
					message: 'Enter age',
				}]);
				users.add(user);
				break;
			case Action.Remove:
				const name = await inquirer.prompt([{
					name: 'name',
					type: 'input',
					message: 'Enter name',
				}]);
				users.remove(name.name);
				break;
			case Action.Quit:
				Message.showColorized(Types.info, "Bye bye!");
				return;
		}
	});
}

startApp();