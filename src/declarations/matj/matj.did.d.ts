import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'get' : ActorMethod<[string], [] | [string]>,
  'getshare' : ActorMethod<[], [] | [string]>,
  'principalget' : ActorMethod<[string], [] | [string]>,
  'set' : ActorMethod<[string, string], bigint>,
  'share' : ActorMethod<[string], string>,
  'unshare' : ActorMethod<[string], string>,
  'who' : ActorMethod<[], string>,
}
