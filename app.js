/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService',MenuSearchService)
    .constant('ApiBaseUrl','https://davids-restaurant.herokuapp.com')
    .directive('foundItems',FoundItemsDirective);
;

function FoundItemsDirective(){

  var ddo = {
    templateUrl:'shoppingList.html',
    scope:{
      items:'<',
      onRemove:'&'
    },
    controller:ShoppingListDirectiveController,
    controllerAs:'list',
    bindToController:true
  };
  return ddo;
}

function ShoppingListDirectiveController(){
  var list = this;

  list.itemInList = function(){
    if(list.items.length === 0){
      return true
    }
    return false;
  }
}

NarrowItDownController.$inject = ['MenuSearchService']
function NarrowItDownController(MenuSearchService){

    var narrowCtrl = this;

    narrowCtrl.searchItem = "";
    narrowCtrl.found = "";
    narrowCtrl.filterSearch = function(){
        try{
        //  if(narrowCtrl.searchItem!==undefined && narrowCtrl.searchItem!==""){
                  var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.searchItem);
                   promise.then(function(result){
                   //console.log("Mithun" + result.length);
                   narrowCtrl.found = result;
                  })
              //  }
        }catch(error){
            //console.log(error.message);
            narrowCtrl.found = "";
            narrowCtrl.message = error.message;
        }

    };

    narrowCtrl.removeItem = function(itemIndex){
      MenuSearchService.removeItem(itemIndex);
    }
}

MenuSearchService.$inject=['$http','ApiBaseUrl'];
function MenuSearchService($http,ApiBaseUrl){

    var service = this;

    var itemArr =[];
    service.getMatchedMenuItems = function(searchItem){
      if(searchItem!== undefined && searchItem!==""){
        return $http({
            method:"GET",
            url:(ApiBaseUrl + "/menu_items.json")
        }).then(function(response){
           // console.log(response.data.menu_items[0].description);
            var allItems = response.data.menu_items;

            //console.log(allItems.length);
            itemArr.splice(0,itemArr.length);
            for(var i=0 ;i< allItems.length ; i++){
               if(allItems[i].description.toLowerCase().indexOf(searchItem) !== -1){
                itemArr.push(allItems[i]);
                }

            }
            //console.log("Jio:::" + itemArr.length);
            return itemArr;
          }).catch(function(error){
        console.log(error);
      });
    }else{
        throw new Error('Nothing Selected!')
      }

        //return itemArr;
    };


    service.removeItem = function(itemIndex){
      itemArr.splice(itemIndex,1);
    }

}
