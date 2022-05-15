% --- householder trans QR

A = hilb(11);
n1=size(A,1);
R = A;
P = eye(n1);

for k=1:n1-1
  j1 = k:n1;
  jk = length(j1);
  v=R(j1,k);

  nm=norm(v);
  rho = sign(v(1))*nm;
  zz=[1;zeros(jk-1,1)];
  w0=v-rho*zz;
  w=w0/norm(w0);


  R(j1,j1) = R(j1,j1)-2*w*(w.'*R(j1,j1));

  //p1=w'*P(j1,:)
  P(j1,:) = P(j1,:)- 2*w*(w'*P(j1,:));

end

Q=P.';
// Q: Orthogonal matrix
r1 = Q.'*Q - eye(n1)
r2 = A - Q*R


[Q1, R1] = qr(A);
r3 = Q1.'*Q1 - eye(n1)
r4 = A - Q1*R1

% --- r1/r2/r3/r4 all have 1e-15 accuracy error