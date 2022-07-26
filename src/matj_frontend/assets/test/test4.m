% title = for loop
// find the number which is equal to sum of factor
p=[];
for n=2:3000
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
p