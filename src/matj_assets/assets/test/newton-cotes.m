function y=NewtonCotes(fun,a,b,n)
  #����˵����funΪҪ������ֵĺ�����a��b�ֱ�Ϊ���ֵ����޺����ޣ�nΪ����˹��ʽ�Ľ�
  sum=0;
  % ���ɿ���˹ϵ������
  Cotescoeff=zeros(7,8);
  Cotescoeff(1,:)=[1,1,0,0,0,0,0,0]/2
  Cotescoeff(2,:)=[1,4,1,0,0,0,0,0]/6
  Cotescoeff(3,:)=[1,3,3,1,0,0,0,0]/8
  Cotescoeff(4,:)=[7,32,12,32,1,0,0,0]/90
  Cotescoeff(5,:)=[19,75,50,50,75,19,0,0]/288
  Cotescoeff(6,:)=[41,216,27,272,27,216,41,0]/840
  Cotescoeff(7,:)=[751,3577,1323,2989,2989,1323,3577,751]/17280
  % ���ɵȾ�ڵ�
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

f(x)=input('�����뺯��f(x)=');
a=input('��������������:  ');
b=input('��������������:  ');
n=input('������n���������伸�ȷ֣�: ');
h=(b-a)/n;

for i=1:n+1   %������n�ȷֺ󣬼�����ڵ�ĺ�����
    xdata(i)=a+(i-1)*h;
end
ydata=subs(f,'x',xdata);

for k=1:n+1    %����Cotesϵ��
    l=1;
    for j=1:n+1
        if(j~=k)
            l=l*(t-j+1)/(k-j);
        end
    end
    s(k)=int(l,0,n)/n;
end

yy1=sum(s.*ydata);
yy2=int(f,a,b);    %ֱ����matlab���
disp('��ȷֵ');
vpa(yy2,8)

If=(b-a)*yy1;   %��Newton_Cptes�����ʽ���
disp('��Newton_Cptes�����ʽ��ã�');
vpa(If,8)
wucha=yy2-If;   %�������
end

disp('���Ϊ�� ')
vpa(wucha,8)




function [y,Ck,Ak]=NewtonCotes(fun,a,b,n)
% y=NewtonCotes(fun,a,b,n)
% ţ��-����˹��ֵ���ֹ�ʽ
%
% ����˵����
% fun�����ֱ��ʽ������������ѡ��
%? ?? ?(1)���ֺ�������������ܹ�����ʸ�����룬����fun=@(x)sin(x).*cos(x)
%? ?? ?(2)x,y�������ɢ�㣬��һ��Ϊx���ڶ���Ϊy������Ⱦ࣬�ҽڵ�ĸ���С��9�����磺fun=[1:8;sin(1:8)]'
% ���fun�ı���õڶ��ַ�ʽ����ôֻ��Ҫ�����һ���������ɣ�����Ҫ����a,b,n��������
% a����������
% b����������
% n��ţ��-����˹����ʽ�Ľ�������������1<=n<=7����Ϊn>=8ʱ���ܱ�֤��ʽ���ȶ���
%? ? (1)n=1�������ι�ʽ
%? ? (2)n=2��������ɭ��ʽ
%? ? (3)n=4��������˹��ʽ
% y����ֵ���ֽ��
% Ck������˹ϵ��
% Ak�����ϵ��
%
% Example
% fun1=@(x)sin(x);%������Խ���ʸ������
% fun2=[0:0.1:0.5;sin(0:0.1:0.5)];%���8���㣬����Ⱦ�
% y1=NewtonCotes(fun1,0,0.5,6)
% y2==NewtonCotes(fun2)
%
% by dynamic of Matlab������̳
% see also http://www.matlabsky.com
% contact me matlabsky@gmail.com
% 2009-11-20 15:06:51


  function y=mulNewtonCotes(fun,a,b,m,n)
  % ����Newton-Cotes��ֵ���ֹ�ʽ������ÿ����������ʹ��Newton-Cotes��ʽ��Ȼ�����
  % ����˵��
  % fun�����ֺ����ľ���������ܹ�����ʸ������
  % a����������
  % b����������
  % m��������[a,b]�ȷֵ�����������
  % n�����õ�Newton-Cotes��ʽ�Ľ�������������n<8���������û����֤�ȶ���
  %? ? (1)n=1�����������ι�ʽ
  %? ? (2)n=2������������ɭ��ʽ
  %? ? (3)n=4������������˹��ʽ
  %
  % Example
  % fun=@(x)sin(x).*cos(x)
  % mulNewtonCotes(fun,0,2,10,4)
  %
  % by dynamic of Matlab������̳
  % see also http://www.matlabsky.com
  % contact me matlabsky@gmail.com
  % 2009-11-20 22:35:32
  %
  xk=linspace(a,b,m+1);
  for i=1:m
  ? ? s(i)=NewtonCotes(fun,xk(i),xk(i+1),n);
  end
  y=sum(s);