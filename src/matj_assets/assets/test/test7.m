% title = factor
// test for factor

syms x
F1 = factor(x^6-3*x^4-3*x^2+4*x^2-1+2)
F2 = factor(a^2 - 1)
F3 = factor(a^2+3*a+1)
F4 = factor(x^6-2*x^3*y^3+y^6)

F5 = factor(x^3+1)
F6 = factor(x^4+1)
F7 = factor(x^5+1)
F8 = factor(x^6+1)
F9 = factor(x^7+1)
F10 = factor(x^8+1)
F11 = factor(x^9+1)

F12 = factor(x^10+1)
F13 = factor(x^10+1, 'real')
F14 = factor(x^10+1, 'complex')

F15 = factor(-a*b^5*c*d*(a^2 - 1)*(a*d - b*c))

F16 = factor(-823429252n)
F17 = factor(8234292522563299328n)
F18 = factor(112/81)
