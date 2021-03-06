app.controller('savedController', function($scope, apiService, urlCreationService, xmlToJsonService, getIdFromZillowService, modalService, loginRegisterService){
    var self = this;
    self.titleChange = null;
    self.serverErrorMessage = null;
    self.newTitle = null;
    self.newComments = null;
    self.savedBool = false;
    //TODO, if it's the demo account, only overwrite the model, not the database.

    self.updateCommentsInDB = function(comments, index){
        self.savedBool = true;
        //console.log(comments, index);
        if(loginRegisterService.userId!==0){
            apiService.apiUpdateCommentsInDB(comments, index);
        }
    };

    self.updateTitleInDB = function(title, index){
        console.log(title, index);
        if(loginRegisterService.userId!==0){
            apiService.updateAptTitleInDB(title, index).then(function(response) {
                if(response.data.success){

                }else{
                    console.log(response);
                }
            }, function(response){
                console.log('SERVER ERROR');
            });
        }
    };

    self.remove = function(index, event){
      apiService.removeApartment(loginRegisterService.userId, index);
    };

    self.updateModalBool = function(){
        modalService.modalBool = false;
    };

    self.getModal = function(){
      return modalService.returnModalBool();
    };

    self.returnSavedBool = function(){
      return apiService.savedBool;
    };

    self.returnSavedApartments = function(){
        if($scope.aboutBool){
            return apiService.savedApartments;
        }
    };

    //self.getSavedApartments = function() {
    //    console.log('savedController hit');
    //    apiService.getApartments();
    //};
    //
    //self.getSavedApartments();

    //self.savedApartments = [
    //    {title: 'seaview summit', comments: 'hello governer!', searchQuery: {street: '102 Calais St', city: 'Laguna Niguel', state: 'CA'}},
    //    {title: 'Huntington Vista', comments: 'hello governer!', searchQuery: {street: '21551 Brookhurst St', city: 'Huntington Beach', state: 'CA'}},
    //    {title: 'Laguna Condo', comments: 'hello governer!', searchQuery: {street: '234 Cliff Dr', city: 'Laguna Beach', state: 'CA'}},
    //    {title: 'Monarch Coast', comments: 'hello governer!', searchQuery: {street: '32400 Crown Valley Pkwy', city: 'Dana point', state: 'CA'}}
    //];

    self.returnTitle = function(i){
        if(self.titleChange === null){
            return apiService.savedApartments[i].title;
        }else{
            var title = apiService.savedApartments;
            console.log(title);
            return title;
        }
    };

    self.switchView = function(index, event){
        var $gif = $('#gif')
        $gif.show();

        console.log('has calss', $(event.target).hasClass('btn-danger'));
        console.log('switch view event target',event.target);
        if($(event.target).hasClass('btn-danger')) {
            return;
        }

        apiService.searchMessage = null;
        modalService.modalBool = false;

        var street = apiService.savedApartments[index].searchQuery.street;
        var city = apiService.savedApartments[index].searchQuery.city;
        var state = apiService.savedApartments[index].searchQuery.state;

        console.log(street, city, state);

        urlCreationService.createGoogleGeoCodeUrl(street, city, state).then(function(response){
            apiService.googleMapsApiCall(response);
        });

        //get url, then convert xml response to json, then get the property id, then
        urlCreationService.zillowIDUrl(street, city, state).then(function(response){//get url
            apiService.zillowGetZPID_XML(response).then(function(response){
                //below converts xml string to object, we have the xml string
                var xmlObject = $.parseXML(response.data.data);
                //below coverts xml to json
                var newResponse = xmlToJsonService.xmlToJson(xmlObject);
                var id = getIdFromZillowService.zillowGetIdFromResponse(newResponse);
                console.log('ZPID' , id);
                //get this FAR!
                if(typeof id === 'undefined'){
                    console.log('UNDEFINNNNEED ID!');
                    //self.noResultsBool = true;
                    apiService.imgArray = [];
                    apiService.facts = null;

                    return;
                }

                //console.log(id);
                apiService.zillowGetPropInfo(id).then(function(response){
                    $scope.imgArray = response;
                    $gif.hide();
                });
            });

        });
    };
});
