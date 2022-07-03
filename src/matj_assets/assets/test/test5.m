% title = test
// 250+ test scripts, writed with MatJ,

setFixNum(4);

test_index = 0;
test_pass  = 0;
test_fail  = 0;


function check_value = checkEq(check_value, compare_value)
  test_index=test_index+1;

  if check_value == compare_value
    test_pass = test_pass + 1;
  else
    test_fail = test_fail + 1;
  disp("checkEq fail:")
  test_index
  check_value
  compare_value
  end
end

function check_value = checkLk(check_value, compare_value)
  test_index=test_index+1;

  if abs(check_value-compare_value)<1e-12
    test_pass = test_pass + 1;
  else
    test_fail = test_fail + 1;
  disp("checkLk fail:")
  test_index
  check_value
  compare_value
  end
end

function check_value = checkMt(check_value, compare_value)
  test_index=test_index+1;

  if sameValue(check_value,compare_value)
    test_pass = test_pass + 1;
  else
    test_fail = test_fail + 1;
  disp("checkMt fail:")
  test_index
  check_value
  compare_value
  end
end

function compare_value = checkZero(check_value)
	test_index=test_index+1;
  compare_value = max(abs(check_value),[],'all');

  if compare_value<1e-12
    test_pass = test_pass + 1;
  else
    test_fail = test_fail + 1;
  disp("checkMt fail:")
  test_index
  check_value
  compare_value
  end
end

function runTest
  disp('---------------  test result ----------------')

  test_pass
  test_fail

  //Count down for main rocket engines
  //disp (3);
  %{
  disp (2);
  disp (1);
  %}
  //disp ("Blast Off!");  # Rocket leaves pad
endfunction


a=1;b=2;c=a+b;
//d=cos(a);
e=a*b;
f=a/b;

checkEq(7 + 10/4 + 4 ^ 0.5,11.5);
checkEq(c,3);//1
//checkLk(d,0.5403023058681398);
checkEq(e,2);
checkEq((f-32)/1.8,-17.5);

//matlab 的语法是 ... Connect lines (with break)
g0 = [ 11 12 13 14...
21 22 23 24...
31 32 33 34 ];
checkMt(size(g0), [1,12]);
g1=[1 -1 ;
-2 2      ;  ...

2 -2

];
checkMt(g1, [1 -1;-2 2;2 -2]);
g=[1 2 3 4;5 6 7 8;9 10 11 12;13 14 15 16];
checkEq(g(4,2),g(8));

checkMt(g(1:3,2), [2;6;10]);
checkMt(g(3,:), [9 10 11 12]);
checkMt(g(2:3,:), [5 6 7 8;9 10 11 12]);

h= 0:10:100;
h1=10:-2:0;
checkMt(h1, [10 8 6 4 2 0]);												//11
checkEq(h(10),90);


