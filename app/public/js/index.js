const indexModule = (() => {
  // 検索ボタンをクリックした時のイベントリスナー
  document.getElementById('search-btn')
  .addEventListener('click',() =>{
    return searchModule.searchUsers()
  })
  //Usersモジュールのフェッチ
  return usersModule.fetchAllUsers()
}) ()