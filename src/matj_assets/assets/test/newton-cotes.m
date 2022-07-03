function y=NewtonCotes(fun,a,b,n)
  #参数说明，fun为要计算积分的函数，a，b分别为积分的下限和上限，n为柯特斯公式的阶
  sum=0;
  % 生成柯特斯系数矩阵
  Cotescoeff=zeros(7,8);
  Cotescoeff(1,:)=[1,1,0,0,0,0,0,0]/2
  Cotescoeff(2,:)=[1,4,1,0,0,0,0,0]/6
  Cotescoeff(3,:)=[1,3,3,1,0,0,0,0]/8
  Cotescoeff(4,:)=[7,32,12,32,1,0,0,0]/90
  Cotescoeff(5,:)=[19,75,50,50,75,19,0,0]/288
  Cotescoeff(6,:)=[41,216,27,272,27,216,41,0]/840
  Cotescoeff(7,:)=[751,3577,1323,2989,2989,1323,3577,751]/17280
  % 生成等距节点
  x=zeros(1,n+1)
  x(1)=a
  for i=2:n+1
      x(i)=x(i-1)+(b-a)/n;
  end

  for k=1:n+1
      sum=sum+Cotescoeff(n,k)  * fun(x(k))
  end
  sum=sum * (b-a);
  y=sum;
end


clear
syms t x;

f(x)=input('请输入函数f(x)=');
a=input('请输入区间下限:  ');
b=input('请输入区间上限:  ');
n=input('请输入n（即将区间几等分）: ');
h=(b-a)/n;

for i=1:n+1   %将区间n等分后，计算各节点的横坐标
    xdata(i)=a+(i-1)*h;
end
ydata=subs(f,'x',xdata);

for k=1:n+1    %计算Cotes系数
    l=1;
    for j=1:n+1
        if(j~=k)
            l=l*(t-j+1)/(k-j);
        end
    end
    s(k)=int(l,0,n)/n;
end

yy1=sum(s.*ydata);
yy2=int(f,a,b);    %直接用matlab求积
disp('精确值');
vpa(yy2,8)

If=(b-a)*yy1;   %用Newton_Cptes求积公式求得
disp('用Newton_Cptes求积公式求得：');
vpa(If,8)
wucha=yy2-If;   %计算误差
end

disp('误差为： ')
vpa(wucha,8)




function [y,Ck,Ak]=NewtonCotes(fun,a,b,n)
% y=NewtonCotes(fun,a,b,n)
% 牛顿-科特斯数值积分公式
%
% 参数说明：
% fun，积分表达式，这里有两种选择
%? ?? ?(1)积分函数句柄，必须能够接受矢量输入，比如fun=@(x)sin(x).*cos(x)
%? ?? ?(2)x,y坐标的离散点，第一列为x，第二列为y，必须等距，且节点的个数小于9，比如：fun=[1:8;sin(1:8)]'
% 如果fun的表采用第二种方式，那么只需要输入第一个参数即可，否则还要输入a,b,n三个参数
% a，积分下限
% b，积分上限
% n，牛顿-科特斯数公式的阶数，必须满足1<=n<=7，因为n>=8时不能保证公式的稳定性
%? ? (1)n=1，即梯形公式
%? ? (2)n=2，即辛普森公式
%? ? (3)n=4，即科特斯公式
% y，数值积分结果
% Ck，科特斯系数
% Ak，求积系数
%
% Example
% fun1=@(x)sin(x);%必须可以接受矢量输入
% fun2=[0:0.1:0.5;sin(0:0.1:0.5)];%最多8个点，必须等距
% y1=NewtonCotes(fun1,0,0.5,6)
% y2==NewtonCotes(fun2)
%
% by dynamic of Matlab技术论坛
% see also http://www.matlabsky.com
% contact me matlabsky@gmail.com
% 2009-11-20 15:06:51


  function y=mulNewtonCotes(fun,a,b,m,n)
  % 复化Newton-Cotes数值积分公式，即在每个子区间上使用Newton-Cotes公式，然后求和
  % 参数说明
  % fun，积分函数的句柄，必须能够接受矢量输入
  % a，积分下限
  % b，积分上限
  % m，将区间[a,b]等分的子区间数量
  % n，采用的Newton-Cotes公式的阶数，必须满足n<8，否则积分没法保证稳定性
  %? ? (1)n=1，即复化梯形公式
  %? ? (2)n=2，即复化辛普森公式
  %? ? (3)n=4，即复化科特斯公式
  %
  % Example
  % fun=@(x)sin(x).*cos(x)
  % mulNewtonCotes(fun,0,2,10,4)
  %
  % by dynamic of Matlab技术论坛
  % see also http://www.matlabsky.com
  % contact me matlabsky@gmail.com
  % 2009-11-20 22:35:32
  %
  xk=linspace(a,b,m+1);
  for i=1:m
  ? ? s(i)=NewtonCotes(fun,xk(i),xk(i+1),n);
  end
  y=sum(s);