import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Char "mo:base/Char";

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

  public shared(msg) func share(index : Text, title: Text, auther: Text, time: Text, size: Text) : async Text {
    let principalId = Principal.toText(msg.caller);
    let key = "_"#index#"%"#title#"%"#auther#"%"#time#"%"#size#"=";

    switch(share_map.get(principalId)){
      case (?shared_str) {
        let shared_name_array : [Text] = Iter.toArray<Text>(Text.split(shared_str, #char '='));
        var out = "";
        var update = false;

        for (x in shared_name_array.vals()) {
          let k = "_"#index#"%";
          if (extract(x, 0, k.size()) != k and x#"%" != k and x != "") {
            out #= x#"=";
          }
          else if(x != ""){
            update := true;
            out #= key;
          }
        };

        if(update == false){
          out #= key;
          share_map.put(principalId, out);
          "add "#out
        }
        else if(shared_str == out){
          "same "#out
        }
        else{
          share_map.put(principalId, out);
          "update "#out
        }
      };
      case null {
        share_map.put(principalId, key);
        "new "#key
      };
    }
  };

  public shared(msg) func unshare(index : Text) : async Text {
    let principalId = Principal.toText(msg.caller);

    switch(share_map.get(principalId)){
      case (?shared_str) {
        let shared_name_array : [Text] = Iter.toArray<Text>(Text.split(shared_str, #char '='));
        var out = "";

        for (x in shared_name_array.vals()) {
          let k = "_"#index#"%";
          if (extract(x, 0, k.size()) != k and x#"%" != k and x != "") {
            out #= x#"="
          }
        };

        if(shared_str == out){
          "not_exist "#out
        }
        else if("" == out){
          share_map.delete(principalId);
          "remove_share "#out
        }
        else{
          share_map.put(principalId, out);
          "removed "#out
        }
      };
      case null {
        "no_share"
      };
    }
  };

  public query func getshare(principalId : Text) : async ?Text {
    share_map.get(principalId);
  };

  public query func getallshare() : async [(Text, Text)] {
    Iter.toArray(share_map.entries());
  };

  private func extract(t : Text, i : Nat, k : Nat) : Text {
    let size = t.size();
    var j = k;
    if(k > size){
      j := size;
    };

    if (i == 0 and j == size) return t;
    let cs = t.chars();
    var r = "";
    var n = i;
    while (n > 0) {
      ignore cs.next();
      n -= 1;
    };
    n := j;
    while (n > 0) {
      switch (cs.next()) {
        case null { assert false };
        case (?c) { r #= Char.toText(c) }
      };
      n -= 1;
    };
    return r;
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