k=[1 3 5;2 4 6;7 8 10];
checkEq(k(3),7);
checkMt(k(:),[1 2 7 3 4 8 5 6 10]');

k0=k;
//n0=k0(null,1:end-1); //非Matlab 写法
n0=k0(:,1:end-1);
checkMt(n0, [1 3;2 4;7 8]);
//checkMt(n0(2:), [2;7;3;4;8]); // 非Matlab 写法
checkMt(n0(2:end), [2 7 3 4 8]');
n0(2:) = 13;
checkMt(n0(1, 1:2), [1 13]);
[n1 n2] = n0(1, 1:2);

maxk=max(k);
checkMt(maxk,[7 8 10]);
maxk2=max(k,[],2);
maxk3=min(k,[],2);

checkMt(maxk2,[5;6;10]);
checkMt(maxk3,[1;2;7]);
(m1, m2) = max(k, [], 2);
checkMt(m2,[3;3;3]);
m3=max(k, 3);
checkMt(m3(:,1),[3;3;7]);														//21

k2=[1.77 -0.005 3.98 -2.95 NaN 0.34 NaN 0.19];
m4=max(k2,[],'ominan');
m5=max(k2);
m6=max(k2,[],'includenan');

checkEq(m4,3.98);
checkEq(m5,3.98);
checkEq(m6,NaN);

m7=min(k2,[],'ominan');
m8=min(k2);
m9=min(k2,[],'includenan');

checkEq(m7,-2.95);
checkEq(m8,-2.95);
checkEq(m9,NaN);

[un, ia, ib]=union([5 7 1],[3 1 1]);
checkMt(un,[1 3 5 7]);
checkMt(ia,[3;1;2]);
checkMt(ib,[1]);

[minBk,maxBk] = bounds(k);
checkMt(minBk,[1 3 5]);
checkMt(maxBk,[7 8 10]);


l=k+10;
m=sin(k);
checkEq(l(8),16);
checkLk(m(6),0.9893582466233818);									//31+4
n=k';
checkLk(n(6),6);

dif=max(k*inv(k) - eye(3), [], 'all');
checkLk(dif, 0);
q=k.*k;
checkEq(q(1,3), 25);

r=k.^3;
checkEq(r(2,3), 216);

s=[k,k];
t=[k;k];
size1 = size(s);
size2 = size(t);
checkMt(size1, [3,6]);
checkMt(size2, [6,3]);


cumsumA1 = 1:5;
checkMt(cumsum(cumsumA1), [1	3	6	10	15]);				//42
cumsumA2 = [1 4 7; 2 5 8; 3 6 9];
checkMt(cumsum(cumsumA2), [1	4	7;3	9	15;6	15	24]);
cumsumA3 = [1 3 5; 2 4 6];
checkMt(cumsum(cumsumA3, 2), [1	4	9;2	6	12]);
cumsumA4=[9 10 3;10 7 6;2 1 10];
checkMt(cumsum(cumsumA4,2,'reverse'), [22	13	3;23	13	6;13	11	10]);
cumsumA5 = [3 5 NaN 9 0 NaN];
checkMt(cumsum(cumsumA5), [3	8	NaN	NaN	NaN	NaN]);
checkMt(cumsum(cumsumA5,'omitnan'), [3	8	8	17	17	17]);

u = [true false true true true false];
checkMt(cumsum(u), [1 1 2 3 4 4]);
v = [true false true; true true false];
checkMt(cumsum(v,2), [1 1 2;1 2 2]);

w=1i;
checkEq(sqrt(-1) - w, 0);


x=[3+4i, 4+4j; -1i, 10];
checkEq(x(1) - x(2), 3+5i); 											//51


magic_n=4;
y=magic(magic_n);
checkMt(sum(y), ones(1,magic_n)*trace(y));
checkMt(sum(y, 2), ones(magic_n,1)*trace(y));

magic_n=5;
y=magic(magic_n);
checkMt(sum(y), ones(1,magic_n)*trace(y));
checkMt(sum(y, 2), ones(magic_n,1)*trace(y));

magic_n=6;
y=magic(magic_n);
checkMt(sum(y), ones(1,magic_n)*trace(y));
checkMt(sum(y, 2), ones(magic_n,1)*trace(y));

z = rand(3,4,2);
checkEq(max(z, [], 'all')<1, true);
checkEq(min(z, [], 'all')>0, true);

str1 = "Hello, world";
checkEq(str1(:5), 'Hello');

// q = "Something ""quoted"" and something else."

str2 = 'Something "quoted" and something else.';
checkEq(str2(11:18), '"quoted"'); 									//61
checkEq(str2(4:2:8), 'ehn');

c=30;

tempText = "Temperature is " + c + "C";
checkEq(tempText(-3:), '30C');

strM = ["a","bb","ccc"; "dddd","eeeeee","fffffff"];
checkMt(strlength(strM), [1 2 3;4 6 7]);

seq2 = [tempText 'ATTAGAAACC'];
checkMt(strlength(seq2), [18 10]);

s1=0;
for i=1:10
s1=s1+i/(2*i+1);
end
s2 = sum((1:10)./(3:2:21));
checkEq(s1, s2);

s3=0;
for i=1:200
if mod(i,3)==0 && mod(i,7)==0
  s3=s3+i;
end
end
checkEq(s3, 945);

p=[];
for n=2:50
s=0;
for r=1:n-1
if mod(n,r)==0
  s=s+r;
end
end
if s==n
  p=[p n];
end
end
checkMt(p, [6,28]);



A=[1 1;1 2;1 3];
B = A' * A;
C = inv(B);
D=C*B-...
eye(2);
checkZero(D);


A1 = [ 2  4 6; 4 3 1; 3 6 8 ];
b1 = [ 14; 18; 20 ];
x1 = A1 \ b1;
B2 = inv(A1);
x2=B2*b1;
checkLk(sum(abs(x1-x2)), 0);


F=[1 2;3 4];
G=[5 6;7 8];
r1=F/G;
r2=F\G;
r3=F./G;
r4=F.\G;
checkMt(G, F*r2);																			//71
checkMt(F, r1*G);
checkMt(G, r4.*F);
checkMt(F, r3.*G);

x.a.b.c=[1;2];
checkEq(x.a.b.c(2), 2);

x.a.b.A=[1,2;3,4];
x.a.b.B=[2 1;4 3];
checkMt(x.a.b.A\x.a.b.B, [0 1;1 0]);

dA = [4 0 0 1;2,-1 3 1; 0 0 0 2; 7 4 3 2];
checkEq(det(dA), 120);
checkMt(poly(dA), [1 -5 -15 3 120]);


checkMt(ones(4)+zeros(4), ones(4));
checkZero(cos(eye(2)*pi/3)-[0.5 1;1 0.5]);


eA=[0.8 0.1 0.05 0.05;
0.1 0.8 0.05 0.05;
0.05 0.05 0.8 0.1;
0.05 0.05 0.1 0.8];
Aeig=eig(eA);
checkMt(Aeig, [1 0.8 0.7 0.7]');											//81
  [eigU,eigD]=eig(eA);
checkEq(det(eigD), 0.392);
checkZero(norm(eA*eigU-eigU*eigD));


eB = [-2 1 1;0 2 0;-4 1 3];
Beig = eig(eB);


B1 = transpose(eB)*eB;
B2 = eB*eB';
B1eig = eig(B1);
B2eig = eig(B2);
checkZero(B1eig - B2eig);

eJ = [0 1; -1 0];
Jeig = eig(eJ);
checkEq(Jeig, '无实数特征值');

eB1 = g1' * g1;
(eB1eig, eB1eigvec)=eig(eB1);
Borth = orth(eB1eigvec);
checkMt(Borth, [1;0]);
// test()

C =  [1 1 1; 0 1 1; 0 0 1];
Corth = orth(C);
checkMt(Corth*Corth', eye(3));												//87

eigA=magic(5);
[eigV,eigDm] = eig(eigA);
checkZero(eigA*eigV-eigV*eigDm);

//(AA, Aeig, Aeigvec, Av, Asigma, Au, Aresult) = svd(g1)


nF=[0 1 2 3];
sum(nF.*nF);
nV=sqrt(sum(nF.*nF));
checkEq(norm(nF), nV);
checkEq(norm(nF,1), 6);
checkEq(norm(nF,2), nV);

dA=[
  64   2   3  61  60   6;
9  55  54  12  13  51;
17  47  46  20  21  43;
40  26  27  37  36  30;
32  34  35  29  28  38;
41  23  22  44  45  19;
49  15  14  52  53  11;
8  58  59   5   4  62];
db = 260 * ones(8, 1);
divx = dA\db;
//matlabx=[3 4 0 0 1 0]' //结果也对
checkEq(norm(dA * divx-db), 0);


tA = ones(4);
tB = triu(tA);
tC = triu(tA,1);
tD = tril(tA);
tE = tril(tA,1);
tF = tril(tA,2);
checkEq(norm(tC+tF-tA), 0);
checkEq(norm(tB+tE-tA), 0);


rA =randi([10 50],1,50);
maxrA=max(rA);
checkEq(maxrA<=50, true);
minrA=min(rA);
checkEq(minrA>=10, true);															//96



cA = [1 0 1;
0 2 0;
1 0 3];
cB = chol(cA);
cA2 = cB'*cB;
cb = sum(cA2,2);
// 尽管R'Rx=b，也不能得出 x=R\(R'\b)
cholx = cB\(cB'\cb);
checkZero(cB'*cB*cholx-cb);


kA = [1 -2;-1 0];
kB = [4 -3;2 3];
kC = kron(kA, kB);
checkEq(trace(kC), 7);



rB = -5 + 10 * rand(50,1);
sumMM=max(rB)+min(rB);
checkEq(abs(sumMM())<1,true);

rrefA = [1 4 7;2 5 8;3 6 9];
checkMt(rref(rrefA), [1 0 -1;0 1 2;0 0 0]);

rrefA1=[8 1 6;3 5 7;4 9 2];
checkMt(rref(rrefA1), eye(3));

rrefA2=magic(4);
rrefB=rref(rrefA2);
checkMt(rrefB(:,4), [1 3 -3 0]');


rrefA3=[1 1 5;2 1 8; 1 2 7;-1 1 -1];
rrefb =[6 8 10 2]';
rrefA4=[rrefA3 rrefb];
rrefC=rref(rrefA4);
checkMt(rrefC(1:3,:), [1 0 3 2;0 1 2 4;0 0 0 0]);


cumpA = 1:5;
checkMt(cumprod(cumpA), [1 2 6 24 120]);

cumpA2 = [1 4 7; 2 5 8; 3 6 9];
checkMt(cumprod(cumpA2), [1 4 7;2 20 56;6 120 504]);

cumpA3 = [1 3 5; 2 4 6];
checkMt(cumprod(cumpA3, 2), [1 3 15;2 8 48]);				//106

cumpA4 = [true false true; true true false];
checkMt(cumprod(cumpA4,2), [1 0 0;1 1 0]);

cumpA5 = randi([1,10],3);
cumpA5B = cumprod(cumpA5,'reverse');
cumpA5C = cumpA5([3,2,1],:);
cumpA5D = cumprod(cumpA5C);
cumpA5E = cumpA5D([3,2,1],:);
checkMt(cumpA5B, cumpA5E);

cumpA6 = [1 3 NaN 2 4 NaN];
checkMt(cumprod(cumpA6), [1 3 NaN NaN NaN NaN]);
checkMt(cumprod(cumpA6,'omitnan'), [1 3 3 6 24 24]);


pA=pascal(5);
pA(25)=pA(25)-1;

pB=chol(pA);
pC = pB(1:4,1:4);
pD = pC'*pC;
checkMt(pD, pA(1:4,1:4));



luA=[0 3 1;0 4 -2;2 1 2];
[luL, luU1]=lu(luA);
luU2=triu(luU1);
checkEq(trace(luU1), trace(luU2));
checkMt(luL*luU2-luA, zeros(3));									//113

qrA=hilb(6);
[qrQ, qrR] = qr(qrA);
checkZero(qrQ * qrR -qrA);


svdA = [1 2; 3 4; 5 6; 7 8];
[U1,S1,V1] = svd(svdA);
checkZero(U1*S1*V1'-svdA);
checkMt(size(S1), [4 2]);

[U2,S2,V2] = svd(svdA');
checkZero(U2*S2*V2'-svdA');
checkMt(size(S2), [2 4]);

[U3,S3,V3] = svd(svdA, 'econ');
checkZero(U3*S3*V3'-svdA);
checkMt(size(S3), [2 2]);

[U4,S4,V4] = svd(svdA', 'econ');
checkZero(U4*S4*V4'-svdA');
checkMt(size(S4), [2 2]);

[U5,S5,V5] = svd(svdA, 0);
checkZero(U5*S5*V5'-svdA);
checkMt(size(S5), [2 2]);

[U6,S6,V6] = svd(svdA', 0);
checkZero(U6*S6*V6'-svdA');
checkMt(size(S6), [2 4]);														//126

pinvA = magic(8);
pinvA2 = pinvA(:,1:6);
pinvb = 260*ones(8,1);
pinvx1 = pinvA2\pinvb;
pinvB=pinv(pinvA2);
pinvx = pinvB*pinvb;
checkZero(norm(pinvx) -3.2816506165694794);

diagA = randi(10,4);
diagB=diag(diag(diagA));
diagB= diagB+diag(diag(diagA,-1),-1);
diagB= diagB+diag(diag(diagA,-2),-2);
diagB= diagB+diag(diag(diagA,-3),-3);
diagB= diagB+diag(diag(diagA,1),1);
diagB= diagB+diag(diag(diagA,2),2);
diagB= diagB+diag(diag(diagA,3),3);
checkZero(diagB-diagA);


hn=6;
hilbA=hilb(hn);
invA = inv(hilbA);
invB = round(invA);
checkEq(norm(invA*hilbA-eye(hn))<1e-3, true);
checkEq(norm(invB*hilbA-eye(hn))<1e-11, true);


condA = [4.1 2.8;9.7 6.6];
checkEq(cond(condA),1622.9993837607635);

condA3 = [1 0 -2;3 4  6;-1 5  7];
checkZero(cond(condA3, 1)-18);

checkEq(norm([-2 3 -1],1), 6);

polyvec=[1, 0, 0, 0, 0, 0, 0, 0, -19, 19];
rrr=roots(polyvec);
checkZero(rrr(0)^9-rrr(0)*19+19);											//134


mm=magic(3);
checkEq(sum(factorial(mm), 'all'), 409113);

dotA = [4 -1 2];
dotB = [2 -2 -1];
checkEq(dot(dotA,dotB), 8);

dotA1 = [1 2 3;4 5 6;7 8 9];
dotB1 = [9 8 7;6 5 4;3 2 1];
checkMt(dot(dotA1,dotB1), [54 57 54]);
checkMt(dot(dotA1,dotB1,2), [46;73;46]);

catA = ones(3);
catB = zeros(3);
checkMt(size(cat(1,catA,catB, catA)), [9 3]);
checkMt(size(cat(2,catA,catB, catA)), [3 9]);

catA2 = rand(2,3,4);
catB2 = rand(2,3,5);
checkMt(size(cat(3,catA2,catB2)), [2 3 9]);

catA3 = [9 8 7; 6 5 4; 3 2 1];
catB3 = [1 2 3; 4 5 6; 7 8 9];
catC3 = cat(3, catA3, catB3, [ 2 3 1; 4 7 8; 3 9 0]);
checkMt(size(catC3), [3 3 3]);													//142

fixX = [-1.9 -3.4; 1.6 2.5; -4.5 4.5];
checkMt(fix(fixX), [-1 -3;1 2;-4 4]);

rootsA=[1,0,-25];
rootsB = roots(rootsA);
checkMt(rootsB, [5;-5]);

checkEq(nthroot(-27, 3), -3);

nthrootN = [5 3 -1];
checkZero(norm(nthroot(-8,nthrootN), 2)-2.5125727273044394);

nthrootX = [-2 -2 -2; 4 -3 -5];
nthrootM = [1 -1 3; 1/2 5 3];
checkEq(round(norm(nthroot(nthrootX,nthrootM), 2)*10000),162415);


iZ = 2+3i;
checkEq(real(iZ), 2);
checkEq(imag(iZ), 3);

iZ1 = [0.5i 1+3i -2.2];
checkMt(real(iZ1), [0 1 -2.2]);
checkMt(imag(iZ1), [0.5 3 0]);

expZ = 2*exp(1i*0.5*pi);
theta = angle(expZ);
checkEq(sin(theta), 1);


conjZ = 2+3i;
checkEq(conj(conjZ)+conjZ,4);

conjMZ = [0-1i 2+1i; 4+2i 0-2i];
checkMt(conj(conjMZ)+conjMZ, [0 4;8 0]);							//154


anyA = [0 0 3;0 0 3;0 0 3];
checkMt(any(anyA), any(anyA,1));
checkMt(any(anyA,2), [1;1;1]);
checkEq(any(anyA, 'all'), 1);

anyA1 = [0.53 0.67 0.01 0.38 0.07 0.42 0.69];
checkEq(any(anyA1, 2),1);

checkMt(anyA1 < 0.5, [0 0 1 1 1 1 0]);
checkEq(any(anyA1<0.5), 1);
checkEq(all(anyA1<0.5), 0);


anyA2(:,:,1) = [2 0; 0 0];
anyA2(:,:,2) = [0 0; 0 0];
anyA2(:,:,3) = [1 1; 1 1];
anyB2 = any(anyA2,[1 2]);
anyC2 = all(anyA2,[1,2]);
checkEq(anyB2(0), 1);
checkEq(anyC2(0), 0);

eigA5 = [3 1 0; 0 3 1; 0 0 3];
[eigA5V,eigA5D] = eig(eigA5);
checkZero(eigA5*eigA5V - eigA5V*eigA5D);

uminusA2=[1 -3; -2 4];
checkMt(-uminusA2, uminus(uminusA2));


dotMA = [1 0 3; 1:3; 2 4 6];
dotMB = [2 3 7; 9 1 5; 8 8 3];
checkMt(dotMA.*dotMB, [2	0	21;9	2	15;16	32	18]);


powA = [1 2; 3 4];
checkMt(powA^2, [7 10;15 22]);
checkMt(powA^3, [37 54;81 118]);										//168


magicA = magic(5);
[magicV,magicD] = eig(magicA);
[magicd,magicind]=sort(diag(magicD));
magicind2= sort(magicind);
magicDs = magicD(magicind,magicind);
magicVs = magicV(:,magicind);
checkZero(norm(magicA*magicV-magicV*magicD));
checkZero(norm(magicA*magicVs-magicVs*magicDs));


sortA1= [9 0 -7 5 3 8 -10 4 2];
sortB1 = sort(sortA1);
checkMt(sortB1, [-10	-7	0	2	3	4	5	8	9]);

sortA2 = [3 6 5; 7 -2 4; 1 0 -9];
sortB2 = sort(sortA2);
checkMt(sortB2, [1	-2	-9;3	0	4;7	6	5]);

sortA3 = [3 6 5; 7 -2 4; 1 0 -9];
sortB3 = sort(sortA3, 2);
checkMt(sortB3, [3	5	6;-2	4	7;-9	0	1]);

sortA4 = [10 -12 4 8; 6 -9 8 0; 2 3 11 -2; 1 1 9 3];
sortB4 = sort(sortA4,"descend");
checkMt(sortB4, [10	3	11	8
  6	1	9	3
  2	-9	8	0
  1	-12	4	-2]);


sortA5(:,:,1) = [2 3; 1 6];
sortA5(:,:,2) = [-1 9; 0 12];
sortB5 = sort(sortA5(:));
checkMt(sortB5, [-1 0 1 2 3 6 9 12]');							//175


AA = [1 2 3; 4 5 6];
BB = [11 12 13
  14 15 16];
DD=[AA;BB];
DD(4)=7;
DD(1,3) = 23;
DD(DD>15)=-1;
DD(DD==-1)=-2;
DD(:,[1 3])=DD(:,[3 1]);
checkMt(DD(2:4, 1:2), [6 5;13 12;-2 15]);

logspaceY = logspace(1,7,7);
checkEq(logspaceY(2), 100);


n = 1;
nFactorial = 1;
while nFactorial < 1e10
  n = n + 1;
nFactorial = nFactorial * n;
end
checkEq(n, 14);																			//178



function cavg = cumavg(x)
  %multiple args. possible
cavg=cumsum(x)./(1:length(x));
end


vec = 1:10;
checkMt(cumavg(vec),[1	1.5	2	2.5	3	3.5	4	4.5	5	5.5]);

function [m,s] = stat(x)
n = length(x);
m = sum(x)/n;
s = sqrt(sum((x-m).^2/n));
end
values = [12.7, 45.4, 98.9, 26.6, 53.1];
[ave,stdev] = stat(values);
checkEq(round(ave), 47);
checkEq(round(stdev), 29);

function y = cal(x)
y = cos(x.^2)./abs(3*x);
end

eee=@cal;
checkEq(cal(10), eee(10));

fun = @(x) cos(x.^2)./abs(3*x);
checkEq(ceil(fun(0.1)), 4);

function ave = average(x)
ave = sum(x(:))/numel(x);
end

z = 1:99;
checkEq(average(z),50);


sqr = @(x) x.^2;
checkEq(sqr(5), 25);

a = 1.3;
b = .2;
c = 30;
parabola = @(x) a*x.^2 + b*x + c;
x = 1;
checkEq(parabola(x), 31.5);

a = -3.9;
b = 52;
c = 0;
parabola = @(x) a*x.^2 + b*x + c;
checkEq(parabola(2), 88.4);															//187


magicA = magic(4);
magicA(:,:,2) = magicA';
checkEq(numel(magicA),32);
checkMt(size(magicA),[4 4 2]);

prodA=[1:3:7;2:3:8;3:3:9];
checkMt(prod(prodA), [6 120 504]);
checkMt(prod(prodA,2), [28;;80;162]);

prodA2 = [true false; true true];
checkMt(prod(prodA2), [1 0]);


prodA3(:,:,1) = [2 4; -2 1];
prodA3(:,:,2) = [1 2; -5 3];
prodA3(:,:,3) = [4 4; 1 -3];
prodA3B = prod(prodA3,[1 2]);
checkMt(prodA3B(:), [-16;-30;-48]);
checkEq(prod(prodA3,[1 2 3]),prod(prodA3,'all'));				//194

fullA = [ 1 2 3 4 5; 2 3 4 5 6; 3 4 5 6 7; 4 5 6 7 8];
fullA( 2 , : ) = [];
fullA(: , 3)=[];
fullA( 2 , : ) = [];
fullA(: , 3)=[];
checkMt(fullA, [1 2 5;4 5 8]);


ldA = magic(3);
ldB = [15; 15; 15];
checkMt(ldA\ldB, ones(3,1));														//196


checkEq(isrow(rand(1,5)), true);
checkEq(iscolumn(rand(5,1)), true);

checkEq(isempty(zeros(0,2,2)), true);


blkdiagA1 = ones(2,2);
blkdiagA2 = 2*ones(3,2);
blkdiagA3 = 3*ones(2,3);
blkdiagB = blkdiag(blkdiagA1,blkdiagA2,blkdiagA3);
checkEq(trace(blkdiagB), 12);
circshiftC=(1:5)';
checkMt(circshift(circshiftC,3), [3 4 5 1 2]');

circshiftA = [1 1 0 0; 1 1 0 0; 0 0 0 0; 0 0 0 0];
checkEq(trace(circshift(circshiftA,1, 2)), 1);

circshiftZ = circshift(circshiftA,[1 1]);
circshiftZ1 = circshift(circshiftZ,[-1 -1]);
checkMt(circshiftZ1, circshiftA);


checkMt(flip([1;2;3]), [3;2;1]);

flipA = diag([1 2 3]);
flipB = flip(flipA);
checkMt(diag(flip(flipB,2)), [3 2 1]');


flipA0 = zeros(1,3,2);
flipA0(:,:,1) = [1 2 3];
flipA0(:,:,2) = [4 5 6];

flipB0 = flip(flipA0);
checkEq(flipB0(0), 3);																	//206



fliplrA = cat(3, [1 2; 3 4], [5 6; 7 8]);
fliplrB=fliplr(fliplrA);
fliplrC=fliplrB(:,1,2);
checkMt(fliplrC(:), [6;8]);

fliplrA2 = 1:10;
checkMt(fliplr(fliplr(fliplrA2))-fliplrA2, zeros(1, 10));

flipudA=(1:10)';
flipudB = flipud(flipudA);
checkMt(flipudB+flipudA-ones(10,1)*11, zeros(10, 1));

permuteB2 = rand(4,3,2);
permuteA2 = ipermute(permuteB2,[3 1 2]);
permuteC2 = permute(permuteA2,[3 1 2]);
permuteD2 = sum(permuteC2-permuteB2, 'all');						//211
checkEq(permuteD2, 0);


checkEq(sum(repmat(10,3,2), 'all'), 60);

repmatA = diag([1 2 3]);
checkEq(trace(repmat(repmatA,2)), 12);

repmatA2 = diag([1 2 3]);
repmatB2 = sum(repmat(repmatA2,2,3),2);
checkMt(repmatB2, [3;6;9;3;6;9]);

checkMt(size(repmat([1 2; 3 4],[2 3 2])), [4 6 2]);

repmatA3=1:4;
repmatB3 = sum(repmat(repmatA3,4,1));
checkMt(repmatB3, [4 8 12 16]);

repmatA4 = (1:3)';
checkMt(sum(repmat(repmatA4,1,4),2), [4;8;12]);					//217

reshapeA = 1:10;
reshapeB = reshape(reshapeA,[5,2]);
reshapeC = reshape(reshapeB, [2 5]);
reshapeD = reshape(reshapeC, [10 1]);
checkMt(reshapeA, reshapeD');

rot90A = [1:5;6:10];
rot90B = rot90(rot90A);
checkMt(rot90B, [5	10
;4	9
;3	8
;2	7
;1	6]);
rot90B1 = rot90(rot90A, 2);
rot90B2=rot90(rot90B);
checkMt(rot90B1, rot90B2);
rot90B3 = rot90(rot90A, 3);
rot90B4=rot90(rot90B2);
checkMt(rot90B3, rot90B4);
checkMt(rot90(rot90B4), rot90A);													//222


shiftdimA = rand(4,2,3,5);
shiftdimB = shiftdim(shiftdimA,2);
checkMt(size(shiftdimB), [3 5 4 2]);

shiftdimC = shiftdim(shiftdimA,-2);
checkMt(size(shiftdimC), [1 1 4 2 3 5]);

shiftdimA2 = rand(1,1,3,2,4);
[shiftdimB,nshifts] = shiftdim(shiftdimA2);
checkEq(nshifts, 2);

nshiftsC = shiftdim(shiftdimB,2);
checkMt(size(nshiftsC), [4 3 2]);

nshiftsD = shiftdim(nshiftsC,-1);
checkMt(size(nshiftsD), [1 4 3 2]);												//227



issortedA = [5 12  33 39 78 90 95 107];
checkEq(issorted(issortedA), true);


issortedA = magic(5);
checkEq(issorted(issortedA,2,'descend'), false);
issortedB = sort(issortedA,2,'descend');
checkEq(issorted(issortedB,2,'descend'), true);

issortedstr = ["Horse","Chicken";"cow","Goat"];
checkEq(issorted(issortedstr), true);
checkEq(issorted(issortedstr,2), false);
checkEq(issorted(issortedstr,2,'descend'), true);


randA=rand([6 7]);
floorA = floor(randA*100);
floorA(1:4,1) = 95; floorA(5:6,1) = 76;
floorA(2:4,2) = -7;  floorA(3,3) = 48;
floorB = sortrows(floorA);
checkMt(floorB(1:2,1), [76;76]);
floorC = sortrows(floorA,2);
checkMt(floorC(1:3,2), [-7;-7;-7]); //也许有比7小的数字
[floorD, floorE]= sortrows(floorA,[1 7]);
checkEq(floorD(1,7)<floorD(2,7), true);
//checkEq(floorD(3,7)<floorD(4,7), true);										//236


squeezeA = zeros(2,1,2);
squeezeA(:,:,1) = [1 2]';
squeezeA(:,:,2) = [3 4]';
squeezeB = squeeze(squeezeA);
checkMt(squeezeB, [1 3;2 4]);


polyvalp = [3 2 1];
polyvalx = [5 7 9];
checkMt(polyval(polyvalp,polyvalx), [86 162 262]);

polyvalp1 = [3 0 -3 10 -25];
checkMt(polyint(polyvalp1), [0.6	0	-1	5	-25	0]);

polyvalX = [1 1 2 3 5 8 13 21];
checkMt(diff(polyvalX), [0	1	1	2	3	5	8]);

polyvalX1 = [1 1 1; 5 5 5; 25 25 25];
checkMt(diff(polyvalX1), [4	4	4
  20	20	20]);

polyvalX2 = [0 5 15 30 50 75 105];
checkMt(diff(polyvalX2,2), [5	5	5	5	5]);

polyvalX3 = [1 3 5;7 11 13;17 19 23];
checkMt(diff(polyvalX3,1,2), [2	2;4	2;2	4]);						//244


polyderp = [3 0 -2 0 1 5];
polyderq = polyder(polyderp);
checkMt(polyderq, [15	0	-6	0	1]);

polydera = [1 -2 0 0 11];
polyderb = [1 -10 15];
polyderq1 = polyder(polydera,polyderb);
checkMt(polyderq1, [6	-60	140	-90	22	-110]);

polyderp2 = [1 0 -3 0 -1];
polyderv = [1 4];
[polyderq2,polyderd] = polyder(polyderp2,polyderv);
checkMt(polyderq2, [3	16	-3	-24	1]);
checkMt(polyderd, [1	8	16]);

polyvalmX = pascal(4);
polyvalmp = poly(polyvalmX);
polyvalmY = polyvalm(polyvalmp,polyvalmX);
checkMt(polyvalmY, zeros(4));														//249


polyp=[1 0 -1];
polyn=length(polyp)-1;
polyA = diag(ones(polyn-1,1),-1);
polyA(1,:)=-polyp(2:polyn+1)./polyp(1);
checkMt(poly(polyA), polyp);
polyr=eig(polyA);
checkMt(polyr, [1;-1]);


syms x
y=x^5-3*x^3+3;
p=sym2poly(y);
checkMt(p, [1	0	-3	0	0	3]);

c = sym2poly(x^3 - 2*x - 5);
checkMt(c, [1	0	-2	-5]);

c = sym2poly(1/2*x^3 - 2/5*x - 5);
checkMt(c, [0.5	0	-0.4	-5]);

ffta = [1,2,3,4,5,6,7,8];
fftb = fft(ffta);
fftc = ifft(fftb);
checkMt(ffta, fftc);																		//253

runTest();


