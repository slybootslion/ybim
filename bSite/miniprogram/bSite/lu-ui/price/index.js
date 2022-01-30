import validator from"../behaviors/validator";Component({externalClasses:["l-deleted-class","l-unit-class","l-value-class","l-class","l-decimal-class","l-dot-class"],behaviors:[validator],properties:{unit:{type:String,value:"￥"},size:{type:String,value:"28"},color:{type:String,value:"#0080ff"},bold:{type:String,value:"500"},unitColor:String,unitSize:String,unitBold:String,value:{type:String,value:"0.00"},mode:{type:String,value:"number",options:["number","text"]},valueColor:String,valueSize:String,valueBold:String,deleted:Boolean,delColor:String,reserveDigit:{type:Number,value:2},autofix:Boolean},data:{priceInteger:{type:String,value:"0"},priceDecimal:{type:String,value:"00"}},observers:{value:function(){this.reserveNumber()}},methods:{reserveNumber(){this.setData({priceInteger:null,priceDecimal:null});const e=Number(this.data.value);if(!(isNaN(Number(e))||"text"===this.data.mode)&&this.data.autofix){const t=e.toFixed(this.data.reserveDigit).toString().split(".");this._setPrice(t)}else{const e=this.data.value.split(".");this._setPrice(e)}},_setPrice(e){if(1===e.length)this.setData({priceInteger:e[0]});else{if(2!==e.length)throw"price 格式有误，请仔细检查！";this.setData({priceInteger:e[0],priceDecimal:e[1]})}}}});
