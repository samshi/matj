import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

actor Registry {

  stable var entries : [(Text, Text)] = [];

  let map = Map.fromIter<Text,Text>(entries.vals(), 10, Text.equal, Text.hash);

  public query(msg) func who() : async Principal {
    msg.caller
  };

  public shared(msg) func set(name : Text, code: Text) : async ?Text {
    let principalId = Principal.toText(msg.caller);
    map.put(principalId # name, code);
    map.get(principalId # name)
  };

  public query(msg) func get(name : Text) : async ?Text {
    let principalId = Principal.toText(msg.caller);
    map.get(principalId # name);
  };

  public query func principalget(principalname : Text) : async ?Text {
    map.get(principalname);
  };

  system func preupgrade() {
    entries := Iter.toArray(map.entries());
  };

  system func postupgrade() {
    entries := [];
  };
}
