
//a='When $a \\neq 0$, there are two solutions to $ax^2+bx+c = 0$ and they are $$x = {-\\vec b \\pm \\sqrt{|b^3-4ac|} \\over 21a}$$'

//solve('(2*x+1+sin(3*a*x))/((-2*x)/(1/7+x^2)^3)')
//solve('x^(y^z)=(1+e^x)^(-2*x*y^w)')
//solve('3*y^2*z*(3+(7*x+5)/(1+y^2))')

//[n, d] = numden('1/8')

syms x
//F = factor(x^6-3*x^4-3*x^2+4*x^2-1+2)
//F = factor(a^2 - 1)
//F = factor(a^2+3*a+1)
//Fxy = factor(x^6-2*x^3*y^3+y^6)
/*
Fxy = factor(x^3+1)
Fxy = factor(x^4+1)
Fxy = factor(x^5+1)
Fxy = factor(x^6+1)
Fxy = factor(x^7+1)
Fxy = factor(x^8+1)
Fxy = factor(x^9+1)
*/
Fxy = factor(x^10+1)
Fxy = factor(x^10+1, 'real')
Fxy = factor(x^10+1, 'complex')
//roots([1,0,0,-2,0,0,1])
//[a,b,c]=deconv([1,0,0,0,0,0,1],[1,0,1])

//F = factor(-a*b^5*c*d*(a^2 - 1)*(a*d - b*c))
/*

a=factor(-823429252n)
//2           2          59         283       12329
a=factor(8234292522563299328n)
a=factor(sym('82342925225632328'))
//2, 2, 2, 251, 401, 18311, 5584781
a=factor(sym('112/81'))
aa=factor(112/81)
*/