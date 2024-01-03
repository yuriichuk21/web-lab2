const TYPES = {
	LEG: 'leg',
	HYPOTENUSE: "hypotenuse",
	ANGLE_ADJ: 'adjacent angle',
	ANGLE_OPP: 'opposite angle',
	ANGLE: 'angle'
}


const STATUS = {
	FAILED: "failed",
	SUCCESS: 'success'
}


function validType(shapeType) {
	if (!Object.values(TYPES).includes(shapeType)) {
		console.log(`Incorrect type - ${shapeType}`)
		return false
	}
	return true 
}


function argumentLowerEqZero(argument, argName) {
	if (argument <= 0) {
		console.log(`argument ${argName} is equal or lower than zero`)
		return false
	}
	return true
}


function bindValues(values, arg1, type1, arg2, type2) {

	const newValues = {...values}
	const mutualTypes = [
		[TYPES.LEG, TYPES.LEG],
		[TYPES.LEG, TYPES.ANGLE],
		[TYPES.LEG, TYPES.ANGLE_OPP],
		[TYPES.LEG, TYPES.ANGLE_ADJ],
		[TYPES.ANGLE, TYPES.ANGLE],
		[TYPES.ANGLE, TYPES.HYPOTENUSE],
		[TYPES.HYPOTENUSE, TYPES.LEG]
	]
	const pair = mutualTypes.find(
		types => (types[0] === type1 && types[1] === type2) || (types[0] === type2 && types[1] === type1)
	)

	if (pair) {
		pair.forEach(type => {
			const currentValue = type === type1 ? arg1 : arg2
			switch (type) {

				case TYPES.LEG:
					if (!newValues.a) {
						newValues.a = currentValue
					} else if (!newValues.b) {
						newValues.b = type === type2 ? arg2 : arg1
					}
					break;

				case TYPES.HYPOTENUSE:
					newValues.c = currentValue
					break;

				case TYPES.ANGLE:
					if (!newValues.alpha) {
						newValues.alpha = currentValue
					} else if (!newValues.beta) {
						newValues.beta = type === type2 ? arg2 : arg1
					}
					break;

				case TYPES.ANGLE_OPP:
					newValues.alpha = currentValue
					break;

				case TYPES.ANGLE_ADJ:
					newValues.beta = currentValue
					break;
			}
		})
	}
	return newValues
}


function triangle(arg1, type1, arg2, type2) {

	if (!validType(type1) || !validType(type2)) {
		return STATUS.FAILED
	}

	if (!argumentLowerEqZero(arg1, 'arg1') || !argumentLowerEqZero(arg2, 'arg2')) {
		return STATUS.FAILED
	}

	const defaultValues = {
		a: 0,
		b: 0,
		c: 0,
		alpha: 0,
		beta: 0
	}
	const values = bindValues(defaultValues, arg1, type1, arg2, type2)
	
	console.log(values)

	const validators = [
		[
			() => JSON.stringify(defaultValues) === JSON.stringify(values),
		 	`Unacceptable type pair - '${type1}' and '${type2}'`
	 	],
	 	[
	 		() => values.alpha + values.beta > 90 || values.alpha >= 90 || values.beta >= 90,
	 		`Sharp angles can't be greater or equal 90 degrees`
	 	],
	 	[
	 		() => (values.a || values.b) && (values.a >= values.c || values.b >= values.c) && values.c,
	 		`Leg can't be greater than hypotenuse`
	 	]
	]

	const runValidators = () => {
		for (let [validator, errorMessage] of validators) {
			if (validator()) {
				console.log(errorMessage)
				return false
			}
		}
		return true
	}

	if (!runValidators()) {
		return STATUS.FAILED
	}

	values.alpha = values.alpha * (Math.PI / 180)
	values.beta = values.beta * (Math.PI / 180)

	if (values.a && values.b) {
		values.c = Math.sqrt(Math.pow(values.a, 2) + Math.pow(values.b, 2))
		values.alpha = Math.asin(values.a / values.c)
		values.beta = Math.PI / 2 - values.alpha

	} else if (values.a && values.c) {
		values.alpha = Math.asin(values.a / values.c)
		values.b = Math.sqrt(Math.pow(values.c, 2) - Math.pow(values.a, 2))
		values.beta = Math.atan(values.a / values.b)

	} else if (values.a && values.alpha) {
		values.c = values.a / Math.cos(values.alpha)
		values.b = values.a * Math.tan(values.alpha)
		values.beta = Math.PI / 2 - values.alpha

	} else if (values.a && values.beta) {
		values.b = values.a * Math.tan(values.beta)
		values.c = values.a / Math.cos(values.beta)
		values.alpha = Math.PI / 2 - values.beta

	} else if (values.alpha && values.beta) {
		values.a = Math.tan(values.alpha)
		values.b = Math.tan(values.beta)
		values.c = Math.sqrt(Math.pow(values.a, 2) + Math.pow(values.b, 2))

	} else if (values.c && values.alpha) {
		values.a = values.c * Math.cos(values.alpha)
		values.b = values.c
		values.beta = Math.PI / 2 - values.alpha
	}

	values.alpha = values.alpha * (180 / Math.PI)
	values.beta = values.beta * (180 / Math.PI)

	if (!runValidators()) {
		return STATUS.FAILED
	}

	console.log('Triangle sides:');
	console.log(`a: ${values.a}`);
	console.log(`b: ${values.b}`);
	console.log(`c: ${values.c}`);
	console.log(`alpha: ${values.alpha}`);
	console.log(`beta:  ${values.beta}`);

	return STATUS.SUCCESS;
}

console.log('Script loaded')
