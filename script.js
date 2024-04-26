baseUrl = "https://localhost:44327/api/Borger";

const app = Vue.createApp({
    data() {
        return {
            borgerArray: [], //tomt array til at indeholde data omkring borgere
			result: null,
		}
    },
	created(){ // life cycle method. Called when browser reloads page
		this.getAll()
	},
	methods: {
		getAll(){
		  //use a helpermethod - DRY
		  this.getAllHelper(baseUrl)
		},
		async getAllHelper(url){ //helper method
				//get data from the baseurl
		try{
		  //response with axios
		  const response = await axios.get(url)
		  this.borgerArray = await response.data
		  }
		catch(ex){
		  alert(ex.message)
		  }
	    },

	    //REDIRCT - JS TIL Borger siden
		redirectToBorger(borgerInfoID){
            location.href="/borger.html?id=" + borgerInfoID

		}
	}
}).mount("#app") //her bliver appen mounted