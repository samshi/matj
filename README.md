# matj
- MatJ is a online scientific computing platform, which aims to provide open source scientific computing and numerical analysis tools compatible with MATLAB syntax
- MaJ is a JS math library for running Matlab scripts.
- Matj is a cross platform web DAPP that supports windows, Linux, MacOS, Android and tablets

# social
- share remote file to public
- share remote file link to friends
- open readyonly public file
- send message to public file author
- give up/down to every message
- donote to message author

# function:
- base: ones, zeros, eye, linear, linspace, all trigonometric
- matrix: blkdiag, bounds, cat, diag, flip, repmat, reshape, rot90
- linear algebra: chol, cond, det, eig, hess,hilb, inv, lu, magic, norm, orth, pascal, pinv, qr, rref, svd, tril, triu
- polynomial: factor, fzero, polyval, roots
- differential/integral: diff, polyint, polyder, solve, sym, limit

# test
-In matj/src/matj_assets/assets/test/, you will find 200+ function tests and plot scripts.

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:8000?canisterId={asset_canister_id}`.

Additionally, if you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 8000.

# social
https://youtu.be/imDRLLJKgIA
https://forum.dfinity.org/t/web-dapp-for-matlab-scripts/18598
https://twitter.com/samshi03184604/status/1627735798929035264?s=20
https://dirt-jaguar-6a2.notion.site/Let-s-get-you-some-attention-c7eaabbc87d142f5baa92096cadc181f
