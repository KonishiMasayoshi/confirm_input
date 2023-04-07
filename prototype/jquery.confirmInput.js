/*----------------------------- confirm_input -----------------------------*/

(function($){
	const 
	defaults = {
		message:{
			error:'入力内容が不正です。', 
			empty:'未入力です。', 
			list:'リストの内容が不正です。', 
			limitBytes:'入力上限バイト数を超えてます。', 
			intMin:'最小値未満です。', 
			intMax:'最大値を超えてます。' 
		}, 
		funcConfirmInputStartCallback:() => {}, 
		funcConfirmInputEndCallback:(
			result, 
			message 
		) => {} 
	}, 
	pattern = {
		unsignedInt:/^[0-9]+$/, 
		float:/^-{0,1}[0-9]+(\.{1}[0-9]+){0,1}$/ 
	};
	let 
	object;
	
	$.confirmInput = function(options){
		object = this;
		object.configs = {}, 
		object.value = '', 
		object.empty = true, 
		object.whiteList, 
		object.blackList, 
		object.limitBytes = -1, 
		object.pattern, 
		object.numberMin, 
		object.numberMax;
		object.configs = $.extend(
			{}, 
			defaults, 
			options 
		);
	};
	
	//入力バイト数取得
	$.confirmInput.prototype.getStringBytes = (value) => {
		let 
		count = 0;
		value += '';
		for(var i = 0, l = value.length;i < l;++i){
			var 
			code = escape(
				value.charAt(i) 
			);
			count += (
				code.length < 4 && 
				code !== '%0A' 
			)?1:2;
		}
		return count;
	}, 
	
	//入力内容
	$.confirmInput.prototype.setValue = (value) => {
		object.value = typeof value === 'string' || typeof value === 'number'?value:'';
	}, 
	$.confirmInput.prototype.getValue = () => {
		return object.value;
	}, 
	
	//未入力確認フラグ
	$.confirmInput.prototype.setEmpty = (value) => {
		object.empty = typeof value === 'boolean'?value:true;
	}, 
	$.confirmInput.prototype.getEmpty = () => {
		return object.empty;
	}, 
	
	//ホワイトリスト
	$.confirmInput.prototype.setWhiteList = (arr) => {
		object.whiteList = $.isArray(arr)?arr:false;
	}, 
	$.confirmInput.prototype.getWhiteList = () => {
		return object.whiteList;
	}, 
	
	//ブラックリスト
	$.confirmInput.prototype.setBlackList = (arr) => {
		object.blackList = $.isArray(arr)?arr:false;
	}, 
	$.confirmInput.prototype.getBlackList = () => {
		return object.blackList;
	}, 
	
	//入力上限バイト数
	$.confirmInput.prototype.setLimitBytes = (value) => {
		object.limitBytes = (value + '').match(pattern.unsignedInt)?parseInt(value):-1;
	}, 
	$.confirmInput.prototype.getLimitBytes = () => {
		return object.limitBytes;
	}, 
	
	//パターン
	$.confirmInput.prototype.setPattern = (value) => {
		if(typeof value === 'object')
		object.pattern = value;
	}, 
	$.confirmInput.prototype.getPattern = () => {
		return object.pattern;
	}, 
	
	//最小値
	$.confirmInput.prototype.setNumberMin = (value) => {
		if((value + '').match(pattern.float))
		object.numberMin = parseFloat(value);
	}, 
	$.confirmInput.prototype.getNumberMin = () => {
		return object.numberMin;
	}, 
	
	//最大値
	$.confirmInput.prototype.setNumberMax = (value) => {
		if((value + '').match(pattern.float))
		object.numberMax = parseFloat(value);
	}, 
	$.confirmInput.prototype.getNumberMax = () => {
		return object.numberMax;
	}, 
	
	//実行用メソッド
	$.confirmInput.prototype.execute = () => {
		object.configs.funcConfirmInputStartCallback();
		//入力確認
		if(
			object.getEmpty() && 
			object.getValue() === '' 
		){
			object.configs.funcConfirmInputEndCallback(
				false, 
				object.configs.message.empty 
			);
			return false;
		}
		//ホワイトリスト
		if(typeof object.getWhiteList() === 'object'){
			if(object.getWhiteList() === false){
				object.configs.funcConfirmInputEndCallback(
					false, 
					object.configs.message.list 
				);
				return false;
			}
			if(
				$.inArray(
					object.getValue(), 
					object.getWhiteList() 
				) === -1 
			){
				object.configs.funcConfirmInputEndCallback(
					false, 
					object.configs.message.error 
				);
				return false;
			}
			object.configs.funcConfirmInputEndCallback(
				true, 
				'' 
			);
			return true;
		}
		//ブラックリスト
		if(typeof object.getBlackList() === 'object'){
			if(object.getBlackList() === false){
				object.configs.funcConfirmInputEndCallback(
					false, 
					object.configs.message.list 
				);
				return false;
			}
			if(
				$.inArray(
					object.getValue(), 
					object.getBlackList() 
				) !== -1 
			){
				object.configs.funcConfirmInputEndCallback(
					false, 
					object.configs.message.error 
				);
				return false;
			}
			object.configs.funcConfirmInputEndCallback(
				true, 
				'' 
			);
			return true;
		}
		if(object.getValue() !== ''){
			//最小値確認(数値)
			if(typeof object.getNumberMin() === 'number'){
				if(!(object.getValue() + '').match(pattern.float)){
					object.configs.funcConfirmInputEndCallback(
						false, 
						object.configs.message.error 
					);
					return false;
				}
				if(object.getNumberMin() > object.getValue()){
					object.configs.funcConfirmInputEndCallback(
						false, 
						object.configs.message.intMin 
					);
					return false;
				}
			}
			//最大値確認(数値)
			if(typeof object.getNumberMax() === 'number'){
				if(!(object.getValue() + '').match(pattern.float)){
					object.configs.funcConfirmInputEndCallback(
						false, 
						object.configs.message.error 
					);
					return false;
				}
				if(object.getNumberMax() < object.getValue()){
					object.configs.funcConfirmInputEndCallback(
						false, 
						object.configs.message.intMax 
					);
					return false;
				}
			}
			//入力上限バイト数確認
			if(
				object.getLimitBytes() !== -1 && 
				object.getLimitBytes() < object.getStringBytes(
					object.getValue() 
				) 
			){
				object.configs.funcConfirmInputEndCallback(
					false, 
					object.configs.message.limitBytes 
				);
				return false;
			}
			//パターン確認
			if(
				typeof object.getPattern() === 'object' && 
				!(object.getValue() + '').match(object.getPattern()) 
			){
				object.configs.funcConfirmInputEndCallback(
					false, 
					object.configs.message.error 
				);
				return false;
			}
		}
		object.configs.funcConfirmInputEndCallback(
			true, 
			'' 
		);
		return true;
	};
})(jQuery);
/*----------------------------- /confirm_input -----------------------------*/