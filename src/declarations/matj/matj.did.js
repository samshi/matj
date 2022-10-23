export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'getallshare' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'getshare' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'principalget' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'set' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'share' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
    'unshare' : IDL.Func([IDL.Text], [IDL.Text], []),
    'who' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
