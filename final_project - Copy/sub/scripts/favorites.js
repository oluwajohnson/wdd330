// Favorites module: manages saving & loading favorites using localStorage
const Favorites = (() => {
  const KEY = "ogf_favorites_v1";

  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function save(list){
    localStorage.setItem(KEY, JSON.stringify(list));
  }
  function add(item){
    const list = load();
    if(!list.find(i => i.id == item.id)){
      list.unshift(item);
      save(list);
    }
    return list;
  }
  function remove(id){
    let list = load().filter(i => i.id != id);
    save(list);
    return list;
  }
  function toggle(item){
    const list = load();
    if(list.find(i => i.id == item.id)) return remove(item.id);
    return add(item);
  }
  return { load, save, add, remove, toggle };
})();

export default Favorites;
