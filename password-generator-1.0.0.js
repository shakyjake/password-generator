
function appraise_password(){
	const input = document.querySelector('.newpass__input');
	if(input){
		let quality = document.querySelector('.newpass__quality');
		if(quality){
			while(quality.childNodes.length){
				quality.firstChild.remove();
			}
		} else {
			quality = document.createElement('div');
			input.parentNode.parentNode.insertBefore(quality, input.parentNode.nextSibling);
		}
		quality.className = 'newpass__quality';
		if(input.value.length){

			let quality_string = '';
			let possible_chars = 0;

			possible_chars += /[a-z]/g.test(input.value) ? 26 : 0;
			possible_chars += /[A-Z]/g.test(input.value) ? 26 : 0;
			possible_chars += /[0-9]/g.test(input.value) ? 10 : 0;
			possible_chars += /[\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/g.test(input.value) ? 33 : 0;
			possible_chars += /[\u{1F30D}-\u{1F567}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6C0}]/ug.test(input.value) ? 744 : 0;

			if(input.value.length < 10){
				quality_string = 'invalid';
				quality.classList.add('newpass__quality--invalid');
			} else {
				if(possible_chars > 500){
					quality_string = 'fantastic';
					quality.classList.add('newpass__quality--good');
				} else {
					let complexity = Math.pow(input.value.length, possible_chars / 50);
					if(complexity > 700){
						quality_string = 'fantastic';
						quality.classList.add('newpass__quality--good');
					} else if(complexity > 150){
						quality_string = 'good';
						quality.classList.add('newpass__quality--good');
					} else if(complexity > 80){
						quality_string = 'adequate';
						quality.classList.add('newpass__quality--ok');
					} else if(complexity > 30){
						quality_string = 'poor';
						quality.classList.add('newpass__quality--bad');
					} else {
						quality_string = 'bad';
						quality.classList.add('newpass__quality--invalid');
					}
				}
			}

			quality.append('Quality: ' + quality_string);
		}
	}
}

function is_checked(id){
	const input = document.getElementById(id);
	if(input){
		if(input.type === 'checkbox'){
			return input.checked;
		}
	}
	return false;
}

function hex_to_dec(hex){
	return parseInt(hex, 16);
}

function generate_random_password(event){

	if(typeof(event) !== 'undefined'){
		event.stopImmediatePropagation();
	}

	let password_length = document.getElementById('PasswordLength').value;
	if(!password_length.length){
		password_length = 16;
	}
	if(isNaN(password_length)){
		password_length = 16;
	}
	password_length = parseInt(password_length);

	const sets = [];

	is_checked('UseLower')		? sets.push('lower')	: ()=>{};
	is_checked('UseUpper')		? sets.push('upper')	: ()=>{};
	is_checked('UseNumbers')	? sets.push('numbers')	: ()=>{};
	is_checked('UseSymbols')	? sets.push('symbols')	: ()=>{};
	is_checked('UseEmoji')		? sets.push('emoji')	: ()=>{};

	if(!sets.length){/* don't be silly */
		sets.push('lower');
		sets.push('upper');
		sets.push('numbers');
		sets.push('symbols');
		sets.push('emoji');
	}

	let password = '';

	while(!Math.max(password.length - password_length, 0)){

		const set = sets[Math.floor(Math.random() * sets.length)];

		if(set === 'lower'){
			const range = 'qwertyuiopasdfghjklzxcvbnm'.split('');
			const char = Math.floor(Math.random() * range.length);
			password += range[char];
		} else if(set === 'upper'){
			const range = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
			const char = Math.floor(Math.random() * range.length);
			password += range[char];
		} else if(set === 'numbers'){
			const range = '1234567890'.split('');
			const char = Math.floor(Math.random() * range.length);
			password += range[char];
		} else if(set === 'symbols'){
			const range = '!"£$%^&*()_+-={}[]:@~;\'#<>?,./\\|'.split('');
			const char = Math.floor(Math.random() * range.length);
			password += range[char];
		} else {
			const subsets = [
				{min : hex_to_dec('1F600'), max : hex_to_dec('1F64F')},
				{min : hex_to_dec('1F680'), max : hex_to_dec('1F6C0')},
				{min : hex_to_dec('1F30D'), max : hex_to_dec('1F567')}
			];
			const subset = Math.floor(Math.random() * subsets.length);
			const char = subsets[subset].min + Math.floor(Math.random() * (subsets[subset].max - subsets[subset].min));
			password += String.fromCodePoint(char);
		}

	}

	document.getElementById('Password').value = password;

	appraise_password();

}

function range_output_update(){

	const range = event.target;
	const input = range.parentNode.querySelector('.form__input--rangeout');

	if(input){
		input.value = range.value;
	}

	generate_random_password();

}

function range_input_update(event){

	const input = event.target;
	const range = input.parentNode.querySelector('.form__input--range');

	if(range){
		range.value = input.value;
	}

	generate_random_password();

}

(() => {

	document.querySelectorAll('.form__input--range').forEach((range) => {
		range.addEventListener('input', range_output_update);
	});

	document.querySelectorAll('.form__input--rangeout').forEach((input) => {
		input.addEventListener('input', range_input_update);
	});

	document.querySelectorAll('.newpass__toggle').forEach((chk) => {
		chk.addEventListener('change', generate_random_password);
	});

	document.querySelectorAll('.newpass__input').forEach((chk) => {
		chk.addEventListener('input', appraise_password);
	});

	document.querySelectorAll('.newpass__randomise').forEach((btn) => {
		btn.addEventListener('click', generate_random_password);
		btn.addEventListener('tap', generate_random_password);
	});

	generate_random_password();

})();