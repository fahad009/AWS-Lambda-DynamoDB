const _ = require('lodash')

module.exports.checkRequiredFields = (arr, body) => {
	let resBO = {fail: false, msg: ''}
	_.map(arr, (val) => {
		if (!_.has(body, val)) {
			resBO.fail = true
			resBO.msg = val + ' is required'
		}
	})
	return resBO
}
