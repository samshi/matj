//stop
/*
*/


//基本极限
limit(sin(x^2)/x^2, 0)
checkLimit(sin(x^2)/x^2, 0, 1)
checkLimit(sin(x)/x, 0, 1)
checkLimit(tan(x)/x, 0, 1)
checkLimit(asin(x)/x, 0, 1)
checkLimit(atan(x)/x, 0, 1)
checkLimit((1-cos(x))/x^2, 0, '1/2')      	// 1/2
checkLimit((1-cos(x^2))/x^4, 0, '1/2')    	// 1/2
checkLimit((e^x-1)/x, 0, 1)
checkLimit((e^(x^2)-1)/x^2, 0, 1)
checkLimit(log(1+x)/x, 0, 1)
checkLimit(x*log(1+1/x), Infinity, 1)
checkLimit((1+x)^(1/x), 0, Math.E)						// e
checkLimit(((1+x)^(1/n)-1)/x, 0, '1/n') 		// 1/n
checkLimit(((1+x^2)^(1/n)-1)/x^2, 0, '1/n') // 1/n
checkLimit((a^x-1)/x, 0, 'log(a)')         		// log(a)
checkLimit(log(1+x)/(x*log(a)), 0, '1/log(a)')   // 1/log(a)

//常数
checkLimit(x^2-x, 0, 'pass')
checkLimit((5+x^2)^(1/2)/(16-x^3)^(1/3), 2, '1.5')

//因式分解
checkLimit((x^2-9)/(x-3), 3, 6)
checkLimit((x-4)/(x^(1/2)-2), 4, 4)
checkLimit((x^(1/3)-1)/(x^(1/2)-1), 1, '2/3')

//无限
checkLimit((x+sin(x))/(x-cos(x)), Infinity, 1)
checkLimit((x+log(x))/(x*log(x)), Infinity, 0)
checkLimit(((2*x-1)^2*(3*x+2)^3)/(6*x+1)^5, Infinity, '1/72')

//嵌套
checkLimit(asin((x^2+x)^(1/2)-x), Infinity, '0.5235987755982989')

//分子/分母有理化
checkLimit((x^2+x)^(1/2)-x, Infinity, '1/2')
checkLimit(x/((1+x)^(1/2) - (1-x)^(1/2)), 0, 1)
checkLimit((2+x^(1/3))/((1-x)^(1/2)-3), -8, '-1/2')
checkLimit(((x+4)^(1/2)-x^(1/2))/((x+5)^(1/2)-x^(1/2)), Infinity, '4/5')
checkLimit((x^(1/3)-5^(1/3))/(x^(1/2)-5^(1/2)), 5, '0.5098163275544867')
checkLimit((x^3+2*x^2+1)^(1/3)-x, Infinity, '2/3')

//前置负号
checkLimit(-(x+sin(x))/(x-cos(x)), Infinity, -1)
checkLimit(-(x^(1/3)-5^(1/3))/(x^(1/2)-5^(1/2)), 5, '-0.5098163275544867')
checkLimit(sin(pi*x)/(x-1), 1, '-pi')

//积
checkLimit(sin(pi*x)/(x-1)*e^(1/(x-1)^2), 1, '-Infinity')
checkLimit(sin(pi*x)/(x-1)*e^(-1/(x-1)^2), 1, 0)

//特例
checkLimit((x^m-1)/(x^n-1), 1, 'm/n')
checkLimit((1/x)*(1/sin(x)-1/tan(x)), 0, '1/2')
checkLimit((tan(x)-sin(x))/x^3, 0, '1/2')
checkLimit((1-x)*tan((pi*x)/2), 1, '2/pi')
checkLimit(x*(log(x+1)-log(x)), Infinity, 1)
checkLimit(tan(2*x)*tan(pi/4-x), pi/4, '1/2')

//幂
checkLimit(((x+2)/(x+3))^x, Infinity, '1/e')
checkLimit((1-2*x)^(3/sin(x)), 0, '0.0024787521766663594')
