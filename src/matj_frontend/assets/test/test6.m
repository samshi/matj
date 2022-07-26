% title = charts
// 8 charts

switch(7)
  case 1
x=[1:10]
y(0)=1;
for i=2:10
  y(i-1)=y(i-2)*3;
end
plot(x, y)

  case 2
//sin 正弦
x = 0:pi/10:2*pi
y1 = sin(x)
y2 = sin(x-0.25)
y3 = sin(x-0.5)
plot(x,y1,'g',x,y2,'b--o',x,y3,'c*')

  case 3
//derivative 求导
h = 0.01;       % step size
X = -pi:h:pi;    % domain
f = sin(X);      % range
Y = diff(f)/h;   % first derivative
Z = diff(Y)/h;   % second derivative
plot(X(:,1:length(Y)),Y,'r',X,f,'b', X(:,1:length(Z)),Z,'k')

  case 4
//polynomial approximation 多项式逼近
x = linspace(0,4*pi,10)
y = sin(x)
p = polyfit(x,y,7)
x1 = linspace(0,4*pi,100)
y1 = polyval(p,x1)
plot(x,y,'o', x1, y1)

  case 5
//polynomial approximation 多项式逼近
x = linspace(0,1,5);
y = 1./(1+x);
p = polyfit(x,y,4);
x1 = linspace(0,2);
y1 = 1./(1+x1);
f1 = polyval(p,x1);
plot(x,y,'o',x1,y1, x1,f1,'r--')

  case 6
//spiral ring 螺线环
t = linspace(0,6*pi,201);
x = t/pi.*cos(t);
y = t/pi.*sin(t);
plot(x,y)

  case 7
//3D surface 3D曲面图
x = linspace(-2,2,50)
y = x'
z = x .* exp(-x.^2 - y.^2)
surf(x, y, z)

  case 8
//complex space of polynomials 多项式的复空间
x = linspace(-1,1,50);
y = x'*1;
z = y + x.*1i;
p = [1 0 0 0 1] //polynomials
r = roots(p)
//w = real(polyval(p, z))/2;
w = imag(polyval(p, z))/2;
surf(x, y, w)

end
