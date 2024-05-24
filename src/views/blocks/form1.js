const hbs = `
<div class="container">
	<form>
		<div class="form-group">
			<label for="exampleInput{{label1}}">{{label1}}</label>
			<input type="{{inputtype1}}" class="form-control" id="exampleInput{{inputtype1}}" aria-describedby="{{label1}}Help" placeholder="Enter {{label1}}">
			<small id="{{label1}}Help" class="form-text text-muted">We'll never share your {{label1}} with anyone else.</small>
		</div>
		<div class="form-group">
			<label for="exampleInput{{label2}}">{{label2}}</label>
			<input type="{{inputtype2}}" class="form-control" id="exampleInput{{inputtype2}}" placeholder="{{label2}}">
		</div>
		<button type="{{submit}}" class="btn btn-primary">{{label3}}</button>
	</form>
</div>
`;

const block = {
	hbs,
	name: 'Form #1',
	previewImageUrl: 'https://i.imgur.com/8wmg2d9.png',
	category: 'forms',
	defaultData: {
		inputtype1: 'email',
		inputtype2: 'password',
		btn: 'submit',
		label1: 'Email address',
		label2: 'Password',
		label3: 'Submit',
	},
	config: {
		title: {
			type: 'string',
			name: 'Section title',
		},
		inputtype1: {
			type: 'string',
			name: 'Input Type',
		},
		inputtype2: {
			type: 'string',
			name: 'Input Type',
		},
		label1: {
			type: 'string',
			name: 'Input Placeholder',
		},
		label2: {
			type: 'string',
			name: 'Input Placeholder',
		},
		label3: {
			type: 'string',
			name: 'Input Placeholder',
		},
	},
};

export default block;
