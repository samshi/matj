import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

actor Registry {

  stable var entries : [(Text, Text)] = [];
  stable var share_entries : [(Text, Text)] = [];

  let map = Map.fromIter<Text,Text>(entries.vals(), 10, Text.equal, Text.hash);
  let share_map = Map.fromIter<Text,Text>(share_entries.vals(), 10, Text.equal, Text.hash);

  public query(msg) func who() : async Text{
    Principal.toText(msg.caller)
  };

  public shared(msg) func set(name : Text, code: Text) : async Nat {
    let principalId = Principal.toText(msg.caller);
    map.put(principalId # name, code);
    switch(map.get(principalId # name)){
      case (?source){
        Text.size(source);
      };
      case null {
        0
      };
    }
  };

  public query(msg) func get(name : Text) : async ?Text {
    let principalId = Principal.toText(msg.caller);
    map.get(principalId # name);
  };

  public query func principalget(principalname : Text) : async ?Text {
    map.get(principalname);
  };

  public shared(msg) func share(name : Text) : async Text {
    let principalId = Principal.toText(msg.caller);
    let key = "_"#name#"=";

    switch(share_map.get(principalId)){
      case (?shared_str) {
        let shared_name_array : [Text] = Iter.toArray<Text>(Text.split(shared_str, #char '='));
        let item : ?Text = Array.find<Text>(shared_name_array, func(x: Text): Bool {
          x == "_"#name;
        });

        switch(item){
          case null {
            share_map.put(principalId, shared_str#key);
            "add"
          };
          case (?abc) {
            "find"
          }
        }
      };
      case null {
        share_map.put(principalId, key);
        "new"
        // Array.init(1, [])
        // Iter.toArray(Text.split(key, #char '='));
      };
    }
  };

  public shared(msg) func unshare(name : Text) : async Text {
    let principalId = Principal.toText(msg.caller);
    let key = "_"#name#"=";

    switch(share_map.get(principalId)){
      case (?shared_str) {
        let shared_name_array : [Text] = Iter.toArray<Text>(Text.split(shared_str, #char '='));
        var out = "";

        for (x in shared_name_array.vals()) {
          if (x != "_"#name and x != "") {
            out #= x#"="
          }
        };

        if(shared_str == out){
          "not exist"
        }
        else if("" == out){
          share_map.delete(principalId);
          "remove share"
        }
        else{
          share_map.put(principalId, out);
          "removed"
        }
      };
      case null {
        "no share"
      };
    }
  };

  public query(msg) func getshare() : async ?Text {
    let principalId = Principal.toText(msg.caller);
    share_map.get(principalId);
  };

  system func preupgrade() {
    entries := Iter.toArray(map.entries());
    share_entries := Iter.toArray(share_map.entries());
  };

  system func postupgrade() {
    entries := [];
    share_entries := [];
  };
}
