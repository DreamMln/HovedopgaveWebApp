
const baseUrl = "https://localhost:44327/api/Borger";

const borger = Vue.createApp({
    data() {
        return {
			regiArray: [], //tomt array til at indeholde data omkring borgere
			pauseArray: [], //tomt array til at indeholde data omkring borgere
			//obj. in another obj.
			addRegi:{
				ind: "",
				ud: "",
			},
			addPause:{
				pauseStart: "",
				pauseSlut: ""
			},
			pauseArray: [],
            noteArray: [], //tomt array til at indeholde data omkring borgernoter
			//json obj - skal hedde det samme
			addNote:{
				noteID: 0,
				noteOmBorger: "",
				datoTid: "",
			},
			deleteNote: "",
			//url, send id som parameter
			hentBorgerData: "",
			result: null,
			//add the message html
			addMessage: "",
			deleteMessage: "",
			id: 0,
			//lommeregner/udregn procent
			num1: 0,
			num2: 0,
			udregn: 0,
		}
    },

	created(){
		// created() is a life cycle method, not an ordinary method, is called automatically when the page is reloaded
		//uri - er en del af url, søger i min url efter ...
		let uri = window.location.search.substring(1);
		//læser id'et der bliver videresendt
		let urlParameters = new URLSearchParams(uri);
		let id = urlParameters.get('id')
		console.log("ID:" + id)
		//videresender værdien, sammen med baseurl
		this.getRoutingBorger(baseUrl, id)
        //created, kalder dem, istedet for this.id,
		this.getAllRegi(baseUrl, id)
		this.getAllNoter(baseUrl, id)
		this.getAllPauser(baseUrl, id)
	},
	methods: {
		//Get borger by id
		async getRoutingBorger(url, id){
			try{
				this.borgerID = id;
				const result = await axios.get(url + "/" + id)
				console.log(url + "/" + id)
				this.hentBorgerData = result.data
                console.log(result)
			}catch (ex) { //exception
			    alert(ex.message)
		    }
		},

		/////////BORGER REGISTRERINGER//////
		async getAllRegi(url, id){
			try{
			//response with axios
			//det er en borger, derfor id og regi sti, kig i controlleren
			const response = await axios.get(url + "/" + id + "/BorgerRegistreringer")
			this.regiArray = await response.data
			}
		catch(ex){
			alert("Fejl get all regi " + ex.message)
			}
		},
		/////////BORGER PAUSER//////
		async getAllPauser(url, id){
			try{
			//response with axios
			//det er en borger, derfor id og pause sti, kig i controlleren
			const response = await axios.get(url + "/" + id + "/BorgerPauser")
			this.pauseArray = await response.data
			}
		catch(ex){
			alert("Fejl get all regi " + ex.message)
			}
		},

		async opretRegiBorger(url, id){
			console.log(this.addRegi)
			try{
				const response = await axios.post(url + "/" + id + "/BorgerRegistreringer", this.addRegi)
				//response = await axios.post(baseUrl, this.addRegi)
				this.addRegi = response.status + " " + response.statusText
				this.getAllRegi(url, id)
				console.log(this.regiArray)
			}
			catch(ex){
				{alert("Fejl i add regi " + ex.message)}
                // alert("Fejl! Der er noget galt " + response.status)
			}
		},

		///////BORGER NOTER/////
		async getAllNoter(url, id){
			try{
			//det er en borger, derfor id og note sti, kig i controlleren
			//const response = await axios.get(url + "/" + noteOmBorger + id)
			//response with axios
			const response = await axios.get(url + "/" + id + "/BorgerNoter")
			this.noteArray = await response.data
			}
		catch(ex){
			{alert("Fejl i hent alle noter " + ex.message)}
		}
		},
		async opretNote(id){
			console.log(this.addNote)
			try{
				const response = await axios.post(baseUrl + "/" + id + "/BorgerNoter", this.addNote)
				//this.addNote = "Responskode: " + response.status + " " + response.statusText
				this.getAllNoter(baseUrl, id)
				console.log(this.noteArray)
			}
			catch(ex){
				{alert("Fejl i opret note " + ex.message)}
			}
		},
		//borgerens id og derefter notens id
		async sletNote(id, noteID){
			console.log(this.deleteNote)
			try{
				const response = await axios.delete(`${baseUrl}/${id}/BorgerNoter?noteID=${noteID}` , this.deleteNote)
				this.deleteNote = `Responskode: ${response.status} ${response.status}`
				if(response.status === 200){
					await this.getAllNoter(baseUrl, id)
					console.log(this.noteArray)
				}else{
					console.error(`kunne ikke slette note: ${response.statusText}`)
				}
			}
			catch(ex){
				{alert("Fejl! Slet en note " + ex.message)}
			}
		},
		//lommeregner
		add() {
			this.udregn = this.num1 + this.num2;
		},
		subtract() {
			this.udregn = this.num1 - this.num2;
		},
		multiply() {
			this.udregn = this.num1 * this.num2;
		},
		divide() {
			if (this.num2 === 0) {
			alert("Kan ikke dividere med nul!");
			} else {
			this.udregn = this.num1 / this.num2;
			}
		},
		calculatePercentage() {
			this.udregn = (this.num1 * this.num2) / 100;
		},
	}
})
borger.mount("#borger") //her bliver appen mounted
